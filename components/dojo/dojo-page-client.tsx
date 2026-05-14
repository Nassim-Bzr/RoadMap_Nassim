'use client'
import { useState, useCallback, useRef } from 'react'
import { TypingEngine } from './typing-engine'
import { STATIC_SNIPPETS, getRandomSnippet } from '@/lib/dojo/snippets'
import { getPerformanceLabel, calculateScore } from '@/lib/dojo/scoring'
import FennecMascot from '@/components/mascot'
import type { CodeSnippet, DojoMode, Difficulty } from '@/lib/dojo/types'

interface SessionRow {
  id: string
  snippet_id: string
  mode: string
  wpm: number
  accuracy: number
  duration: number
  score: number
  completed: boolean
  created_at: string
}

interface BestRow {
  snippet_id: string
  best_wpm: number
  best_accuracy: number
  best_score: number
  attempts: number
}

interface Props {
  initialSessions: SessionRow[]
  initialBests: BestRow[]
  globalStats: { totalSessions: number; bestWpm: number; avgAccuracy: number }
}

const MODES: { id: DojoMode; label: string; icon: string; desc: string }[] = [
  { id: 'speed',  label: 'Vitesse', icon: '⚡', desc: 'Code visible, tape le plus vite possible' },
  { id: 'memory', label: 'Mémoire', icon: '🧠', desc: 'Code masqué après démarrage' },
  { id: 'gaps',   label: 'Blancs',  icon: '🎯', desc: 'Remplis les ___ manquants' },
]

const CATEGORIES = [
  { id: 'all',             label: 'Tout' },
  { id: 'python-advanced', label: 'Python Avancé' },
  { id: 'python-basics',   label: 'Python Bases' },
  { id: 'polars',          label: 'Polars' },
  { id: 'geopandas',       label: 'GeoPandas' },
  { id: 'sql-window',      label: 'SQL Window' },
  { id: 'sql-cte',         label: 'SQL CTE' },
  { id: 'fastapi',         label: 'FastAPI' },
  { id: 'dbt',             label: 'dbt' },
  { id: 'docker',          label: 'Docker' },
]

const DIFFICULTIES: { id: Difficulty | 'all'; label: string; color: string }[] = [
  { id: 'all',    label: 'Tout',      color: 'var(--ink-3)' },
  { id: 'easy',   label: 'Facile',    color: 'var(--c-05)' },
  { id: 'medium', label: 'Moyen',     color: 'var(--gold)' },
  { id: 'hard',   label: 'Difficile', color: 'var(--primary)' },
  { id: 'expert', label: 'Expert',    color: 'var(--c-04)' },
]

const DIFF_COLOR: Record<string, string> = {
  easy: 'var(--c-05)', medium: 'var(--gold)', hard: 'var(--primary)', expert: 'var(--c-04)',
}

