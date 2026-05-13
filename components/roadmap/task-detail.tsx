"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/lib/data/types";

interface Props {
  task: Task;
  phaseColor: string;
  note: string;
  onSaveNote: (taskId: string, content: string) => void;
}

const RESOURCE_ICONS: Record<string, string> = {
  doc: "📖",
  video: "📺",
  article: "✍️",
  github: "📦",
  course: "🎓",
  tool: "🔧",
  book: "📚",
};

export function TaskDetail({ task, phaseColor, note, onSaveNote }: Props) {
  const [draft, setDraft] = useState(note);
  const [showSolution, setShowSolution] = useState(false);
  useEffect(() => { setDraft(note); }, [note]);
  useEffect(() => { setShowSolution(false); }, [task.id]);

  const S = {
    wrap: { margin: "3px 0 6px 17px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, padding: 10 },
    label: { fontSize: 7, fontWeight: 700, color: phaseColor, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 4 },
    textarea: { width: "100%", background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: 6, color: "#dcd9d3", fontSize: 9, minHeight: 40, resize: "vertical" as const, outline: "none", fontFamily: "inherit" },
    pre: { fontSize: 9, color: "#cbd5e1", background: "rgba(0,0,0,0.25)", padding: 10, borderRadius: 4, overflow: "auto" as const, whiteSpace: "pre-wrap" as const, lineHeight: 1.55, margin: 0, fontFamily: "'JetBrains Mono','Fira Code',monospace" },
    solutionBtn: (open: boolean) => ({
      display: "flex" as const, alignItems: "center" as const, gap: 6,
      width: "100%", padding: "7px 10px", marginTop: 6,
      background: open ? phaseColor + "22" : "rgba(255,255,255,0.04)",
      border: "1px solid " + (open ? phaseColor + "55" : "rgba(255,255,255,0.08)"),
      borderRadius: 5, color: open ? phaseColor : "#dcd9d3",
      fontSize: 10, fontWeight: 700, cursor: "pointer" as const,
      transition: "all 0.15s",
    }),
  };

  return (
    <div className="animate-fade-slide" style={S.wrap}>
      {/* Description pédagogique */}
      {task.description && (
        <div style={{ marginBottom: 8, padding: "6px 8px", background: phaseColor + "0d", borderRadius: 4, borderLeft: "2px solid " + phaseColor + "44" }}>
          <div style={S.label}>💡 À quoi ça sert ?</div>
          <p style={{ fontSize: 9.5, color: "#cbd5e1", margin: 0, lineHeight: 1.55 }}>{task.description}</p>
        </div>
      )}

      {/* Resources (nouveau format) */}
      {task.resources && task.resources.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={S.label}>🔗 Ressources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {task.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#7ea1c4", textDecoration: "none", padding: "3px 5px", background: "rgba(255,255,255,0.025)", borderRadius: 3 }}
              >
                <span>{RESOURCE_ICONS[r.type] ?? "🔗"}</span>
                <span style={{ color: "#94a3b8", minWidth: 36 }}>{r.type}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Fallback: ancien format url + resource */}
      {(!task.resources || task.resources.length === 0) && task.url && (
        <div style={{ marginBottom: 8 }}>
          <div style={S.label}>🔗 Ressource</div>
          {task.resource && <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2 }}>{task.resource}</div>}
          <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: "#7ea1c4", wordBreak: "break-all", textDecoration: "none" }}>
            {task.url}
          </a>
        </div>
      )}

      {/* Exercise */}
      <div style={{ marginBottom: 8 }}>
        <div style={S.label}>📝 Énoncé de l&apos;exercice</div>
        <pre style={S.pre}>
          {task.exercise}
        </pre>

        {/* Solution toggle */}
        {task.solution && (
          <>
            <button
              onClick={() => setShowSolution(!showSolution)}
              style={S.solutionBtn(showSolution)}
            >
              <span style={{ display: "inline-block", transform: showSolution ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>▶</span>
              <span style={{ flex: 1, textAlign: "left" }}>
                {showSolution ? "Masquer la correction" : "✅ Afficher la correction"}
              </span>
              {!showSolution && <span style={{ fontSize: 8, color: "#6e6d72", fontWeight: 500 }}>(essaie d&apos;abord !)</span>}
            </button>

            {showSolution && (
              <div className="animate-fade-slide" style={{ marginTop: 6, padding: 8, background: phaseColor + "0a", border: "1px solid " + phaseColor + "33", borderRadius: 4 }}>
                <div style={{ ...S.label, marginBottom: 6 }}>✅ Correction commentée</div>
                <pre style={S.pre}>{task.solution}</pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notes */}
      <div>
        <div style={S.label}>📝 Mes notes</div>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { if (draft !== note) onSaveNote(task.id, draft); }}
          placeholder="Ajoute tes notes, blocages, découvertes..."
          style={S.textarea}
        />
      </div>
    </div>
  );
}
