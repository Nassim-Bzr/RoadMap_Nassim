"use client";

import { useState } from "react";
import { useJournal } from "@/hooks/use-journal";
import FennecMascot from "@/components/mascot";

const MOODS = [
  { v: 1, e: "😫", lbl: "Dur",      color: "var(--c-04)" },
  { v: 2, e: "😔", lbl: "Mitigé",   color: "var(--flame)" },
  { v: 3, e: "😐", lbl: "Neutre",   color: "var(--ink-mute)" },
  { v: 4, e: "😊", lbl: "Bien",     color: "var(--c-05)" },
  { v: 5, e: "🔥", lbl: "Excellent",color: "var(--c-01)" },
];

export default function JournalTab() {
  const { entries, saveEntry } = useJournal();
  const [text, setText] = useState("");
  const [mood, setMood] = useState(4);
  const [saved, setSaved] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const handleSave = async () => {
    if (!text.trim()) return;
    await saveEntry(text, mood);
    setText("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Entry card */}
      <div style={{
        background: "var(--surface)", border: "2px solid var(--line)",
        borderRadius: "var(--r-xl)", boxShadow: "0 3px 0 var(--line-2)",
        padding: "22px 24px", marginBottom: 28,
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          {today.toUpperCase()}
        </div>
        <h2 style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(20px,3.5vw,26px)", fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 20px", maxWidth: "28ch", lineHeight: 1.15 }}>
          Comment s&apos;est passée ta session ?
        </h2>

        {/* Mood row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {MOODS.map(m => {
            const isPicked = mood === m.v;
            return (
              <button
                key={m.v}
                onClick={() => setMood(m.v)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 8px",
                  background: isPicked ? `color-mix(in oklab, ${m.color} 8%, var(--surface))` : "var(--surface)",
                  border: `2px solid ${isPicked ? m.color : "var(--line)"}`,
                  borderRadius: "var(--r-md)",
                  boxShadow: isPicked ? `0 3px 0 ${m.color}` : "0 3px 0 var(--line-2)",
                  cursor: "pointer", transition: "all 0.12s",
                }}
              >
                <span style={{ fontSize: 26, filter: isPicked ? "grayscale(0)" : "grayscale(0.4)", transform: isPicked ? "scale(1.15)" : "scale(1)", transition: "all 0.15s" }}>
                  {m.e}
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: isPicked ? "var(--ink)" : "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
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
            borderRadius: "var(--r-md)", padding: "14px 16px",
            color: "var(--ink)", fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 600,
            lineHeight: 1.55, minHeight: 110, resize: "vertical", outline: "none", marginBottom: 16,
            transition: "border-color 0.15s",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            className="btn-3d"
            style={saved ? { "--btn-c": "var(--c-05)", "--btn-d": "var(--c-05-d)" } as React.CSSProperties : undefined}
          >
            {saved ? "✓ Sauvegardé !" : "✓ Sauvegarder"}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 14px" }}>
        <h3 style={{ fontFamily: "var(--f-sans)", fontSize: 18, fontWeight: 900, letterSpacing: "-0.01em", margin: 0, color: "var(--ink)" }}>Historique</h3>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {entries.length} {entries.length <= 1 ? "entrée" : "entrées"}
        </span>
      </div>

      {entries.length === 0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ margin: "0 auto 16px", opacity: 0.7 }}>
            <FennecMascot size={90} />
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 800, color: "var(--ink-3)" }}>
            Aucune entrée — commence aujourd&apos;hui !
          </div>
        </div>
      )}

      {entries.map(entry => {
        const d = new Date(entry.date);
        const dateStr = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
        const moodEmoji = MOODS.find(m => m.v === entry.mood)?.e ?? "😐";
        return (
          <div key={entry.date} style={{
            display: "grid", gridTemplateColumns: "110px 1fr auto", gap: 16,
            padding: "16px 20px", background: "var(--surface)",
            border: "2px solid var(--line)", borderRadius: "var(--r-md)",
            marginBottom: 10, alignItems: "start", boxShadow: "0 2px 0 var(--line-2)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{dateStr}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{entry.content}</div>
            <div style={{ fontSize: 24 }}>{moodEmoji}</div>
          </div>
        );
      })}
    </div>
  );
}
