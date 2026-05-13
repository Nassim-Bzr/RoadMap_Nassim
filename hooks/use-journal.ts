"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/lib/data/types";

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("daily_journal")
        .select("date, content, mood")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) setEntries(data);
    };
    load();
  }, []);

  const saveEntry = useCallback(async (content: string, mood: number) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const date = new Date().toISOString().split("T")[0];
    const entry: JournalEntry = { date, content, mood };

    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== date);
      return [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });

    await supabase.from("daily_journal").upsert({
      user_id: user.id,
      date,
      content,
      mood,
    }, { onConflict: "user_id,date" });
  }, []);

  return { entries, saveEntry };
}
