"use client"
import { useState } from 'react'

interface Exercise {
  sentence: string
  answer: string
  hint: string
}

interface GrammarExercise {
  rule: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
}

interface Props {
  exercise: GrammarExercise
  onComplete: (score: number, xp: number) => void
  onRegenerate: () => void
}

export default function GrammarMode({ exercise, onComplete, onRegenerate }: Props) {
  const [answers, setAnswers] = useState<string[]>(
    () => (exercise.exercises || []).map(() => '')
  )
  const [submitted, setSubmitted] = useState<boolean[]>(
    () => (exercise.exercises || []).map(() => false)
  )
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const exercises = exercise.exercises || []

  const checkAnswer = (idx: number) => {
    const newSubmitted = [...submitted]
    newSubmitted[idx] = true
    setSubmitted(newSubmitted)
  }

  const isCorrect = (idx: number) => {
    return answers[idx].trim().toLowerCase() === exercises[idx].answer.trim().toLowerCase()
  }

  const handleFinish = () => {
    const correct = submitted.filter((s, i) => s && isCorrect(i)).length
    const totalScore = exercises.filter((_, i) => submitted[i] && isCorrect(i)).length
    const xp = totalScore * 15 + (totalScore === exercises.length ? 25 : 0)
    setScore(totalScore)
    onComplete(totalScore, xp)
    setShowResult(true)
  }

  const allAnswered = submitted.every(Boolean)

  if (showResult) {
    const pct = Math.round((score / exercises.length) * 100)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 0' }}>
        <div style={{ fontSize: 56 }}>{pct >= 80 ? '🎓' : pct >= 60 ? '📝' : '💡'}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 900, color: 'var(--ink)' }}>
            {score}/{exercises.length} exercices réussis
          </div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 15, color: 'var(--ink-3)', marginTop: 8 }}>
            Règle travaillée: <strong>{exercise.rule}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onRegenerate}
            style={{
              padding: '12px 28px', borderRadius: 'var(--r-md)',
              background: 'var(--primary)', color: '#FFF',
              fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 0 var(--primary-dark)',
            }}
          >
            Nouvel exercice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Rule card */}
      <div style={{
        background: 'linear-gradient(135deg, #9B7EE522, #9B7EE511)',
        border: '2px solid #9B7EE544',
        borderRadius: 'var(--r-xl)', padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: '#9B7EE5' }}>
            {exercise.rule}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--f-sans)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
          {exercise.explanation}
        </p>
      </div>

      {/* Examples */}
      {exercise.examples?.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Exemples
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {exercise.examples.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#9B7EE5', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: -8 }}>
        Exercices ({exercises.filter((_, i) => submitted[i]).length}/{exercises.length})
      </div>

      {exercises.map((ex, idx) => {
        const isSubmitted = submitted[idx]
        const correct = isSubmitted && isCorrect(idx)
        const parts = ex.sentence.split('___')

        return (
          <div key={idx} style={{
            background: isSubmitted
              ? correct ? '#2DBFB311' : '#E94B7C11'
              : 'var(--surface)',
            border: `2px solid ${isSubmitted ? (correct ? '#2DBFB344' : '#E94B7C44') : 'var(--line)'}`,
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            transition: 'all 0.2s',
          }}>
            {/* Sentence with input */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--f-sans)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.8 }}>{parts[0]}</span>
              {isSubmitted ? (
                <span style={{
                  display: 'inline-block', padding: '2px 10px',
                  borderRadius: 6, fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 700,
                  background: correct ? '#2DBFB3' : '#E94B7C',
                  color: '#FFF', minWidth: 60, textAlign: 'center',
                }}>
                  {answers[idx] || '___'}
                </span>
              ) : (
                <input
                  type="text"
                  value={answers[idx]}
                  onChange={e => {
                    const newAnswers = [...answers]
                    newAnswers[idx] = e.target.value
                    setAnswers(newAnswers)
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') checkAnswer(idx) }}
                  placeholder="___"
                  style={{
                    display: 'inline-block', width: 120,
                    padding: '4px 10px', borderRadius: 6,
                    border: '2px solid #9B7EE5',
                    fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 700,
                    color: 'var(--ink)', background: '#9B7EE511',
                    outline: 'none', textAlign: 'center',
                  }}
                />
              )}
              {parts[1] && <span style={{ fontFamily: 'var(--f-sans)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.8 }}>{parts[1]}</span>}
            </div>

            {/* Hint */}
            {!isSubmitted && (
              <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', fontStyle: 'italic', marginBottom: 10 }}>
                💡 {ex.hint}
              </div>
            )}

            {/* Feedback after submit */}
            {isSubmitted && (
              <div style={{ marginTop: 6 }}>
                {correct ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2DBFB3', fontFamily: 'var(--f-sans)' }}>
                    ✓ Correct !
                  </div>
                ) : (
                  <div style={{ fontSize: 13, fontFamily: 'var(--f-sans)' }}>
                    <span style={{ color: '#E94B7C', fontWeight: 700 }}>✗ Incorrect.</span>
                    {' '}Réponse correcte:{' '}
                    <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--ink)' }}>{ex.answer}</span>
                    <div style={{ color: 'var(--ink-3)', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>💡 {ex.hint}</div>
                  </div>
                )}
              </div>
            )}

            {/* Validate button */}
            {!isSubmitted && (
              <button
                onClick={() => checkAnswer(idx)}
                disabled={!answers[idx].trim()}
                style={{
                  marginTop: 8, padding: '8px 16px', borderRadius: 'var(--r-md)',
                  background: answers[idx].trim() ? '#9B7EE5' : 'var(--line)',
                  color: answers[idx].trim() ? '#FFF' : 'var(--ink-mute)',
                  fontFamily: 'var(--f-sans)', fontWeight: 700, fontSize: 12,
                  border: 'none', cursor: answers[idx].trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                Valider
              </button>
            )}
          </div>
        )
      })}

      {/* Finish button */}
      {allAnswered && (
        <button
          onClick={handleFinish}
          style={{
            padding: '14px 32px', borderRadius: 'var(--r-md)',
            background: 'var(--primary)', color: '#FFF',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 0 var(--primary-dark)',
            alignSelf: 'center', marginTop: 8,
          }}
        >
          Voir mes résultats
        </button>
      )}
    </div>
  )
}
