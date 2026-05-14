"use client"

import { useState, useCallback } from 'react'
import LessonView from './lesson-view'
import TutorChat from './tutor-chat'
import { OCR_PHASES } from '@/lib/data/ocr-phases'
import FennecMascot from '@/components/mascot'
import type { Task, Phase } from '@/lib/data/types'

interface Lesson {
  concept: string
  why_it_matters: string
  code_example: string
  code_language: string
  quiz: {
    question: string
    options: string[]
    correct_index: number
    explanation: string
  }
  pro_tip: string
  next_step: string
}

interface TaskOption {
  task: Task
  phase: Phase
  weekTitle: string
}

interface Props {
  nextTaskId: string | null
}

const BLOC_LABELS: Record<string, string> = {
  ocr1: "🧱 Fondations",
  ocr2: "⚙️ Infrastructure",
  ocr3: "☁️ Cloud & Big Data",
  ocr4: "🤖 IA & Expert",
}

function getAllTaskOptions(): TaskOption[] {
  const options: TaskOption[] = []
  for (const phase of OCR_PHASES) {
    for (const week of phase.weeks) {
      for (const task of week.tasks) {
        options.push({ task, phase, weekTitle: week.title })
      }
    }
  }
  return options
}

export default function LearnPageClient({ nextTaskId }: Props) {
  const allOptions = getAllTaskOptions()
  const defaultTask = nextTaskId
    ? allOptions.find(o => o.task.id === nextTaskId) || allOptions[0]
    : allOptions[0]

  const [selected, setSelected] = useState<TaskOption>(defaultTask)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadLesson = useCallback(async (opt: TaskOption) => {
    setSelected(opt)
    setLesson(null)
    setError(null)
    setLoading(true)
    setSidebarOpen(false)
    try {
      const res = await fetch('/api/tutor/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: opt.task.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setLesson(data.lesson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  const filtered = search.trim()
    ? allOptions.filter(o =>
        o.task.label.toLowerCase().includes(search.toLowerCase()) ||
        o.phase.title.toLowerCase().includes(search.toLowerCase())
      )
    : allOptions

  const groupedFiltered: Record<string, TaskOption[]> = {}
  for (const opt of filtered) {
    const key = opt.phase.id
    if (!groupedFiltered[key]) groupedFiltered[key] = []
    groupedFiltered[key].push(opt)
  }

  const SidebarContent = () => (
    <div style={{
      background: 'var(--surface)', border: '2px solid var(--line)',
      borderRadius: 'var(--r-lg)', boxShadow: '0 3px 0 var(--line-2)',
      padding: '14px 12px', height: '100%',
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
        Choisir une leçon
      </div>
      <input
        style={{
          width: '100%', background: 'var(--bg)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-sm)', padding: '7px 10px', fontSize: 12,
          color: 'var(--ink)', outline: 'none', marginBottom: 10,
          boxSizing: 'border-box', fontFamily: 'var(--f-sans)', fontWeight: 600,
        }}
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div style={{ maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.entries(groupedFiltered).map(([phaseId, opts]) => {
          const phase = OCR_PHASES.find(p => p.id === phaseId)!
          return (
            <div key={phaseId}>
              <div style={{
                fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.06em', padding: '8px 4px 4px',
                borderTop: '2px solid var(--line)', marginTop: 4,
                color: phase.color,
              }}>
                {BLOC_LABELS[phaseId] ?? phase.title.slice(0, 22)}
              </div>
              {opts.map(opt => {
                const active = selected?.task.id === opt.task.id
                return (
                  <button
                    key={opt.task.id}
                    onClick={() => setSelected(opt)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '8px 10px',
                      background: active ? `color-mix(in oklab, ${opt.phase.color} 12%, var(--surface))` : 'transparent',
                      border: `2px solid ${active ? opt.phase.color : 'transparent'}`,
                      borderRadius: 'var(--r-sm)', cursor: 'pointer',
                      fontSize: 11, lineHeight: 1.4, fontFamily: 'var(--f-sans)',
                      color: active ? 'var(--ink)' : 'var(--ink-2)',
                      fontWeight: active ? 800 : 600,
                      transition: 'all 0.1s',
                    }}
                  >
                    <div style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: opt.phase.color, marginBottom: 2 }}>
                      {opt.task.day}
                    </div>
                    <div>{opt.task.label}</div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: 8 }}>

      {/* ── Hero header ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
        marginBottom: 20, padding: '20px 24px',
        background: 'linear-gradient(135deg, color-mix(in oklab, #E94B7C 10%, var(--bg-soft)), var(--surface))',
        border: '2px solid var(--line)', borderRadius: 'var(--r-xl)',
        boxShadow: '0 3px 0 var(--line-2)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            ✨ Tutor IA · Data Engineer
          </div>
          <h1 style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.1 }}>
            Apprends avec l&apos;IA
          </h1>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', margin: 0, lineHeight: 1.4 }}>
            Leçons personnalisées sur les 13 projets OpenClassrooms · propulsé par Claude
          </p>
        </div>
        <FennecMascot size={64} />
      </div>

      {/* ── Mobile: leçon sélectionnée + bouton toggle sidebar ── */}
      <div style={{ display: 'none' }} className="mobile-lesson-bar">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', marginBottom: 12,
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', boxShadow: '0 2px 0 var(--line-2)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: selected.phase.color, marginBottom: 2 }}>
              {selected.task.day}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selected.task.label}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              padding: '8px 14px', flexShrink: 0,
              background: sidebarOpen ? 'var(--primary)' : 'var(--surface-2)',
              border: `2px solid ${sidebarOpen ? 'var(--primary-dark)' : 'var(--line)'}`,
              borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontSize: 11, fontWeight: 800,
              color: sidebarOpen ? 'white' : 'var(--ink-3)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            {sidebarOpen ? '✕ Fermer' : '📚 Changer'}
          </button>
        </div>
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <div style={{ marginBottom: 16 }} className="mobile-sidebar-drawer">
          <SidebarContent />
        </div>
      )}

      {/* ── Desktop layout: sidebar + main ── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Sidebar — desktop only */}
        <div style={{ width: 220, flexShrink: 0 }} className="desktop-sidebar">
          <SidebarContent />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Selected project info card */}
          {!lesson && !loading && (
            <div style={{
              background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-xl)', boxShadow: '0 3px 0 var(--line-2)',
              overflow: 'hidden',
            }}>
              {/* Colored top banner */}
              <div style={{
                padding: '20px 24px',
                background: selected.phase.color,
                color: 'white',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 6 }}>
                  {selected.task.day} · {BLOC_LABELS[selected.phase.id]}
                </div>
                <h3 style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 900, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {selected.task.label}
                </h3>
              </div>

              <div style={{ padding: '24px 24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>📚</div>
                {selected.task.description && (
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 20, lineHeight: 1.6, maxWidth: '50ch', margin: '0 auto 20px' }}>
                    {selected.task.description}
                  </p>
                )}
                {error && (
                  <p style={{ fontSize: 13, color: 'var(--c-04)', marginBottom: 14, fontWeight: 700 }}>{error}</p>
                )}
                <button
                  className="btn-3d btn-lg"
                  onClick={() => loadLesson(selected)}
                  style={{
                    '--btn-c': selected.phase.color,
                    '--btn-d': `color-mix(in oklab, ${selected.phase.color} 70%, black)`,
                  } as React.CSSProperties}
                >
                  Générer la leçon ✨
                </button>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', marginTop: 12 }}>
                  Propulsé par Claude · 13 projets OpenClassrooms Data Engineer
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div style={{
              background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-xl)', boxShadow: '0 3px 0 var(--line-2)',
              padding: '56px 28px', textAlign: 'center',
            }}>
              <div style={{ margin: '0 auto 20px', animation: 'float 2s ease-in-out infinite', display: 'inline-block' }}>
                <FennecMascot size={72} />
              </div>
              <p style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 700, color: 'var(--ink-3)' }}>
                Génération de ta leçon personnalisée...
              </p>
            </div>
          )}

          {lesson && !loading && (
            <LessonView
              lesson={lesson}
              taskId={selected.task.id}
              taskLabel={selected.task.label}
              onComplete={() => setLesson(null)}
            />
          )}
        </div>
      </div>

      <TutorChat currentTaskId={selected?.task.id ?? ''} />

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-sidebar { display: none !important; }
          .mobile-lesson-bar { display: flex !important; }
          .mobile-sidebar-drawer { display: block !important; }
        }
        @media (min-width: 641px) {
          .mobile-lesson-bar { display: none !important; }
          .mobile-sidebar-drawer { display: none !important; }
        }
      `}</style>
    </div>
  )
}
