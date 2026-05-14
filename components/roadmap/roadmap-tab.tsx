"use client";

import { useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { usePomodoroContext } from "@/components/pomodoro/pomodoro-context";
import { OCR_PHASES } from "@/lib/data/ocr-phases";
import { ProjectChat } from "@/components/roadmap/project-chat";
import type { Phase, Task } from "@/lib/data/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function darken(hex: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * 0.78);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * 0.78);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * 0.78);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lighten(hex: string, alpha = 0.12): string {
  return `color-mix(in oklab, ${hex} ${Math.round(alpha * 100)}%, white)`;
}

// Level badge based on phase index
const LEVEL_INFO = [
  { label: "Junior", badge: "🥉", desc: "Niveau débutant" },
  { label: "Intermédiaire", badge: "🥈", desc: "Niveau avancé" },
  { label: "Confirmé", badge: "🥇", desc: "Niveau confirmé" },
  { label: "Expert", badge: "🏆", desc: "Niveau expert" },
];

const BLOC_HOURS = [113, 190, 130, 170];
const BLOC_SKILLS: Record<string, string[]> = {
  ocr1: ["Python", "SQL", "Pandas", "EDA", "RGPD", "PostgreSQL"],
  ocr2: ["Docker", "MongoDB", "LightGBM", "SHAP", "MLflow", "AWS"],
  ocr3: ["Spark", "PySpark", "Redpanda", "Kestra", "DuckDB", "Delta Lake"],
  ocr4: ["LangChain", "RAG", "Mistral", "LangGraph", "LoRA", "MLOps"],
};

// ── Main component ────────────────────────────────────────────────────────────

export default function RoadmapTab() {
  const { completed, toggle } = useProgress();
  const { start: startPomo } = usePomodoroContext();
  const [activePhaseId, setActivePhaseId] = useState<string>("ocr1");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const activePhase = OCR_PHASES.find(p => p.id === activePhaseId) ?? OCR_PHASES[0];
  const phaseIndex = OCR_PHASES.findIndex(p => p.id === activePhaseId);
  const allTasks = OCR_PHASES.flatMap(p => p.weeks.flatMap(w => w.tasks));
  const totalDone = allTasks.filter(t => completed[t.id]).length;
  const globalPct = Math.round(totalDone / allTasks.length * 100);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 0 60px" }}>

      {/* ── Global progress header ── */}
      <GlobalProgressHeader
        phases={OCR_PHASES}
        completed={completed}
        totalDone={totalDone}
        totalTasks={allTasks.length}
        globalPct={globalPct}
      />

      {/* ── Phase navigation pills ── */}
      <PhaseNav
        phases={OCR_PHASES}
        activeId={activePhaseId}
        completed={completed}
        onSelect={id => { setActivePhaseId(id); setOpenTaskId(null); }}
      />

      {/* ── Active bloc content ── */}
      <BlocView
        phase={activePhase}
        phaseIndex={phaseIndex}
        completed={completed}
        openTaskId={openTaskId}
        setOpenTaskId={setOpenTaskId}
        toggle={toggle}
        startPomo={startPomo}
      />
    </div>
  );
}

// ── Global Progress Header ────────────────────────────────────────────────────

