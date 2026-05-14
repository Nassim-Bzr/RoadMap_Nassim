"use client"
import { useState, useCallback } from 'react'

interface Word {
  word: string
  phonetic: string
  definition: string
  example: string
  translation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface VocabularyExercise {
  theme: string
  words: Word[]
}

interface Props {
  exercise: VocabularyExercise
  onComplete: (score: number, xp: number) => void
  onRegenerate: () => void
}

const difficultyColor: Record<string, string> = {
  easy: '#2DBFB3',
  medium: '#F4A437',
  hard: '#E94B7C',
}

export default function VocabularyMode({ exercise, onComplete, onRegenerate }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [unknown, setUnknown] = useState<Set<number>>(new Set())
  const [finished, setFinished] = useState(false)

  const words = exercise.words || []
  const current = words[currentIndex]

  const handleKnow = useCallback(() => {
    const newKnown = new Set(known)
    newKnown.add(currentIndex)
    setKnown(newKnown)
    goNext(newKnown, unknown)
  }, [currentIndex, known, unknown]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDontKnow = useCallback(() => {
    const newUnknown = new Set(unknown)
    newUnknown.add(currentIndex)
    setUnknown(newUnknown)
    goNext(known, newUnknown)
  }, [currentIndex, known, unknown]) // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = (k: Set<number>, u: Set<number>) => {
    if (currentIndex >= words.length - 1) {
      const score = k.size
      const xp = score * 10 + (score === words.length ? 20 : 0)
      onComplete(score, xp)
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setIsFlipped(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setIsFlipped(false)
    }
  }

  if (!current) return null

  if (finished) {
    const score = known.size
    const pct = Math.round((score / words.length) * 100)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 0' }}>
        <div style={{ fontSize: 64 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 900, color: 'var(--ink)' }}>
            {score}/{words.length} mots maîtrisés
          </div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 15, color: 'var(--ink-3)', marginTop: 8 }}>
            {pct >= 80 ? 'Excellent travail !' : pct >= 60 ? 'Bon résultat, continuez !' : 'Révisez encore un peu !'}
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '16px 24px',
        }}>
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#2DBFB3', fontFamily: 'var(--f-sans)' }}>{score}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', fontWeight: 700 }}>CONNUS</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#E94B7C', fontFamily: 'var(--f-sans)' }}>{unknown.size}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', fontWeight: 700 }}>À REVOIR</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#F4A437', fontFamily: 'var(--f-sans)' }}>+{score * 10 + (score === words.length ? 20 : 0)}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', fontWeight: 700 }}>XP</div>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          style={{
            padding: '12px 28px', borderRadius: 'var(--r-md)',
            background: 'var(--primary)', color: '#FFF',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 0 var(--primary-dark)',
            transform: 'translateY(0)', transition: 'all 0.1s',
          }}
        >
          Régénérer un nouveau set
        </button>
      </div>
    )
  }

  const progress = ((currentIndex) / words.length) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>
          Thème: <span style={{ color: 'var(--ink)' }}>{exercise.theme}</span>
        </div>
        <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #2DBFB3, #9B7EE5)',
          borderRadius: 99, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Flashcard — simple toggle (no absolute positioning to avoid mobile height collapse) */}
      <div
        onClick={() => setIsFlipped(f => !f)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {/* FRONT */}
        {!isFlipped && (
          <div style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--surface)',
            border: '2px solid var(--line)',
            borderRadius: 'var(--r-xl)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '28px 20px', gap: 12,
            animation: 'card-in 0.25s ease',
          }}>
            <div style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: 99,
              background: difficultyColor[current.difficulty] + '22',
              border: `1px solid ${difficultyColor[current.difficulty]}44`,
              fontSize: 11, fontWeight: 700, color: difficultyColor[current.difficulty],
              fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {current.difficulty}
            </div>
            <div style={{ fontSize: 'clamp(28px, 8vw, 38px)', fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--f-sans)', textAlign: 'center' }}>
              {current.word}
            </div>
            <div style={{ fontSize: 15, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', letterSpacing: '0.03em', textAlign: 'center' }}>
              {current.phonetic}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', fontWeight: 600, marginTop: 4 }}>
              Appuyez pour voir la définition
            </div>
          </div>
        )}

        {/* BACK */}
        {isFlipped && (
          <div style={{
            width: '100%', boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #9B7EE514, #2DBFB314)',
            border: '2px solid var(--line)',
            borderRadius: 'var(--r-xl)',
            display: 'flex', flexDirection: 'column',
            padding: '24px 20px', gap: 16,
            animation: 'card-in 0.25s ease',
          }}>
            {/* Word reminder */}
            <div style={{ textAlign: 'center', paddingBottom: 12, borderBottom: '2px solid var(--line)' }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--f-sans)' }}>
                {current.word}
              </span>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', marginLeft: 10 }}>
                {current.phonetic}
              </span>
            </div>

            {/* Définition EN FRANÇAIS */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                📖 Définition
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--f-sans)', fontWeight: 600, lineHeight: 1.55 }}>
                {current.definition}
              </div>
            </div>

            {/* Exemple EN ANGLAIS */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                💬 Exemple
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: 'var(--f-sans)', fontStyle: 'italic', lineHeight: 1.55 }}>
                &ldquo;{current.example}&rdquo;
              </div>
            </div>

            {/* Traduction */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              background: 'var(--surface)', border: '2px solid var(--line)',
            }}>
              <span style={{ fontSize: 18 }}>🇫🇷</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Traduction</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--f-sans)' }}>
                  {current.translation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          style={{
            padding: '10px 20px', borderRadius: 'var(--r-md)',
            background: 'var(--surface)', border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontWeight: 700, fontSize: 14,
            color: 'var(--ink-3)', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Précédent
        </button>
        <button
          onClick={handleDontKnow}
          style={{
            padding: '10px 20px', borderRadius: 'var(--r-md)',
            background: '#E94B7C22', border: '2px solid #E94B7C44',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
            color: '#E94B7C', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          À revoir
        </button>
        <button
          onClick={handleKnow}
          style={{
            padding: '10px 20px', borderRadius: 'var(--r-md)',
            background: '#2DBFB3', border: '2px solid #2DBFB3',
            boxShadow: '0 4px 0 #1a8f85',
            fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
            color: '#FFF', cursor: 'pointer',
            transition: 'all 0.1s',
          }}
        >
          ★ Je connais →
        </button>
      </div>
    </div>
  )
}
