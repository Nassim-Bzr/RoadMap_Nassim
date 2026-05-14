export type DojoMode = 'speed' | 'memory' | 'gaps'

export type SnippetCategory =
  | 'python-basics'
  | 'python-advanced'
  | 'pandas'
  | 'polars'
  | 'geopandas'
  | 'sql-basics'
  | 'sql-window'
  | 'sql-cte'
  | 'docker'
  | 'dbt'
  | 'airflow'
  | 'fastapi'
  | 'nextjs'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface CodeSnippet {
  id: string
  title: string
  category: SnippetCategory
  difficulty: Difficulty
  language: 'python' | 'sql' | 'typescript' | 'yaml' | 'bash'
  code: string
  explanation: string
  tags: string[]
  lineCount: number
  charCount: number
}

export interface TypingSession {
  id?: string
  snippetId: string
  mode: DojoMode
  wpm: number
  accuracy: number
  duration: number
  errors: number
  completed: boolean
  score: number
  createdAt?: string
}

export interface DojoStats {
  totalSessions: number
  totalTime: number
  bestWpm: number
  avgWpm: number
  avgAccuracy: number
  bestScore: number
  streak: number
  favoriteCategory: SnippetCategory
  completedSnippets: string[]
}

export interface TypingState {
  typed: string
  target: string
  started: boolean
  finished: boolean
  startTime: number | null
  errors: number[]
  currentIndex: number
  wpm: number
  accuracy: number
  progress: number
  elapsed: number
}

export interface CharState {
  char: string
  state: 'correct' | 'wrong' | 'pending' | 'cursor' | 'extra'
}
