import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function buildPrompt(mode: string, level: string, topic?: string, previousErrors?: string[], seenWords?: string[]): string {
  const topicStr = topic ? ` sur le thème: "${topic}"` : ' (contexte tech/data engineering si pertinent)'
  const errorsStr = previousErrors?.length
    ? `\nErreurs précédentes de l'étudiant à corriger: ${previousErrors.join(', ')}`
    : ''
  const seenStr = seenWords?.length
    ? `\nMots DÉJÀ VUS à NE PAS répéter (choisis des mots différents): ${seenWords.join(', ')}`
    : ''

  const modeInstructions: Record<string, string> = {
    vocabulary: `Génère une liste de 8 mots de vocabulaire anglais DIFFÉRENTS pour le niveau ${level}${topicStr}.
${seenStr}
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "theme": "string (thème des mots)",
  "words": [
    {
      "word": "string (mot en anglais)",
      "phonetic": "string (transcription phonétique IPA)",
      "definition": "string (définition du mot EN FRANÇAIS — explication claire du sens)",
      "example": "string (phrase exemple EN ANGLAIS utilisant le mot)",
      "translation": "string (traduction française courte du mot, 1-3 mots max)",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

    grammar: `Génère une leçon de grammaire anglaise pour le niveau ${level}${topicStr}.
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "rule": "string (nom de la règle, ex: Present Perfect)",
  "explanation": "string (explication claire en français, 2-3 phrases)",
  "examples": ["string", "string", "string"],
  "exercises": [
    {
      "sentence": "string (phrase avec ___ pour le blanc)",
      "answer": "string (réponse correcte)",
      "hint": "string (indice en français)"
    }
  ]
}
Génère 5 exercices.`,

    conversation: `Génère un scénario de conversation anglaise pour le niveau ${level}${topicStr}.
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "scenario": "string (titre du scénario, ex: Job Interview at a Tech Startup)",
  "context": "string (description du contexte en français, 2-3 phrases)",
  "starter": "string (première phrase de l'IA pour lancer la conversation, en anglais)",
  "vocabulary_hints": ["string", "string", "string", "string", "string"],
  "tips": ["string (conseil de communication en français)", "string", "string"]
}`,

    writing: `Génère un sujet de rédaction anglaise pour le niveau ${level}${topicStr}.
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "prompt": "string (sujet de rédaction en anglais, 1-2 phrases)",
  "context": "string (contexte et instructions en français)",
  "requirements": ["string (critère 1)", "string", "string", "string"],
  "vocabulary_hints": ["string (mot utile)", "string", "string", "string", "string", "string"],
  "example_intro": "string (exemple d'introduction en anglais)"
}`,

    listening: `Génère un texte de compréhension anglaise pour le niveau ${level}${topicStr}.
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "string (titre de l'article/texte)",
  "text": "string (texte en anglais de 150-200 mots, adapté au niveau ${level})",
  "questions": [
    {
      "q": "string (question en anglais)",
      "options": ["string", "string", "string", "string"],
      "answer": 0
    }
  ],
  "vocabulary": ["string (mot difficile: définition)", "string", "string", "string"]
}
Génère 4 questions QCM.`,
  }

  return (modeInstructions[mode] || modeInstructions.vocabulary) + errorsStr + seenStr
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return new NextResponse('Unauthorized', { status: 401 })
    }

    const { mode, level, topic, previousErrors, seenWords } = await req.json()

    if (!mode || !level) {
      return NextResponse.json({ error: 'mode and level are required' }, { status: 400 })
    }

    const systemPrompt = `Tu es un professeur d'anglais expert, niveau CEFR, spécialisé pour les développeurs Data Engineers français. Génère des exercices adaptés au niveau ${level} et au contexte tech/data quand pertinent. Réponds TOUJOURS avec un JSON valide et rien d'autre. Sois créatif et varie les thèmes à chaque génération.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: buildPrompt(mode, level, topic, previousErrors, seenWords),
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response (strip potential markdown code blocks)
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/)
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawText

    const exercise = JSON.parse(jsonStr.trim())
    return NextResponse.json({ exercise, mode, level })
  } catch (error) {
    console.error('English generate error:', error)
    return NextResponse.json({ error: 'Failed to generate exercise' }, { status: 500 })
  }
}
