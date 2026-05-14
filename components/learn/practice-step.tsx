"use client"

import { useState, useRef, useCallback } from 'react'

interface Practice {
  title: string
  instructions: string
  starter_code: string
  language: string
  expected_output: string
  output_type: 'table' | 'terminal' | 'value'
  hint: string
  solution: string
}

interface Props {
  practice: Practice
  taskLabel: string
  onNext: () => void
  onBack: () => void
}

type RunState = 'idle' | 'running' | 'success' | 'error'

// ── Simulated output renderer ─────────────────────────────────────────────────

function TableOutput({ data }: { data: unknown[] }) {
  if (!data.length) return <span style={{ color: 'var(--ink-mute)', fontSize: 12 }}>Aucun résultat</span>
  const cols = Object.keys(data[0] as object)
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12, fontFamily: 'var(--f-mono)' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{
                padding: '7px 12px', textAlign: 'left', fontWeight: 800,
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)',
                borderBottom: '2px solid rgba(255,255,255,0.15)',
                whiteSpace: 'nowrap', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data as Record<string, unknown>[]).map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
              {cols.map(c => (
                <td key={c} style={{
                  padding: '6px 12px', color: 'rgba(255,255,255,0.75)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}>
                  {String(row[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TerminalOutput({ text }: { text: string }) {
  return (
    <pre style={{ margin: 0, color: '#4ade80', fontSize: 12, fontFamily: 'var(--f-mono)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {text}
    </pre>
  )
}

function ValueOutput({ value }: { value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--f-mono)' }}>{'>>> '}</span>
      <span style={{ fontSize: 22, fontWeight: 900, color: '#4ade80', fontFamily: 'var(--f-mono)' }}>{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PracticeStep({ practice, taskLabel, onNext, onBack }: Props) {
  const [code, setCode] = useState(practice.starter_code)
  const [runState, setRunState] = useState<RunState>('idle')
  const [outputData, setOutputData] = useState<unknown>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Simulate "run": parse expected_output to display it as if it ran
  const handleRun = useCallback(() => {
    setRunState('running')
    setFeedback('')
    setSubmitted(false)

    setTimeout(() => {
      try {
        if (practice.output_type === 'table') {
          const parsed = JSON.parse(practice.expected_output)
          setOutputData(parsed)
          setRunState('success')
        } else {
          setOutputData(practice.expected_output)
          setRunState('success')
        }
      } catch {
        setOutputData(practice.expected_output)
        setRunState('success')
      }
    }, 600)
  }, [practice])

  const handleSubmit = useCallback(async () => {
    setFeedbackLoading(true)
    setSubmitted(true)
    setFeedback('')

    try {
      const res = await fetch('/api/tutor/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userCode: code,
          solution: practice.solution,
          instructions: practice.instructions,
          language: practice.language,
          taskLabel,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { text } = JSON.parse(payload)
            setFeedback(prev => prev + text)
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      setFeedback('Erreur lors de la génération du feedback.')
      console.error(err)
    } finally {
      setFeedbackLoading(false)
    }
  }, [code, practice, taskLabel])

  // Handle Tab key in textarea
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current!
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newCode = code.slice(0, start) + '    ' + code.slice(end)
      setCode(newCode)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
  }, [code])

  const langColor: Record<string, string> = {
    python: '#4FACFE', sql: '#F4A437', yaml: '#9B7EE5', bash: '#4ade80',
  }
  const lc = langColor[practice.language] ?? '#4FACFE'

  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1830, #12101f)',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        marginBottom: 14,
        boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
      }}>

        {/* Title bar */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '2px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {['#f87171', '#fbbf24', '#4ade80'].map(c => (
              <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
              {practice.title}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--f-mono)' }}>
              exercise.{practice.language === 'sql' ? 'sql' : practice.language === 'yaml' ? 'yml' : 'py'}
            </div>
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: 99,
            background: `color-mix(in oklab, ${lc} 15%, transparent)`,
            border: `1.5px solid color-mix(in oklab, ${lc} 40%, transparent)`,
            fontSize: 10, fontWeight: 800, color: lc,
          }}>
            {practice.language}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ padding: '14px 20px 12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            🎯 Objectif
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            {practice.instructions}
          </p>
        </div>

        {/* Editor */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{
              display: 'block', width: '100%',
              background: '#0d0c1a',
              color: 'rgba(255,255,255,0.88)',
              fontFamily: 'var(--f-mono)', fontSize: 13, lineHeight: 1.7,
              padding: '16px 20px',
              border: 'none', outline: 'none', resize: 'none',
              minHeight: 220,
              boxSizing: 'border-box',
              caretColor: lc,
            }}
            rows={Math.max(10, code.split('\n').length + 1)}
          />
          {/* Line numbers hint */}
          <div style={{
            position: 'absolute', top: 16, left: 0,
            width: 36, textAlign: 'right', paddingRight: 8,
            pointerEvents: 'none',
          }}>
            {code.split('\n').map((_, i) => (
              <div key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.15)', userSelect: 'none' }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          padding: '10px 16px',
          borderTop: '2px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          {/* Run button */}
          <button
            onClick={handleRun}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px',
              background: runState === 'running' ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.15)',
              border: '1.5px solid rgba(74,222,128,0.4)',
              borderRadius: 'var(--r-md)', cursor: runState === 'running' ? 'default' : 'pointer',
              fontSize: 12, fontWeight: 800, color: '#4ade80',
              fontFamily: 'var(--f-sans)',
              transition: 'all 0.12s',
            }}
          >
            {runState === 'running' ? (
              <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: 14 }}>⟳</span>
            ) : '▶'}
            {runState === 'running' ? 'Exécution...' : 'Exécuter'}
          </button>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={feedbackLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px',
              background: submitted ? 'rgba(79,172,254,0.1)' : 'rgba(79,172,254,0.15)',
              border: `1.5px solid rgba(79,172,254,${feedbackLoading ? 0.2 : 0.4})`,
              borderRadius: 'var(--r-md)', cursor: feedbackLoading ? 'default' : 'pointer',
              fontSize: 12, fontWeight: 800, color: '#4FACFE',
              fontFamily: 'var(--f-sans)', opacity: feedbackLoading ? 0.6 : 1,
              transition: 'all 0.12s',
            }}
          >
            {feedbackLoading ? '⟳ Analyse...' : '✦ Soumettre pour feedback IA'}
          </button>

          {/* Hint */}
          <button
            onClick={() => setShowHint(h => !h)}
            style={{
              padding: '8px 12px',
              background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            💡 Indice
          </button>

          {/* Solution */}
          <button
            onClick={() => setShowSolution(s => !s)}
            style={{
              padding: '8px 12px',
              background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            {showSolution ? '🙈 Cacher' : '👁 Solution'}
          </button>
        </div>

        {/* Hint box */}
        {showHint && (
          <div style={{
            margin: '0 16px 12px', padding: '10px 14px',
            background: 'rgba(251,191,36,0.08)', border: '1.5px solid rgba(251,191,36,0.25)',
            borderRadius: 'var(--r-md)',
            fontSize: 12, fontWeight: 600, color: 'rgba(251,191,36,0.9)',
            lineHeight: 1.6,
          }}>
            💡 {practice.hint}
          </div>
        )}

        {/* Solution box */}
        {showSolution && (
          <div style={{ margin: '0 0 0', borderTop: '2px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Solution
            </div>
            <pre style={{
              margin: 0, padding: '8px 20px 16px',
              fontFamily: 'var(--f-mono)', fontSize: 12.5, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              background: 'rgba(255,255,255,0.02)',
            }}>
              {practice.solution}
            </pre>
          </div>
        )}
      </div>

      {/* ── Output panel ── */}
      {runState !== 'idle' && (
        <div style={{
          background: '#0d0c1a',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          marginBottom: 14,
        }}>
          <div style={{
            padding: '8px 16px',
            borderBottom: '2px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: runState === 'running' ? '#fbbf24' : '#4ade80',
              animation: runState === 'running' ? 'pulse-dot 1s ease infinite' : 'none',
            }} />
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
              OUTPUT
              {practice.output_type === 'table' && Array.isArray(outputData) && ` · ${outputData.length} lignes`}
            </span>
          </div>

          <div style={{ padding: '14px 16px', minHeight: 60 }}>
            {runState === 'running' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
                    animation: `typing-dot 1.2s ease-in-out ${j * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            {runState === 'success' && outputData !== null && (
              practice.output_type === 'table' && Array.isArray(outputData)
                ? <TableOutput data={outputData as unknown[]} />
                : practice.output_type === 'terminal'
                  ? <TerminalOutput text={String(outputData)} />
                  : <ValueOutput value={String(outputData)} />
            )}
          </div>
        </div>
      )}

      {/* ── AI Feedback ── */}
      {(feedbackLoading || feedback) && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '16px 18px', marginBottom: 14,
          boxShadow: '0 3px 0 var(--line-2)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>✦</span> Feedback IA
            {feedbackLoading && <span style={{ fontSize: 9, color: 'var(--ink-mute)', fontWeight: 700 }}>· en cours...</span>}
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {feedback}
            {feedbackLoading && <span style={{ display: 'inline-block', width: 8, height: 14, background: 'var(--primary)', marginLeft: 2, animation: 'pulse-dot 0.8s ease infinite', borderRadius: 2, verticalAlign: 'middle' }} />}
          </p>
        </div>
      )}

      {/* ── Nav buttons ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px', background: 'var(--surface)', border: '2px solid var(--line)',
            borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 800,
            color: 'var(--ink-2)', fontFamily: 'var(--f-sans)', boxShadow: '0 3px 0 var(--line-2)',
          }}
        >
          ← Code
        </button>
        <button className="btn-3d" onClick={onNext}>
          Quiz →
        </button>
      </div>
    </div>
  )
}
