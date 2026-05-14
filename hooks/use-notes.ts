"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const LS_KEY = "roadmap_notes";

function loadFromLS(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}

function saveToLS(data: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const local = loadFromLS();
    if (Object.keys(local).length > 0) setNotes(local);

    const load = async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from("task_notes")
        .select("task_id, content")
        .eq("user_id", user.id);

      if (!error && data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.task_id] = r.content; });
        const merged = { ...local, ...map };
        setNotes(merged);
        saveToLS(merged);
      }
    };
    load();
  }, []);

  const saveNote = useCallback(async (taskId: string, content: string) => {
    const updated = (prev: Record<string, string>) => ({ ...prev, [taskId]: content });
    setNotes(prev => {
      const n = updated(prev);
      saveToLS(n);
      return n;
    });

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { error } = await supabase.from("task_notes").upsert({
      user_id: user.id,
      task_id: taskId,
      content,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,task_id" });

    if (error) console.error("task_notes upsert:", error.message);
  }, []);

  return { notes, saveNote };
}
