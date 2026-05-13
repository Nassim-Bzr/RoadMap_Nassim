"use client"

import { useState } from 'react'
import FennecMascot from '@/components/mascot'

interface Quiz {
  question: string
  options: string[]
  correct_index: number
  explanation: string
}

interface Lesson {
  concept: string
  why_it_matters: string
  code_example: string
  code_language: string
  quiz: Quiz
  pro_tip: string
  next_step: string
}

interface Props {
  lesson: Lesson
  taskId: string
  taskLabel: string
  onComplete: () => void
}

type Step = 'concept' | 'code' | 'quiz' | 'done'

export default function LessonView({ lesson, taskId, taskLabel, onComplete }: Props) {
  const [step, setStep] = useState<Step>('concept')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<{ correct: boolean; explanation: string | null } | null>(null)
  const [loading, setLoading] = useState(false)

  const steps: Step[] = ['concept', 'code', 'quiz', 'done']
  const stepLabels = ['Concept', 'Code', 'Quiz', 'Done']
  const currentIdx = steps.indexOf(step)

  const handleQuizSubmit = async () => {
    if (selectedOption === null) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          question: lesson.quiz.question,
          selectedIndex: selectedOption,
          correctIndex: lesson.quiz.correct_index,
          options: lesson.quiz.options,
        }),
      })
      const data = await res.json()
      setQuizResult({ correct: data.correct, explanation: data.explanation })
    } finally {
      setLoading(false)
    }
  }

  const card: React.CSSProperties = {
    background: 'var(--surface)', border: '2px solid var(--line)',
    borderRadius: 'var(--r-lg)', padding: '20px 22px', marginBottom: 12,
    boxShadow: '0 3px 0 var(--line-2)',
  }

  return (
    <div>
      {/* Step progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        {steps.map((s, i) => {
          const isDone = currentIdx > i
          const isActive = s === step
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${isDone ? 'var(--c-05)' : isActive ? 'var(--primary)' : 'var(--line)'}`,
                background: isDone ? 'color-mix(in oklab, var(--c-05) 16%, var(--surface))' : isActive ? 'color-mix(in oklab, var(--primary) 12%, var(--surface))' : 'var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                color: isDone ? 'var(--c-05)' : isActive ? 'var(--primary)' : 'var(--ink-mute)',
                boxShadow: isActive ? '0 2px 0 var(--primary-dark)' : isDone ? '0 2px 0 var(--c-05-d)' : '0 2px 0 var(--line-2)',
              }}>
                {isDone ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--ink)' : 'var(--ink-mute)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {stepLabels[i]}
              </span>
              {i < steps.length - 1 && (
                <div style={{ width: 24, height: 2, background: isDone ? 'var(--c-05)' : 'var(--line)', borderRadius: 2 }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Task title */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Leçon en cours
        </div>
        <h2 style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>
          {taskLabel}
        </h2>
      </div>

      {/* CONCEPT */}
      {step === 'concept' && (
        <div>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--c-05)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>📖 Concept</div>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 600 }}>{lesson.concept}</p>
          </div>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>🎯 Pourquoi c&apos;est important</div>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 600 }}>{lesson.why_it_matters}</p>
          </div>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gem-d)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>💡 Pro tip</div>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0, fontStyle: 'italic', fontWeight: 600 }}>{lesson.pro_tip}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-3d" onClick={() => setStep('code')}>
              Voir l&apos;exemple de code →
            </button>
          </div>
        </div>
      )}

      {/* CODE */}
      {step === 'code' && (
        <div>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--c-03)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
              {'</>'} Exemple {lesson.code_language}
            </div>
            <pre style={{
              background: 'var(--bg)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-md)', padding: '16px 18px',
              fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--ink)',
              lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre', margin: 0,
              boxShadow: '0 2px 0 var(--line-2)',
            }}>
              {lesson.code_example}
            </pre>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep('concept')}
              style={{
                padding: '10px 20px', background: 'var(--surface)', border: '2px solid var(--line)',
                borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                color: 'var(--ink-2)', fontFamily: 'var(--f-sans)', boxShadow: '0 3px 0 var(--line-2)',
              }}
            >
              ← Concept
            </button>
            <button className="btn-3d" onClick={() => setStep('quiz')}>
              Tester mes connaissances →
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <div>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--flame)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>🧠 Quiz</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', marginBottom: 16, lineHeight: 1.45, letterSpacing: '-0.005em' }}>
              {lesson.quiz.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lesson.quiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx
                const isCorrect = idx === lesson.quiz.correct_index
                let borderColor = 'var(--line)'
                let bg = 'var(--bg)'
                let color = 'var(--ink)'
                let shadow = '0 2px 0 var(--line-2)'
                if (quizResult) {
                  if (isCorrect) { borderColor = 'var(--c-05)'; bg = 'color-mix(in oklab, var(--c-05) 10%, var(--surface))'; color = 'var(--c-05)'; shadow = '0 2px 0 var(--c-05-d)' }
                  else if (isSelected) { borderColor = 'var(--c-04)'; bg = 'color-mix(in oklab, var(--c-04) 10%, var(--surface))'; color = 'var(--c-04)'; shadow = '0 2px 0 var(--c-04-d)' }
                } else if (isSelected) {
                  borderColor = 'var(--primary)'; bg = 'color-mix(in oklab, var(--primary) 8%, var(--surface))'; color = 'var(--ink)'; shadow = '0 2px 0 var(--primary-dark)'
                }
                return (
                  <button
                    key={idx}
                    disabled={quizResult !== null}
                    onClick={() => !quizResult && setSelectedOption(idx)}
                    style={{
                      background: bg, border: `2px solid ${borderColor}`,
                      borderRadius: 'var(--r-md)', padding: '11px 14px',
                      textAlign: 'left', cursor: quizResult ? 'default' : 'pointer',
                      color, fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 10,
                      boxShadow: shadow, fontFamily: 'var(--f-sans)',
                      transition: 'all 0.1s',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: isSelected || (quizResult && isCorrect) ? borderColor : 'var(--line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: 'white',
                    }}>
                      {quizResult && isCorrect ? '✓' : quizResult && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ opacity: !quizResult || isSelected || isCorrect ? 1 : 0.5 }}>{option}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {quizResult && (
            <div style={{
              ...card,
              borderColor: quizResult.correct ? 'var(--c-05)' : 'var(--c-04)',
              background: quizResult.correct ? 'color-mix(in oklab, var(--c-05) 8%, var(--surface))' : 'color-mix(in oklab, var(--c-04) 8%, var(--surface))',
              boxShadow: quizResult.correct ? '0 3px 0 var(--c-05-d)' : '0 3px 0 var(--c-04-d)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{quizResult.correct ? '🎉' : '🤔'}</span>
                <span style={{
                  fontFamily: 'var(--f-sans)', fontWeight: 900, fontSize: 15,
                  color: quizResult.correct ? 'var(--c-05)' : 'var(--c-04)',
                }}>
                  {quizResult.correct ? 'Correct !' : 'Pas tout à fait...'}
                </span>
              </div>
              {quizResult.explanation && (
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                  {quizResult.explanation}
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep('code')}
              style={{
                padding: '10px 20px', background: 'var(--surface)', border: '2px solid var(--line)',
                borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                color: 'var(--ink-2)', fontFamily: 'var(--f-sans)', boxShadow: '0 3px 0 var(--line-2)',
              }}
            >
              ← Code
            </button>
            {!quizResult ? (
              <button
                className="btn-3d"
                style={{ opacity: selectedOption === null || loading ? 0.5 : 1 } as React.CSSProperties}
                disabled={selectedOption === null || loading}
                onClick={handleQuizSubmit}
              >
                {loading ? 'Validation...' : 'Valider →'}
              </button>
            ) : (
              <button className="btn-3d" onClick={() => setStep('done')}>
                Terminer la leçon →
              </button>
            )}
          </div>
        </div>
      )}

      {/* DONE */}
      {step === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, color-mix(in oklab, var(--gold) 16%, var(--bg-soft)), var(--surface))',
            border: '2px solid var(--gold)', borderRadius: 'var(--r-xl)',
            padding: '40px 32px', boxShadow: '0 4px 0 var(--gold-d)', marginBottom: 16,
          }}>
            <div style={{ margin: '0 auto 16px', animation: 'crown-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', display: 'inline-block' }}>
              <FennecMascot size={80} mood="happy" />
            </div>
            <h3 style={{ fontFamily: 'var(--f-sans)', fontSize: 24, fontWeight: 900, color: 'var(--ink)', marginBottom: 6, letterSpacing: '-0.02em' }}>
              Leçon terminée !
            </h3>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 0 }}>&quot;{taskLabel}&quot;</p>
          </div>

          <div style={{
            background: 'var(--surface)', border: '2px solid var(--line)',
            borderRadius: 'var(--r-lg)', padding: '20px 22px',
            boxShadow: '0 3px 0 var(--line-2)', textAlign: 'left', marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              🚀 Prochaine étape
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 600 }}>
              {lesson.next_step}
            </p>
          </div>

          <button className="btn-3d" onClick={onComplete}>
            Choisir une autre leçon
          </button>
        </div>
      )}
    </div>
  )
}
