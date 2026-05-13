"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { StreakData } from "@/lib/data/types";

const DEFAULT: StreakData = {
  current_streak: 0,
  longest_streak: 0,
  last_activity_date: null,
  total_tasks_completed: 0,
};

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) setStreak(data);
    };
    load();
  }, []);

  const recordActivity = useCallback(async (completedCount: number) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    let newStreak = 1;

    if (streak.last_activity_date === today) {
      newStreak = streak.current_streak;
    } else if (streak.last_activity_date) {
      const last = new Date(streak.last_activity_date);
      last.setDate(last.getDate() + 1);
      if (last.toISOString().split("T")[0] === today) {
        newStreak = streak.current_streak + 1;
      }
    }

    const longest = Math.max(newStreak, streak.longest_streak);
    const updated: StreakData = {
      current_streak: newStreak,
      longest_streak: longest,
      last_activity_date: today,
      total_tasks_completed: completedCount,
    };

    setStreak(updated);
    await supabase.from("streaks").upsert({
      user_id: user.id,
      ...updated,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }, [streak]);

  return { streak, recordActivity };
}
