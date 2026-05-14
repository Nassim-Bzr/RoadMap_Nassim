"use client"
import { useState } from 'react'

export interface ExerciseData {
  type: 'exercise'
  problem: string
  context: string
  steps: string[]
  answer: string
  explanation: string
  python_check: string
}

interface Props {
  exercise: ExerciseData
  onComplete?: (correct: boolean) => void
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/,/g, '.')
    .replace(/[^\w.%+-]/g, '')
}

function isAnswerClose(userAns: string, correctAns: string): boolean {
  const u = normalizeAnswer(userAns)
  const c = normalizeAnswer(correctAns)
  if (u === c) return true

  // Try numeric proximity (within 1% relative)
  const uNum = parseFloat(u)
  const cNum = parseFloat(c)
  if (!isNaN(uNum) && !isNaN(cNum) && cNum !== 0) {
    return Math.abs(uNum - cNum) / Math.abs(cNum) < 0.02
  }

  // Substring match (answer contains key part or vice versa)
  if (u.length > 2 && c.includes(u)) return true
  if (c.length > 2 && u.includes(c)) return true

  return false
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 6,
        }}>
          {label}
        </div>
      )}
      <div style={{ background: '#161525', borderRadius: 'var(--r-md)', padding: '16px 18px', position: 'relative', border: '2px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute', top: 10, right: 10,
            padding: '4px 10px', borderRadius: 6,
            background: copied ? '#2DBFB3' : 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer',
            fontSize: 11, fontWeight: 700,
            color: copied ? '#fff' : 'rgba(255,255,255,0.6)',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ Copié' : 'Copier'}
        </button>
        <pre style={{
          margin: 0, fontFamily: 'var(--f-mono)', fontSize: 13, lineHeight: 1.7,
          color: '#c9d1d9', whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: 60,
        }}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default function ExerciseDisplay({ exercise, onComplete }: Props) {
  const [userAnswer, setUserAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set())
  const [showPython, setShowPython] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleCheck = () => {
    if (!userAnswer.trim()) return
    const correct = isAnswerClose(userAnswer, exercise.answer)
    setChecked(true)
    setIsCorrect(correct)
    if (correct && !xpAwarded) {
      setXpAwarded(true)
      onComplete?.(true)
    } else if (!correct) {
      onComplete?.(false)
    }
  }

  const handleRevealHint = (i: number) => {
    setRevealedHints(prev => new Set([...prev, i]))
  }

  const handleReset = () => {
    setUserAnswer('')
    setChecked(false)
    setIsCorrect(false)
    setRevealedHints(new Set())
    setShowPython(false)
    setXpAwarded(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--f-sans)' }}>
      {/* Problem */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-lg)', padding: '20px 22px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          🧮 Problème
        </div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.65 }}>
          {exercise.problem}
        </p>
      </div>

      {/* Context */}
      <div style={{
        background: 'color-mix(in oklab, #4A90E2 6%, var(--surface))',
        border: '2px solid color-mix(in oklab, #4A90E2 20%, var(--line))',
        borderRadius: 'var(--r-md)', padding: '14px 16px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>🎯</span>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.65 }}>
          <strong>Contexte :</strong> {exercise.context}
        </p>
      </div>

      {/* Hints */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          💡 Indices guidés (optionnels)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercise.steps.map((step, i) => (
            <div key={i} style={{ border: '2px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
              <button
                onClick={() => handleRevealHint(i)}
                style={{
                  width: '100%', padding: '11px 14px',
                  background: revealedHints.has(i) ? 'color-mix(in oklab, #9B7EE5 8%, var(--surface))' : 'var(--surface)',
                  border: 'none', cursor: revealedHints.has(i) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  textAlign: 'left', fontFamily: 'var(--f-sans)',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: revealedHints.has(i) ? '#9B7EE5' : 'var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: revealedHints.has(i) ? '#fff' : 'var(--ink-mute)',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: revealedHints.has(i) ? 'var(--ink-2)' : 'var(--ink-mute)' }}>
                  {revealedHints.has(i) ? step : `Indice ${i + 1} — cliquer pour révéler`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Answer input */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          ✏️ Ta réponse
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !checked && handleCheck()}
            disabled={checked && isCorrect}
            placeholder="Tape ta réponse ici..."
            style={{
              flex: 1, padding: '12px 14px',
              background: checked
                ? isCorrect ? 'color-mix(in oklab, #2DBFB3 8%, var(--surface))' : 'color-mix(in oklab, #E94B7C 8%, var(--surface))'
                : 'var(--bg)',
              border: `2px solid ${checked ? (isCorrect ? '#2DBFB3' : '#E94B7C') : 'var(--line)'}`,
              borderRadius: 'var(--r-md)', fontFamily: 'var(--f-sans)',
              fontSize: 14, fontWeight: 700, color: 'var(--ink)', outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!userAnswer.trim()}
              style={{
                padding: '12px 20px', borderRadius: 'var(--r-md)',
                background: !userAnswer.trim() ? 'var(--line)' : 'var(--primary)',
                color: !userAnswer.trim() ? 'var(--ink-mute)' : '#fff',
                fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 13,
                border: 'none', cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                boxShadow: !userAnswer.trim() ? 'none' : '0 3px 0 var(--primary-dark)',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              Vérifier ✓
            </button>
          ) : (
            <button
              onClick={handleReset}
              style={{
                padding: '12px 20px', borderRadius: 'var(--r-md)',
                background: 'var(--surface)', color: 'var(--ink-2)',
                fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 13,
                border: '2px solid var(--line)', cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {checked && (
        <div style={{
          background: isCorrect ? 'color-mix(in oklab, #2DBFB3 8%, var(--surface))' : 'color-mix(in oklab, #E94B7C 8%, var(--surface))',
          border: `2px solid ${isCorrect ? '#2DBFB3' : '#E94B7C'}`,
          borderRadius: 'var(--r-lg)', padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>{isCorrect ? '🎉' : '💪'}</span>
            <div style={{ fontSize: 15, fontWeight: 900, color: isCorrect ? '#1a9e95' : '#c02055' }}>
              {isCorrect ? 'Bravo ! Bonne réponse ! +30 XP' : 'Pas tout à fait…'}
            </div>
          </div>
          {!isCorrect && (
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>
              Réponse correcte : <span style={{ color: '#2DBFB3', fontFamily: 'var(--f-mono)' }}>{exercise.answer}</span>
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.65 }}>
            {exercise.explanation}
          </div>
        </div>
      )}

      {/* Python check */}
      {checked && (
        <div>
          <button
            onClick={() => setShowPython(p => !p)}
            style={{
              padding: '8px 14px', borderRadius: 'var(--r-md)',
              background: 'var(--surface)', border: '2px solid var(--line)',
              fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700,
              color: 'var(--ink-3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            🐍 {showPython ? 'Masquer' : 'Voir'} le code Python
          </button>
          {showPython && (
            <div style={{ marginTop: 10 }}>
              <CodeBlock code={exercise.python_check} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
