"use client"
import { useState, useCallback, useRef } from 'react'
import { useEnglishProgress } from '@/hooks/use-english-progress'
import { ENGLISH_LEVELS, ENGLISH_MODES } from '@/lib/data/english-levels'
import type { EnglishMode, CEFRLevel } from '@/lib/data/english-levels'
import VocabularyMode from '@/components/english/modes/vocabulary-mode'
import GrammarMode from '@/components/english/modes/grammar-mode'
import ConversationMode from '@/components/english/modes/conversation-mode'
import WritingMode from '@/components/english/modes/writing-mode'
import ListeningMode from '@/components/english/modes/listening-mode'

type Exercise = Record<string, unknown>

const LEVEL_OPTIONS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Pools de topics variés pour forcer la diversité
const VOCAB_TOPICS: Record<string, string[]> = {
  vocabulary: [
    'cloud infrastructure & DevOps', 'data pipelines & ETL', 'machine learning & AI',
    'databases & SQL', 'Python programming', 'software architecture',
    'agile & project management', 'cybersecurity', 'networking & APIs',
    'business & startup culture', 'communication & presentations',
    'everyday work conversations', 'travel & culture', 'science & technology',
    'environment & sustainability', 'health & wellbeing', 'finance & economics',
  ],
  grammar: [
    'professional emails', 'technical documentation', 'job interviews',
    'meetings & presentations', 'data science context', 'everyday situations',
  ],
  conversation: [
    'tech job interview', 'daily standup meeting', 'code review discussion',
    'explaining a bug to a client', 'networking at a conference', 'salary negotiation',
    'onboarding a new colleague', 'presenting data insights',
  ],
  writing: [
    'technical blog post', 'project proposal', 'bug report', 'weekly status update',
    'cover letter for a data engineer role', 'README documentation',
  ],
  listening: [
    'tech podcast excerpt', 'data engineering article', 'company announcement',
    'tutorial transcript', 'conference talk summary',
  ],
}

function pickRandomTopic(mode: EnglishMode, exclude: string[] = []): string {
  const pool = VOCAB_TOPICS[mode] ?? VOCAB_TOPICS.vocabulary
  const available = pool.filter(t => !exclude.includes(t))
  const source = available.length > 0 ? available : pool
  return source[Math.floor(Math.random() * source.length)]
}

