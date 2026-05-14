'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { calculateWpm, calculateAccuracy } from '@/lib/dojo/scoring'
import type { TypingState, CharState } from '@/lib/dojo/types'

export function useTyping(target: string) {
  const [state, setState] = useState<TypingState>({
    typed: '',
    target,
    started: false,
    finished: false,
    startTime: null,
    errors: [],
    currentIndex: 0,
    wpm: 0,
    accuracy: 100,
    progress: 0,
    elapsed: 0,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const typedRef = useRef('')

  useEffect(() => {
    reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  useEffect(() => {
    if (state.started && !state.finished) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - (startTimeRef.current ?? 0)) / 1000)
        const wpm = calculateWpm(typedRef.current, elapsed)
        setState(prev => ({ ...prev, elapsed, wpm }))
      }, 500)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state.started, state.finished])

  const handleInput = useCallback((typed: string) => {
    typedRef.current = typed
    setState(prev => {
      const wasStarted = prev.started
      const started = wasStarted || typed.length > 0
      if (!wasStarted && typed.length > 0) {
        startTimeRef.current = Date.now()
      }

      const errors: number[] = []
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== target[i]) errors.push(i)
      }

      const accuracy = calculateAccuracy(typed, target)
      const progress = Math.min(100, Math.round((typed.length / target.length) * 100))
      const finished = typed === target

      if (finished && intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      return {
        ...prev,
        typed,
        started,
        startTime: startTimeRef.current,
        errors,
        currentIndex: typed.length,
        accuracy,
        progress,
        finished,
      }
    })
  }, [target])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startTimeRef.current = null
    typedRef.current = ''
    setState({
      typed: '',
      target,
      started: false,
      finished: false,
      startTime: null,
      errors: [],
      currentIndex: 0,
      wpm: 0,
      accuracy: 100,
      progress: 0,
      elapsed: 0,
    })
  }, [target])

  const chars: CharState[] = target.split('').map((char, i) => {
    if (i < state.typed.length) {
      return { char, state: state.typed[i] === char ? 'correct' : 'wrong' }
    }
    if (i === state.typed.length) return { char, state: 'cursor' }
    return { char, state: 'pending' }
  })

  return { state, chars, handleInput, reset }
}