// ── WPM gauge SVG ────────────────────────────────────────────────────────────
function WpmGauge({ wpm, max = 120 }: { wpm: number; max?: number }) {
  const r = 52
  const cx = 72
  const cy = 72
  const strokeW = 10
  const startAngle = -220
  const sweepAngle = 260
  const pct = Math.min(wpm / max, 1)

  function polarToXY(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function describeArc(start: number, end: number) {
    const s = polarToXY(start, r)
    const e = polarToXY(end, r)
    const large = Math.abs(end - start) > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const endAngle = startAngle + sweepAngle * pct
  const color = wpm < 30 ? '#94a3b8' : wpm < 50 ? 'var(--gold)' : wpm < 80 ? 'var(--c-05)' : '#4FACFE'

  return (
    <svg viewBox="0 0 144 100" style={{ width: '100%', maxWidth: 144 }}>
      <defs>
        <filter id="gauge-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <path d={describeArc(startAngle, startAngle + sweepAngle)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} strokeLinecap="round" />
      {/* Progress */}
      {pct > 0 && (
        <path d={describeArc(startAngle, endAngle)} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" filter="url(#gauge-glow)" />
      )}
      {/* Needle dot */}
      {pct > 0 && (() => {
        const np = polarToXY(endAngle, r)
        return <circle cx={np.x} cy={np.y} r={5} fill={color} filter="url(#gauge-glow)" />
      })()}
      {/* WPM value */}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={22} fontWeight={900} fontFamily="var(--f-sans)">{wpm}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9} fontWeight={800} letterSpacing="0.08em" fontFamily="var(--f-sans)">WPM</text>
    </svg>
  )
}

// ── DojoLeft ─────────────────────────────────────────────────────────────────
function DojoLeft({
  mode, setMode, category, setCategory, difficulty, setDifficulty,
  snippet, filteredSnippets, selectSnippet, pickRandom, generateAi, aiLoading,
  bests,
}: {
  mode: DojoMode; setMode: (m: DojoMode) => void
  category: string; setCategory: (c: string) => void
  difficulty: Difficulty | 'all'; setDifficulty: (d: Difficulty | 'all') => void
  snippet: CodeSnippet; filteredSnippets: CodeSnippet[]
  selectSnippet: (s: CodeSnippet) => void
  pickRandom: () => void
  generateAi: () => void
  aiLoading: boolean
  bests: BestRow[]
}) {
  const bestForSnippet = bests.find(b => b.snippet_id === snippet.id)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10, height: '100%',
    }}>
      {/* Mode */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Mode</div>
      {MODES.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          style={{
            padding: '9px 11px', textAlign: 'left', width: '100%',
            background: mode === m.id ? 'rgba(255,107,71,0.18)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${mode === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, cursor: 'pointer', transition: 'all 0.1s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            <span style={{ fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 900, color: mode === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.7)' }}>{m.label}</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginTop: 3, lineHeight: 1.3 }}>{m.desc}</div>
        </button>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

      {/* Category */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Catégorie</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            padding: '3px 7px',
            background: category === c.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${category === c.id ? 'var(--primary-dark)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 99, cursor: 'pointer',
            fontSize: 10, fontWeight: 800, fontFamily: 'var(--f-sans)',
            color: category === c.id ? 'white' : 'rgba(255,255,255,0.5)',
          }}>{c.label}</button>
        ))}
      </div>

      {/* Difficulty */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Difficulté</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {DIFFICULTIES.map(d => (
          <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
            padding: '3px 7px',
            background: difficulty === d.id ? d.color : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${difficulty === d.id ? d.color : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 99, cursor: 'pointer',
            fontSize: 10, fontWeight: 800, fontFamily: 'var(--f-sans)',
            color: difficulty === d.id ? 'white' : 'rgba(255,255,255,0.5)',
          }}>{d.label}</button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

      {/* Snippets */}
      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Extraits</div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredSnippets.map(s => {
          const active = s.id === snippet.id
          const dc = DIFF_COLOR[s.difficulty]
          const best = bests.find(b => b.snippet_id === s.id)
          return (
            <button key={s.id} onClick={() => selectSnippet(s)} style={{
              padding: '7px 9px', width: '100%', textAlign: 'left',
              background: active ? 'rgba(255,107,71,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${active ? dc : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 6, cursor: 'pointer', transition: 'all 0.1s',
            }}>
              <div style={{ fontSize: 11, fontWeight: active ? 900 : 700, color: active ? 'white' : 'rgba(255,255,255,0.6)', marginBottom: 2, lineHeight: 1.2, wordBreak: 'break-word' }}>{s.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: dc }}>{s.difficulty}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>·</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{s.lineCount}L</span>
                {best && <span style={{ fontSize: 9, fontWeight: 800, color: '#FFD447' }}>⭐{best.best_wpm}</span>}
              </div>
            </button>
          )
        })}
        {filteredSnippets.length === 0 && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '12px 0' }}>Aucun extrait</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <button onClick={pickRandom} style={{
          flex: 1, padding: '7px 0',
          background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800,
          color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--f-sans)',
        }}>🎲 Random</button>
        <button onClick={generateAi} disabled={aiLoading} style={{
          flex: 1, padding: '7px 0',
          background: aiLoading ? 'rgba(255,107,71,0.08)' : 'rgba(255,107,71,0.18)',
          border: '1.5px solid var(--primary)',
          borderRadius: 8, cursor: aiLoading ? 'not-allowed' : 'pointer',
          fontSize: 11, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--f-sans)',
          opacity: aiLoading ? 0.6 : 1,
        }}>{aiLoading ? '…' : '✨ IA'}</button>
      </div>
    </div>
  )
}

