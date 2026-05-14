import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userCode, solution, instructions, language, taskLabel } = await req.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Tu es un tuteur Data Engineer. Évalue ce code soumis par un étudiant pour l'exercice : "${taskLabel}"

CONSIGNE DE L'EXERCICE :
${instructions}

CODE DE L'ÉTUDIANT (${language}) :
\`\`\`${language}
${userCode}
\`\`\`

SOLUTION ATTENDUE :
\`\`\`${language}
${solution}
\`\`\`

Donne un feedback court (4-6 lignes max) :
1. Est-ce correct ? (oui/non/partiellement)
2. Ce qui est bien
3. Ce qui peut être amélioré (si applicable)
4. Un conseil concret pour la prochaine fois

Sois encourageant, précis, en français. Pas de blabla.`,
      }],
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
  } catch (err) {
    console.error('Practice feedback error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
