"use client"
import { useState, useCallback, useRef } from 'react'
import { useMathProgress } from '@/hooks/use-math-progress'
import { MATH_TOPICS, MATH_LEVEL_INFO } from '@/lib/data/math-curriculum'
import type { MathLevel, MathTopic } from '@/lib/data/math-curriculum'
import LessonDisplay from '@/components/math/exercises/lesson-display'
import type { LessonData } from '@/components/math/exercises/lesson-display'
import ExerciseDisplay from '@/components/math/exercises/exercise-display'
import type { ExerciseData } from '@/components/math/exercises/exercise-display'
import QuizDisplay from '@/components/math/exercises/quiz-display'
import type { QuizData } from '@/components/math/exercises/quiz-display'
import ChallengeDisplay from '@/components/math/exercises/challenge-display'
import type { ChallengeData } from '@/components/math/exercises/challenge-display'
import MathChat from '@/components/math/math-chat'

type ExerciseType = 'lesson' | 'exercise' | 'quiz' | 'challenge'
type GeneratedContent = LessonData | ExerciseData | QuizData | ChallengeData

const EXERCISE_TYPES: { id: ExerciseType; label: string; icon: string; xp: number }[] = [
  { id: 'lesson',    label: 'Leçon',    icon: '📖', xp: 20 },
  { id: 'exercise',  label: 'Exercice', icon: '🧮', xp: 30 },
  { id: 'quiz',      label: 'Quiz',     icon: '🎯', xp: 15 },
  { id: 'challenge', label: 'Défi',     icon: '⚡', xp: 50 },
]

const LEVEL_FILTER_OPTIONS: (MathLevel | 'all')[] = ['all', 'debutant', 'elementaire', 'intermediaire', 'avance', 'expert']

function getLevelInfo(level: MathLevel) {
  return MATH_LEVEL_INFO.find(l => l.id === level) ?? MATH_LEVEL_INFO[0]
}

