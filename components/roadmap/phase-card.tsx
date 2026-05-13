"use client";

import { useState } from "react";
import type { Phase } from "@/lib/data/types";
import { WeekAccordion } from "./week-accordion";

interface Props {
  phase: Phase;
  completed: Record<string, boolean>;
  notes: Record<string, string>;
  onToggle: (id: string) => void;
  onSaveNote: (id: string, content: string) => void;
  searchQuery: string;
  filterMode: string;
  defaultOpen?: boolean;
}

export function PhaseCard({ phase, completed, notes, onToggle, onSaveNote, searchQuery, filterMode, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const allTasks = phase.weeks.flatMap(w => w.tasks);
  const done = allTasks.filter(t => completed[t.id]).length;
  const pct = allTasks.length ? Math.round(done / allTasks.length * 100) : 0;

  return (
    <div style={{ marginBottom: 4 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", background: open ? phase.color + "0d" : "rgba(255,255,255,0.025)", border: "1px solid " + (open ? phase.color + "33" : "rgba(255,255,255,0.07)"), borderRadius: 7, padding: "8px 10px", transition: "all 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{phase.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: phase.color }}>{phase.title}</div>
              <div style={{ fontSize: 8, color: "#6e6d72" }}>{phase.subtitle}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: pct === 100 ? "#6a9fa8" : "#fff" }}>{pct}%</div>
            <div style={{ fontSize: 7, color: "#6e6d72" }}>{done}/{allTasks.length}</div>
          </div>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, marginTop: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: phase.color, borderRadius: 99, transition: "width 0.4s" }} />
        </div>
      </div>
      {open && (
        <div className="animate-fade-slide" style={{ marginTop: 2, marginLeft: 6, borderLeft: "2px solid " + phase.color + "15", paddingLeft: 8 }}>
          {phase.weeks.map(week => (
            <WeekAccordion
              key={week.id}
              week={week}
              phaseColor={phase.color}
              completed={completed}
              notes={notes}
              onToggle={onToggle}
              onSaveNote={onSaveNote}
              searchQuery={searchQuery}
              filterMode={filterMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
