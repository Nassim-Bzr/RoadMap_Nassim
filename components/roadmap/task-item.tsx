"use client";

import { useState } from "react";
import type { Task } from "@/lib/data/types";
import { TaskDetail } from "./task-detail";
import { usePomodoroContext } from "@/components/pomodoro/pomodoro-context";

interface Props {
  task: Task;
  phaseColor: string;
  completed: boolean;
  note: string;
  onToggle: (id: string) => void;
  onSaveNote: (id: string, content: string) => void;
}

export function TaskItem({ task, phaseColor, completed, note, onToggle, onSaveNote }: Props) {
  const [open, setOpen] = useState(false);
  const { start } = usePomodoroContext();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
        <div
          onClick={() => onToggle(task.id)}
          style={{ cursor: "pointer", width: 13, height: 13, borderRadius: 3, border: "2px solid " + (completed ? phaseColor : "#334155"), background: completed ? phaseColor : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 7, color: "#fff", fontWeight: 700 }}
        >
          {completed ? "✓" : ""}
        </div>
        <span style={{ fontSize: 7, color: "#475569", fontWeight: 600, minWidth: 16 }}>{task.day}</span>
        <span
          onClick={() => setOpen(!open)}
          style={{ cursor: "pointer", fontSize: 10, color: completed ? "#475569" : "#dcd9d3", textDecoration: completed ? "line-through" : "none", flex: 1 }}
        >
          {task.label}
        </span>
        {note && <span style={{ fontSize: 8, color: "#c49a5c" }}>📝</span>}
        <button
          onClick={() => start(task.label)}
          style={{ background: "transparent", border: "none", fontSize: 9, cursor: "pointer", color: "#6e6d72", padding: 0 }}
          title="Pomodoro 25min"
        >
          ⏱️
        </button>
        <span
          onClick={() => setOpen(!open)}
          style={{ cursor: "pointer", fontSize: 8, color: open ? phaseColor : "#334155", display: "inline-block", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
        >
          ▶
        </span>
      </div>
      {open && (
        <TaskDetail task={task} phaseColor={phaseColor} note={note} onSaveNote={onSaveNote} />
      )}
    </div>
  );
}
