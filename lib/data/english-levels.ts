export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface EnglishLevel {
  id: CEFRLevel
  label: string
  color: string
  icon: string
  description: string
  xpRequired: number
}

export const ENGLISH_LEVELS: EnglishLevel[] = [
  { id: 'A1', label: 'Débutant',      color: '#2DBFB3', icon: '🌱', description: 'Bases essentielles',       xpRequired: 0    },
  { id: 'A2', label: 'Élémentaire',   color: '#4A90E2', icon: '📚', description: 'Situations courantes',     xpRequired: 200  },
  { id: 'B1', label: 'Intermédiaire', color: '#9B7EE5', icon: '⚡', description: 'Autonomie de base',        xpRequired: 500  },
  { id: 'B2', label: 'Avancé',        color: '#F4A437', icon: '🔥', description: 'Aisance communicative',    xpRequired: 1000 },
  { id: 'C1', label: 'Courant',       color: '#FF6B47', icon: '🚀', description: 'Maîtrise professionnelle', xpRequired: 2000 },
  { id: 'C2', label: 'Maîtrise',      color: '#E94B7C', icon: '👑', description: 'Niveau natif',             xpRequired: 4000 },
]

export type EnglishMode = 'vocabulary' | 'grammar' | 'conversation' | 'writing' | 'listening'

export interface EnglishModeInfo {
  id: EnglishMode
  label: string
  icon: string
  description: string
  color: string
}

export const ENGLISH_MODES: EnglishModeInfo[] = [
  { id: 'vocabulary',   label: 'Vocabulaire',    icon: '📖', description: 'Flashcards & mémorisation',   color: '#2DBFB3' },
  { id: 'grammar',      label: 'Grammaire',       icon: '⚙️', description: 'Règles & exercices',          color: '#9B7EE5' },
  { id: 'conversation', label: 'Conversation',    icon: '💬', description: 'Roleplay avec IA',             color: '#4A90E2' },
  { id: 'writing',      label: 'Écriture',        icon: '✍️', description: 'Rédaction & correction IA',   color: '#F4A437' },
  { id: 'listening',    label: 'Compréhension',   icon: '👂', description: 'Textes & analyse',             color: '#E94B7C' },
]
