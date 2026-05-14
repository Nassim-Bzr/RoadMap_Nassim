"use client";

import { useProgress } from "@/hooks/use-progress";
import { useStreak } from "@/hooks/use-streak";
import { OCR_PHASES } from "@/lib/data/ocr-phases";
import FennecMascot from "@/components/mascot";

const TOTAL = OCR_PHASES.reduce((s, p) => s + p.weeks.reduce((s2, w) => s2 + w.tasks.length, 0), 0);
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function darken(hex: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * 0.78);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * 0.78);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * 0.78);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function StatsTab() {
  const { completed } = useProgress();
  const { streak } = useStreak();

  const cc = Object.values(completed).filter(Boolean).length;
  const pct = TOTAL > 0 ? Math.round(cc / TOTAL * 100) : 0;
  const xp = cc * 50; // 50XP per OCR project (weighted more)

  // Salary estimation based on OCR program completion
  const sal = pct < 15 ? "40-45k" : pct < 35 ? "48-55k" : pct < 55 ? "55-65k" : pct < 75 ? "65-75k" : "75-95k";

  // Per-bloc completion
  const blocStats = OCR_PHASES.map(p => {
    const tasks = p.weeks.flatMap(w => w.tasks);
    const done = tasks.filter(t => completed[t.id]).length;
    const pctBloc = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    return { id: p.id, label: p.icon + " " + p.title.split(" ")[0], color: p.color, colorD: darken(p.color), value: pctBloc, done, total: tasks.length };
  });

  // Activity by day label (based on task.day field)
  const weeklyData = DAYS.map(d => ({
    label: d,
    value: OCR_PHASES.flatMap(p => p.weeks.flatMap(w => w.tasks)).filter(t => t.day === d && completed[t.id]).length,
    color: "var(--c-01)", colorD: "var(--c-01-d)",
  }));

  const statCards = [
    { label: "Streak actuel",  value: streak.current_streak, unit: "j",   sub: "jours consécutifs 🔥", valColor: "var(--flame)" },
    { label: "Record perso",   value: streak.longest_streak, unit: "j",   sub: "meilleure série",       valColor: "var(--ink)" },
    { label: "XP total",       value: xp,                    unit: "pts", sub: "50 XP par projet",      valColor: "var(--gem-d)" },
    { label: "Projets OCR",    value: cc,                    unit: `/${TOTAL}`, sub: `${pct}% du parcours`, valColor: "var(--primary-dark)" },
  ];

  return (
    <div style={{ paddingTop: 8 }}>

      {/* ── Hero ── */}
      <div style={{
        display: "flex", gap: 20, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
        marginBottom: 20, padding: "22px 20px",
        background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, var(--bg-soft)), var(--bg-soft))",
        border: "2px solid var(--line)", borderRadius: "var(--r-xl)",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
            Progression globale · RNCP 35288
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(44px,7vw,68px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
            {pct}<span style={{ fontSize: "0.38em", color: "var(--primary-dark)", marginLeft: 4 }}>%</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginTop: 8 }}>
            <strong>{cc}</strong> projets terminés sur {TOTAL}. <strong>{TOTAL - cc}</strong> restants.
          </div>
        </div>
        <FennecMascot size={88} />
      </div>

      {/* ── Stat cards — 2 cols on mobile, 4 on desktop ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12, marginBottom: 20,
      }}>
        {statCards.map(c => (
          <div key={c.label} style={{
            background: "var(--surface)", border: "2px solid var(--line)",
            borderRadius: "var(--r-lg)", padding: "16px 14px", boxShadow: "0 3px 0 var(--line-2)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              {c.label}
            </div>
            <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(22px,4vw,28px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, color: c.valColor, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "baseline", gap: 3 }}>
              {c.value}
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-mute)" }}>{c.unit}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Bloc progression ── */}
      <div style={{
        background: "var(--surface)", border: "2px solid var(--line)",
        borderRadius: "var(--r-xl)", padding: "18px 18px", marginBottom: 14,
        boxShadow: "0 3px 0 var(--line-2)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          Progression par bloc
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {blocStats.map(b => (
            <div key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{b.label}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>
                  {b.done}/{b.total} · {b.value}%
                </span>
              </div>
              <div style={{ height: 10, background: "var(--line)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: b.value + "%",
                  background: b.color, borderRadius: 99,
                  transition: "width 0.7s cubic-bezier(0.34, 1.4, 0.64, 1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity chart ── */}
      <ChartCard title="Activité par jour" meta="Projets complétés" data={weeklyData} />

      {/* ── Salary card ── */}
      <div style={{
        background: "linear-gradient(135deg, color-mix(in oklab, var(--gold) 16%, var(--bg-soft)), var(--surface))",
        border: "2px solid var(--gold)", borderRadius: "var(--r-xl)",
        padding: "20px 20px", boxShadow: "0 3px 0 var(--gold-d)",
        display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
            Valeur marché Data Engineer
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
            {sal}<span style={{ fontSize: "0.42em", color: "var(--gold-d)", marginLeft: 6 }}>€/an</span>
          </div>
          <div style={{ marginTop: 14, height: 12, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, var(--c-04), var(--gold), var(--c-01))", borderRadius: 99, transition: "width 0.7s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 10, fontWeight: 700, color: "var(--ink-mute)", marginTop: 4 }}>
            <span>40k</span><span>50k</span><span>65k</span><span>80k</span><span>95k+</span>
          </div>
        </div>
        <div style={{ fontSize: 48, flexShrink: 0 }}>💰</div>
      </div>
    </div>
  );
}

function ChartCard({ title, meta, data, max, suffix = "" }: {
  title: string; meta: string;
  data: { label: string; value: number; color: string; colorD: string }[];
  max?: number; suffix?: string;
}) {
  const m = max ?? Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ background: "var(--surface)", border: "2px solid var(--line)", borderRadius: "var(--r-xl)", padding: "18px 18px", marginBottom: 14, boxShadow: "0 3px 0 var(--line-2)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{title}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-mute)" }}>{meta}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
        {data.map((d, i) => {
          const h = Math.max((d.value / m) * 100, 2);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", minWidth: 0 }}>
              <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
                <div style={{
                  width: "100%", background: d.color,
                  border: `2px solid ${d.colorD}`, borderRadius: "6px 6px 0 0",
                  height: h + "%", minHeight: 4, position: "relative",
                  transition: "height 0.6s cubic-bezier(0.34, 1.4, 0.64, 1)",
                }}>
                  {d.value > 0 && (
                    <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 800, color: "var(--ink)", paddingBottom: 3, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {d.value}{suffix}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
