'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

// ── Types & constants ────────────────────────────────────────────────────────
const HERO_PHASES = [
  { id: 'P1', label: 'Fondations',  c: '#FF6B47', d: '#E54A28' },
  { id: 'P2', label: 'Engineering', c: '#F4A437', d: '#D88A1A' },
  { id: 'P3', label: 'Cloud',       c: '#9B7EE5', d: '#7858CA' },
  { id: 'P4', label: 'ML',          c: '#E94B7C', d: '#C7305E' },
  { id: 'P5', label: 'Senior',      c: '#2DBFB3', d: '#1A9E94' },
]

const W = 980, H = 360
const DURATION = 8.0

// ── Easing ───────────────────────────────────────────────────────────────────
const outCubic   = (t: number) => 1 - Math.pow(1 - t, 3)
const inOutCubic = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
const outBack    = (t: number) => { const c1=1.70158, c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2) }
const outExpo    = (t: number) => t===1 ? 1 : 1-Math.pow(2,-10*t)

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const lerp    = (a: number, b: number, t: number) => a+(b-a)*t

function seg(t: number, s: number, e: number, ease = outCubic) {
  if (t <= s) return 0
  if (t >= e) return 1
  return ease((t-s)/(e-s))
}

// ── Path ─────────────────────────────────────────────────────────────────────
function pathAt(progress: number) {
  const x = lerp(100, W-100, progress)
  const y = H/2 + 40 + Math.sin(progress * Math.PI * 1.7) * 36
  return { x, y }
}

function buildSVGPath() {
  const N = 40
  let d = ''
  for (let i = 0; i <= N; i++) {
    const { x, y } = pathAt(i/N)
    d += (i===0?'M':'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '
  }
  return d
}

// ── useClock ─────────────────────────────────────────────────────────────────
function useClock(duration: number, replayKey: number) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const lastRef = useRef<number | null>(null)
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    setT(0)
    setPlaying(true)
    lastRef.current = null
  }, [replayKey])

  useEffect(() => {
    if (!playing) { lastRef.current = null; return }
    const step = (ts: number) => {
      if (lastRef.current == null) lastRef.current = ts
      const dt = (ts - lastRef.current) / 1000
      lastRef.current = ts
      setT(cur => {
        const next = cur + dt
        if (next >= duration) { setPlaying(false); return duration }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, duration])

  return { t, playing }
}

// ── HeroPath ─────────────────────────────────────────────────────────────────
function HeroPath({ t }: { t: number }) {
  const d = buildSVGPath()
  const reveal = seg(t, 1.0, 2.4, outCubic)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
         style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="heroPathGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#FF6B47" />
          <stop offset="30%"  stopColor="#F4A437" />
          <stop offset="55%"  stopColor="#9B7EE5" />
          <stop offset="80%"  stopColor="#E94B7C" />
          <stop offset="100%" stopColor="#2DBFB3" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="#EBDFC8" strokeWidth="6" strokeDasharray="2 10" strokeLinecap="round" />
      <path d={d} fill="none" stroke="url(#heroPathGrad)" strokeWidth="6"
            strokeLinecap="round" pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={1 - reveal}
            style={{ filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.06))' }} />
    </svg>
  )
}

// ── HeroNode ─────────────────────────────────────────────────────────────────
function HeroNode({ idx, phase, t }: { idx: number; phase: typeof HERO_PHASES[0]; t: number }) {
  const p = idx / (HERO_PHASES.length - 1)
  const { x, y } = pathAt(p)

  const appearStart = 1.2 + idx * 0.15
  const appear = seg(t, appearStart, appearStart + 0.6, outBack)

  const hopWindow = 2.6 + idx * 0.45
  const lit = seg(t, hopWindow, hopWindow + 0.35)

  const lightT = Math.max(0, t - hopWindow)
  const pulse = lit > 0.5 ? 1 + Math.sin(lightT*8)*0.04*(1 - Math.min(1, lightT/1.5)) : 1

  const size = 56
  const scale = appear * pulse

  return (
    <div style={{
      position: 'absolute', left: x - size/2, top: y - size/2,
      width: size, height: size,
      transform: `scale(${scale})`, transformOrigin: 'center',
      opacity: appear,
    }}>
      <div style={{
        position: 'absolute', inset: -18, borderRadius: '50%',
        background: `radial-gradient(closest-side, ${phase.c}66, transparent 70%)`,
        opacity: lit * 0.9, transition: 'opacity 0.2s',
      }} />
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: lit > 0.3 ? phase.c : '#EBDFC8',
        border: `4px solid ${lit > 0.3 ? phase.d : '#D9C8A6'}`,
        boxShadow: lit > 0.3 ? `0 6px 0 ${phase.d}` : '0 6px 0 #D9C8A6',
        display: 'grid', placeItems: 'center',
        color: 'white', fontFamily: 'Nunito, sans-serif',
        fontWeight: 900, fontSize: 16, letterSpacing: '0.04em',
      }}>
        {lit > 0.5 ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="3.5">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : phase.id}
      </div>
      <div style={{
        position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
        transform: `translateX(-50%) translateY(${(1-appear)*6}px)`,
        opacity: appear * (lit > 0.2 ? 1 : 0.55),
        fontFamily: 'Nunito, sans-serif',
        fontSize: 11, fontWeight: 800,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: lit > 0.5 ? phase.d : '#7A7194',
        whiteSpace: 'nowrap',
      }}>
        {phase.label}
      </div>
    </div>
  )
}

