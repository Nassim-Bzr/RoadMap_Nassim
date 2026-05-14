"use client"
import { useState } from 'react'

export interface LessonData {
  type: 'lesson'
  title: string
  concept: string
  formula: string
  steps: string[]
  data_example: string
  key_insight: string
  python_snippet: string
}

interface Props {
  lesson: LessonData
  onComplete?: () => void
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
    <div style={{ position: 'relative' }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 6,
        }}>
          {label}
        </div>
      )}
      <div style={{
        background: '#161525', borderRadius: 'var(--r-md)',
        padding: '16px 18px', position: 'relative',
        border: '2px solid rgba(255,255,255,0.08)',
      }}>
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
          margin: 0, fontFamily: 'var(--f-mono)',
          fontSize: 13, lineHeight: 1.7, color: '#c9d1d9',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          paddingRight: 60,
        }}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default function LessonDisplay({ lesson, onComplete }: Props) {
  const [done, setDone] = useState(false)

  const handleDone = () => {
    setDone(true)
    onComplete?.()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--f-sans)' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>📖</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>{lesson.title}</h2>
      </div>

      {/* Concept */}
      <div style={{
        background: 'color-mix(in oklab, #9B7EE5 8%, var(--surface))',
        border: '2px solid color-mix(in oklab, #9B7EE5 25%, var(--line))',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9B7EE5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          📚 Concept
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: 'var(--ink-2)', fontWeight: 600 }}>
          {lesson.concept}
        </p>
      </div>

      {/* Formula */}
      <div style={{
        background: '#161525',
        border: '2px solid rgba(155, 126, 229, 0.3)',
        borderRadius: 'var(--r-lg)', padding: '24px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(155,126,229,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          ∑ Formule clé
        </div>
        <div style={{
          fontFamily: 'var(--f-mono)', fontSize: 18, fontWeight: 700,
          color: '#e2c3ff', letterSpacing: '0.02em', lineHeight: 1.6,
          wordBreak: 'break-word',
        }}>
          {lesson.formula}
        </div>
      </div>

      {/* Steps */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          🪜 Étapes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900, boxShadow: '0 3px 0 var(--primary-dark)',
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.6, paddingTop: 4 }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data example */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          🤖 Exemple data/ML
        </div>
        <div style={{
          background: 'color-mix(in oklab, #2DBFB3 6%, var(--surface))',
          border: '2px solid color-mix(in oklab, #2DBFB3 20%, var(--line))',
          borderRadius: 'var(--r-lg)', padding: '16px 18px',
          fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {lesson.data_example}
        </div>
      </div>

      {/* Key Insight */}
      <div style={{
        background: 'color-mix(in oklab, #F4A437 10%, var(--surface))',
        border: '2px solid color-mix(in oklab, #F4A437 35%, var(--line))',
        borderRadius: 'var(--r-lg)', padding: '16px 20px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#b97800', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Insight clé
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.65 }}>
            {lesson.key_insight}
          </p>
        </div>
      </div>

      {/* Python snippet */}
      <CodeBlock code={lesson.python_snippet} label="🐍 Code Python" />

      {/* Complete button */}
      <button
        onClick={handleDone}
        disabled={done}
        style={{
          padding: '14px 24px', borderRadius: 'var(--r-lg)',
          background: done ? '#2DBFB3' : 'var(--primary)',
          color: '#fff', fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 15,
          border: 'none', cursor: done ? 'default' : 'pointer',
          boxShadow: done ? '0 3px 0 #1a9e95' : '0 4px 0 var(--primary-dark)',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {done ? '✅ Leçon complétée ! +20 XP' : '✓ Leçon terminée (+20 XP)'}
      </button>
    </div>
  )
}
