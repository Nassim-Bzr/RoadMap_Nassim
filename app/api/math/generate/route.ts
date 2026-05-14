import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MATH_TOPICS } from '@/lib/data/math-curriculum'
import type { MathLevel } from '@/lib/data/math-curriculum'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

type ExerciseType = 'lesson' | 'exercise' | 'quiz' | 'challenge'

function buildPrompt(topicId: string, topicTitle: string, level: MathLevel, exerciseType: ExerciseType, seenProblems: string[]): string {
  const seenStr = seenProblems.length > 0
    ? `\nProblèmes DÉJÀ VUS à éviter: ${seenProblems.join(' | ')}`
    : ''

  const schemas: Record<ExerciseType, string> = {
    lesson: `Génère une LEÇON pour le topic "${topicTitle}" au niveau ${level}.
${seenStr}
Retourne UNIQUEMENT ce JSON valide:
{
  "type": "lesson",
  "title": "string (titre accrocheur de la leçon)",
  "concept": "string (explication claire en français, 3-4 phrases pédagogiques)",
  "formula": "string (formule clé en notation mathématique, style LaTeX textuel)",
  "steps": ["string (étape 1)", "string (étape 2)", "string (étape 3)"],
  "data_example": "string (exemple concret appliqué data/ML/Python avec explication)",
  "key_insight": "string (l'insight le plus important pour un data engineer, 1-2 phrases percutantes)",
  "python_snippet": "string (code Python concret avec numpy/pandas/sklearn selon le topic, 5-15 lignes)"
}`,

    exercise: `Génère un EXERCICE PRATIQUE pour le topic "${topicTitle}" au niveau ${level}.
${seenStr}
Retourne UNIQUEMENT ce JSON valide:
{
  "type": "exercise",
  "problem": "string (énoncé clair du problème à résoudre)",
  "context": "string (contexte data/ML pour rendre le problème concret et motivant)",
  "steps": ["string (étape guidée 1)", "string (étape guidée 2)", "string (étape guidée 3)"],
  "answer": "string (réponse finale précise)",
  "explanation": "string (explication détaillée de la solution, 3-5 phrases)",
  "python_check": "string (code Python qui vérifie/illustre la réponse)"
}`,

    quiz: `Génère un QUIZ de 4 questions pour le topic "${topicTitle}" au niveau ${level}.
${seenStr}
Retourne UNIQUEMENT ce JSON valide:
{
  "type": "quiz",
  "questions": [
    {
      "question": "string (question précise)",
      "options": ["string option A", "string option B", "string option C", "string option D"],
      "correct": 0,
      "explanation": "string (explication de la bonne réponse en 2 phrases)"
    }
  ]
}
Génère exactement 4 questions variées et progressives. Le champ "correct" est l'index (0-3) de la bonne réponse.`,

    challenge: `Génère un DÉFI pour le topic "${topicTitle}" au niveau ${level}.
${seenStr}
Retourne UNIQUEMENT ce JSON valide:
{
  "type": "challenge",
  "title": "string (titre accrocheur du défi)",
  "story": "string (contexte narratif immersif, ex: 'Tu es data scientist chez une banque...', 2-3 phrases)",
  "problem": "string (problème précis à résoudre)",
  "data": "string (données fictives à utiliser: valeurs numériques, tableau, dataset décrit)",
  "tasks": ["string (tâche 1)", "string (tâche 2)", "string (tâche 3)"],
  "solution": "string (solution complète et détaillée avec toutes les étapes)",
  "python_solution": "string (code Python complet et fonctionnel, 15-30 lignes)"
}`,
  }

  return schemas[exerciseType]
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return new NextResponse('Unauthorized', { status: 401 })
    }

    const { topicId, level, exerciseType, seenProblems = [] } = await req.json() as {
      topicId: string
      level: MathLevel
      exerciseType: ExerciseType
      seenProblems?: string[]
    }

    if (!topicId || !level || !exerciseType) {
      return NextResponse.json({ error: 'topicId, level, exerciseType are required' }, { status: 400 })
    }

    const topic = MATH_TOPICS.find(t => t.id === topicId)
    const topicTitle = topic?.title ?? topicId

    const systemPrompt = `Tu es un professeur de mathématiques expert pour data scientists et développeurs. Génère des exercices niveau ${level} pour le topic: ${topicTitle}. Contexte: Data Engineering, Machine Learning, Python. Réponds UNIQUEMENT avec JSON valide, sans markdown, sans texte avant ou après le JSON.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: buildPrompt(topicId, topicTitle, level, exerciseType, seenProblems),
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/)
    const jsonStr = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : rawText

    const result = JSON.parse(jsonStr.trim())
    return NextResponse.json({ result, topicId, level, exerciseType })
  } catch (error) {
    console.error('Math generate error:', error)
    return NextResponse.json({ error: 'Failed to generate exercise' }, { status: 500 })
  }
}
