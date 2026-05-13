"use client";

import { useState } from "react";
import type { Week } from "@/lib/data/types";
import { TaskItem } from "./task-item";

interface Props {
  week: Week;
  phaseColor: string;
  completed: Record<string, boolean>;
  notes: Record<string, string>;
  onToggle: (id: string) => void;
  onSaveNote: (id: string, content: string) => void;
  searchQuery: string;
  filterMode: string;
}

export function WeekAccordion({ week, phaseColor, completed, notes, onToggle, onSaveNote, searchQuery, filterMode }: Props) {
  const [open, setOpen] = useState(false);

  const filteredTasks = week.tasks.filter(t => {
    const matchSearch = !searchQuery || t.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterMode === "all" || (filterMode === "done" && completed[t.id]) || (filterMode === "todo" && !completed[t.id]);
    return matchSearch && matchFilter;
  });

  const done = week.tasks.filter(t => completed[t.id]).length;
  const pct = week.tasks.length ? Math.round(done / week.tasks.length * 100) : 0;

  if (searchQuery && filteredTasks.length === 0) return null;

  return (
    <div style={{ marginBottom: 1 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 6px", background: open ? "rgba(255,255,255,0.025)" : "transparent", borderRadius: 4 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9 }}>{pct === 100 ? "✅" : "📌"}</span>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: pct === 100 ? "#6a9fa8" : "#dcd9d3" }}>{week.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 32, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: phaseColor, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 7, color: "#6e6d72" }}>{done}/{week.tasks.length}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "2px 3px 4px 20px" }}>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              phaseColor={phaseColor}
              completed={!!completed[task.id]}
              note={notes[task.id] ?? ""}
              onToggle={onToggle}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