export default function EnglishPageClient() {
  const { progress, addXP, addWords } = useEnglishProgress()
  const [activeMode, setActiveMode] = useState<EnglishMode | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('B1')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionXP, setSessionXP] = useState(0)
  // Track seen words + used topics across regenerations
  const seenWordsRef = useRef<string[]>([])
  const usedTopicsRef = useRef<string[]>([])

  const currentLevelInfo = ENGLISH_LEVELS.find(l => l.id === progress.level) || ENGLISH_LEVELS[0]
  const nextLevelInfo = ENGLISH_LEVELS.find(l => l.xpRequired > progress.xp)
  const xpForCurrentLevel = currentLevelInfo.xpRequired
  const xpForNextLevel = nextLevelInfo?.xpRequired ?? currentLevelInfo.xpRequired + 500
  const xpProgress = nextLevelInfo
    ? ((progress.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    : 100

  const topMode = (Object.entries(progress.modeProgress) as [EnglishMode, number][])
    .sort((a, b) => b[1] - a[1])[0]
  const topModeInfo = ENGLISH_MODES.find(m => m.id === topMode?.[0])

  const generateExercise = useCallback(async () => {
    if (!activeMode) return
    setLoading(true)
    setError(null)
    setExercise(null)
    setSessionXP(0)

    // Pick a fresh topic not used recently
    const topic = pickRandomTopic(activeMode, usedTopicsRef.current)
    usedTopicsRef.current = [...usedTopicsRef.current.slice(-6), topic]

    try {
      const res = await fetch('/api/english/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          level: selectedLevel,
          topic,
          // Send last 24 seen words so Claude avoids them
          seenWords: activeMode === 'vocabulary' ? seenWordsRef.current.slice(-24) : undefined,
        }),
      })
      if (!res.ok) throw new Error('Génération échouée')
      const data = await res.json()

      // Track new words to avoid on next generation
      if (activeMode === 'vocabulary' && Array.isArray(data.exercise?.words)) {
        const newWords = (data.exercise.words as { word: string }[]).map(w => w.word)
        seenWordsRef.current = [...seenWordsRef.current, ...newWords]
      }

      setExercise(data.exercise)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la génération. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }, [activeMode, selectedLevel])

  const handleComplete = useCallback((score: number, xp: number) => {
    if (!activeMode) return
    addXP(xp, activeMode)
    setSessionXP(xp)
    if (activeMode === 'vocabulary' && exercise) {
      const ex = exercise as { words?: unknown[] }
      addWords(ex.words?.length ?? 0)
    }
  }, [activeMode, addXP, addWords, exercise])

  const handleSelectMode = (mode: EnglishMode) => {
    setActiveMode(mode)
    setExercise(null)
    setError(null)
    setSessionXP(0)
    // Reset diversity tracking when switching mode
    seenWordsRef.current = []
    usedTopicsRef.current = []
  }

  const activeModeInfo = ENGLISH_MODES.find(m => m.id === activeMode)

  return (
    <div style={{ fontFamily: 'var(--f-sans)', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* === HERO BANNER === */}
      <div style={{
        background: `linear-gradient(135deg, ${currentLevelInfo.color}22, ${currentLevelInfo.color}08)`,
        border: `2px solid ${currentLevelInfo.color}33`,
        borderRadius: 'var(--r-xl)', padding: '24px 28px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Level badge */}
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-lg)',
              background: currentLevelInfo.color,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 20px ${currentLevelInfo.color}44`,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 24 }}>{currentLevelInfo.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#FFF', letterSpacing: '0.04em' }}>{progress.level}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Niveau anglais
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
                {currentLevelInfo.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                {currentLevelInfo.description}
              </div>
            </div>
          </div>

          {/* Flag */}
          <div style={{ fontSize: 48, lineHeight: 1 }}>🇬🇧</div>
        </div>

        {/* XP bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' }}>
              {progress.xp} XP
            </span>
            {nextLevelInfo && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-mute)' }}>
                → {nextLevelInfo.id} : {nextLevelInfo.xpRequired} XP
              </span>
            )}
          </div>
          <div style={{ height: 10, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(xpProgress, 100)}%`,
              background: `linear-gradient(90deg, ${currentLevelInfo.color}, ${nextLevelInfo?.color || currentLevelInfo.color})`,
              borderRadius: 99, transition: 'width 0.6s ease',
              boxShadow: `0 0 8px ${currentLevelInfo.color}88`,
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Mots appris', value: progress.wordsLearned, icon: '📖', color: '#2DBFB3' },
            { label: 'Sessions', value: progress.sessionsCompleted, icon: '⚡', color: '#9B7EE5' },
            { label: 'Mode préféré', value: topModeInfo?.label ?? '—', icon: topModeInfo?.icon ?? '🎯', color: '#F4A437' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 120px', minWidth: 100,
              background: 'var(--surface)', border: '2px solid var(--line)',
              borderRadius: 'var(--r-lg)', padding: '12px 16px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ fontSize: 18 }}>{stat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* === MODE SELECTOR === */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
          Choisir un mode d'entraînement
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {ENGLISH_MODES.map(mode => {
            const isActive = activeMode === mode.id
            const sessionsCount = progress.modeProgress[mode.id] || 0
            return (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode.id)}
                style={{
                  flexShrink: 0, width: 160,
                  padding: '18px 16px',
                  borderRadius: 'var(--r-xl)',
                  background: isActive
                    ? `linear-gradient(135deg, ${mode.color}, ${mode.color}cc)`
                    : 'var(--surface)',
                  border: isActive ? `2px solid ${mode.color}` : '2px solid var(--line)',
                  boxShadow: isActive
                    ? `0 8px 24px ${mode.color}44, 0 4px 0 ${mode.color}88`
                    : '0 2px 0 var(--line)',
                  cursor: 'pointer', textAlign: 'left',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{mode.icon}</div>
                <div style={{
                  fontSize: 14, fontWeight: 900, lineHeight: 1.2, marginBottom: 4,
                  color: isActive ? '#FFF' : 'var(--ink)',
                }}>
                  {mode.label}
                </div>
                <div style={{
                  fontSize: 11, lineHeight: 1.4,
                  color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--ink-3)',
                }}>
                  {mode.description}
                </div>
                {sessionsCount > 0 && (
                  <div style={{
                    marginTop: 10, fontSize: 11, fontWeight: 700,
                    color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--ink-mute)',
                  }}>
                    {sessionsCount} session{sessionsCount > 1 ? 's' : ''}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* === EXERCISE AREA === */}
      {activeMode && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-xl)', overflow: 'hidden',
        }}>
          {/* Exercise header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '2px solid var(--line)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {/* Row 1: mode title + generate button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{activeModeInfo?.icon}</span>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--ink)' }}>{activeModeInfo?.label}</div>
              </div>
              <button
                onClick={generateExercise}
                disabled={loading}
                style={{
                  padding: '9px 16px', borderRadius: 'var(--r-md)',
                  background: loading ? 'var(--line)' : 'var(--primary)',
                  color: loading ? 'var(--ink-mute)' : '#FFF',
                  fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 13,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 3px 0 var(--primary-dark)',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {loading
                  ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Génération...</>
                  : <>✨ {exercise ? 'Régénérer' : 'Générer'}</>}
              </button>
            </div>
            {/* Row 2: level pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)' }}>Niveau :</span>
              {LEVEL_OPTIONS.map(lvl => {
                const lvlInfo = ENGLISH_LEVELS.find(l => l.id === lvl)!
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                      border: `2px solid ${selectedLevel === lvl ? lvlInfo.color : 'var(--line)'}`,
                      background: selectedLevel === lvl ? lvlInfo.color + '22' : 'transparent',
                      color: selectedLevel === lvl ? lvlInfo.color : 'var(--ink-mute)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {lvl}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Session XP toast */}
          {sessionXP > 0 && (
            <div style={{
              margin: '12px 24px 0',
              padding: '10px 16px', borderRadius: 'var(--r-md)',
              background: '#F4A43722', border: '2px solid #F4A43744',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 700, color: '#c47b00',
            }}>
              🎉 +{sessionXP} XP gagnés cette session !
            </div>
          )}

          {/* Content */}
          <div style={{ padding: '20px 24px' }}>
            {/* Loading state */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '48px 0' }}>
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite' }}>✨</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-3)' }}>
                  L'IA prépare votre exercice…
                </div>
              </div>
            )}

            {/* Error state */}
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
            {!loading && !error && !exercise && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '48px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>{activeModeInfo?.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
                  Prêt pour {activeModeInfo?.label} ?
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 340, lineHeight: 1.6 }}>
                  {activeModeInfo?.description}. Sélectionnez votre niveau et cliquez sur "Générer un exercice".
                </div>
              </div>
            )}

            {/* Exercise content */}
            {!loading && !error && exercise && (
              <>
                {activeMode === 'vocabulary' && (
                  <VocabularyMode
                    exercise={exercise as unknown as Parameters<typeof VocabularyMode>[0]['exercise']}
                    onComplete={handleComplete}
                    onRegenerate={generateExercise}
                  />
                )}
                {activeMode === 'grammar' && (
                  <GrammarMode
                    exercise={exercise as unknown as Parameters<typeof GrammarMode>[0]['exercise']}
                    onComplete={handleComplete}
                    onRegenerate={generateExercise}
                  />
                )}
                {activeMode === 'conversation' && (
                  <ConversationMode
                    exercise={exercise as unknown as Parameters<typeof ConversationMode>[0]['exercise']}
                    level={selectedLevel}
                    onComplete={handleComplete}
                    onRegenerate={generateExercise}
                  />
                )}
                {activeMode === 'writing' && (
                  <WritingMode
                    exercise={exercise as unknown as Parameters<typeof WritingMode>[0]['exercise']}
                    level={selectedLevel}
                    onComplete={handleComplete}
                    onRegenerate={generateExercise}
                  />
                )}
                {activeMode === 'listening' && (
                  <ListeningMode
                    exercise={exercise as unknown as Parameters<typeof ListeningMode>[0]['exercise']}
                    onComplete={handleComplete}
                    onRegenerate={generateExercise}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* No mode selected placeholder */}
      {!activeMode && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-xl)', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 56 }}>🇬🇧</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>
            Bienvenue dans votre espace Anglais
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 420, lineHeight: 1.7 }}>
            Choisissez un mode d'entraînement ci-dessus pour commencer. Tous les exercices sont générés par l'IA et adaptés à votre niveau.
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
