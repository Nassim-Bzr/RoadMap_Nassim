import type { Badge } from "./types";

export const BADGES: Badge[] = [
  { id: "b1", name: "First Blood", emoji: "🩸", description: "Première tâche", check: (c) => c >= 1 },
  { id: "b2", name: "Getting Started", emoji: "🌱", description: "10 tâches", check: (c) => c >= 10 },
  { id: "b3", name: "Quarter Way", emoji: "🔥", description: "25% complété", check: (c, t) => c >= t * 0.25 },
  { id: "b4", name: "Halfway", emoji: "⚡", description: "50% complété", check: (c, t) => c >= t * 0.5 },
  { id: "b5", name: "Almost There", emoji: "🔥", description: "75% complété", check: (c, t) => c >= t * 0.75 },
  { id: "b6", name: "Expert", emoji: "🏆", description: "100% complété", check: (c, t) => c >= t },
  { id: "b7", name: "Week Warrior", emoji: "🗡", description: "7 jours streak", check: (_c, _t, s) => s >= 7 },
  { id: "b8", name: "Month Master", emoji: "🗓️", description: "30 jours streak", check: (_c, _t, s) => s >= 30 },
  { id: "b9", name: "Python Lover", emoji: "🐍", description: "20 tâches Python", check: (c) => c >= 20 },
  { id: "b10", name: "SQL Wizard", emoji: "🧙", description: "Toutes tâches SQL", check: (c) => c >= 6 },
  { id: "b11", name: "Centurion", emoji: "💯", description: "100 tâches", check: (c) => c >= 100 },
  { id: "b12", name: "Unstoppable", emoji: "🚀", description: "150 tâches", check: (c) => c >= 150 },
];
