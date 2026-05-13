"use client";

import { useState, Fragment } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useNotes } from "@/hooks/use-notes";
import { usePomodoroContext } from "@/components/pomodoro/pomodoro-context";
import { ALL_PHASES, DATA_PHASES, DEV_PHASES, ROADMAPSH_PHASES } from "@/lib/data";
import type { Phase, Task } from "@/lib/data/types";
import FennecMascot from "@/components/mascot";

function darken(hex: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * 0.78);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * 0.78);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * 0.78);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const TRACKS = [
  { id: "data",      label: "Data Eng",     phases: DATA_PHASES },
  { id: "dev",       label: "Backend / FS", phases: DEV_PHASES },
  { id: "roadmapsh", label: "Roadmap.sh",   phases: ROADMAPSH_PHASES },
  { id: "all",       label: "Tout",         phases: ALL_PHASES },
];

export default function RoadmapTab() {
  const { completed, toggle } = useProgress();
  const { notes, saveNote } = useNotes();
  const { start: startPomo } = usePomodoroContext();
  const [track, setTrack] = useState("data");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const phases = TRACKS.find(t => t.id === track)?.phases ?? DATA_PHASES;

  // set default active phase when track changes
  const effectivePhaseId = activePhaseId ?? phases[0]?.id;
  const activePhase = phases.find(p => p.id === effectivePhaseId) ?? phases[0];

  return (
    <div>
      {/* Track segmented */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, marginTop: 8, border: "2px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "0 2px 0 var(--line-2)", background: "var(--surface)" }}>
        {TRACKS.map(t => {
          const isActive = track === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTrack(t.id); setActivePhaseId(null); setOpenTaskId(null); }}
              style={{
                flex: 1, padding: "10px 8px", background: isActive ? "var(--primary)" : "transparent",
                border: "none", borderRight: "2px solid var(--line)",
                color: isActive ? "white" : "var(--ink-3)",
                fontSize: 12, fontWeight: 800, cursor: "pointer",
                transition: "all 0.12s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Phase strip */}
      <div style={{ display: "flex", gap: 10, paddingBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
        {phases.map(p => {
          const tasks = p.weeks.flatMap(w => w.tasks);
          const done = tasks.filter(t => completed[t.id]).length;
          const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
          const isActive = p.id === effectivePhaseId;
          return (
            <button
              key={p.id}
              onClick={() => { setActivePhaseId(p.id); setOpenTaskId(null); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "10px 16px 10px 12px",
                borderRadius: "var(--r-md)",
                background: isActive ? p.color : "var(--surface)",
                border: `2px solid ${isActive ? darken(p.color) : "var(--line)"}`,
                boxShadow: `0 3px 0 ${isActive ? darken(p.color) : "var(--line-2)"}`,
                color: isActive ? "white" : "var(--ink-3)",
                whiteSpace: "nowrap", fontWeight: 800, fontSize: 13,
                cursor: "pointer", transition: "all 0.12s",
                flexShrink: 0,
              }}
            >
              <span style={{
                display: "grid", placeItems: "center",
                width: 26, height: 26, borderRadius: 8,
                background: isActive ? "rgba(255,255,255,0.2)" : "var(--bg-soft)",
                color: isActive ? "white" : "var(--ink-2)",
                fontSize: 12, fontWeight: 900,
              }}>{p.icon}</span>
              <span>{p.title.split(" ").slice(0, 2).join(" ")}</span>
              <span style={{ fontSize: 11, fontWeight: 800, opacity: isActive ? 0.85 : undefined, color: isActive ? undefined : "var(--ink-mute)" }}>{pct}%</span>
            </button>
          );
        })}
      </div>

      {activePhase && (
        <PhaseView
          phase={activePhase}
          completed={completed}
          notes={notes}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          openTaskId={openTaskId}
          setOpenTaskId={setOpenTaskId}
          toggle={toggle}
          saveNote={saveNote}
          startPomo={startPomo}
        />
      )}
    </div>
  );
}

function PhaseView({
  phase, completed, notes, search, setSearch, filter, setFilter,
  openTaskId, setOpenTaskId, toggle, saveNote, startPomo,
}: {
  phase: Phase;
  completed: Record<string, boolean>;
  notes: Record<string, string>;
  search: string; setSearch: (s: string) => void;
  filter: string; setFilter: (f: string) => void;
  openTaskId: string | null; setOpenTaskId: (id: string | null) => void;
  toggle: (id: string) => void;
  saveNote: (id: string, text: string) => void;
  startPomo: (label: string) => void;
}) {
  const allTasks = phase.weeks.flatMap(w => w.tasks);
  const donePct = allTasks.length ? Math.round(allTasks.filter(t => completed[t.id]).length / allTasks.length * 100) : 0;
  const doneCount = allTasks.filter(t => completed[t.id]).length;
  const phaseD = darken(phase.color);
  const currentTaskId = allTasks.find(t => !completed[t.id])?.id;

  return (
    <div>
      {/* Unit header */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: phase.color, border: `2px solid ${phaseD}`,
        borderRadius: "var(--r-lg)", boxShadow: `0 4px 0 ${phaseD}`,
        padding: "22px 28px", marginBottom: 28, color: "white",
      }}>
        <div style={{ position: "absolute", inset: "-40% -10% auto auto", width: "60%", height: "100%", background: "radial-gradient(closest-side, rgba(255,255,255,0.18), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.85, marginBottom: 6 }}>
              Section {phase.icon} · {phase.period}
            </div>
            <h2 style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, letterSpacing: "-0.02em", margin: "0 0 6px", lineHeight: 1.1 }}>
              {phase.title}
            </h2>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>{phase.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <div style={{ fontFamily: "var(--f-sans)", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{donePct}%</div>
              <div style={{ width: 140, height: 10, background: "rgba(0,0,0,0.18)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: donePct + "%", background: "white", borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85 }}>{doneCount}/{allTasks.length} leçons</div>
            </div>
            <FennecMascot size={72} />
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flex: "1 1 240px",
          height: 44, padding: "0 16px",
          background: "var(--surface)", border: "2px solid var(--line)",
          borderRadius: "var(--r-md)", boxShadow: "0 2px 0 var(--line-2)",
        }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une leçon…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--f-sans)" }}
          />
        </div>
        <div style={{ display: "flex", border: "2px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--surface)", boxShadow: "0 2px 0 var(--line-2)" }}>
          {["all", "todo", "done"].map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0 16px", height: 44, fontSize: 12, fontWeight: 800,
                background: filter === f ? "var(--primary)" : "transparent",
                color: filter === f ? "white" : "var(--ink-3)",
                border: "none", borderRight: i < 2 ? "2px solid var(--line)" : "none",
                cursor: "pointer", transition: "all 0.12s",
              }}
            >
              {f === "all" ? "Toutes" : f === "todo" ? "À faire" : "Faites"}
            </button>
          ))}
        </div>
      </div>

      {/* Path tree */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 40 }}>
        {phase.weeks.map((week, wi) => {
          const visibleTasks = week.tasks.filter(t => {
            if (search && !t.label.toLowerCase().includes(search.toLowerCase())) return false;
            if (filter === "done" && !completed[t.id]) return false;
            if (filter === "todo" && completed[t.id]) return false;
            return true;
          });
          if (search && visibleTasks.length === 0) return null;

          return (
            <div key={week.id} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {/* Week banner */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 18px", marginTop: 16, marginBottom: 8,
                background: "var(--surface)", border: "2px solid var(--line)",
                borderRadius: "var(--r-md)", boxShadow: "0 3px 0 var(--line-2)",
                position: "relative",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.color }}>
                  Semaine {wi + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{week.title}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
                  {week.tasks.filter(t => completed[t.id]).length}/{week.tasks.length}
                </span>
              </div>

              {/* Nodes */}
              {visibleTasks.map((task, ti) => {
                const isDone = !!completed[task.id];
                const isCurrent = task.id === currentTaskId;
                const indexInPhase = allTasks.findIndex(t => t.id === task.id);
                const prev = allTasks[indexInPhase - 1];
                const isLocked = !isDone && !isCurrent && !!prev && !completed[prev.id] && filter === "all" && !search;
                const pos = ti % 8;
                const offsets = [0, 70, 100, 70, 0, -70, -100, -70];
                const xOffset = offsets[pos];
                const isOpen = openTaskId === task.id;

                return (
                  <Fragment key={task.id}>
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      position: "relative",
                      transform: `translateX(${xOffset}px)`,
                      transition: "transform 0.12s",
                    }}>
                      <button
                        onClick={() => !isLocked && setOpenTaskId(isOpen ? null : task.id)}
                        style={{
                          position: "relative",
                          width: 78, height: 78, borderRadius: "50%",
                          background: isLocked ? "var(--line)" : phase.color,
                          border: `4px solid ${isLocked ? "var(--line-2)" : phaseD}`,
                          boxShadow: `0 6px 0 ${isLocked ? "var(--line-2)" : phaseD}${isDone ? ", 0 0 0 8px rgba(255,200,87,0.3)" : ""}`,
                          display: "grid", placeItems: "center",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          color: isLocked ? "var(--ink-mute)" : "white",
                          fontSize: 28,
                          transition: "transform 0.08s, box-shadow 0.08s",
                          animation: isCurrent && !isDone ? "node-pulse 1.6s ease infinite" : undefined,
                          outline: isDone ? "3px solid var(--gold)" : "none",
                          outlineOffset: isDone ? 3 : 0,
                        }}
                        title={task.label}
                      >
                        {isLocked ? "🔒" : isDone ? "⭐" : "📖"}
                        {isCurrent && !isDone && !isOpen && (
                          <div style={{
                            position: "absolute", top: 12, left: "calc(100% + 14px)",
                            padding: "7px 12px", background: "white",
                            border: "2px solid var(--line)", borderRadius: "var(--r-md)",
                            fontSize: 11, fontWeight: 900, color: phase.color,
                            whiteSpace: "nowrap", boxShadow: "0 3px 0 var(--line-2)",
                            letterSpacing: "0.05em", textTransform: "uppercase",
                            animation: "bubble-bounce 1.4s ease-in-out infinite",
                            zIndex: 10,
                          }}>
                            Commencer
                          </div>
                        )}
                      </button>
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-mute)", textAlign: "center", maxWidth: 90 }}>
                        {task.day} · {task.label.length > 16 ? task.label.slice(0, 14) + "…" : task.label}
                      </div>
                    </div>

                    {isOpen && (
                      <LessonDrawer
                        task={task}
                        phase={phase}
                        isDone={isDone}
                        note={notes[task.id] || ""}
                        onClose={() => setOpenTaskId(null)}
                        onToggle={() => toggle(task.id)}
                        onPomo={() => startPomo(task.label)}
                        onNote={(t) => saveNote(task.id, t)}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonDrawer({ task, phase, isDone, note, onClose, onToggle, onPomo, onNote }: {
  task: Task; phase: Phase; isDone: boolean; note: string;
  onClose: () => void; onToggle: () => void; onPomo: () => void; onNote: (t: string) => void;
}) {
  const [localNote, setLocalNote] = useState(note);
  const phaseD = darken(phase.color);

  return (
    <div style={{
      width: "100%", maxWidth: 560, margin: "16px auto 8px",
      background: "var(--surface)", border: "2px solid var(--line)",
      borderRadius: "var(--r-lg)", boxShadow: "0 4px 0 var(--line-2)",
      overflow: "hidden", animation: "drawer-open 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      {/* Banner */}
      <div style={{ padding: "16px 20px", background: phase.color, color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85, marginBottom: 4 }}>
            {task.day} · Leçon
          </div>
          <h3 style={{ fontFamily: "var(--f-sans)", fontSize: 17, fontWeight: 900, margin: 0, letterSpacing: "-0.01em" }}>{task.label}</h3>
        </div>
        <button
          onClick={onClose}
          style={{ width: 32, height: 32, background: "rgba(0,0,0,0.18)", borderRadius: 10, border: "none", display: "grid", placeItems: "center", color: "white", cursor: "pointer", fontSize: 18, flexShrink: 0 }}
        >✕</button>
      </div>

      <div style={{ padding: 22, display: "grid", gap: 18 }}>
        {/* Resource */}
        {task.url && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              📚 Ressource recommandée
            </div>
            <a
              href={task.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "var(--bg)", border: "2px solid var(--line)", borderRadius: "var(--r-md)",
                color: "var(--ink)", textDecoration: "none", transition: "border-color 0.15s",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--c-05)", display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>📖</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)", marginBottom: 2 }}>{task.resource || "Voir la ressource"}</div>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)", wordBreak: "break-all" }}>{task.url}</span>
              </div>
            </a>
          </div>
        )}

        {/* Exercise */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 8 }}>
            💻 Exercice pratique
          </div>
          <pre style={{ margin: 0 }}>{task.exercise}</pre>
        </div>

        {/* Notes */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 8 }}>
            ✏️ Mes notes
          </div>
          <textarea
            value={localNote}
            onChange={e => setLocalNote(e.target.value)}
            onBlur={() => onNote(localNote)}
            placeholder="Insights, blocages, ce que tu as appris…"
            style={{
              width: "100%", background: "var(--bg)", border: "2px solid var(--line)",
              borderRadius: "var(--r-md)", padding: "12px 14px", color: "var(--ink)",
              fontSize: 13, fontWeight: 600, lineHeight: 1.55, minHeight: 80,
              resize: "vertical", outline: "none", fontFamily: "var(--f-sans)",
              transition: "border-color 0.15s",
            }}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", gap: 10, padding: "16px 22px", background: "var(--surface-2)", borderTop: "2px solid var(--line)" }}>
        <button
          onClick={onPomo}
          className="btn-3d btn-secondary"
          style={{ flex: 1 }}
        >
          ⏱ Pomodoro 25 min
        </button>
        <button
          onClick={onToggle}
          className="btn-3d"
          style={{
            flex: 1,
            ...(isDone ? { "--btn-c": "var(--gold)", "--btn-d": "var(--gold-d)" } as React.CSSProperties : { "--btn-c": phase.color, "--btn-d": phaseD } as React.CSSProperties),
          }}
        >
          {isDone ? "✓ Refaire" : "✓ Marquer comme fait"}
        </button>
      </div>
    </div>
  );
}
