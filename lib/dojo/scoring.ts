export function calculateWpm(typed: string, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  const words = typed.trim().split(/\s+/).filter(w => w.length > 0).length
  return Math.round(words / (elapsedSeconds / 60))
}

export function calculateAccuracy(typed: string, target: string): number {
  if (typed.length === 0) return 100
  let correct = 0
  const len = Math.min(typed.length, target.length)
  for (let i = 0; i < len; i++) {
    if (typed[i] === target[i]) correct++
  }
  return Math.round((correct / typed.length) * 100)
}

export function calculateScore(wpm: number, accuracy: number, difficulty: string): number {
  const diffMultiplier = ({ easy: 1, medium: 1.5, hard: 2, expert: 3 } as Record<string, number>)[difficulty] ?? 1
  const accuracyBonus = accuracy >= 95 ? 1.2 : accuracy >= 85 ? 1.0 : 0.8
  return Math.round(wpm * accuracyBonus * diffMultiplier)
}

export function getPerformanceLabel(wpm: number, accuracy: number) {
  if (accuracy >= 95 && wpm >= 40) return { emoji: '🔥', label: 'Parfait',  color: 'var(--c-05)' }
  if (accuracy >= 90 && wpm >= 25) return { emoji: '⭐', label: 'Excellent', color: 'var(--gold)' }
  if (accuracy >= 80)              return { emoji: '👍', label: 'Bien',      color: 'var(--primary)' }
  return                                  { emoji: '💪', label: 'Continue',  color: 'var(--ink-3)' }
}
