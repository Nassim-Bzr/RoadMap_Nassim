"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/lib/data/types";

const LS_KEY = "roadmap_journal";

function loadFromLS(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}

function saveToLS(data: JournalEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const local = loadFromLS();
    if (local.length > 0) setEntries(local);

    const load = async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from("daily_journal")
        .select("date, content, mood")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error && data && data.length > 0) {
        setEntries(data);
        saveToLS(data);
      }
    };
    load();
  }, []);

  const saveEntry = useCallback(async (content: string, mood: number) => {
    const date = new Date().toISOString().split("T")[0];
    const entry: JournalEntry = { date, content, mood };

    setEntries(prev => {
      const next = [entry, ...prev.filter(e => e.date !== date)]
        .sort((a, b) => b.date.localeCompare(a.date));
      saveToLS(next);
      return next;
    });

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { error } = await supabase.from("daily_journal").upsert({
      user_id: user.id,
      date,
      content,
      mood,
    }, { onConflict: "user_id,date" });

    if (error) console.error("daily_journal upsert:", error.message);
  }, []);

  return { entries, saveEntry };
}
