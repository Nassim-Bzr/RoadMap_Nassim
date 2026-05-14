import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return new Response('Unauthorized', { status: 401 })
    }

    const { messages, level, scenario } = await req.json()

    if (!messages || !level) {
      return new Response('messages and level are required', { status: 400 })
    }

    const systemPrompt = `You are an English conversation partner helping a French-speaking Data Engineer improve their English.
The student's CEFR level is ${level}.
Scenario: ${scenario || 'Casual conversation about technology and data engineering'}.

Rules:
- Speak in English adapted to the student's level (simpler vocabulary for A1/A2, richer for B2/C1/C2)
- Be encouraging, patient, and pedagogical
- Keep responses concise (2-4 sentences max for the main response)
- After EVERY response, add exactly this format on a new line:
  💡 Note: [one grammar tip OR vocabulary note in French, max 1 sentence]
- Gently correct major errors by incorporating the correct form naturally in your response
- Ask follow-up questions to keep the conversation going`

    const stream = await anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('English conversation error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
