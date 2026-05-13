import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { taskId, question, selectedIndex, correctIndex, options } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const correct = selectedIndex === correctIndex

    await supabase.from('quiz_attempts').insert({
      user_id: user.id,
      task_id: taskId,
      question,
      selected_answer: options[selectedIndex],
      correct_answer: options[correctIndex],
      correct,
      created_at: new Date().toISOString(),
    })

    if (correct) {
      return NextResponse.json({ correct: true, explanation: null })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Question: "${question}"
Options: ${options.map((o: string, i: number) => `${i === correctIndex ? '✓' : '✗'} ${o}`).join(', ')}
L'étudiant a choisi: "${options[selectedIndex]}" (mauvaise réponse)
La bonne réponse est: "${options[correctIndex]}"

Explique en 2-3 phrases pourquoi la bonne réponse est correcte et pourquoi l'étudiant s'est trompé. Sois pédagogique et encourage-le. Lien avec le data engineering si possible. Réponds directement sans introduction.`,
      }],
    })

    const content = message.content[0]
    const explanation = content.type === 'text' ? content.text : 'La bonne réponse est ' + options[correctIndex]

    return NextResponse.json({ correct: false, explanation })
  } catch (error) {
    console.error('Quiz error:', error)
    return NextResponse.json({ error: 'Failed to process quiz' }, { status: 500 })
  }
}