// ── HeroFennec ────────────────────────────────────────────────────────────────
function HeroFennec({ t }: { t: number }) {
  const N = HERO_PHASES.length
  const entry = seg(t, 0.5, 1.6, outCubic)
  const hopStart = 2.3, hopEnd = 5.0
  const hopP = clamp01((t - hopStart) / (hopEnd - hopStart))
  const segF = hopP * (N - 1)
  const seg_i = Math.min(Math.floor(segF), N - 2)
  const seg_local = segF - seg_i

  let progress: number
  if (t < hopStart) {
    progress = 0
  } else if (t >= hopEnd) {
    progress = 1
  } else {
    const localEased = inOutCubic(seg_local)
    progress = (seg_i + localEased) / (N - 1)
  }

  const { x, y } = pathAt(progress)
  const hopH = t >= hopStart && t < hopEnd ? Math.sin(seg_local * Math.PI) * 28 : 0
  const entryX = lerp(-80, x, entry)
  const entryY = y - hopH
  const tilt = t >= hopStart && t < hopEnd ? Math.sin(seg_local * Math.PI) * 12 : 0

  return (
    <div style={{
      position: 'absolute',
      left: entryX - 36, top: entryY - 60,
      width: 72, height: 72,
      transform: `rotate(${tilt}deg)`,
      transformOrigin: '50% 80%',
      opacity: entry,
      filter: 'drop-shadow(0 6px 8px rgba(45,40,67,0.18))',
    }}>
      <svg viewBox="0 0 100 100" width="72" height="72" aria-hidden="true">
        <path d="M22 38 L18 8 L42 28 Z" fill="#FF8F66" stroke="#E54A28" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M26 32 L24 16 L36 26 Z" fill="#FFD8C9"/>
        <path d="M78 38 L82 8 L58 28 Z" fill="#FF8F66" stroke="#E54A28" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M74 32 L76 16 L64 26 Z" fill="#FFD8C9"/>
        <ellipse cx="50" cy="58" rx="30" ry="28" fill="#FF8F66" stroke="#E54A28" strokeWidth="2"/>
        <ellipse cx="50" cy="68" rx="20" ry="14" fill="#FFEFE6"/>
        <path d="M30 50 Q36 44 42 50 Q38 56 30 54 Z" fill="rgba(229,74,40,0.18)"/>
        <path d="M70 50 Q64 44 58 50 Q62 56 70 54 Z" fill="rgba(229,74,40,0.18)"/>
        <ellipse cx="38" cy="54" rx="4.5" ry={hopH > 14 ? 2.4 : 6} fill="#2D2843"/>
        <ellipse cx="62" cy="54" rx="4.5" ry={hopH > 14 ? 2.4 : 6} fill="#2D2843"/>
        {hopH <= 14 && <>
          <circle cx="39" cy="52" r="1.6" fill="white"/>
          <circle cx="63" cy="52" r="1.6" fill="white"/>
        </>}
        <ellipse cx="50" cy="64" rx="3" ry="2.4" fill="#2D2843"/>
        <path d={hopH > 14 ? 'M44 72 Q50 78 56 72' : 'M50 66 L50 70 M45 73 Q50 76 55 73'}
              stroke="#2D2843" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  )
}

