"use client"

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import FennecMascot from '@/components/mascot'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  currentTaskId: string
}

export default function TutorChat({ currentTaskId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [open, setOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...newMessages, assistantMsg])

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, currentTaskId }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { text: chunk } = JSON.parse(payload)
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + chunk,
              }
              return updated
            })
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      console.error('Chat stream error:', err)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Désolé, une erreur est survenue. Réessaie.',
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 200 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: 58, right: 0,
          width: 340, height: 440,
          background: 'var(--surface)', border: '2px solid var(--line)',
          borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 6px 0 var(--line-2), 0 12px 40px rgba(0,0,0,0.12)',
          animation: 'chat-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '2px solid var(--line)',
            background: 'linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, var(--surface)), var(--surface))',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <FennecMascot size={28} />
            <div>
              <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                Tutor IA
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-mute)' }}>
                {streaming ? '🟠 En train de répondre...' : '🟢 Prêt'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--ink-mute)', fontSize: 12, fontWeight: 700, marginTop: 20, padding: '0 16px', lineHeight: 1.6 }}>
                Pose-moi une question sur la leçon, colle du code à review, ou demande une explication.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user'
                    ? 'color-mix(in oklab, var(--primary) 14%, var(--surface))'
                    : 'var(--bg)',
                  border: `2px solid ${m.role === 'user' ? 'var(--primary)' : 'var(--line)'}`,
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '9px 13px',
                  fontSize: 12, fontWeight: 600, color: 'var(--ink)',
                  maxWidth: '88%', lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  boxShadow: `0 2px 0 ${m.role === 'user' ? 'var(--primary-dark)' : 'var(--line-2)'}`,
                }}
              >
                {m.content || (streaming && i === messages.length - 1 ? (
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <span key={j} style={{
                        width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)',
                        animation: `typing-dot 1.2s ease-in-out ${j * 0.2}s infinite`,
                        display: 'inline-block',
                      }} />
                    ))}
                  </span>
                ) : '')}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '2px solid var(--line)' }}>
            <input
              style={{
                flex: 1, background: 'var(--bg)', border: '2px solid var(--line)',
                borderRadius: 'var(--r-md)', padding: '8px 12px',
                fontSize: 12, fontWeight: 600, color: 'var(--ink)',
                fontFamily: 'var(--f-sans)', outline: 'none',
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Pose ta question..."
              disabled={streaming}
            />
            <button
              onClick={sendMessage}
              disabled={streaming}
              style={{
                width: 36, height: 36, borderRadius: 'var(--r-md)',
                background: streaming ? 'var(--line)' : 'var(--primary)',
                border: `2px solid ${streaming ? 'var(--line-2)' : 'var(--primary-dark)'}`,
                cursor: streaming ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: streaming ? '0 2px 0 var(--line-2)' : '0 3px 0 var(--primary-dark)',
                flexShrink: 0,
              }}
            >
              <Send size={14} color={streaming ? 'var(--ink-mute)' : 'white'} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: open ? 'var(--surface)' : 'var(--primary)',
          border: `2px solid ${open ? 'var(--line)' : 'var(--primary-dark)'}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 3px 0 var(--line-2)' : '0 4px 0 var(--primary-dark), 0 8px 24px rgba(255,107,71,0.3)',
          animation: !open ? 'bubble-bounce 2.5s ease-in-out 3s infinite' : undefined,
          transition: 'all 0.15s',
        }}
      >
        <FennecMascot size={28} />
      </button>
    </div>
  )
}