// ── DojoRight ─────────────────────────────────────────────────────────────────
function DojoRight({
  liveWpm, accuracy, elapsed, sessions, snippet, bests,
}: {
  liveWpm: number; accuracy: number; elapsed: number
  sessions: SessionRow[]; snippet: CodeSnippet; bests: BestRow[]
}) {
  const bestForSnippet = bests.find(b => b.snippet_id === snippet.id)
  const allBestWpm = Math.max(0, ...bests.map(b => b.best_wpm))
  const allBestAcc = sessions.length > 0
    ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* WPM gauge */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '14px 10px 10px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--f-sans)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Vitesse live</div>
        <WpmGauge wpm={liveWpm} max={120} />
      </div>

      {/* Accuracy & time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: 'var(--c-05)', letterSpacing: '-0.02em', lineHeight: 1 }}>{accuracy}%</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>Préc.</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.02em', lineHeight: 1 }}>{elapsed}s</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>Temps</div>
        </div>
      </div>

      {/* Snippet best */}
      {bestForSnippet && (
        <div style={{ background: 'rgba(255,212,71,0.08)', border: '1.5px solid rgba(255,212,71,0.25)', borderRadius: 10, padding: '10px 10px' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,212,71,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Meilleur sur ce snippet</div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 20, fontWeight: 900, color: '#FFD447', letterSpacing: '-0.02em', lineHeight: 1 }}>{bestForSnippet.best_wpm} <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.7 }}>WPM</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{Math.round(bestForSnippet.best_accuracy)}% · {bestForSnippet.attempts} essai{bestForSnippet.attempts > 1 ? 's' : ''}</div>
        </div>
      )}

      {/* Global stats */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 10px' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Global</div>
        {[
          { label: 'Sessions', value: sessions.length, color: 'rgba(255,255,255,0.8)' },
          { label: 'Meilleur WPM', value: allBestWpm, color: '#4FACFE' },
          { label: 'Précision moy.', value: allBestAcc + '%', color: 'var(--c-05)' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
            <span style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 900, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Recent sessions */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Récentes</div>
        {sessions.length === 0 && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '8px 0' }}>Aucune session</div>
        )}
        {sessions.slice(0, 10).map((s, i) => {
          const p = getPerformanceLabel(s.wpm, s.accuracy)
          return (
            <div key={s.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12 }}>{p.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.snippet_id.replace(/-/g, ' ')}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{s.mode}</div>
              </div>
              <span style={{ fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 900, color: '#4FACFE', flexShrink: 0 }}>{s.wpm}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function DojoPageClient({ initialSessions, initialBests, globalStats }: Props) {
  const [mode, setMode] = useState<DojoMode>('speed')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [snippet, setSnippet] = useState<CodeSnippet>(STATIC_SNIPPETS[0])
  const [sessions, setSessions] = useState<SessionRow[]>(initialSessions)
  const [bests, setBests] = useState<BestRow[]>(initialBests)
  const [result, setResult] = useState<{ wpm: number; accuracy: number; duration: number; errors: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [liveWpm, setLiveWpm] = useState(0)
  const [liveAccuracy, setLiveAccuracy] = useState(100)
  const [liveElapsed, setLiveElapsed] = useState(0)

  const filteredSnippets = STATIC_SNIPPETS.filter(s => {
    if (category !== 'all' && s.category !== category) return false
    if (difficulty !== 'all' && s.difficulty !== difficulty) return false
    return true
  })

  const selectSnippet = (s: CodeSnippet) => { setSnippet(s); setResult(null); setLiveWpm(0); setLiveAccuracy(100); setLiveElapsed(0) }

  const pickRandom = () => {
    const pool = filteredSnippets.filter(s => s.id !== snippet.id)
    selectSnippet(pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : getRandomSnippet([snippet.id]))
  }

  const generateAi = useCallback(async () => {
    setAiLoading(true)
    try {
      const res = await fetch('/api/dojo/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: `ai-${Date.now()}`,
          category: category === 'all' ? 'polars' : category,
          difficulty: difficulty === 'all' ? 'medium' : difficulty,
        }),
      })
      const data = await res.json()
      if (data.snippet) {
        selectSnippet({
          id: `ai-${Date.now()}`,
          title: data.snippet.title ?? 'Snippet IA',
          category: (category === 'all' ? 'polars' : category) as CodeSnippet['category'],
          difficulty: (difficulty === 'all' ? 'medium' : difficulty) as Difficulty,
          language: data.snippet.language ?? 'python',
          code: data.snippet.code,
          explanation: data.snippet.explanation ?? '',
          tags: data.snippet.tags ?? [],
          lineCount: data.snippet.code.split('\n').length,
          charCount: data.snippet.code.length,
        })
      }
    } catch { /* ignore */ }
    finally { setAiLoading(false) }
  }, [category, difficulty]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = useCallback(async (wpm: number, accuracy: number, duration: number, errors: number) => {
    setResult({ wpm, accuracy, duration, errors })
    setSaving(true)
    try {
      const res = await fetch('/api/dojo/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippetId: snippet.id, mode, wpm, accuracy, duration, errors, completed: true, difficulty: snippet.difficulty }),
      })
      const data = await res.json()
      if (data.session) {
        setSessions(prev => [data.session, ...prev.slice(0, 49)])
        const sc = calculateScore(wpm, accuracy, snippet.difficulty)
        setBests(prev => {
          const ex = prev.find(b => b.snippet_id === snippet.id)
          if (ex) return prev.map(b => b.snippet_id === snippet.id
            ? { ...b, best_wpm: Math.max(b.best_wpm, wpm), best_accuracy: Math.max(b.best_accuracy, accuracy), best_score: Math.max(b.best_score, sc), attempts: b.attempts + 1 }
            : b)
          return [...prev, { snippet_id: snippet.id, best_wpm: wpm, best_accuracy: accuracy, best_score: sc, attempts: 1 }]
        })
      }
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }, [snippet, mode])

  const perf = result ? getPerformanceLabel(result.wpm, result.accuracy) : null
  const score = result ? calculateScore(result.wpm, result.accuracy, snippet.difficulty) : 0

  return (
    <>
      <style>{`
        .dojo-layout {
          display: grid;
          grid-template-columns: 240px 1fr 200px;
          gap: 16px;
          align-items: start;
          min-height: 600px;
        }
        .dojo-left, .dojo-right { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; scrollbar-width: none; }
        @media (max-width: 960px) {
          .dojo-layout { grid-template-columns: 200px 1fr; }
          .dojo-right-col { display: none; }
        }
        @media (max-width: 640px) {
          .dojo-layout { grid-template-columns: 1fr; }
          .dojo-left-col { display: none; }
          .dojo-mobile-filters { display: flex !important; }
        }
        .dojo-mobile-filters { display: none; }
        .dojo-result-stats { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
      `}</style>

      {/* Dark terminal wrapper */}
      <div style={{
        background: '#0d0d1a',
        border: '2px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
        marginTop: 8,
      }}>
        {/* Terminal top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px',
          background: '#161525', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.9 }} />
            ))}
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>
            ⚔️ Code Dojo — {snippet.title}
          </div>
          <FennecMascot size={22} />
        </div>

        {/* 3-column body */}
        <div className="dojo-layout" style={{ padding: '16px' }}>

          {/* LEFT: browser */}
          <div className="dojo-left-col dojo-left">
            <DojoLeft
              mode={mode} setMode={setMode}
              category={category} setCategory={setCategory}
              difficulty={difficulty} setDifficulty={setDifficulty}
              snippet={snippet} filteredSnippets={filteredSnippets}
              selectSnippet={selectSnippet}
              pickRandom={pickRandom}
              generateAi={generateAi}
              aiLoading={aiLoading}
              bests={bests}
            />
          </div>

          {/* CENTER: typing arena */}
          <div style={{ minWidth: 0 }}>
            {/* Mobile filters strip */}
            <div className="dojo-mobile-filters" style={{
              flexWrap: 'wrap', gap: 6, marginBottom: 12,
              padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10,
            }}>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  padding: '4px 10px',
                  background: mode === m.id ? 'rgba(255,107,71,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${mode === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 99, cursor: 'pointer',
                  fontSize: 11, fontWeight: 800, fontFamily: 'var(--f-sans)',
                  color: mode === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                }}>{m.icon} {m.label}</button>
              ))}
              <button onClick={pickRandom} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 99, cursor: 'pointer', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--f-sans)' }}>🎲</button>
            </div>

            {/* Snippet info */}
            <div style={{
              marginBottom: 12, padding: '10px 14px',
              background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)',
              borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{snippet.title}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{snippet.explanation}</div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap' }}>
                {[
                  { label: snippet.language.toUpperCase(), color: '#4FACFE' },
                  { label: snippet.difficulty, color: DIFF_COLOR[snippet.difficulty] },
                  { label: `${snippet.lineCount}L`, color: 'rgba(255,255,255,0.3)' },
                ].map(tag => (
                  <span key={tag.label} style={{ padding: '2px 7px', background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${tag.color}`, borderRadius: 99, fontSize: 9, fontWeight: 800, color: tag.color, whiteSpace: 'nowrap' }}>{tag.label}</span>
                ))}
              </div>
            </div>

            {/* Typing engine or result */}
            {result === null ? (
              <TypingEngine
                snippet={snippet}
                mode={mode}
                onComplete={handleComplete}
                onLiveUpdate={(wpm, acc, elapsed) => { setLiveWpm(wpm); setLiveAccuracy(acc); setLiveElapsed(elapsed) }}
              />
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,212,71,0.12), rgba(255,255,255,0.04))',
                border: '1.5px solid rgba(255,212,71,0.4)', borderRadius: 16,
                padding: '28px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 6 }}>{perf?.emoji}</div>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 20 }}>
                  {perf?.label}
                </div>
                <div className="dojo-result-stats">
                  {[
                    { label: 'WPM',      value: result.wpm,            color: '#4FACFE' },
                    { label: 'Précision',value: result.accuracy + '%', color: 'var(--c-05)' },
                    { label: 'Temps',    value: result.duration + 's', color: 'rgba(255,255,255,0.8)' },
                    { label: 'Score',    value: score,                 color: '#FFD447' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {saving && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Sauvegarde…</p>}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => { setResult(null); setLiveWpm(0); setLiveAccuracy(100); setLiveElapsed(0) }} style={{
                    padding: '10px 20px', background: 'var(--primary)', border: '2px solid var(--primary-dark)',
                    borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                    color: 'white', fontFamily: 'var(--f-sans)', boxShadow: '0 3px 0 var(--primary-dark)',
                  }}>↺ Recommencer</button>
                  <button onClick={pickRandom} style={{
                    padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)',
                    borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                    color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--f-sans)',
                  }}>Suivant →</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: gauge + stats */}
          <div className="dojo-right-col dojo-right">
            <DojoRight
              liveWpm={liveWpm}
              accuracy={liveAccuracy}
              elapsed={liveElapsed}
              sessions={sessions}
              snippet={snippet}
              bests={bests}
            />
          </div>
        </div>
      </div>
    </>
  )
}
