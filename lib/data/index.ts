import { DATA_PHASES } from "./data-phases";
import { DEV_PHASES } from "./dev-phases";
import { ROADMAPSH_PHASES } from "./roadmapsh-phases";
import { OCR_PHASES } from "./ocr-phases";

export { DATA_PHASES } from "./data-phases";
export { DEV_PHASES } from "./dev-phases";
export { ROADMAPSH_PHASES } from "./roadmapsh-phases";
export { OCR_PHASES } from "./ocr-phases";
export { BADGES } from "./badges";
export type { Phase, Week, Task, Badge, TaskProgress, TaskNote, StreakData, JournalEntry } from "./types";

export const ALL_PHASES = [...DATA_PHASES, ...DEV_PHASES, ...ROADMAPSH_PHASES];

const countTasks = (phases: typeof DATA_PHASES) =>
  phases.reduce((s, p) => s + p.weeks.reduce((s2, w) => s2 + w.tasks.length, 0), 0);

export const TOTAL_TASKS = countTasks(ALL_PHASES);
export const DATA_TOTAL = countTasks(DATA_PHASES);
export const DEV_TOTAL = countTasks(DEV_PHASES);
export const ROADMAPSH_TOTAL = countTasks(ROADMAPSH_PHASES);
export const OCR_TOTAL = countTasks(OCR_PHASES);
