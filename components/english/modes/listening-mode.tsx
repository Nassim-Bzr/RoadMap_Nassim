"use client"
import { useState } from 'react'

interface Question {
  q: string
  options: string[]
  answer: number
}

interface ListeningExercise {
  title: string
  text: string
  questions: Question[]
  vocabulary: string[]
}

interface Props {
  exercise: ListeningExercise
  onComplete: (score: number, xp: number) => void
  onRegenerate: () => void
}

export default function ListeningMode({ exercise, onComplete, onRegenerate }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [showVocab, setShowVocab] = useState(false)

  const questions = exercise.questions || []

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealed) return
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleReveal = () => {
    const correct = questions.filter((q, i) => selectedAnswers[i] === q.answer).length
    setScore(correct)
    const xp = correct * 12 + (correct === questions.length ? 20 : 0)
    onComplete(correct, xp)
    setRevealed(true)
  }

  const allAnswered = questions.every((_, i) => selectedAnswers[i] !== undefined)
  const pct = revealed ? Math.round((score / questions.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Text article */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-xl)', padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>👂</span>
          <span style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>
            {exercise.title}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--f-sans)', fontSize: 15, lineHeight: 1.8,
          color: 'var(--ink-2)', whiteSpace: 'pre-wrap',
        }}>
          {exercise.text}
        </div>
      </div>

      {/* Vocabulary */}
      {exercise.vocabulary?.length > 0 && (
        <div>
          <button
            onClick={() => setShowVocab(v => !v)}
            style={{
              padding: '6px 14px', borderRadius: 99,
              background: showVocab ? '#E94B7C22' : 'var(--surface)',
              border: `2px solid ${showVocab ? '#E94B7C44' : 'var(--line)'}`,
              fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700,
              color: showVocab ? '#E94B7C' : 'var(--ink-3)', cursor: 'pointer',
            }}
          >
            📖 Vocabulaire difficile
          </button>
          {showVocab && (
            <div style={{
              marginTop: 10, background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-lg)', padding: '14px 18px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {exercise.vocabulary.map((v, i) => (
                <div key={i} style={{ fontSize: 13, fontFamily: 'var(--f-sans)', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  • {v}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>
        Questions de compréhension ({Object.keys(selectedAnswers).length}/{questions.length} répondues)
      </div>

      {questions.map((q, qIdx) => {
        const selected = selectedAnswers[qIdx]
        const isCorrect = revealed && selected === q.answer

        return (
          <div key={qIdx} style={{
            background: revealed
              ? (isCorrect ? '#2DBFB311' : '#E94B7C11')
              : 'var(--surface)',
            border: `2px solid ${revealed ? (isCorrect ? '#2DBFB344' : '#E94B7C44') : 'var(--line)'}`,
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              {qIdx + 1}. {q.q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oIdx) => {
                const isSelected = selected === oIdx
                const isAnswer = q.answer === oIdx
                let optBg = 'transparent'
                let optBorder = 'var(--line)'
                let optColor = 'var(--ink-2)'

                if (revealed) {
                  if (isAnswer) {
                    optBg = '#2DBFB322'
                    optBorder = '#2DBFB3'
                    optColor = '#1a8f85'
                  } else if (isSelected && !isAnswer) {
                    optBg = '#E94B7C22'
                    optBorder = '#E94B7C'
                    optColor = '#E94B7C'
                  }
                } else if (isSelected) {
                  optBg = '#E94B7C22'
                  optBorder = '#E94B7C'
                  optColor = 'var(--ink)'
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 'var(--r-md)',
                      background: optBg, border: `2px solid ${optBorder}`,
                      cursor: revealed ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${optBorder}`,
                      background: isSelected || (revealed && isAnswer) ? optBorder : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#FFF', fontWeight: 800, fontFamily: 'var(--f-sans)',
                    }}>
                      {revealed && isAnswer ? '✓' : revealed && isSelected && !isAnswer ? '✗' : String.fromCharCode(65 + oIdx)}
                    </div>
                    <span style={{ fontFamily: 'var(--f-sans)', fontSize: 14, color: optColor, lineHeight: 1.4 }}>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Score summary after reveal */}
      {revealed && (
        <div style={{
          background: pct >= 75 ? '#2DBFB311' : '#F4A43711',
          border: `2px solid ${pct >= 75 ? '#2DBFB344' : '#F4A43744'}`,
          borderRadius: 'var(--r-xl)', padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 40 }}>{pct >= 75 ? '🎉' : pct >= 50 ? '👍' : '📖'}</div>
          <div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>
              {score}/{questions.length} bonnes réponses
            </div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
              {pct >= 75 ? 'Excellent ! Votre compréhension est très bonne !' :
               pct >= 50 ? 'Pas mal ! Relisez le texte pour les points manqués.' :
               'Relisez attentivement le texte et réessayez.'}
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!allAnswered}
            style={{
              padding: '14px 32px', borderRadius: 'var(--r-md)',
              background: allAnswered ? '#E94B7C' : 'var(--line)',
              color: allAnswered ? '#FFF' : 'var(--ink-mute)',
              fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
              border: 'none', cursor: allAnswered ? 'pointer' : 'not-allowed',
              boxShadow: allAnswered ? '0 4px 0 #b23660' : 'none',
              transition: 'all 0.15s',
            }}
          >
            Vérifier mes réponses
          </button>
        ) : (
          <button
            onClick={onRegenerate}
            style={{
              padding: '14px 32px', borderRadius: 'var(--r-md)',
              background: 'var(--primary)', color: '#FFF',
              fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 0 var(--primary-dark)',
            }}
          >
            Nouveau texte
          </button>
        )}
      </div>
    </div>
  )
}
