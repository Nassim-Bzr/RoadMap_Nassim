"use client"
import { useState } from 'react'

interface WritingExercise {
  prompt: string
  context: string
  requirements: string[]
  vocabulary_hints: string[]
  example_intro: string
}

interface Props {
  exercise: WritingExercise
  level: string
  onComplete: (score: number, xp: number) => void
  onRegenerate: () => void
}

function renderMarkdown(text: string) {
  return text
    .replace(/##\s(.+)/g, '<h3 style="font-size:15px;font-weight:900;color:var(--ink);margin:16px 0 8px;">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/❌\s\*\*(.+?)\*\*:\s(.+)/g, '<div style="margin:6px 0;"><span style="color:#E94B7C;font-weight:700;">❌ $1</span>: $2</div>')
    .replace(/✅\s\*\*(.+?)\*\*:\s(.+)/g, '<div style="margin:6px 0;"><span style="color:#2DBFB3;font-weight:700;">✅ $1</span>: $2</div>')
    .replace(/💬\s\*\*(.+?)\*\*:\s(.+)/g, '<div style="margin:4px 0 10px;padding-left:16px;font-style:italic;color:var(--ink-3);">💬 $2</div>')
    .replace(/^-\s(.+)/gm, '<div style="display:flex;gap:6px;margin:3px 0;">• <span>$1</span></div>')
    .replace(/\n\n/g, '<br/>')
}

export default function WritingMode({ exercise, level, onComplete, onRegenerate }: Props) {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [completed, setCompleted] = useState(false)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const getFeedback = async () => {
    if (!text.trim() || loadingFeedback) return
    setLoadingFeedback(true)
    setFeedback('')

    try {
      const res = await fetch('/api/english/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, prompt: exercise.prompt, level }),
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let feedbackText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              // Extract score from feedback
              const scoreMatch = feedbackText.match(/Score:\s*(\d+)\/10/)
              const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
              const xp = score * 8 + (wordCount > 80 ? 20 : 0)
              onComplete(score, xp)
              setCompleted(true)
              break
            }
            try {
              const { text: t } = JSON.parse(data)
              feedbackText += t
              setFeedback(feedbackText)
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error(err)
      setFeedback('Erreur lors de la génération du feedback. Veuillez réessayer.')
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Prompt card */}
      <div style={{
        background: 'linear-gradient(135deg, #F4A43722, #F4A43711)',
        border: '2px solid #F4A43744',
        borderRadius: 'var(--r-xl)', padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>✍️</span>
          <span style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 800, color: '#F4A437', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sujet de rédaction
          </span>
        </div>
        <p style={{ fontFamily: 'var(--f-sans)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.5 }}>
          {exercise.prompt}
        </p>
        <p style={{ fontFamily: 'var(--f-sans)', fontSize: 13, color: 'var(--ink-3)', margin: 0, lineHeight: 1.6 }}>
          {exercise.context}
        </p>
      </div>

      {/* Requirements */}
      {exercise.requirements?.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '16px 20px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Critères
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {exercise.requirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  border: '2px solid #F4A43766', background: '#F4A43711',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#F4A437', fontWeight: 900, fontFamily: 'var(--f-sans)',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontFamily: 'var(--f-sans)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  {req}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible hints + example */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowHints(h => !h)}
          style={{
            padding: '6px 14px', borderRadius: 99,
            background: showHints ? '#F4A43722' : 'var(--surface)',
            border: `2px solid ${showHints ? '#F4A43744' : 'var(--line)'}`,
            fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700,
            color: showHints ? '#F4A437' : 'var(--ink-3)', cursor: 'pointer',
          }}
        >
          📚 Vocabulaire utile
        </button>
        <button
          onClick={() => setShowExample(e => !e)}
          style={{
            padding: '6px 14px', borderRadius: 99,
            background: showExample ? '#F4A43722' : 'var(--surface)',
            border: `2px solid ${showExample ? '#F4A43744' : 'var(--line)'}`,
            fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700,
            color: showExample ? '#F4A437' : 'var(--ink-3)', cursor: 'pointer',
          }}
        >
          💡 Voir l'intro exemple
        </button>
      </div>

      {showHints && exercise.vocabulary_hints?.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '14px 18px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {exercise.vocabulary_hints.map((hint, i) => (
              <span key={i} style={{
                padding: '5px 12px', borderRadius: 99,
                background: '#F4A43722', border: '1px solid #F4A43744',
                fontSize: 13, fontFamily: 'var(--f-mono)', color: '#c47b00', fontWeight: 600,
              }}>
                {hint}
              </span>
            ))}
          </div>
        </div>
      )}

      {showExample && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '14px 18px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Exemple d'introduction
          </div>
          <p style={{ fontFamily: 'var(--f-sans)', fontSize: 14, color: 'var(--ink-2)', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
            "{exercise.example_intro}"
          </p>
        </div>
      )}

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your English text here..."
          rows={10}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '16px', borderRadius: 'var(--r-xl)',
            border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontSize: 15, color: 'var(--ink)',
            background: 'var(--surface)', resize: 'vertical',
            outline: 'none', lineHeight: 1.7,
          }}
        />
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)',
          fontFamily: 'var(--f-sans)',
          background: 'var(--surface)', padding: '2px 8px', borderRadius: 99,
        }}>
          {wordCount} mots
        </div>
      </div>

      {/* Feedback button */}
      {!completed && (
        <button
          onClick={getFeedback}
          disabled={!text.trim() || loadingFeedback || wordCount < 10}
          style={{
            alignSelf: 'center', padding: '14px 32px', borderRadius: 'var(--r-md)',
            background: text.trim() && !loadingFeedback && wordCount >= 10 ? 'var(--primary)' : 'var(--line)',
            color: text.trim() && !loadingFeedback && wordCount >= 10 ? '#FFF' : 'var(--ink-mute)',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
            border: 'none',
            cursor: text.trim() && !loadingFeedback && wordCount >= 10 ? 'pointer' : 'not-allowed',
            boxShadow: text.trim() && !loadingFeedback && wordCount >= 10 ? '0 4px 0 var(--primary-dark)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {loadingFeedback ? '✨ Analyse en cours...' : '🎯 Obtenir feedback IA'}
        </button>
      )}

      {wordCount > 0 && wordCount < 10 && (
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)' }}>
          Écrivez au moins 10 mots pour obtenir un feedback
        </div>
      )}

      {/* Feedback display */}
      {feedback && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-xl)', padding: '20px 24px',
          fontFamily: 'var(--f-sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Feedback de l'IA
          </div>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(feedback) }} />
        </div>
      )}

      {completed && (
        <button
          onClick={onRegenerate}
          style={{
            alignSelf: 'center', padding: '12px 28px', borderRadius: 'var(--r-md)',
            background: 'var(--surface)', border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontWeight: 700, fontSize: 13, color: 'var(--ink-3)',
            cursor: 'pointer',
          }}
        >
          Nouveau sujet
        </button>
      )}
    </div>
  )
}
