"use client"
import { useState } from 'react'

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface QuizData {
  type: 'quiz'
  questions: QuizQuestion[]
}

interface Props {
  quiz: QuizData
  onComplete?: (score: number) => void
}

export default function QuizDisplay({ quiz, onComplete }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  )
  const [submitted, setSubmitted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const questions = quiz.questions
  const allAnswered = selectedAnswers.every(a => a !== null)

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setSelectedAnswers(prev => {
      const updated = [...prev]
      updated[qIdx] = optIdx
      return updated
    })
    // In single-question mode, auto-advance after a short delay
    if (!showAll) {
      setTimeout(() => {
        if (qIdx < questions.length - 1) setCurrentQ(qIdx + 1)
      }, 800)
    }
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    setSubmitted(true)
    const score = selectedAnswers.filter((a, i) => a === questions[i].correct).length
    onComplete?.(score)
  }

  const score = submitted
    ? selectedAnswers.filter((a, i) => a === questions[i].correct).length
    : 0

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  const renderQuestion = (q: QuizQuestion, qIdx: number) => {
    const selected = selectedAnswers[qIdx]
    const isCorrect = submitted && selected === q.correct
    const isWrong = submitted && selected !== null && selected !== q.correct

    return (
      <div key={qIdx} style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden',
      }}>
        {/* Question header */}
        <div style={{
          padding: '14px 18px',
          background: 'color-mix(in oklab, var(--primary) 5%, var(--surface))',
          borderBottom: '2px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: submitted ? (isCorrect ? '#2DBFB3' : isWrong ? '#E94B7C' : 'var(--line)') : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, color: '#fff',
            boxShadow: submitted
              ? `0 3px 0 ${isCorrect ? '#1a9e95' : isWrong ? '#a01040' : 'var(--line-2)'}`
              : '0 3px 0 var(--primary-dark)',
          }}>
            {submitted ? (isCorrect ? '✓' : isWrong ? '✗' : qIdx + 1) : qIdx + 1}
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.6 }}>
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options.map((opt, optIdx) => {
            const isSelected = selected === optIdx
            const isCorrectOpt = q.correct === optIdx
            let bg = 'var(--bg)'
            let borderColor = 'var(--line)'
            let color = 'var(--ink-2)'

            if (submitted) {
              if (isCorrectOpt) { bg = 'color-mix(in oklab, #2DBFB3 12%, var(--surface))'; borderColor = '#2DBFB3'; color = '#1a9e95' }
              else if (isSelected) { bg = 'color-mix(in oklab, #E94B7C 12%, var(--surface))'; borderColor = '#E94B7C'; color = '#c02055' }
            } else if (isSelected) {
              bg = 'color-mix(in oklab, var(--primary) 10%, var(--surface))'
              borderColor = 'var(--primary)'
              color = 'var(--primary)'
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(qIdx, optIdx)}
                disabled={submitted}
                style={{
                  width: '100%', padding: '11px 14px', textAlign: 'left',
                  background: bg, border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--r-md)', cursor: submitted ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.15s', fontFamily: 'var(--f-sans)',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: isSelected || (submitted && isCorrectOpt) ? borderColor : 'var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900,
                  color: isSelected || (submitted && isCorrectOpt) ? '#fff' : 'var(--ink-mute)',
                }}>
                  {OPTION_LABELS[optIdx]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color, lineHeight: 1.5 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {submitted && selected !== null && (
          <div style={{
            margin: '0 16px 14px',
            padding: '12px 14px',
            background: isCorrect
              ? 'color-mix(in oklab, #2DBFB3 6%, var(--surface))'
              : 'color-mix(in oklab, #F4A437 6%, var(--surface))',
            border: `2px solid ${isCorrect ? 'color-mix(in oklab, #2DBFB3 30%, var(--line))' : 'color-mix(in oklab, #F4A437 30%, var(--line))'}`,
            borderRadius: 'var(--r-md)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: isCorrect ? '#1a9e95' : '#b97800', marginBottom: 4 }}>
              {isCorrect ? '✓ Exact !' : '💡 Explication'}
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {q.explanation}
            </p>
          </div>
        )}
      </div>
    )
  }

  if (submitted) {
    const percent = Math.round((score / questions.length) * 100)
    const xp = score * 15
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--f-sans)' }}>
        {/* Score */}
        <div style={{
          background: percent >= 75
            ? 'color-mix(in oklab, #2DBFB3 10%, var(--surface))'
            : 'color-mix(in oklab, #F4A437 10%, var(--surface))',
          border: `2px solid ${percent >= 75 ? '#2DBFB3' : '#F4A437'}`,
          borderRadius: 'var(--r-xl)', padding: '28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48 }}>
            {percent >= 75 ? '🎉' : percent >= 50 ? '💪' : '📚'}
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)' }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-2)' }}>
            {percent}% de bonnes réponses · +{xp} XP
          </div>
          {/* Score bar */}
          <div style={{ width: '100%', maxWidth: 280, height: 12, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${percent}%`,
              background: percent >= 75 ? '#2DBFB3' : percent >= 50 ? '#F4A437' : '#E94B7C',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 600 }}>
            {percent >= 90 ? 'Excellent ! Tu maîtrises ce sujet !' :
             percent >= 75 ? 'Très bien ! Continue comme ça !' :
             percent >= 50 ? 'Pas mal ! Révise les points ratés.' :
             'Courage ! Relis la leçon et réessaie.'}
          </div>
        </div>

        {/* Detailed review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {questions.map((q, i) => renderQuestion(q, i))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--f-sans)' }}>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
          🎯 {questions.length} questions · {selectedAnswers.filter(a => a !== null).length} répondues
        </div>
        <button
          onClick={() => setShowAll(p => !p)}
          style={{
            padding: '7px 14px', borderRadius: 'var(--r-md)',
            background: 'var(--surface)', border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700,
            color: 'var(--ink-3)', cursor: 'pointer',
          }}
        >
          {showAll ? '📄 Une par une' : '📋 Tout afficher'}
        </button>
      </div>

      {/* Questions */}
      {showAll
        ? questions.map((q, i) => renderQuestion(q, i))
        : renderQuestion(questions[currentQ], currentQ)
      }

      {/* Navigation (single mode) */}
      {!showAll && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              style={{
                width: 34, height: 34, borderRadius: 'var(--r-sm)',
                background: currentQ === i
                  ? 'var(--primary)'
                  : selectedAnswers[i] !== null
                    ? 'color-mix(in oklab, #9B7EE5 15%, var(--surface))'
                    : 'var(--surface)',
                border: `2px solid ${currentQ === i ? 'var(--primary-dark)' : selectedAnswers[i] !== null ? '#9B7EE5' : 'var(--line)'}`,
                fontSize: 13, fontWeight: 800,
                color: currentQ === i ? '#fff' : selectedAnswers[i] !== null ? '#9B7EE5' : 'var(--ink-mute)',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        style={{
          padding: '14px 24px', borderRadius: 'var(--r-lg)',
          background: allAnswered ? 'var(--primary)' : 'var(--line)',
          color: allAnswered ? '#fff' : 'var(--ink-mute)',
          fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
          border: 'none', cursor: allAnswered ? 'pointer' : 'not-allowed',
          boxShadow: allAnswered ? '0 4px 0 var(--primary-dark)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        {allAnswered ? '✓ Valider le quiz' : `Réponds à toutes les questions (${selectedAnswers.filter(a => a !== null).length}/${questions.length})`}
      </button>
    </div>
  )
}
