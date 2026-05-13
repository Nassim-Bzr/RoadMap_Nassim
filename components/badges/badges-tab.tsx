"use client";

import { useProgress } from "@/hooks/use-progress";
import { useStreak } from "@/hooks/use-streak";
import { BADGES, TOTAL_TASKS } from "@/lib/data";

export default function BadgesTab() {
  const { completed } = useProgress();
  const { streak } = useStreak();

  const cc = Object.values(completed).filter(Boolean).length;
  const earned = BADGES.filter(b => b.check(cc, TOTAL_TASKS, streak.current_streak));

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center",
        padding: "24px 26px", marginBottom: 24,
        background: "linear-gradient(135deg, color-mix(in oklab, var(--gold) 14%, var(--bg-soft)), var(--surface))",
        border: "2px solid var(--gold)", borderRadius: "var(--r-xl)",
        boxShadow: "0 4px 0 var(--gold-d)",
      }}>
        <div style={{ fontSize: 52 }}>🏆</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>Trophées</div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
            {earned.length}
            <em style={{ fontStyle: "normal", color: "var(--gold-d)", fontSize: "0.5em", marginLeft: 6 }}>/ {BADGES.length}</em>
          </div>
        </div>
        <div style={{ fontFamily: "var(--f-sans)", fontSize: 13, fontWeight: 800, color: "var(--ink-3)", textAlign: "right", maxWidth: "22ch", letterSpacing: "-0.005em" }}>
          <strong>{Math.round(earned.length / BADGES.length * 100)}%</strong> du panthéon débloqué. Continue !
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {BADGES.map((badge, i) => {
          const isEarned = badge.check(cc, TOTAL_TASKS, streak.current_streak);
          return (
            <div
              key={badge.id}
              style={{
                position: "relative",
                background: isEarned
                  ? "linear-gradient(160deg, color-mix(in oklab, var(--gold) 14%, white), var(--surface) 70%)"
                  : "var(--surface)",
                border: `2px solid ${isEarned ? "var(--gold)" : "var(--line)"}`,
                borderRadius: "var(--r-lg)", padding: "22px 16px 18px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                boxShadow: isEarned ? "0 3px 0 var(--gold-d)" : "0 3px 0 var(--line-2)",
                opacity: isEarned ? 1 : 0.55,
                transition: "transform 0.12s",
              }}
            >
              <span style={{ position: "absolute", top: 10, left: 14, fontFamily: "var(--f-mono)", fontSize: 10, fontWeight: 700, color: "var(--ink-mute)" }}>
                N°{String(i + 1).padStart(2, "0")}
              </span>
              {!isEarned && (
                <span style={{ position: "absolute", top: 10, right: 14, fontSize: 13, color: "var(--ink-mute)" }}>🔒</span>
              )}

              <div style={{
                width: 64, height: 64, borderRadius: "50%", fontSize: 26,
                display: "grid", placeItems: "center",
                background: isEarned ? "linear-gradient(135deg, var(--gold), var(--c-04))" : "var(--surface-2)",
                border: isEarned ? "3px solid white" : "3px solid var(--line-2)",
                boxShadow: isEarned ? "0 0 0 3px var(--gold)" : "none",
                filter: isEarned ? "none" : "grayscale(1)",
              }}>
                {badge.emoji}
              </div>

              <div style={{ fontFamily: "var(--f-sans)", fontSize: 13, fontWeight: 900, color: "var(--ink)", textAlign: "center", letterSpacing: "-0.005em" }}>
                {badge.name}
              </div>
              <div style={{ fontFamily: "var(--f-sans)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textAlign: "center" }}>
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
