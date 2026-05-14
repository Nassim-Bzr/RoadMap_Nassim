"use client"
import { useState, useRef, useEffect, useCallback } from 'react'

interface ConversationExercise {
  scenario: string
  context: string
  starter: string
  vocabulary_hints: string[]
  tips: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  exercise: ConversationExercise
  level: string
  onComplete: (score: number, xp: number) => void
  onRegenerate: () => void
}

function parseMessage(content: string) {
  const noteIdx = content.indexOf('💡')
  if (noteIdx > -1) {
    return { main: content.slice(0, noteIdx).trim(), note: content.slice(noteIdx).trim() }
  }
  return { main: content, note: null }
}

export default function ConversationMode({ exercise, level, onComplete, onRegenerate }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: exercise.starter },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [finished, setFinished] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/english/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          level,
          scenario: exercise.scenario,
        }),
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let aiContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const { text } = JSON.parse(data)
              aiContent += text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: aiContent }
                return updated
              })
            } catch {}
          }
        }
      }

      const newTurnCount = turnCount + 1
      setTurnCount(newTurnCount)

      if (newTurnCount >= 8) {
        const xp = Math.min(newTurnCount * 8, 100)
        onComplete(newTurnCount, xp)
        setFinished(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, level, exercise.scenario, turnCount, onComplete])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleNewConversation = () => {
    setMessages([{ role: 'assistant', content: exercise.starter }])
    setTurnCount(0)
    setFinished(false)
    setInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Scenario banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4A90E222, #4A90E211)',
        border: '2px solid #4A90E244',
        borderRadius: 'var(--r-lg)', padding: '14px 18px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <span style={{ fontFamily: 'var(--f-sans)', fontSize: 15, fontWeight: 900, color: '#4A90E2' }}>
            {exercise.scenario}
          </span>
          {finished && (
            <span style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 800,
              padding: '3px 8px', borderRadius: 99,
              background: '#2DBFB322', color: '#2DBFB3',
              fontFamily: 'var(--f-sans)',
            }}>
              Session complète ✓
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--f-sans)', lineHeight: 1.5 }}>
          {exercise.context}
        </div>
      </div>

      {/* Tips & hints */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowHints(h => !h)}
          style={{
            padding: '6px 14px', borderRadius: 99,
            background: 'var(--surface)', border: '2px solid var(--line)',
            fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 700, color: 'var(--ink-3)',
            cursor: 'pointer',
          }}
        >
          {showHints ? 'Masquer' : '💡 Vocabulaire & conseils'}
        </button>
        <div style={{
          fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {turnCount}/8 échanges · Niveau {level}
        </div>
      </div>

      {showHints && (
        <div style={{
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {exercise.vocabulary_hints?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Vocabulaire utile
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {exercise.vocabulary_hints.map((hint, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 99,
                    background: '#4A90E222', border: '1px solid #4A90E244',
                    fontSize: 12, fontFamily: 'var(--f-mono)', color: '#4A90E2', fontWeight: 600,
                  }}>
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}
          {exercise.tips?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', fontFamily: 'var(--f-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Conseils
              </div>
              {exercise.tips.map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: 'var(--f-sans)', marginBottom: 4 }}>
                  • {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat area */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--line)',
        borderRadius: 'var(--r-xl)', overflow: 'hidden',
      }}>
        <div style={{
          height: 380, overflowY: 'auto', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user'
            const { main, note } = isUser ? { main: msg.content, note: null } : parseMessage(msg.content)

            return (
              <div key={i} style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                gap: 8,
              }}>
                {!isUser && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4A90E2, #9B7EE5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>
                    🤖
                  </div>
                )}
                <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isUser ? 'var(--primary)' : 'var(--bg)',
                    border: isUser ? 'none' : '1px solid var(--line)',
                    fontFamily: 'var(--f-sans)', fontSize: 14, lineHeight: 1.6,
                    color: isUser ? '#FFF' : 'var(--ink)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {main}
                  </div>
                  {note && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--r-md)',
                      background: '#F4A43711', border: '1px solid #F4A43733',
                      fontFamily: 'var(--f-sans)', fontSize: 12, color: '#F4A437',
                      lineHeight: 1.5,
                    }}>
                      {note}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: '#FFF',
                    fontFamily: 'var(--f-sans)', flexShrink: 0,
                  }}>
                    N
                  </div>
                )}
              </div>
            )
          })}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4A90E2, #9B7EE5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>
                🤖
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                background: 'var(--bg)', border: '1px solid var(--line)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(n => (
                  <div key={n} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-mute)',
                    animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          borderTop: '2px solid var(--line)', padding: '12px 16px',
          display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response in English... (Enter to send)"
            disabled={loading || finished}
            rows={2}
            style={{
              flex: 1, resize: 'none',
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              border: '2px solid var(--line)',
              fontFamily: 'var(--f-sans)', fontSize: 14, color: 'var(--ink)',
              background: finished ? 'var(--bg)' : 'var(--surface)',
              outline: 'none', lineHeight: 1.5,
              opacity: finished ? 0.5 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || finished}
            style={{
              padding: '10px 18px', borderRadius: 'var(--r-md)',
              background: input.trim() && !loading && !finished ? 'var(--primary)' : 'var(--line)',
              color: input.trim() && !loading && !finished ? '#FFF' : 'var(--ink-mute)',
              fontFamily: 'var(--f-sans)', fontWeight: 800, fontSize: 14,
              border: 'none', cursor: input.trim() && !loading && !finished ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              boxShadow: input.trim() && !loading && !finished ? '0 3px 0 var(--primary-dark)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            Envoyer
          </button>
        </div>
      </div>

      {/* New conversation button */}
      <button
        onClick={handleNewConversation}
        style={{
          alignSelf: 'center', padding: '10px 22px', borderRadius: 'var(--r-md)',
          background: 'var(--surface)', border: '2px solid var(--line)',
          fontFamily: 'var(--f-sans)', fontWeight: 700, fontSize: 13, color: 'var(--ink-3)',
          cursor: 'pointer',
        }}
      >
        Nouvelle conversation
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
