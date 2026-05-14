import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateScore } from '@/lib/dojo/scoring'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { snippetId, mode, wpm, accuracy, duration, errors, completed, difficulty } = await req.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const score = calculateScore(wpm, accuracy, difficulty)

  const { data, error } = await supabase.from('dojo_sessions').insert({
    user_id: user.id,
    snippet_id: snippetId,
    mode,
    wpm,
    accuracy,
    duration,
    errors,
    completed,
    score,
    created_at: new Date().toISOString(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.rpc('update_dojo_best', {
    p_user_id: user.id,
    p_snippet_id: snippetId,
    p_wpm: wpm,
    p_accuracy: accuracy,
    p_score: score,
  })

  return NextResponse.json({ session: data })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sessions } = await supabase
    .from('dojo_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: bests } = await supabase
    .from('dojo_bests')
    .select('*')
    .eq('user_id', user.id)

  return NextResponse.json({ sessions, bests })
}
