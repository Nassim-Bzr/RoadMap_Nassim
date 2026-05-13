"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("task_notes")
        .select("task_id, content")
        .eq("user_id", user.id);

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.task_id] = r.content; });
        setNotes(map);
      }
    };
    load();
  }, []);

  const saveNote = useCallback(async (taskId: string, content: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setNotes((prev) => ({ ...prev, [taskId]: content }));

    await supabase.from("task_notes").upsert({
      user_id: user.id,
      task_id: taskId,
      content,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,task_id" });
  }, []);

  return { notes, saveNote };
}
