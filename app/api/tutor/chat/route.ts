import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildChatSystemPrompt } from '@/lib/ai/tutor-prompts'
import { OCR_PHASES } from '@/lib/data/ocr-phases'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { messages, currentTaskId } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const [{ data: progress }, { data: profile }, { data: quizErrors }] = await Promise.all([
      supabase.from('task_progress').select('task_id').eq('user_id', user.id).eq('completed', true),
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('quiz_attempts').select('task_id, question').eq('user_id', user.id).eq('correct', false).order('created_at', { ascending: false }).limit(5),
    ])

    let currentTask = null, currentPhase = null
    for (const phase of OCR_PHASES) {
      for (const week of phase.weeks) {
        const task = week.tasks.find(t => t.id === currentTaskId)
        if (task) { currentTask = task; currentPhase = phase; break }
      }
      if (currentTask) break
    }

    if (!currentTask || !currentPhase) {
      currentPhase = OCR_PHASES[0]
      currentTask = OCR_PHASES[0].weeks[0].tasks[0]
    }

    const userContext = {
      name: profile?.full_name || 'Nassim',
      currentTask,
      currentPhase,
      completedTaskIds: progress?.map(p => p.task_id) || [],
      recentErrors: quizErrors?.map(e => e.question) || [],
      notes: {},
    }

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: buildChatSystemPrompt(userContext),
      messages: messages.map((m: { role: string; content: string }) => ({
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
    console.error('Chat error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
