'use client'
import { useRef, useEffect, useCallback } from 'react'
import { useTyping } from '@/hooks/use-typing'
import type { CodeSnippet, DojoMode } from '@/lib/dojo/types'

interface Props {
  snippet: CodeSnippet
  mode: DojoMode
  onComplete: (wpm: number, accuracy: number, duration: number, errors: number) => void
  onLiveUpdate?: (wpm: number, accuracy: number, elapsed: number) => void
}

function addGaps(code: string): string {
  const lines = code.split('\n')
  let gapCount = 0
  return lines.map(line => {
    if (gapCount >= 5) return line
    const words = line.match(/\b\w{4,}\b/g)
    if (words && words.length > 0 && Math.random() < 0.3) {
      const word = words[Math.floor(Math.random() * words.length)]
      gapCount++
      return line.replace(word, '_'.repeat(word.length))
    }
    return line
  }).join('\n')
}

const FONT = `'JetBrains Mono', 'Fira Code', monospace`
const FS = 13
const LH = 1.7
const PAD = 16

export function TypingEngine({ snippet, mode, onComplete, onLiveUpdate }: Props) {
  const target = mode === 'gaps' ? addGaps(snippet.code) : snippet.code
  const { state, chars, handleInput, reset } = useTyping(target)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    reset()
    textareaRef.current?.focus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet.id, mode])

  useEffect(() => {
    if (state.finished) {
      onComplete(state.wpm, state.accuracy, state.elapsed, state.errors.length)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.finished])

  useEffect(() => {
    if (state.started && !state.finished) {
      onLiveUpdate?.(state.wpm, state.accuracy, state.elapsed)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wpm, state.accuracy, state.elapsed])

  // Sync scroll between textarea and overlay
  const handleScroll = useCallback(() => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // Handle Tab key — insert 4 spaces instead of focus-jumping
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = state.typed.slice(0, start) + '    ' + state.typed.slice(end)
      handleInput(newVal)
      // restore cursor after React re-render
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
  }, [state.typed, handleInput])

  const lineCount = target.split('\n').length
  const minH = Math.max(180, lineCount * FS * LH + PAD * 2)

  const sharedStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: FS,
    lineHeight: LH,
    padding: PAD,
    whiteSpace: 'pre',
    overflowX: 'auto',
    overflowY: 'auto',
    tabSize: 4,
    minHeight: minH,
    maxHeight: 480,
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <div>
      {/* ── Reference panel (dark terminal style) ── */}
      <div style={{
        position: 'relative',
        background: '#161525',
        border: '1.5px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--r-lg)',
        marginBottom: 12,
        opacity: mode === 'memory' && state.started ? 0 : 1,
        transition: 'opacity 0.6s ease',
        userSelect: 'none',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 8, right: 12, zIndex: 2,
          fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          fontFamily: 'var(--f-sans)',
          background: '#161525',
          padding: '2px 6px', borderRadius: 4,
        }}>
          {mode === 'memory' ? '👁 Caché' : '📋 Référence'}
        </div>
        <pre style={{
          ...sharedStyle,
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
          border: 'none',
          background: 'transparent',
          minHeight: 'unset',
          maxHeight: 280,
        }}>
          {snippet.code}
        </pre>
      </div>

      {/* ── Typing zone ── */}
      <div
        style={{ position: 'relative', marginBottom: 12 }}
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Colored overlay — exact same geometry as textarea, must be above it */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          style={{
            ...sharedStyle,
            position: 'absolute',
            top: 0, left: 0,
            zIndex: 2,
            pointerEvents: 'none',
            borderRadius: 'var(--r-lg)',
            border: '1.5px solid transparent',
            overflow: 'hidden',
            scrollbarWidth: 'none',
          }}
        >
          {chars.map((c, i) => (
            <span
              key={i}
              style={{
                color:
                  c.state === 'correct' ? '#4ade80' :
                  c.state === 'wrong'   ? '#f87171' :
                  c.state === 'cursor'  ? 'transparent' :
                  'rgba(255,255,255,0.35)',
                background: c.state === 'cursor' ? 'rgba(255,255,255,0.9)' : 'transparent',
                outline: c.state === 'cursor' ? '2px solid rgba(255,255,255,0.9)' : 'none',
                textDecoration: c.state === 'wrong' ? 'underline wavy #f87171' : 'none',
                borderRadius: c.state === 'cursor' ? 2 : 0,
              }}
            >
              {c.char}
            </span>
          ))}
          {state.typed.length === target.length && state.typed === target ? null : (
            state.typed.length === target.length
              ? <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2, color: 'transparent' }}> </span>
              : null
          )}
        </div>

        {/* Real textarea */}
        <textarea
          ref={textareaRef}
          value={state.typed}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          style={{
            ...sharedStyle,
            display: 'block',
            background: '#161525',
            border: `1.5px solid ${state.started ? 'rgba(255,107,71,0.6)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 'var(--r-lg)',
            resize: 'none',
            color: 'transparent',
            caretColor: 'rgba(255,255,255,0.9)',
            outline: 'none',
            boxShadow: state.started ? '0 0 0 2px rgba(255,107,71,0.15)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* Idle hint overlay */}
        {!state.started && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 2,
          }}>
            <span style={{
              fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              background: 'rgba(22,21,37,0.9)', padding: '6px 14px', borderRadius: 99,
              border: '1.5px solid rgba(255,255,255,0.12)',
            }}>
              Clique ici et commence à taper…
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {state.started && !state.finished && (
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, marginBottom: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: state.progress + '%',
            background: 'linear-gradient(90deg, var(--primary), #4FACFE)',
            borderRadius: 99,
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      {/* Reset button */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={() => { reset(); textareaRef.current?.focus() }}
          style={{
            padding: '7px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 800,
            color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--f-sans)',
          }}
        >
          ↺ Recommencer
        </button>
      </div>
    </div>
  )
}
