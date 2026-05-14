"use client";

import { useState } from "react";
import { useJournal } from "@/hooks/use-journal";
import FennecMascot from "@/components/mascot";

const MOODS = [
  { v: 1, e: "😫", lbl: "Dur",       color: "var(--c-04)" },
  { v: 2, e: "😔", lbl: "Mitigé",    color: "var(--flame)" },
  { v: 3, e: "😐", lbl: "Neutre",    color: "var(--ink-mute)" },
  { v: 4, e: "😊", lbl: "Bien",      color: "var(--c-05)" },
  { v: 5, e: "🔥", lbl: "Excellent", color: "var(--c-01)" },
];

export default function JournalTab() {
  const { entries, saveEntry } = useJournal();
  const [text, setText] = useState("");
  const [mood, setMood] = useState(4);
  const [saved, setSaved] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const handleSave = async () => {
    if (!text.trim()) return;
    await saveEntry(text, mood);
    setText("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ paddingTop: 8 }}>

      {/* ── Entry card ── */}
      <div style={{
        background: "var(--surface)", border: "2px solid var(--line)",
        borderRadius: "var(--r-xl)", boxShadow: "0 3px 0 var(--line-2)",
        padding: "20px 18px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          {today.toUpperCase()}
        </div>
        <h2 style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(18px,3.5vw,24px)", fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 18px", lineHeight: 1.2 }}>
          Comment s&apos;est passée ta session ?
        </h2>

        {/* Mood row — scrolls on very small screens */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
          {MOODS.map(m => {
            const isPicked = mood === m.v;
            return (
              <button
                key={m.v}
                onClick={() => setMood(m.v)}
                style={{
                  flex: "1 0 56px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  padding: "10px 6px",
                  background: isPicked ? `color-mix(in oklab, ${m.color} 8%, var(--surface))` : "var(--surface)",
                  border: `2px solid ${isPicked ? m.color : "var(--line)"}`,
                  borderRadius: "var(--r-md)",
                  boxShadow: isPicked ? `0 3px 0 ${m.color}` : "0 3px 0 var(--line-2)",
                  cursor: "pointer", transition: "all 0.12s",
                }}
              >
                <span style={{
                  fontSize: 22,
                  filter: isPicked ? "grayscale(0)" : "grayscale(0.4)",
                  transform: isPicked ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.15s",
                }}>
                  {m.e}
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, color: isPicked ? "var(--ink)" : "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {m.lbl}
                </span>
              </button>
            );
          })}
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Qu'as-tu appris ? Quels blocages ? Quelles victoires ?"
          style={{
            width: "100%", background: "var(--bg)", border: "2px solid var(--line)",
            borderRadius: "var(--r-md)", padding: "12px 14px",
            color: "var(--ink)", fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 600,
            lineHeight: 1.55, minHeight: 100, resize: "vertical", outline: "none",
            marginBottom: 14, transition: "border-color 0.15s", boxSizing: "border-box",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--primary)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--line)")}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            className="btn-3d"
            style={saved
              ? { "--btn-c": "var(--c-05)", "--btn-d": "var(--c-05-d)" } as React.CSSProperties
              : { "--btn-c": "var(--primary)", "--btn-d": "var(--primary-dark)" } as React.CSSProperties}
          >
            {saved ? "✓ Sauvegardé !" : "✓ Sauvegarder"}
          </button>
        </div>
      </div>

      {/* ── Timeline header ── */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 12px" }}>
        <h3 style={{ fontFamily: "var(--f-sans)", fontSize: 17, fontWeight: 900, letterSpacing: "-0.01em", margin: 0, color: "var(--ink)" }}>
          Historique
        </h3>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-mute)" }}>
          {entries.length} {entries.length <= 1 ? "entrée" : "entrées"}
        </span>
      </div>

      {entries.length === 0 && (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <div style={{ margin: "0 auto 14px", opacity: 0.7 }}>
            <FennecMascot size={80} />
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 800, color: "var(--ink-3)" }}>
            Aucune entrée — commence aujourd&apos;hui !
          </div>
        </div>
      )}

      {/* ── Entries list — stacked on mobile ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map(entry => {
          const d = new Date(entry.date + "T12:00:00");
          const dateStr = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
          const moodData = MOODS.find(m => m.v === entry.mood) ?? MOODS[2];
          return (
            <div key={entry.date} style={{
              background: "var(--surface)", border: "2px solid var(--line)",
              borderRadius: "var(--r-lg)", padding: "14px 16px",
              boxShadow: "0 2px 0 var(--line-2)",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `color-mix(in oklab, ${moodData.color} 12%, var(--surface))`,
                  border: `2px solid color-mix(in oklab, ${moodData.color} 30%, var(--line))`,
                  display: "grid", placeItems: "center", fontSize: 18,
                }}>
                  {moodData.e}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-2)", letterSpacing: "0.02em" }}>
                    {dateStr}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: moodData.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {moodData.lbl}
                  </div>
                </div>
              </div>
              {/* Content */}
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {entry.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
