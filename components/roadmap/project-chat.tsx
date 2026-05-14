"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  taskId: string
  taskLabel: string
  phaseColor: string
}

export function ProjectChat({ taskId, taskLabel, phaseColor }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset conversation when task changes
  useEffect(() => {
    setMessages([])
  }, [taskId])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || streaming) return

    const newMessages: Message[] = [...messages, { role: "user", content: msg }]
    setMessages(newMessages)
    setInput("")
    setStreaming(true)

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages([...newMessages, assistantMsg])

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, currentTaskId: taskId }),
      })

      if (!res.ok || !res.body) throw new Error("Stream failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const payload = line.slice(6)
          if (payload === "[DONE]") break
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
          } catch { /* ignore */ }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: "Désolé, erreur. Réessaie." }
        return updated
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }, [input, messages, streaming, taskId])

  const QUICK_PROMPTS = [
    "Explique-moi le concept clé",
    "Donne-moi un exemple concret",
    "Par où commencer ?",
    "Quels outils utiliser ?",
  ]

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: 320,
      background: "var(--bg)",
      border: `2px solid var(--line)`,
      borderRadius: "var(--r-md)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "8px 14px",
        background: `color-mix(in oklab, ${phaseColor} 8%, var(--surface))`,
        borderBottom: "2px solid var(--line)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: streaming ? "#fbbf24" : "#4ade80",
          animation: streaming ? "pulse-dot 1s ease infinite" : "none",
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-2)" }}>
          Assistant IA · {taskLabel.length > 30 ? taskLabel.slice(0, 28) + "…" : taskLabel}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-mute)", textAlign: "center", margin: "8px 0 12px", lineHeight: 1.5 }}>
              Pose une question sur ce projet…
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: "5px 10px",
                    background: "var(--surface)",
                    border: `2px solid var(--line)`,
                    borderRadius: 99, cursor: "pointer",
                    fontSize: 11, fontWeight: 700,
                    color: "var(--ink-3)",
                    fontFamily: "var(--f-sans)",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = phaseColor; e.currentTarget.style.color = phaseColor }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--ink-3)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "88%",
              background: m.role === "user"
                ? `color-mix(in oklab, ${phaseColor} 14%, var(--surface))`
                : "var(--surface)",
              border: `2px solid ${m.role === "user" ? phaseColor : "var(--line)"}`,
              borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
              padding: "8px 12px",
              fontSize: 12, fontWeight: 600, color: "var(--ink)",
              lineHeight: 1.55, whiteSpace: "pre-wrap",
              boxShadow: `0 2px 0 ${m.role === "user" ? `color-mix(in oklab, ${phaseColor} 40%, transparent)` : "var(--line-2)"}`,
            }}
          >
            {m.content || (streaming && i === messages.length - 1
              ? <span style={{ display: "flex", gap: 3, alignItems: "center", padding: "2px 0" }}>
                  {[0, 1, 2].map(j => (
                    <span key={j} style={{
                      width: 5, height: 5, borderRadius: "50%", background: phaseColor,
                      animation: `typing-dot 1.2s ease-in-out ${j * 0.2}s infinite`,
                      display: "inline-block",
                    }} />
                  ))}
                </span>
              : ""
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 6, padding: "8px 10px", borderTop: "2px solid var(--line)", background: "var(--surface)" }}>
        <input
          ref={inputRef}
          style={{
            flex: 1, background: "var(--bg)", border: "2px solid var(--line)",
            borderRadius: "var(--r-md)", padding: "7px 11px",
            fontSize: 12, fontWeight: 600, color: "var(--ink)",
            fontFamily: "var(--f-sans)", outline: "none",
            transition: "border-color 0.12s",
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          onFocus={e => (e.currentTarget.style.borderColor = phaseColor)}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--line)")}
          placeholder="Pose ta question..."
          disabled={streaming}
        />
        <button
          onClick={() => sendMessage()}
          disabled={streaming || !input.trim()}
          style={{
            width: 34, height: 34, borderRadius: "var(--r-md)", flexShrink: 0,
            background: streaming || !input.trim() ? "var(--line)" : phaseColor,
            border: `2px solid ${streaming || !input.trim() ? "var(--line-2)" : `color-mix(in oklab, ${phaseColor} 70%, black)`}`,
            cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
            display: "grid", placeItems: "center", fontSize: 15,
            boxShadow: streaming || !input.trim() ? "0 2px 0 var(--line-2)" : `0 3px 0 color-mix(in oklab, ${phaseColor} 60%, black)`,
            transition: "all 0.12s",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
