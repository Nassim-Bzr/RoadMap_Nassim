"use client"

import { useState, useCallback } from 'react'
import LessonView from './lesson-view'
import TutorChat from './tutor-chat'
import { ALL_PHASES } from '@/lib/data'
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

function getAllTaskOptions(): TaskOption[] {
  const options: TaskOption[] = []
  for (const phase of ALL_PHASES) {
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

  const loadLesson = useCallback(async (opt: TaskOption) => {
    setSelected(opt)
    setLesson(null)
    setError(null)
    setLoading(true)
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
    const key = opt.phase.title
    if (!groupedFiltered[key]) groupedFiltered[key] = []
    groupedFiltered[key].push(opt)
  }

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Hero header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
        marginBottom: 24, padding: '22px 26px',
        background: 'linear-gradient(135deg, color-mix(in oklab, var(--c-04) 10%, var(--bg-soft)), var(--surface))',
        border: '2px solid var(--line)', borderRadius: 'var(--r-xl)',
        boxShadow: '0 3px 0 var(--line-2)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            ✨ Tutor IA
          </div>
          <h1 style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
            Apprends avec l&apos;IA
          </h1>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', marginTop: 6, maxWidth: '36ch' }}>
            Leçons personnalisées pour ton projet GPS/mobilité · propulsé par Claude
          </p>
        </div>
        <FennecMascot size={72} />
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{
            background: 'var(--surface)', border: '2px solid var(--line)',
            borderRadius: 'var(--r-lg)', boxShadow: '0 3px 0 var(--line-2)',
            padding: '14px 12px',
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
            <div style={{ maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Object.entries(groupedFiltered).map(([phaseTitle, opts]) => (
                <div key={phaseTitle}>
                  <div style={{
                    fontSize: 9, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', padding: '8px 4px 4px',
                    borderTop: '2px solid var(--line)', marginTop: 4,
                  }}>
                    {phaseTitle.slice(0, 22)}
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
                          {opt.phase.icon} {opt.weekTitle.slice(0, 16)}
                        </div>
                        <div>{opt.task.label}</div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!lesson && !loading && (
            <div style={{
              background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-xl)', boxShadow: '0 3px 0 var(--line-2)',
              padding: '36px 28px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>📚</div>
              <h3 style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: 'var(--ink)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                {selected.task.label}
              </h3>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 20 }}>
                {selected.phase.title} · {selected.weekTitle}
              </p>
              {error && (
                <p style={{ fontSize: 13, color: 'var(--c-04)', marginBottom: 14, fontWeight: 700 }}>{error}</p>
              )}
              <button className="btn-3d" onClick={() => loadLesson(selected)}>
                Générer la leçon ✨
              </button>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', marginTop: 12 }}>
                Propulsé par Claude · personnalisé pour ton projet GPS Renault
              </p>
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
    </div>
  )
}
