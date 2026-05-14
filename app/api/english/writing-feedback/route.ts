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

    const { text, prompt, level } = await req.json()

    if (!text || !level) {
      return new Response('text and level are required', { status: 400 })
    }

    const systemPrompt = `Tu es un professeur d'anglais expert qui corrige des rédactions pour des apprenants français de niveau CEFR ${level}.

Analyse le texte anglais fourni et donne un feedback détaillé en suivant ce format exact:

## Score: X/10

## Points forts
- [liste des points positifs]

## Corrections importantes
Pour chaque erreur significative:
❌ **Erreur**: [phrase incorrecte]
✅ **Correction**: [phrase corrigée]
💬 **Explication**: [explication courte en français]

## Texte corrigé
[Version améliorée du texte complet, en anglais]

## Conseils pour progresser
- [2-3 conseils spécifiques adaptés au niveau ${level}]

Sois encourageant mais précis. Adapte la sévérité de la correction au niveau ${level}.`

    const userMessage = prompt
      ? `Sujet de rédaction: "${prompt}"\n\nTexte de l'étudiant:\n${text}`
      : `Texte de l'étudiant:\n${text}`

    const stream = await anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
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
    console.error('Writing feedback error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