// ── HeroSparkles ──────────────────────────────────────────────────────────────
function HeroSparkles({ t }: { t: number }) {
  const N = HERO_PHASES.length
  const bursts: { key: number; sx: number; sy: number; op: number; size: number }[] = []
  for (let i = 1; i < N; i++) {
    const arrive = 2.3 + (i / (N-1)) * (5.0 - 2.3)
    const p = i / (N-1)
    const { x, y } = pathAt(p)
    const since = t - arrive
    if (since > 0 && since < 1.4) {
      for (let k = 0; k < 6; k++) {
        const angle = (k/6)*Math.PI*2 + i*0.7
        const dist = 12 + since*38
        bursts.push({
          key: i*100+k,
          sx: x + Math.cos(angle)*dist,
          sy: y + Math.sin(angle)*dist - since*18,
          op: 1 - since/1.4,
          size: 4 + Math.sin(k)*1.5,
        })
      }
    }
  }
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {bursts.map(b => (
        <div key={b.key} style={{
          position: 'absolute', left: b.sx - b.size/2, top: b.sy - b.size/2,
          width: b.size, height: b.size, borderRadius: '50%',
          background: '#FFC857', opacity: b.op*0.9,
          boxShadow: `0 0 ${b.size*2}px #FFC857`,
        }} />
      ))}
    </div>
  )
}

// ── HeroTitle ─────────────────────────────────────────────────────────────────
function HeroTitle({ t }: { t: number }) {
  const eye = seg(t, 0.3, 0.9, outCubic)
  const w1  = seg(t, 0.7, 1.2, outBack)
  const w2  = seg(t, 1.0, 1.5, outBack)
  const w3  = seg(t, 1.3, 1.8, outBack)
  const sub = seg(t, 1.6, 2.3, outCubic)

  const word = (w: number, label: string, color: string) => (
    <span style={{
      display: 'inline-block',
      opacity: w,
      transform: `translateY(${(1-w)*24}px) scale(${0.92+0.08*w})`,
      color, marginRight: 14,
    }}>{label}</span>
  )

  return (
    <div style={{
      position: 'absolute', left: 40, top: 38,
      fontFamily: 'Nunito, sans-serif',
      color: '#2D2843', pointerEvents: 'none',
    }}>
      <div style={{
        opacity: eye,
        transform: `translateX(${(1-eye)*-10}px)`,
        fontSize: 12, fontWeight: 800,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#E54A28', marginBottom: 10,
      }}>◆ Ta roadmap · Édition 2026</div>
      <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, whiteSpace: 'nowrap' }}>
        {word(w1, 'De', '#2D2843')}
        {word(w2, 'zéro', '#FF6B47')}
        <span style={{ display: 'inline-block', opacity: w2, color: '#7A7194', fontWeight: 700, marginRight: 14 }}>à</span>
        {word(w3, 'Senior.', '#2D2843')}
      </div>
      <div style={{
        marginTop: 14, opacity: sub,
        transform: `translateY(${(1-sub)*8}px)`,
        fontSize: 16, fontWeight: 700,
        color: '#4B4368', letterSpacing: '-0.005em',
      }}>
        Data · Dev · ML — 9 mois, 5 phases, 86 missions.
      </div>
    </div>
  )
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ t, start, end, target }: { t: number; start: number; end: number; target: number }) {
  const p = seg(t, start, end, outExpo)
  return <>{Math.round(target * p)}</>
}

// ── HeroStats ─────────────────────────────────────────────────────────────────
function HeroStats({ t }: { t: number }) {
  const card = seg(t, 5.0, 5.7, outBack)
  const cards = [
    { lbl: 'XP',       v: 1290, color: '#4A90E2', colorD: '#2E70BF', icon: '◇', start: 5.2, end: 6.4 },
    { lbl: 'Streak',   v: 12,   color: '#FF8C42', colorD: '#E5701F', icon: '▲', start: 5.5, end: 6.2 },
    { lbl: 'Missions', v: 86,   color: '#FFC857', colorD: '#E0A93A', icon: '★', start: 5.8, end: 6.5 },
  ]
  return (
    <div style={{
      position: 'absolute', right: 36, bottom: 44,
      opacity: card,
      transform: `translateY(${(1-card)*20}px) scale(${0.9+0.1*card})`,
      transformOrigin: '100% 100%',
      display: 'flex', gap: 10,
      pointerEvents: 'none',
    }}>
      {cards.map(s => (
        <div key={s.lbl} style={{
          background: 'white',
          border: `2px solid ${s.color}`,
          borderRadius: 16, padding: '10px 14px 9px',
          boxShadow: `0 3px 0 ${s.colorD}`,
          fontFamily: 'Nunito, sans-serif',
          minWidth: 86, textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.colorD, marginBottom: 4 }}>
            {s.icon} {s.lbl}
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: '#2D2843', lineHeight: 1 }}>
            <Counter t={t} start={s.start} end={s.end} target={s.v} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── HeroAmbient ───────────────────────────────────────────────────────────────
function HeroAmbient({ t }: { t: number }) {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const seedX = (i * 173) % W
    const seedY = (i * 91) % H
    const speed = 0.4 + (i%4)*0.18
    return {
      x: seedX + Math.sin(t*speed + i)*18,
      y: seedY + Math.cos(t*speed*0.8 + i*0.7)*12,
      op: 0.28 + (i%5)*0.05,
      size: 4 + (i%4)*2,
      hue: i,
    }
  })
  const fade = seg(t, 0.0, 1.2)
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: fade }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y,
          width: d.size, height: d.size, borderRadius: '50%',
          background: d.hue%3===0 ? '#FFC857' : d.hue%3===1 ? '#9B7EE5' : '#2DBFB3',
          opacity: d.op, boxShadow: '0 0 8px currentColor',
        }} />
      ))}
    </div>
  )
}

