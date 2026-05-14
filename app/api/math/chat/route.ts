import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import type { MathLevel } from '@/lib/data/math-curriculum'
import { DEMO_MODE } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    if (!DEMO_MODE) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return new Response('Unauthorized', { status: 401 })
    }

    const { messages, topicId: _topicId, topicTitle, level } = await req.json() as {
      messages: ChatMessage[]
      topicId: string
      topicTitle: string
      level: MathLevel
    }

    const systemPrompt = `Tu es un professeur de maths bienveillant et pédagogue, spécialisé pour les data engineers. Topic actuel: ${topicTitle}. Niveau: ${level}. Explique avec des analogies data/ML, donne des exemples Python quand pertinent. Réponds en français. Sois encourageant. Limite tes réponses à 300 mots maximum pour rester concis et percutant.`

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map((m: ChatMessage) => ({
        role: m.role,
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
    console.error('Math chat error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
