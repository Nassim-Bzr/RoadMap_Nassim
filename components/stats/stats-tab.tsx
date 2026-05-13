"use client";

import { useProgress } from "@/hooks/use-progress";
import { useStreak } from "@/hooks/use-streak";
import { ALL_PHASES, DATA_PHASES, DEV_PHASES, TOTAL_TASKS, DATA_TOTAL, DEV_TOTAL } from "@/lib/data";
import FennecMascot from "@/components/mascot";

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
  const pct = TOTAL_TASKS > 0 ? Math.round(cc / TOTAL_TASKS * 100) : 0;
  const xp = cc * 15;
  const sal = pct < 10 ? "40-45k" : pct < 25 ? "50-60k" : pct < 45 ? "60-70k" : pct < 70 ? "70-85k" : "80-100k";

  const dataCount = DATA_PHASES.reduce((s, p) => s + p.weeks.reduce((s2, w) => s2 + w.tasks.filter(t => completed[t.id]).length, 0), 0);
  const devCount = DEV_PHASES.reduce((s, p) => s + p.weeks.reduce((s2, w) => s2 + w.tasks.filter(t => completed[t.id]).length, 0), 0);

  const weeklyData = DAYS.map(d => ({
    label: d,
    value: ALL_PHASES.flatMap(p => p.weeks.flatMap(w => w.tasks)).filter(t => t.day === d && completed[t.id]).length,
    color: "var(--c-01)", colorD: "var(--c-01-d)",
  }));

  const phaseData = ALL_PHASES.map(p => {
    const tasks = p.weeks.flatMap(w => w.tasks);
    const done = tasks.filter(t => completed[t.id]).length;
    return { label: p.icon, value: tasks.length ? Math.round(done / tasks.length * 100) : 0, color: p.color, colorD: darken(p.color) };
  });

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center",
        marginBottom: 24, padding: "24px 28px",
        background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, var(--bg-soft)), var(--bg-soft))",
        border: "2px solid var(--line)", borderRadius: "var(--r-xl)",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
            Progression globale
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(48px,7vw,72px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
            {pct}<span style={{ fontSize: "0.4em", color: "var(--primary-dark)", marginLeft: 4 }}>%</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginTop: 10, maxWidth: "32ch" }}>
            <strong>{cc}</strong> leçons terminées sur {TOTAL_TASKS}. {TOTAL_TASKS - cc} restantes pour le 100%.
          </div>
        </div>
        <FennecMascot size={100} />
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Streak actuel", value: streak.current_streak, unit: "jours", sub: "consécutifs 🔥", valColor: "var(--flame)" },
          { label: "Record perso",  value: streak.longest_streak, unit: "jours", sub: "tenu le plus longtemps", valColor: "var(--ink)" },
          { label: "XP total",      value: xp, unit: "pts", sub: "15 XP par leçon", valColor: "var(--gem-d)" },
          { label: "Track Data",    value: dataCount, unit: `/ ${DATA_TOTAL}`, sub: `${Math.round(dataCount / DATA_TOTAL * 100)}% complet`, valColor: "var(--primary-dark)" },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--surface)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18, boxShadow: "0 3px 0 var(--line-2)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: "var(--f-sans)", fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, color: c.valColor, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "baseline", gap: 4 }}>
              {c.value}
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-mute)" }}>{c.unit}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <ChartCard title="Activité par jour" meta="Tâches complétées" data={weeklyData} />
      <ChartCard title="Progression par section" meta="% complétés" data={phaseData} max={100} suffix="%" />

      {/* Salary card */}
      <div style={{
        background: "linear-gradient(135deg, color-mix(in oklab, var(--gold) 16%, var(--bg-soft)), var(--surface))",
        border: "2px solid var(--gold)", borderRadius: "var(--r-xl)",
        padding: "24px 26px", boxShadow: "0 3px 0 var(--gold-d)",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
            Valeur estimée du profil
          </div>
          <div style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
            {sal}<span style={{ fontSize: "0.45em", color: "var(--gold-d)", marginLeft: 6 }}>€/an</span>
          </div>
          <div style={{ marginTop: 16, height: 14, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, var(--c-04), var(--gold), var(--c-01))", borderRadius: 99, transition: "width 0.7s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 700, color: "var(--ink-mute)", marginTop: 4 }}>
            <span>40k</span><span>55k</span><span>70k</span><span>85k</span><span>100k+</span>
          </div>
        </div>
        <div style={{ fontSize: 56, flexShrink: 0 }}>💰</div>
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
    <div style={{ background: "var(--surface)", border: "2px solid var(--line)", borderRadius: "var(--r-xl)", padding: "22px 24px", marginBottom: 14, boxShadow: "0 3px 0 var(--line-2)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.005em" }}>{title}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-mute)" }}>{meta}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingTop: 24 }}>
        {data.map((d, i) => {
          const h = Math.max((d.value / m) * 100, 2);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", minWidth: 0 }}>
              <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
                <div style={{
                  width: "100%", background: d.color,
                  border: `2px solid ${d.colorD}`, borderRadius: "8px 8px 0 0",
                  height: h + "%", minHeight: 4, position: "relative",
                  boxShadow: `0 -2px 0 ${d.colorD} inset`,
                  transition: "height 0.6s cubic-bezier(0.34, 1.4, 0.64, 1)",
                }}>
                  {d.value > 0 && (
                    <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", fontSize: 11, fontWeight: 800, color: "var(--ink)", paddingBottom: 4, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {d.value}{suffix}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
