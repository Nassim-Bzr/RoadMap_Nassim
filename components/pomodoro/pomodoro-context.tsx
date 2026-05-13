"use client";

import { createContext, useContext } from "react";

interface PomodoroContextType {
  running: boolean;
  seconds: number;
  taskLabel: string;
  start: (label: string) => void;
  stop: () => void;
  format: (s: number) => string;
}

export const PomodoroContext = createContext<PomodoroContextType>({
  running: false,
  seconds: 0,
  taskLabel: "",
  start: () => {},
  stop: () => {},
  format: (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`,
});

export function usePomodoroContext() {
  return useContext(PomodoroContext);
}
