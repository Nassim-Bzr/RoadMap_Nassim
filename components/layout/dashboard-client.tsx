"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useProgress } from "@/hooks/use-progress";
import { useStreak } from "@/hooks/use-streak";
import { usePomodoro } from "@/hooks/use-pomodoro";
import { ALL_PHASES, TOTAL_TASKS } from "@/lib/data";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { PomodoroContext } from "@/components/pomodoro/pomodoro-context";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import FennecMascot from "@/components/mascot";

interface Props {
  user: User;
  children: React.ReactNode;
}

const TABS = [
  { path: "/dashboard",         label: "Parcours",  icon: "🗺" },
  { path: "/dashboard/learn",   label: "Tutor IA",  icon: "✨" },
  { path: "/dashboard/dojo",    label: "Dojo",      icon: "⚔️" },
  { path: "/dashboard/english", label: "Anglais",   icon: "🇬🇧" },
  { path: "/dashboard/math",    label: "Maths",     icon: "🧮" },
  { path: "/dashboard/stats",   label: "Stats",     icon: "📊" },
  { path: "/dashboard/journal", label: "Journal",   icon: "📔" },
];

export default function DashboardClient({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { completed, loading } = useProgress();
  const { streak, recordActivity } = useStreak();
  const pomodoro = usePomodoro();

  const cc = Object.values(completed).filter(Boolean).length;
  const xp = cc * 15;

  useEffect(() => {
    if (cc > 0) recordActivity(cc);
  }, [cc]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", gap: 16 }}>
        <div style={{ animation: "float 2s ease-in-out infinite" }}>
          <FennecMascot size={80} />
        </div>
        <div style={{ fontFamily: "var(--f-sans)", fontSize: 12, fontWeight: 800, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Chargement…
        </div>
      </div>
    );
  }

  return (
    <PomodoroContext.Provider value={pomodoro}>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

        {/* TOPBAR */}
        <header style={{
          position: "sticky", top: 0, zIndex: 60,
          background: "var(--surface)",
          borderBottom: "2px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px" }}>

            {/* Top row: brand + metrics */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 0" }}>
              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <FennecMascot size={36} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
                  <b style={{ fontFamily: "var(--f-sans)", fontSize: 16, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                    Roadmap Data Engineer
                  </b>
                </div>
              </div>

              {/* Metrics — compact on mobile */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[
                  { label: "🔥", value: streak.current_streak, color: "var(--flame)", title: "Streak" },
                  { label: "💎", value: xp,                    color: "var(--gem)",   title: "XP" },
                ].map(m => (
                  <div
                    key={m.title}
                    title={m.title}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "5px 9px",
                      borderRadius: 99, background: "var(--surface)",
                      border: "2px solid var(--line)",
                      fontFamily: "var(--f-sans)", fontWeight: 800, fontSize: 13,
                      color: m.color, cursor: "default",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{m.label}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
                  </div>
                ))}
                <button
                  onClick={handleLogout}
                  title={process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? "Mode démo" : (user.email ?? "Logout")}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--surface-2)", border: "2px solid var(--line)",
                    cursor: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? "default" : "pointer",
                    fontSize: 12, fontWeight: 700, color: "var(--ink-3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? "👤" : (user.email?.[0]?.toUpperCase() ?? "?")}
                </button>
              </div>
            </div>

            {/* Tab strip — scrollable */}
            <div style={{ display: "flex", gap: 2, paddingBottom: 10, overflowX: "auto", scrollbarWidth: "none" }}>
              {TABS.map(tb => {
                const isActive = pathname === tb.path;
                return (
                  <button
                    key={tb.path}
                    onClick={() => router.push(tb.path)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "8px 12px",
                      borderRadius: 99, flexShrink: 0,
                      border: isActive ? "2px solid var(--line)" : "2px solid transparent",
                      background: isActive ? "var(--surface)" : "transparent",
                      boxShadow: isActive ? "0 2px 0 var(--line-2)" : "none",
                      fontFamily: "var(--f-sans)", fontSize: 12, fontWeight: 800,
                      color: isActive ? "var(--ink)" : "var(--ink-3)",
                      cursor: "pointer", whiteSpace: "nowrap",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{tb.icon}</span>
                    {tb.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 16px 120px" }}>
          {children}
        </main>

        {/* POMODORO FLOATING */}
        <PomodoroTimer />
      </div>
    </PomodoroContext.Provider>
  );
}
