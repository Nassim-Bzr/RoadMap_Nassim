import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt, buildLessonPrompt } from '@/lib/ai/tutor-prompts'
import { ALL_PHASES } from '@/lib/data'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [{ data: progress }, { data: profile }, { data: quizErrors }, { data: cached }] = await Promise.all([
      supabase.from('task_progress').select('task_id').eq('user_id', user.id).eq('completed', true),
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('quiz_attempts').select('task_id, question').eq('user_id', user.id).eq('correct', false).order('created_at', { ascending: false }).limit(5),
      supabase.from('generated_lessons').select('lesson_data').eq('user_id', user.id).eq('task_id', taskId).single(),
    ])

    if (cached) return NextResponse.json({ lesson: cached.lesson_data })

    let currentTask = null, currentPhase = null
    for (const phase of ALL_PHASES) {
      for (const week of phase.weeks) {
        const task = week.tasks.find(t => t.id === taskId)
        if (task) { currentTask = task; currentPhase = phase; break }
      }
      if (currentTask) break
    }
    if (!currentTask || !currentPhase) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const userContext = {
      name: profile?.full_name || 'Nassim',
      currentTask,
      currentPhase,
      completedTaskIds: progress?.map(p => p.task_id) || [],
      recentErrors: quizErrors?.map(e => e.question) || [],
      notes: {},
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: buildSystemPrompt(userContext),
      messages: [{ role: 'user', content: buildLessonPrompt(currentTask) }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    let lesson
    try {
      lesson = JSON.parse(content.text)
    } catch {
      const match = content.text.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('Could not parse lesson JSON')
      lesson = JSON.parse(match[0])
    }

    await supabase.from('generated_lessons').upsert({
      user_id: user.id,
      task_id: taskId,
      lesson_data: lesson,
      generated_at: new Date().toISOString(),
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Lesson generation error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 })
  }
}
