"use client"
import { useState, useEffect, useCallback } from 'react'
import { ENGLISH_LEVELS } from '@/lib/data/english-levels'
import type { CEFRLevel, EnglishMode } from '@/lib/data/english-levels'

interface EnglishProgress {
  level: CEFRLevel
  xp: number
  sessionsCompleted: number
  wordsLearned: number
  streakDays: number
  modeProgress: Record<EnglishMode, number>
}

const DEFAULT: EnglishProgress = {
  level: 'A1',
  xp: 0,
  sessionsCompleted: 0,
  wordsLearned: 0,
  streakDays: 0,
  modeProgress: { vocabulary: 0, grammar: 0, conversation: 0, writing: 0, listening: 0 },
}

const LS_KEY = 'english_progress'

export function useEnglishProgress() {
  const [progress, setProgress] = useState<EnglishProgress>(DEFAULT)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) setProgress(JSON.parse(stored))
    } catch {}
  }, [])

  const addXP = useCallback((amount: number, mode: EnglishMode) => {
    setProgress(prev => {
      const newXP = prev.xp + amount
      let newLevel: CEFRLevel = 'A1'
      for (const lvl of ENGLISH_LEVELS) {
        if (newXP >= lvl.xpRequired) newLevel = lvl.id
      }
      const updated: EnglishProgress = {
        ...prev,
        xp: newXP,
        level: newLevel,
        sessionsCompleted: prev.sessionsCompleted + 1,
        modeProgress: { ...prev.modeProgress, [mode]: (prev.modeProgress[mode] || 0) + 1 },
      }
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const addWords = useCallback((count: number) => {
    setProgress(prev => {
      const updated = { ...prev, wordsLearned: prev.wordsLearned + count }
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  return { progress, addXP, addWords }
}
