export interface Resource {
  type: "doc" | "video" | "article" | "github" | "course" | "tool" | "book";
  title: string;
  url: string;
}

export interface Task {
  id: string;
  label: string;
  day: string;
  description?: string;
  url?: string;
  resource?: string;
  resources?: Resource[];
  exercise: string;
  solution?: string;
}

export interface Week {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  color: string;
  icon: string;
  weeks: Week[];
}

export interface TaskProgress {
  task_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface TaskNote {
  task_id: string;
  content: string;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_tasks_completed: number;
}

export interface JournalEntry {
  date: string;
  content: string;
  mood: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  check: (completed: number, total: number, streak: number) => boolean;
}
