import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { taskId, category, difficulty } = await req.json()
  const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null
  let userId: string | null = null

  if (!DEMO) {
    supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    userId = user.id

    const { data: cached } = await supabase
      .from('dojo_snippets_cache')
      .select('snippet_data')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single()

    if (cached) return NextResponse.json({ snippet: cached.snippet_data })
  }

  const prompt = `Génère un snippet de code de pratique pour cette tâche: "${taskId}"
Catégorie: ${category}
Difficulté: ${difficulty}

Le code doit:
- Être réaliste et utilisable en production
- Utiliser des données GPS (latitude/longitude, vehicle_id, timestamp, speed)
- Avoir entre 10 et 20 lignes
- Être en ${category.includes('sql') ? 'SQL' : 'Python'}

Réponds UNIQUEMENT avec ce JSON valide:
{
  "title": "Titre court du snippet",
  "code": "le code complet ici",
  "language": "python ou sql",
  "explanation": "pourquoi ce pattern est important (1 phrase)",
  "tags": ["tag1", "tag2", "tag3"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') return NextResponse.json({ error: 'Bad response' }, { status: 500 })

  let snippet
  try {
    const match = content.text.match(/\{[\s\S]*\}/)
    snippet = JSON.parse(match ? match[0] : content.text)
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }

  if (supabase && userId) {
    await supabase.from('dojo_snippets_cache').upsert({
      user_id: userId,
      task_id: taskId,
      snippet_data: snippet,
      created_at: new Date().toISOString(),
    })
  }

  return NextResponse.json({ snippet })
}