// ── HeroCTA ───────────────────────────────────────────────────────────────────
function HeroCTA({ t }: { t: number }) {
  const show = seg(t, 6.6, 7.3, outBack)
  return (
    <div style={{
      position: 'absolute', left: 40, bottom: 36,
      opacity: show, transform: `translateY(${(1-show)*14}px)`,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '12px 22px',
        background: 'linear-gradient(135deg, #FF6B47, #E94B7C)',
        color: 'white', borderRadius: 99,
        fontFamily: 'Nunito, sans-serif', fontWeight: 900,
        fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
        boxShadow: '0 4px 0 #BF3818, 0 8px 24px rgba(229,74,40,0.3)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: 'white',
          boxShadow: '0 0 0 6px rgba(255,255,255,0.25)',
          animation: 'heroCtaPulse 1.4s ease-in-out infinite',
        }} />
        Commence ta première leçon
        <span style={{ fontSize: 18, marginLeft: 4 }}>→</span>
      </div>
    </div>
  )
}

// ── HeroVideo ─────────────────────────────────────────────────────────────────
export default function HeroVideo() {
  const [replayKey, setReplayKey] = useState(0)
  const { t } = useClock(DURATION, replayKey)

  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setScale(Math.min(1, el.clientWidth / W))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const displayH = H * scale

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%', height: displayH,
        position: 'relative', borderRadius: 22,
        overflow: 'hidden',
        background:
          'radial-gradient(120% 80% at 20% 10%, #FFEFE6 0%, transparent 60%),' +
          'radial-gradient(100% 80% at 90% 95%, #E8DDFE 0%, transparent 55%),' +
          'linear-gradient(135deg, #FFF7EC 0%, #FFEBD5 100%)',
        border: '2px solid #EBDFC8',
        boxShadow: '0 4px 0 #D9C8A6, 0 12px 32px rgba(45,40,67,0.06)',
        marginBottom: 24,
      }}
    >
      {/* Fixed-size canvas, scaled to container */}
      <div style={{
        width: W, height: H,
        position: 'absolute', top: 0, left: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        <HeroAmbient t={t} />
        <HeroPath t={t} />
        {HERO_PHASES.map((ph, i) => (
          <HeroNode key={ph.id} idx={i} phase={ph} t={t} />
        ))}
        <HeroSparkles t={t} />
        <HeroFennec t={t} />
        <HeroTitle t={t} />
        <HeroStats t={t} />
        <HeroCTA t={t} />
      </div>

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(45,40,67,0.05) 1px, transparent 0)',
        backgroundSize: '3px 3px', opacity: 0.6, pointerEvents: 'none',
      }} />

      {/* Replay button */}
      <button
        onClick={() => setReplayKey(k => k+1)}
        title="Rejouer l'intro"
        aria-label="Rejouer l'intro"
        style={{
          position: 'absolute', top: 14, right: 14,
          width: 36, height: 36, borderRadius: 12,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(6px)',
          border: '2px solid #EBDFC8',
          boxShadow: '0 2px 0 #D9C8A6',
          display: 'grid', placeItems: 'center',
          color: '#4B4368', cursor: 'pointer',
          transition: 'transform 0.08s, box-shadow 0.08s',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'translateY(1px)')}
        onMouseUp={e => (e.currentTarget.style.transform = '')}
        onMouseLeave={e => (e.currentTarget.style.transform = '')}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
        </svg>
      </button>

      {/* Progress sliver */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(45,40,67,0.06)' }}>
        <div style={{
          height: '100%', width: `${(t/DURATION)*100}%`,
          background: 'linear-gradient(90deg, #FF6B47, #E94B7C, #9B7EE5, #2DBFB3)',
          transition: 'width 0.05s linear',
        }} />
      </div>

      <style>{`
        @keyframes heroCtaPulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(255,255,255,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(255,255,255,0.05); }
        }
      `}</style>
    </div>
  )
}
