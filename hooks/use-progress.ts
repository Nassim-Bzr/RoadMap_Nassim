"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const LS_KEY = "roadmap_progress";

function loadFromLS(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}

function saveToLS(data: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Always load localStorage first (instant UI)
      const local = loadFromLS();
      if (Object.keys(local).length > 0) setCompleted(local);

      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("task_progress")
        .select("task_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (!error && data) {
        const map: Record<string, boolean> = {};
        data.forEach((r) => { map[r.task_id] = true; });
        // Merge: Supabase wins over localStorage
        const merged = { ...local, ...map };
        setCompleted(merged);
        saveToLS(merged);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggle = useCallback(async (taskId: string) => {
    const newVal = !completed[taskId];
    const updated = { ...completed, [taskId]: newVal };
    setCompleted(updated);
    saveToLS(updated);

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { error } = await supabase.from("task_progress").upsert({
      user_id: user.id,
      task_id: taskId,
      completed: newVal,
      completed_at: newVal ? new Date().toISOString() : null,
    }, { onConflict: "user_id,task_id" });

    if (error) console.error("task_progress upsert:", error.message);
  }, [completed]);

  return { completed, toggle, loading };
}
