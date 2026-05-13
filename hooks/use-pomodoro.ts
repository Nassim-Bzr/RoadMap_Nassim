"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function usePomodoro() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [taskLabel, setTaskLabel] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      timerRef.current = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      setRunning(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, seconds]);

  const start = useCallback((label: string) => {
    setTaskLabel(label);
    setSeconds(25 * 60);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    setSeconds(0);
    setTaskLabel("");
  }, []);

  const format = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return { running, seconds, taskLabel, start, stop, format };
}
