export type MathLevel = 'debutant' | 'elementaire' | 'intermediaire' | 'avance' | 'expert'

export interface MathTopic {
  id: string
  title: string
  emoji: string
  description: string
  why: string
  level: MathLevel
  tags: string[]
}

export interface MathLevelInfo {
  id: MathLevel
  label: string
  color: string
  icon: string
  xpRequired: number
  description: string
}

export const MATH_LEVEL_INFO: MathLevelInfo[] = [
  { id: 'debutant',      label: 'Débutant',      color: '#2DBFB3', icon: '🌱', xpRequired: 0,    description: 'Bases arithmétique & logique' },
  { id: 'elementaire',   label: 'Élémentaire',   color: '#4A90E2', icon: '📐', xpRequired: 150,  description: 'Algèbre & fonctions de base' },
  { id: 'intermediaire', label: 'Intermédiaire', color: '#9B7EE5', icon: '⚡', xpRequired: 400,  description: 'Stats, proba, matrices' },
  { id: 'avance',        label: 'Avancé',        color: '#F4A437', icon: '🔥', xpRequired: 900,  description: 'Calcul différentiel & optimisation' },
  { id: 'expert',        label: 'Expert',        color: '#E94B7C', icon: '🚀', xpRequired: 1800, description: 'Algèbre linéaire avancée & deep learning math' },
]

export const MATH_TOPICS: MathTopic[] = [
  // DÉBUTANT
  { id: 'arithmetic',       title: 'Arithmétique & Logique',    emoji: '🔢', description: 'Opérations, fractions, puissances, modulo',  why: 'Base de tout algorithme, hashing, index',         level: 'debutant',      tags: ['Python', 'algorithmique'] },
  { id: 'sets',             title: 'Ensembles & Logique',       emoji: '🔵', description: 'Unions, intersections, prédicats logiques',   why: 'Requêtes SQL, filtres, booléens',                  level: 'debutant',      tags: ['SQL', 'pandas'] },
  { id: 'functions_basic',  title: 'Fonctions & Graphes',       emoji: '📈', description: 'Domaine, image, courbes simples',             why: 'Comprendre les courbes de loss',                   level: 'debutant',      tags: ['matplotlib', 'ML'] },

  // ÉLÉMENTAIRE
  { id: 'algebra',          title: 'Algèbre & Équations',       emoji: '🧮', description: 'Polynômes, systèmes, factorisation',          why: 'Régression, feature engineering',                 level: 'elementaire',   tags: ['sklearn', 'régression'] },
  { id: 'vectors_2d',       title: 'Vecteurs 2D',               emoji: '➡️', description: 'Coordonnées, norme, produit scalaire',        why: 'Embeddings, similarité cosinus',                  level: 'elementaire',   tags: ['NLP', 'embeddings'] },
  { id: 'percentages',      title: 'Pourcentages & Ratios',     emoji: '📊', description: 'Taux, variations, proportions',               why: 'Métriques, KPIs, precision/recall',               level: 'elementaire',   tags: ['métriques', 'évaluation'] },

  // INTERMÉDIAIRE
  { id: 'statistics',       title: 'Statistiques descriptives', emoji: '📉', description: 'Moyenne, médiane, variance, écart-type',      why: 'EDA, feature scaling, outliers',                  level: 'intermediaire', tags: ['pandas', 'EDA', 'numpy'] },
  { id: 'probability',      title: 'Probabilités',              emoji: '🎲', description: 'Lois, Bayes, espérance, distributions',       why: 'Naive Bayes, incertitude, A/B testing',           level: 'intermediaire', tags: ['ML', 'stats', 'scikit'] },
  { id: 'matrices',         title: 'Matrices & Opérations',     emoji: '🔲', description: 'Produit matriciel, transposée, inverse',      why: 'Numpy, réseaux de neurones, PCA',                 level: 'intermediaire', tags: ['numpy', 'deep learning'] },
  { id: 'combinatorics',    title: 'Combinatoire & Comptage',   emoji: '🃏', description: 'Permutations, combinaisons, arrangements',    why: 'Complexité algo, hyperparamètres',                level: 'intermediaire', tags: ['algorithmique', 'ML'] },

  // AVANCÉ
  { id: 'derivatives',      title: 'Dérivées & Gradients',      emoji: '📐', description: 'Dérivée, règle chaîne, gradient',             why: 'Gradient descent, backpropagation',               level: 'avance',        tags: ['deep learning', 'optimisation'] },
  { id: 'linear_algebra',   title: 'Algèbre Linéaire',          emoji: '🧊', description: 'Valeurs propres, SVD, décompositions',        why: 'PCA, recommandation, compression',                level: 'avance',        tags: ['PCA', 'SVD', 'numpy'] },
  { id: 'optimization',     title: 'Optimisation',              emoji: '🎯', description: 'Minimum/maximum, contraintes, convexité',     why: 'Loss functions, hyperparameter tuning',           level: 'avance',        tags: ['ML', 'gradient', 'SGD'] },
  { id: 'information',      title: "Théorie de l'information",  emoji: '🔐', description: 'Entropie, KL-divergence, mutual info',        why: 'Decision trees, cross-entropy loss',              level: 'avance',        tags: ['ML', 'arbres', 'NLP'] },

  // EXPERT
  { id: 'multivar_calculus', title: 'Calcul Multivariable',     emoji: '🌊', description: 'Dérivées partielles, jacobien, hessien',      why: 'Optimisation multi-dim, Adam, RMSProp',           level: 'expert',        tags: ['deep learning', 'optimiseurs'] },
  { id: 'fourier',           title: 'Transformée de Fourier',   emoji: '〰️', description: 'Fréquences, FFT, convolution',               why: 'CNN, signal processing, audio AI',                level: 'expert',        tags: ['CNN', 'signal', 'numpy'] },
  { id: 'graph_theory',      title: 'Théorie des Graphes',      emoji: '🕸️', description: 'Noeuds, arêtes, parcours, centralité',       why: 'GNN, knowledge graphs, réseaux sociaux',          level: 'expert',        tags: ['GNN', 'neo4j', 'NetworkX'] },
]
