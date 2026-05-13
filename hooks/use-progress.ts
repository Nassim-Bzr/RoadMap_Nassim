"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useProgress() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("task_progress")
        .select("task_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (data) {
        const map: Record<string, boolean> = {};
        data.forEach((r) => { map[r.task_id] = true; });
        setCompleted(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggle = useCallback(async (taskId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newVal = !completed[taskId];
    setCompleted((prev) => ({ ...prev, [taskId]: newVal }));

    await supabase.from("task_progress").upsert({
      user_id: user.id,
      task_id: taskId,
      completed: newVal,
      completed_at: newVal ? new Date().toISOString() : null,
    }, { onConflict: "user_id,task_id" });
  }, [completed]);

  return { completed, toggle, loading };
}
