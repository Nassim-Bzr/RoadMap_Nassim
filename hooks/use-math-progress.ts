"use client"
import { useState, useEffect, useCallback } from 'react'
import { MATH_LEVEL_INFO } from '@/lib/data/math-curriculum'
import type { MathLevel } from '@/lib/data/math-curriculum'

interface MathProgress {
  level: MathLevel
  xp: number
  sessionsCompleted: number
  topicsProgress: Record<string, number>
  masteredTopics: string[]
}

const DEFAULT: MathProgress = {
  level: 'debutant',
  xp: 0,
  sessionsCompleted: 0,
  topicsProgress: {},
  masteredTopics: [],
}

const LS_KEY = 'math_progress'

function computeLevel(xp: number): MathLevel {
  let level: MathLevel = 'debutant'
  for (const info of MATH_LEVEL_INFO) {
    if (xp >= info.xpRequired) level = info.id
  }
  return level
}

export function useMathProgress() {
  const [progress, setProgress] = useState<MathProgress>(DEFAULT)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) setProgress(JSON.parse(stored) as MathProgress)
    } catch { /* ignore */ }
  }, [])

  const addXP = useCallback((amount: number, topicId: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount
      const newLevel = computeLevel(newXP)
      const prevCount = prev.topicsProgress[topicId] ?? 0
      const newCount = prevCount + 1
      const newTopicsProgress = { ...prev.topicsProgress, [topicId]: newCount }
      const newMastered = newCount >= 3 && !prev.masteredTopics.includes(topicId)
        ? [...prev.masteredTopics, topicId]
        : prev.masteredTopics

      const updated: MathProgress = {
        ...prev,
        xp: newXP,
        level: newLevel,
        sessionsCompleted: prev.sessionsCompleted + 1,
        topicsProgress: newTopicsProgress,
        masteredTopics: newMastered,
      }
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
      return updated
    })
  }, [])

  const masterTopic = useCallback((topicId: string) => {
    setProgress(prev => {
      if (prev.masteredTopics.includes(topicId)) return prev
      const updated: MathProgress = {
        ...prev,
        masteredTopics: [...prev.masteredTopics, topicId],
      }
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
      return updated
    })
  }, [])

  return { progress, addXP, masterTopic }
}
