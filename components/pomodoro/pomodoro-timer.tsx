"use client";

import { usePomodoroContext } from "./pomodoro-context";

export function PomodoroTimer() {
  const { running, seconds, taskLabel, stop, format } = usePomodoroContext();

  if (!running) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 100,
      background: "var(--surface)", border: "2px solid var(--flame)",
      borderRadius: 99, padding: "8px 8px 8px 18px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 4px 0 var(--flame-d), 0 8px 32px rgba(0,0,0,0.15)",
      animation: "pomo-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      {/* Pulse dot */}
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--flame)", animation: "pulse-dot 1.4s ease infinite" }} />

      {/* Timer */}
      <span style={{ fontFamily: "var(--f-sans)", fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
        {format(seconds)}
      </span>

      {/* Task label */}
      <span style={{ fontFamily: "var(--f-sans)", fontSize: 12, fontWeight: 700, color: "var(--ink-3)", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {taskLabel}
      </span>

      {/* Stop button */}
      <button
        onClick={stop}
        style={{
          padding: "8px 14px", background: "var(--flame)", color: "white",
          borderRadius: 99, border: "none", fontFamily: "var(--f-sans)",
          fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: "0 2px 0 var(--flame-d)", cursor: "pointer",
          transition: "transform 0.06s",
        }}
      >
        Stop
      </button>
    </div>
  );
}
