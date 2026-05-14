"use client"
import { useState } from 'react'

export interface ChallengeData {
  type: 'challenge'
  title: string
  story: string
  problem: string
  data: string
  tasks: string[]
  solution: string
  python_solution: string
}

interface Props {
  challenge: ChallengeData
  onComplete?: () => void
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
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
        color: '#c9d1d9', whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: 64,
      }}>
        {code}
      </pre>
    </div>
  )
}

export default function ChallengeDisplay({ challenge, onComplete }: Props) {
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set())
  const [showSolution, setShowSolution] = useState(false)
  const [showPython, setShowPython] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleToggleTask = (i: number) => {
    setCheckedTasks(prev => {
      const updated = new Set(prev)
      if (updated.has(i)) updated.delete(i)
      else updated.add(i)
      return updated
    })
  }

  const handleComplete = () => {
    setCompleted(true)
    onComplete?.()
  }

  const handleRevealSolution = () => {
    setShowSolution(true)
    if (!completed) handleComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--f-sans)' }}>
      {/* Story card */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in oklab, #E94B7C 8%, var(--surface)), color-mix(in oklab, #9B7EE5 6%, var(--surface)))',
        border: '2px solid color-mix(in oklab, #E94B7C 20%, var(--line))',
        borderRadius: 'var(--r-xl)', padding: '22px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#E94B7C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Défi
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>
              {challenge.title}
            </h2>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.75, fontStyle: 'italic' }}>
          {challenge.story}
        </p>
      </div>

      {/* Problem */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          🎯 Problème à résoudre
        </div>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.65 }}>
          {challenge.problem}
        </p>
      </div>

      {/* Data */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          📊 Données
        </div>
        <div style={{
          background: '#161525', borderRadius: 'var(--r-lg)', padding: '16px 18px',
          border: '2px solid rgba(255,255,255,0.06)',
          fontFamily: 'var(--f-mono)', fontSize: 13, color: '#a5c8ff',
          lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {challenge.data}
        </div>
      </div>

      {/* Tasks checklist */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          📋 Tâches ({checkedTasks.size}/{challenge.tasks.length} complétées)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {challenge.tasks.map((task, i) => (
            <button
              key={i}
              onClick={() => handleToggleTask(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px', borderRadius: 'var(--r-md)',
                background: checkedTasks.has(i)
                  ? 'color-mix(in oklab, #2DBFB3 8%, var(--surface))'
                  : 'var(--bg)',
                border: `2px solid ${checkedTasks.has(i) ? '#2DBFB3' : 'var(--line)'}`,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--f-sans)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: checkedTasks.has(i) ? '#2DBFB3' : 'var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: checkedTasks.has(i) ? '#fff' : 'var(--ink-mute)',
                fontWeight: 900, transition: 'all 0.15s',
              }}>
                {checkedTasks.has(i) ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 14, fontWeight: 600, lineHeight: 1.6,
                color: checkedTasks.has(i) ? 'var(--ink-3)' : 'var(--ink-2)',
                textDecoration: checkedTasks.has(i) ? 'line-through' : 'none',
              }}>
                {task}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* XP status */}
      {completed && (
        <div style={{
          background: 'color-mix(in oklab, #F4A437 10%, var(--surface))',
          border: '2px solid #F4A437',
          borderRadius: 'var(--r-md)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 15, fontWeight: 800, color: '#b97800',
        }}>
          🏆 Défi complété ! +50 XP gagnés
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={handleRevealSolution}
          style={{
            flex: 1, minWidth: 160, padding: '13px 20px', borderRadius: 'var(--r-lg)',
            background: showSolution ? 'var(--line)' : 'var(--primary)',
            color: showSolution ? 'var(--ink-mute)' : '#fff',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
            border: 'none', cursor: showSolution ? 'default' : 'pointer',
            boxShadow: showSolution ? 'none' : '0 4px 0 var(--primary-dark)',
            transition: 'all 0.2s',
          }}
        >
          {showSolution ? '✅ Solution affichée' : '👁️ Voir la solution (+50 XP)'}
        </button>

        <button
          onClick={() => setShowPython(p => !p)}
          style={{
            flex: 1, minWidth: 160, padding: '13px 20px', borderRadius: 'var(--r-lg)',
            background: 'var(--surface)', border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
            color: 'var(--ink-2)', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🐍 {showPython ? 'Masquer' : 'Solution Python'}
        </button>
      </div>

      {/* Solution */}
      {showSolution && (
        <div style={{
          background: 'color-mix(in oklab, #9B7EE5 6%, var(--surface))',
          border: '2px solid color-mix(in oklab, #9B7EE5 25%, var(--line))',
          borderRadius: 'var(--r-lg)', padding: '20px 22px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#9B7EE5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            📖 Solution complète
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {challenge.solution}
          </p>
        </div>
      )}

      {/* Python solution */}
      {showPython && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            🐍 Solution Python complète
          </div>
          <CodeBlock code={challenge.python_solution} />
        </div>
      )}
    </div>
  )
}