function TopicCard({
  topic,
  isActive,
  isMastered,
  sessionsCount,
  onClick,
}: {
  topic: MathTopic
  isActive: boolean
  isMastered: boolean
  sessionsCount: number
  onClick: () => void
}) {
  const levelInfo = getLevelInfo(topic.level)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '16px 18px',
        background: isActive
          ? `color-mix(in oklab, ${levelInfo.color} 8%, var(--surface))`
          : 'var(--surface)',
        border: `2px solid ${isActive ? levelInfo.color : hovered ? levelInfo.color + '88' : 'var(--line)'}`,
        borderLeft: `4px solid ${levelInfo.color}`,
        borderRadius: 'var(--r-lg)',
        cursor: 'pointer', textAlign: 'left',
        transform: hovered && !isActive ? 'translateY(-3px)' : isActive ? 'translateY(-2px)' : 'none',
        boxShadow: isActive
          ? `0 8px 24px ${levelInfo.color}22, 0 4px 0 ${levelInfo.color}44`
          : hovered ? `0 6px 16px ${levelInfo.color}18, 0 2px 0 var(--line-2)` : '0 2px 0 var(--line)',
        transition: 'all 0.2s',
        fontFamily: 'var(--f-sans)',
        position: 'relative',
      }}
    >
      {/* Level badge */}
      <div style={{
        position: 'absolute', top: 10, right: 12,
        padding: '3px 8px', borderRadius: 99,
        background: levelInfo.color + '22',
        border: `1.5px solid ${levelInfo.color}55`,
        fontSize: 10, fontWeight: 800, color: levelInfo.color,
        letterSpacing: '0.04em',
      }}>
        {levelInfo.icon} {levelInfo.label}
      </div>

      {/* Emoji + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 80 }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{topic.emoji}</span>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
          {topic.title}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        {topic.description}
      </div>

      {/* Why useful */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', lineHeight: 1.4 }}>
        <span style={{ color: levelInfo.color }}>🎯 Utile pour : </span>
        {topic.why}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {topic.tags.map(tag => (
          <span key={tag} style={{
            padding: '2px 8px', borderRadius: 99,
            background: `color-mix(in oklab, ${levelInfo.color} 12%, var(--bg))`,
            border: `1.5px solid ${levelInfo.color}33`,
            fontSize: 10, fontWeight: 800, color: levelInfo.color,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {isMastered ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 99,
            background: '#2DBFB322', border: '2px solid #2DBFB388',
            fontSize: 11, fontWeight: 800, color: '#1a9e95',
          }}>
            ✓ Maîtrisé
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mute)' }}>
              {sessionsCount}/3 sessions
            </span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i < sessionsCount ? levelInfo.color : 'var(--line)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

export default function MathPageClient() {
  const { progress, addXP } = useMathProgress()
  const [levelFilter, setLevelFilter] = useState<MathLevel | 'all'>('all')
  const [activeTopic, setActiveTopic] = useState<MathTopic | null>(null)
  const [exerciseType, setExerciseType] = useState<ExerciseType>('lesson')
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionXP, setSessionXP] = useState(0)
  const exerciseAreaRef = useRef<HTMLDivElement>(null)
  const seenProblemsRef = useRef<string[]>([])

  const currentLevelInfo = getLevelInfo(progress.level)
  const nextLevelInfo = MATH_LEVEL_INFO.find(l => l.xpRequired > progress.xp)
  const xpForCurrentLevel = currentLevelInfo.xpRequired
  const xpForNextLevel = nextLevelInfo?.xpRequired ?? xpForCurrentLevel + 500
  const xpProgress = nextLevelInfo
    ? ((progress.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    : 100

  const filteredTopics = MATH_TOPICS.filter(t =>
    levelFilter === 'all' || t.level === levelFilter
  )

  const handleSelectTopic = (topic: MathTopic) => {
    setActiveTopic(topic)
    setContent(null)
    setError(null)
    setSessionXP(0)
    seenProblemsRef.current = []
    setTimeout(() => {
      exerciseAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleGenerate = useCallback(async () => {
    if (!activeTopic) return
    setLoading(true)
    setError(null)
    setContent(null)
    setSessionXP(0)

    try {
      const res = await fetch('/api/math/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: activeTopic.id,
          level: progress.level,
          exerciseType,
          seenProblems: seenProblemsRef.current.slice(-5),
        }),
      })
      if (!res.ok) throw new Error('Génération échouée')
      const data = await res.json() as { result: GeneratedContent }

      // Track problem to avoid repeats
      if ('problem' in data.result && typeof data.result.problem === 'string') {
        seenProblemsRef.current = [...seenProblemsRef.current, data.result.problem.slice(0, 60)]
      }
      if ('title' in data.result && typeof data.result.title === 'string') {
        seenProblemsRef.current = [...seenProblemsRef.current, data.result.title]
      }

      setContent(data.result)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la génération. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }, [activeTopic, progress.level, exerciseType])

  const handleExerciseComplete = useCallback((correct?: boolean) => {
    if (!activeTopic) return
    const typeInfo = EXERCISE_TYPES.find(t => t.id === exerciseType)
    let xp = typeInfo?.xp ?? 20
    if (exerciseType === 'exercise' && correct === false) xp = 0
    if (xp > 0) {
      addXP(xp, activeTopic.id)
      setSessionXP(xp)
    }
  }, [activeTopic, exerciseType, addXP])

  const handleQuizComplete = useCallback((score: number) => {
    if (!activeTopic) return
    const xp = score * 15
    if (xp > 0) {
      addXP(xp, activeTopic.id)
      setSessionXP(xp)
    }
  }, [activeTopic, addXP])

  const activeTopicLevelInfo = activeTopic ? getLevelInfo(activeTopic.level) : null

  return (
    <div style={{ fontFamily: 'var(--f-sans)', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ===== HERO BANNER ===== */}
      <div style={{
        background: `linear-gradient(135deg, ${currentLevelInfo.color}22, ${currentLevelInfo.color}08)`,
        border: `2px solid ${currentLevelInfo.color}33`,
        borderRadius: 'var(--r-xl)', padding: '24px 28px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Level badge */}
            <div style={{
              width: 68, height: 68, borderRadius: 'var(--r-lg)',
              background: currentLevelInfo.color,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 20px ${currentLevelInfo.color}44`, flexShrink: 0,
            }}>
              <span style={{ fontSize: 26 }}>{currentLevelInfo.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#FFF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {currentLevelInfo.label.slice(0, 5)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Niveau Maths
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
                {currentLevelInfo.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                {currentLevelInfo.description}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 48 }}>🧮</div>
        </div>

        {/* XP bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' }}>{progress.xp} XP</span>
            {nextLevelInfo && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-mute)' }}>
                → {nextLevelInfo.label} : {nextLevelInfo.xpRequired} XP
              </span>
            )}
          </div>
          <div style={{ height: 10, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(xpProgress, 100)}%`,
              background: `linear-gradient(90deg, ${currentLevelInfo.color}, ${nextLevelInfo?.color ?? currentLevelInfo.color})`,
              borderRadius: 99, transition: 'width 0.6s ease',
              boxShadow: `0 0 8px ${currentLevelInfo.color}88`,
            }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Sessions', value: progress.sessionsCompleted, icon: '⚡', color: '#9B7EE5' },
            { label: 'Sujets maîtrisés', value: progress.masteredTopics.length, icon: '🏆', color: '#F4A437' },
            { label: 'XP total', value: progress.xp, icon: '💎', color: currentLevelInfo.color },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 100px', minWidth: 90,
              background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-lg)', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ fontSize: 16 }}>{stat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== LEVEL FILTER TABS ===== */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
          Filtrer par niveau
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {LEVEL_FILTER_OPTIONS.map(lvl => {
            const isActive = levelFilter === lvl
            const info = lvl !== 'all' ? getLevelInfo(lvl) : null
            const color = info?.color ?? 'var(--primary)'
            const count = lvl === 'all' ? MATH_TOPICS.length : MATH_TOPICS.filter(t => t.level === lvl).length
            return (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                style={{
                  flexShrink: 0, padding: '8px 14px', borderRadius: 99,
                  background: isActive ? color : 'var(--surface)',
                  border: `2px solid ${isActive ? color : 'var(--line)'}`,
                  boxShadow: isActive ? `0 3px 0 ${color}66` : '0 2px 0 var(--line)',
                  fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 800,
                  color: isActive ? '#fff' : 'var(--ink-3)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {lvl === 'all' ? '🔢 Tous' : `${info?.icon} ${info?.label}`}
                <span style={{
                  fontSize: 10, fontWeight: 900,
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--line)',
                  color: isActive ? '#fff' : 'var(--ink-mute)',
                  borderRadius: 99, padding: '1px 6px',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== TOPIC GRID ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {filteredTopics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isActive={activeTopic?.id === topic.id}
            isMastered={progress.masteredTopics.includes(topic.id)}
            sessionsCount={Math.min(progress.topicsProgress[topic.id] ?? 0, 3)}
            onClick={() => handleSelectTopic(topic)}
          />
        ))}
      </div>

      {/* ===== ACTIVE TOPIC AREA ===== */}
      {activeTopic && (
        <div
          ref={exerciseAreaRef}
          style={{
            background: 'var(--surface)', border: `2px solid ${activeTopicLevelInfo?.color ?? 'var(--line)'}`,
            borderRadius: 'var(--r-xl)', overflow: 'hidden',
          }}
        >
          {/* Topic header */}
          <div style={{
            padding: '18px 20px',
            background: `color-mix(in oklab, ${activeTopicLevelInfo?.color ?? '#FF6B47'} 6%, var(--surface))`,
            borderBottom: '2px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 28 }}>{activeTopic.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>{activeTopic.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, marginTop: 2 }}>{activeTopic.description}</div>
            </div>
            <button
              onClick={() => { setActiveTopic(null); setContent(null) }}
              style={{
                padding: '6px 12px', borderRadius: 'var(--r-md)',
                background: 'var(--bg)', border: '2px solid var(--line)',
                fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700,
                color: 'var(--ink-3)', cursor: 'pointer',
              }}
            >
              ✕ Fermer
            </button>
          </div>

          {/* Exercise type selector + generate */}
          <div style={{
            padding: '16px 20px', borderBottom: '2px solid var(--line)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EXERCISE_TYPES.map(et => {
                const isActive = exerciseType === et.id
                const color = activeTopicLevelInfo?.color ?? 'var(--primary)'
                return (
                  <button
                    key={et.id}
                    onClick={() => { setExerciseType(et.id); setContent(null) }}
                    style={{
                      flex: '1 1 100px', minWidth: 90, padding: '12px 10px',
                      borderRadius: 'var(--r-md)',
                      background: isActive ? color : 'var(--bg)',
                      border: `2px solid ${isActive ? color : 'var(--line)'}`,
                      boxShadow: isActive ? `0 4px 0 ${color}66` : '0 2px 0 var(--line)',
                      fontFamily: 'var(--f-sans)', cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{et.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isActive ? '#fff' : 'var(--ink-2)' }}>{et.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--ink-mute)' }}>+{et.xp} XP</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                padding: '13px 24px', borderRadius: 'var(--r-lg)',
                background: loading ? 'var(--line)' : 'var(--primary)',
                color: loading ? 'var(--ink-mute)' : '#fff',
                fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 0 var(--primary-dark)',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading
                ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>✨</span> Génération en cours…</>
                : <>✨ {content ? 'Régénérer' : 'Générer'} {EXERCISE_TYPES.find(e => e.id === exerciseType)?.label}</>}
            </button>
          </div>

          {/* Content area */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Session XP toast */}
            {sessionXP > 0 && (
              <div style={{
                padding: '12px 16px', borderRadius: 'var(--r-md)',
                background: '#F4A43722', border: '2px solid #F4A43744',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 700, color: '#c47b00',
              }}>
                🎉 +{sessionXP} XP gagnés !
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '48px 0' }}>
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite' }}>✨</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-3)' }}>
                  Le professeur IA prépare votre {EXERCISE_TYPES.find(e => e.id === exerciseType)?.label.toLowerCase()}…
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{
                padding: '16px 20px', borderRadius: 'var(--r-lg)',
                background: '#E94B7C11', border: '2px solid #E94B7C33',
                fontSize: 14, color: '#E94B7C', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && !content && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>
                  {EXERCISE_TYPES.find(e => e.id === exerciseType)?.icon}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>
                  Prêt pour une {EXERCISE_TYPES.find(e => e.id === exerciseType)?.label.toLowerCase()} ?
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 360, lineHeight: 1.65 }}>
                  Cliquez sur "Générer" pour obtenir un contenu personnalisé par IA pour le topic <strong>{activeTopic.title}</strong>.
                </div>
              </div>
            )}

            {/* Content */}
            {!loading && !error && content && (
              <>
                {content.type === 'lesson' && (
                  <LessonDisplay
                    lesson={content}
                    onComplete={() => handleExerciseComplete()}
                  />
                )}
                {content.type === 'exercise' && (
                  <ExerciseDisplay
                    exercise={content}
                    onComplete={(correct) => handleExerciseComplete(correct)}
                  />
                )}
                {content.type === 'quiz' && (
                  <QuizDisplay
                    quiz={content}
                    onComplete={handleQuizComplete}
                  />
                )}
                {content.type === 'challenge' && (
                  <ChallengeDisplay
                    challenge={content}
                    onComplete={() => handleExerciseComplete()}
                  />
                )}
              </>
            )}

            {/* Chatbot — always visible when topic is active */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
                🤖 Assistant IA
              </div>
              <MathChat
                topicId={activeTopic.id}
                topicTitle={activeTopic.title}
                level={progress.level}
                phaseColor={activeTopicLevelInfo?.color ?? '#FF6B47'}
              />
            </div>
          </div>
        </div>
      )}

      {/* No topic selected placeholder */}
      {!activeTopic && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-xl)', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 64 }}>🧮</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)' }}>
            Bienvenue dans votre espace Maths
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 440, lineHeight: 1.75 }}>
            Choisissez un sujet dans la grille ci-dessus pour commencer. Tous les exercices sont générés par IA et adaptés à votre niveau, avec un focus sur les applications Data/ML.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {MATH_LEVEL_INFO.map(lvl => (
              <div key={lvl.id} style={{
                padding: '6px 12px', borderRadius: 99,
                background: lvl.color + '18', border: `2px solid ${lvl.color}33`,
                fontSize: 12, fontWeight: 700, color: lvl.color,
              }}>
                {lvl.icon} {lvl.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