function GlobalProgressHeader({
  phases, completed, totalDone, totalTasks, globalPct,
}: {
  phases: Phase[];
  completed: Record<string, boolean>;
  totalDone: number;
  totalTasks: number;
  globalPct: number;
}) {
  const totalHours = BLOC_HOURS.reduce((s, h) => s + h, 0);

  return (
    <div style={{
      background: "var(--surface)",
      border: "2px solid var(--line)",
      borderRadius: "var(--r-xl)",
      boxShadow: "0 4px 0 var(--line-2)",
      padding: "28px 32px",
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        {/* Left: title + description */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B47, #E94B7C)",
              display: "grid", placeItems: "center", fontSize: 18,
            }}>🎓</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                Formation certifiante · RNCP 35288
              </div>
              <h2 style={{ fontFamily: "var(--f-sans)", fontSize: 18, fontWeight: 900, margin: 0, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                Data Engineer
              </h2>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", fontWeight: 600, maxWidth: 420 }}>
            4 blocs de compétences RNCP · 13 projets concrets · {totalHours}h supervisées
          </p>
        </div>

        {/* Right: global stats */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {phases.map((p, i) => {
            const pTasks = p.weeks.flatMap(w => w.tasks);
            const pDone = pTasks.filter(t => completed[t.id]).length;
            const pct = pTasks.length ? Math.round(pDone / pTasks.length * 100) : 0;
            return (
              <div key={p.id} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{LEVEL_INFO[i]?.badge}</div>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `conic-gradient(${p.color} ${pct * 3.6}deg, var(--line) 0deg)`,
                  display: "grid", placeItems: "center",
                  margin: "0 auto 4px",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--surface)",
                    display: "grid", placeItems: "center",
                    fontSize: 10, fontWeight: 900, color: p.color,
                  }}>{pct}%</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {LEVEL_INFO[i]?.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-3)" }}>Progression globale</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "var(--primary)" }}>{totalDone}/{totalTasks} projets · {globalPct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--line)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${globalPct}%`,
            background: "linear-gradient(90deg, #FF6B47, #F4A437, #9B7EE5, #E94B7C)",
            borderRadius: 99,
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Phase Navigation ──────────────────────────────────────────────────────────

function PhaseNav({ phases, activeId, completed, onSelect }: {
  phases: Phase[];
  activeId: string;
  completed: Record<string, boolean>;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
      {phases.map((p, i) => {
        const tasks = p.weeks.flatMap(w => w.tasks);
        const done = tasks.filter(t => completed[t.id]).length;
        const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
        const isActive = p.id === activeId;
        const isComplete = pct === 100;

        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              gap: 4, padding: "12px 16px", flexShrink: 0,
              background: isActive ? p.color : "var(--surface)",
              border: `2px solid ${isActive ? darken(p.color) : "var(--line)"}`,
              boxShadow: `0 3px 0 ${isActive ? darken(p.color) : "var(--line-2)"}`,
              borderRadius: "var(--r-md)",
              cursor: "pointer",
              transition: "all 0.12s",
              minWidth: 160,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 900,
                  color: isActive ? "white" : "var(--ink)",
                  letterSpacing: "-0.01em",
                }}>{p.title}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: isActive ? "rgba(255,255,255,0.75)" : "var(--ink-mute)",
                }}>{BLOC_HOURS[i]}h · {LEVEL_INFO[i]?.label}</div>
              </div>
              {isComplete && <span style={{ marginLeft: "auto", fontSize: 14 }}>✅</span>}
            </div>
            {/* Mini progress bar */}
            <div style={{ width: "100%", height: 3, background: isActive ? "rgba(255,255,255,0.25)" : "var(--line)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: isActive ? "white" : p.color, borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Bloc View ─────────────────────────────────────────────────────────────────

function BlocView({
  phase, phaseIndex, completed, openTaskId, setOpenTaskId, toggle, startPomo,
}: {
  phase: Phase;
  phaseIndex: number;
  completed: Record<string, boolean>;
  openTaskId: string | null;
  setOpenTaskId: (id: string | null) => void;
  toggle: (id: string) => void;
  startPomo: (label: string) => void;
}) {
  const allTasks = phase.weeks.flatMap(w => w.tasks);
  const doneCount = allTasks.filter(t => completed[t.id]).length;
  const donePct = allTasks.length ? Math.round(doneCount / allTasks.length * 100) : 0;
  const phaseD = darken(phase.color);
  const levelInfo = LEVEL_INFO[phaseIndex] ?? LEVEL_INFO[0];
  const skills = BLOC_SKILLS[phase.id] ?? [];

  return (
    <div>
      {/* ── Bloc Header (OCR-style) ── */}
      <div style={{
        background: phase.color,
        border: `2px solid ${phaseD}`,
        borderRadius: "var(--r-xl)",
        boxShadow: `0 5px 0 ${phaseD}`,
        padding: "28px 32px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}>
        {/* Background gradient orb */}
        <div style={{
          position: "absolute", right: -60, top: -60,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div>
            {/* Bloc badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                padding: "3px 10px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: 99,
                fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {levelInfo.badge} Bloc {phaseIndex + 1} — {levelInfo.label}
              </div>
              <div style={{
                padding: "3px 10px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 99,
                fontSize: 10, fontWeight: 900,
              }}>
                {BLOC_HOURS[phaseIndex]}h supervisées
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--f-sans)", fontSize: "clamp(22px,4vw,28px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {phase.title}
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, opacity: 0.9 }}>
              {phase.subtitle}
            </p>
            {/* Skills chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map(s => (
                <span key={s} style={{
                  padding: "3px 10px",
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 99,
                  fontSize: 11, fontWeight: 800,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Progress ring */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ProgressRing pct={donePct} color="white" size={80} />
            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, marginTop: 6 }}>
              {doneCount}/{allTasks.length} projets
            </div>
          </div>
        </div>
      </div>

      {/* ── Projects list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {phase.weeks.flatMap(week =>
          week.tasks.map((task, ti) => {
            const globalTasks = phase.weeks.flatMap(w => w.tasks);
            const globalIdx = globalTasks.findIndex(t => t.id === task.id);
            const prevTask = globalTasks[globalIdx - 1];
            const isDone = !!completed[task.id];
            const isPrev = !!prevTask;
            const isLocked = !isDone && isPrev && !completed[prevTask.id];
            const isCurrent = !isDone && (!isPrev || completed[prevTask.id]);
            const isOpen = openTaskId === task.id;

            return (
              <ProjectCard
                key={task.id}
                task={task}
                phase={phase}
                index={globalIdx}
                isDone={isDone}
                isLocked={isLocked}
                isCurrent={isCurrent}
                isOpen={isOpen}
                onOpen={() => setOpenTaskId(isOpen ? null : task.id)}
                onClose={() => setOpenTaskId(null)}
                onToggle={() => toggle(task.id)}
                onPomo={() => startPomo(task.label)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Project Card (OpenClassrooms style) ──────────────────────────────────────

function ProjectCard({
  task, phase, index, isDone, isLocked, isCurrent, isOpen,
  onOpen, onClose, onToggle, onPomo,
}: {
  task: Task;
  phase: Phase;
  index: number;
  isDone: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onPomo: () => void;
}) {
  const phaseD = darken(phase.color);

  return (
    <div style={{ animation: "fadeSlideIn 0.2s ease" }}>
      {/* Card header row */}
      <div
        onClick={() => !isLocked && onOpen()}
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr auto",
          gap: 16,
          alignItems: "center",
          padding: "18px 20px",
          background: isDone
            ? `color-mix(in oklab, ${phase.color} 6%, white)`
            : "var(--surface)",
          border: `2px solid ${isDone ? phase.color : isCurrent ? phase.color : "var(--line)"}`,
          borderRadius: isOpen ? "var(--r-lg) var(--r-lg) 0 0" : "var(--r-lg)",
          boxShadow: isDone
            ? `0 3px 0 color-mix(in oklab, ${phase.color} 25%, transparent)`
            : `0 3px 0 var(--line-2)`,
          cursor: isLocked ? "not-allowed" : "pointer",
          opacity: isLocked ? 0.55 : 1,
          transition: "all 0.15s",
          userSelect: "none",
        }}
      >
        {/* Step circle */}
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: isDone
            ? phase.color
            : isLocked ? "var(--line)" : "var(--surface)",
          border: `3px solid ${isDone ? phaseD : isLocked ? "var(--line-2)" : phase.color}`,
          boxShadow: isDone ? `0 3px 0 ${phaseD}` : isCurrent ? `0 0 0 4px color-mix(in oklab, ${phase.color} 20%, transparent)` : "none",
          display: "grid", placeItems: "center",
          fontSize: isDone ? 20 : 15,
          fontWeight: 900,
          color: isDone ? "white" : isLocked ? "var(--ink-mute)" : phase.color,
          flexShrink: 0,
          transition: "all 0.2s",
        }}>
          {isDone ? "✓" : isLocked ? "🔒" : index + 1}
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {isCurrent && !isDone && (
              <span style={{
                padding: "2px 8px", borderRadius: 99,
                background: phase.color, color: "white",
                fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                En cours
              </span>
            )}
            {isDone && (
              <span style={{
                padding: "2px 8px", borderRadius: 99,
                background: `color-mix(in oklab, ${phase.color} 15%, white)`,
                color: phase.color,
                fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Terminé ✓
              </span>
            )}
            <span style={{
              fontFamily: "var(--f-mono)", fontSize: 10, fontWeight: 700,
              color: "var(--ink-mute)",
            }}>
              {task.day}
            </span>
          </div>
          <div style={{
            fontSize: 15, fontWeight: 800,
            color: isLocked ? "var(--ink-mute)" : "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}>
            {task.label}
          </div>
          {task.description && !isOpen && (
            <div style={{
              fontSize: 12, color: "var(--ink-3)", fontWeight: 600,
              marginTop: 4, lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {task.description}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "var(--bg-soft)", border: "2px solid var(--line)",
          display: "grid", placeItems: "center",
          fontSize: 14, color: "var(--ink-3)",
          transform: isOpen ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
          flexShrink: 0,
        }}>
          ↓
        </div>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <ProjectPanel
          task={task}
          phase={phase}
          isDone={isDone}
          onClose={onClose}
          onToggle={onToggle}
          onPomo={onPomo}
        />
      )}
    </div>
  );
}

// ── Project Panel (expanded) ──────────────────────────────────────────────────

function ProjectPanel({ task, phase, isDone, onClose, onToggle, onPomo }: {
  task: Task;
  phase: Phase;
  isDone: boolean;
  onClose: () => void;
  onToggle: () => void;
  onPomo: () => void;
}) {
  const phaseD = darken(phase.color);

  return (
    <div style={{
      background: "var(--surface)",
      border: `2px solid ${phase.color}`,
      borderTop: "none",
      borderRadius: "0 0 var(--r-lg) var(--r-lg)",
      overflow: "hidden",
      animation: "drawer-open 0.25s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Tabs row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "2px solid var(--line)" }}>
        <div style={{ padding: "14px 20px", borderRight: "2px solid var(--line)" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6 }}>
            📋 Mission
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", lineHeight: 1.55 }}>
            {task.description}
          </p>
        </div>
        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6 }}>
            💻 Exercice pratique
          </div>
          <pre style={{
            margin: 0, fontSize: 11,
            background: "var(--ink)", color: "#F5EFE0",
            borderRadius: "var(--r-sm)", padding: "12px 14px",
            maxHeight: 200, overflowY: "auto",
          }}>
            {task.exercise}
          </pre>
        </div>
      </div>

      <div style={{ padding: "18px 20px", display: "grid", gap: 16 }}>
        {/* Resources */}
        {task.resources && task.resources.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 10 }}>
              📚 Ressources ({task.resources.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {task.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px",
                    background: "var(--bg)", border: "2px solid var(--line)",
                    borderRadius: "var(--r-sm)", color: "var(--ink)",
                    textDecoration: "none", transition: "border-color 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = phase.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {r.type === "video" ? "🎬" : r.type === "doc" ? "📖" : r.type === "github" ? "⚙️" : r.type === "course" ? "🎓" : r.type === "tool" ? "🔧" : r.type === "book" ? "📕" : "🔗"}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--f-mono)" }}>
                      {r.type}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Primary resource link */}
        {task.url && !task.resources && (
          <a
            href={task.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: "var(--bg)", border: "2px solid var(--line)", borderRadius: "var(--r-md)",
              color: "var(--ink)", textDecoration: "none",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in oklab, ${phase.color} 12%, white)`, display: "grid", placeItems: "center", fontSize: 18 }}>📖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{task.resource || "Voir la ressource"}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)" }}>{task.url}</div>
            </div>
          </a>
        )}

        {/* AI Chat */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 8 }}>
            🤖 Assistant IA
          </div>
          <ProjectChat taskId={task.id} taskLabel={task.label} phaseColor={phase.color} />
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        display: "flex", gap: 10, padding: "14px 20px",
        background: "var(--surface-2)", borderTop: "2px solid var(--line)",
      }}>
        <button
          onClick={onPomo}
          style={{
            flex: 1, padding: "10px 16px",
            background: "var(--surface)", border: "2px solid var(--line)",
            boxShadow: "0 3px 0 var(--line-2)", borderRadius: "var(--r-md)",
            fontSize: 12, fontWeight: 800, color: "var(--ink-3)",
            cursor: "pointer", transition: "all 0.1s", fontFamily: "var(--f-sans)",
          }}
        >
          ⏱ Pomodoro 25 min
        </button>
        <button
          onClick={onToggle}
          style={{
            flex: 2, padding: "10px 16px",
            background: isDone ? `color-mix(in oklab, ${phase.color} 12%, white)` : phase.color,
            border: `2px solid ${phaseD}`,
            boxShadow: `0 3px 0 ${phaseD}`,
            borderRadius: "var(--r-md)",
            fontSize: 13, fontWeight: 900, color: isDone ? phase.color : "white",
            cursor: "pointer", transition: "all 0.1s", fontFamily: "var(--f-sans)",
            letterSpacing: "0.02em",
          }}
        >
          {isDone ? "↺ Recommencer" : "✓ Marquer comme terminé"}
        </button>
      </div>
    </div>
  );
}

// ── Progress Ring SVG ─────────────────────────────────────────────────────────

function ProgressRing({ pct, color, size = 60 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={13} fontWeight={900}
        style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {pct}%
      </text>
    </svg>
  );
}
