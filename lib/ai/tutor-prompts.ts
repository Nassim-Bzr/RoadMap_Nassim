import type { Task, Phase } from '@/lib/data/types'

interface UserContext {
  name: string
  currentTask: Task
  currentPhase: Phase
  completedTaskIds: string[]
  recentErrors: string[]
  notes: Record<string, string>
}

// Bloc descriptions to give Claude context on the OCR program
const BLOC_CONTEXT: Record<string, string> = {
  ocr1: "Bloc 1 — Fondations Data (113h) : Python, SQL, PostgreSQL, collecte de données, RGPD, analyse exploratoire EDA, nettoyage de données, modèle prédictif de base. Niveau Junior.",
  ocr2: "Bloc 2 — Infrastructure & Pipelines (190h) : Docker, docker-compose, MongoDB/NoSQL, scikit-learn avancé, LightGBM, SHAP/interprétabilité, MLflow, GitHub Actions CI/CD, déploiement AWS EC2. Niveau Intermédiaire.",
  ocr3: "Bloc 3 — Cloud & Big Data (130h) : Apache Spark, PySpark, AWS EMR, Redpanda (Kafka-compatible), Kestra (orchestration), DuckDB, Delta Lake, architecture Lakehouse, pipelines temps réel. Niveau Confirmé.",
  ocr4: "Bloc 4 — IA & Portfolio Expert (170h) : LangChain, RAG (Retrieval-Augmented Generation), ChromaDB, Mistral LLM, LangGraph agents, LoRA fine-tuning, LangSmith observabilité, POC → MVP production. Niveau Expert.",
}

export function buildSystemPrompt(ctx: UserContext): string {
  const blocCtx = BLOC_CONTEXT[ctx.currentPhase.id] ?? ctx.currentPhase.title

  return `Tu es un tuteur expert en Data Engineering, spécialisé dans la formation OpenClassrooms Data Engineer (RNCP 35288).

PROFIL DE L'ÉTUDIANT :
- Nom : ${ctx.name}
- Formation : Data Engineer OpenClassrooms — 4 blocs RNCP, 13 projets, 603h supervisées
- Tâches complétées : ${ctx.completedTaskIds.length} projets sur 13
- Phase actuelle : ${blocCtx}

CONTEXTE DU PROJET EN COURS :
- Projet : "${ctx.currentTask.label}"
- Description : ${ctx.currentTask.description ?? 'Projet du parcours Data Engineer'}

STYLE D'ENSEIGNEMENT :
- Toujours commencer par "pourquoi c'est important" pour un Data Engineer en 2026
- Exemples concrets en lien avec le projet OCR en cours (Docker, Spark, RAG, etc.)
- Jamais de théorie abstraite sans exemple appliqué à la data
- Niveau adapté : Junior pour Bloc 1, intermédiaire pour Bloc 2, avancé pour Blocs 3-4
- Si erreurs récentes (${ctx.recentErrors.join(', ') || 'aucune'}), aborder ces lacunes en priorité

RÈGLES :
- Réponses concises et directes, pas de blabla
- Code Python/SQL/YAML toujours commenté et prêt à copier-coller
- Toujours terminer par un conseil actionnable ("pour ce projet, fais X")
- Langue : français
- Référence aux outils du programme OCR : Docker, dbt, Airflow, Spark, Kestra, DuckDB, LangChain, Mistral`
}

export function buildLessonPrompt(task: Task): string {
  return `Génère une leçon complète sur le projet OpenClassrooms : "${task.label}"

Description du projet : ${task.description ?? ''}

Réponds UNIQUEMENT avec ce JSON valide, sans markdown, sans texte avant ou après :
{
  "concept": "Explication claire en 3-4 phrases maximum. Simple, direct, centré sur les compétences Data Engineer.",
  "why_it_matters": "En 2 phrases : pourquoi cette compétence est cruciale pour un Data Engineer en 2026 (marché du travail, usage réel en entreprise).",
  "code_example": "Un exemple de code Python, SQL, YAML ou bash complet et commenté, directement applicable au projet décrit. Utilise les outils du projet (Docker, Spark, LangChain, etc.).",
  "code_language": "python",
  "practice": {
    "title": "Titre court de l'exercice (max 8 mots)",
    "instructions": "Description claire en 2-3 phrases de ce que l'étudiant doit faire. Exercice concret, pas trop dur, directement lié au projet OCR.",
    "starter_code": "Code de départ à compléter — avec des commentaires TODO indiquant ce qu'il faut écrire. Entre 8 et 18 lignes. Adapté au projet (Python, SQL, ou YAML selon le contexte).",
    "language": "python",
    "expected_output": "Ce que le code DOIT produire quand il est correct — peut être du texte, un tableau (liste de dicts), ou une valeur. Exemple réaliste en lien avec le projet data.",
    "output_type": "table",
    "hint": "Un indice court si l'étudiant bloque.",
    "solution": "La solution complète et correcte — code propre sans TODO."
  },
  "quiz": {
    "question": "Une question concrète sur une compétence clé du projet, niveau approprié (pas trop facile)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Explication de la bonne réponse en 2 phrases, avec le lien Data Engineering en entreprise."
  },
  "pro_tip": "Un conseil de Senior Data Engineer en 1 phrase : ce que les pros font vraiment sur ce sujet.",
  "next_step": "En 1 phrase : la prochaine compétence à maîtriser pour consolider ce projet OCR."
}

RÈGLES pour le champ "practice":
- output_type doit être "table" (si le résultat est un tableau de données — liste de dicts Python ou résultat SQL), "terminal" (si c'est du texte/print/logs), ou "value" (si c'est un nombre ou une chaîne simple)
- Le starter_code doit être incomplet mais compilable sans les TODO — il ne doit PAS crasher si l'étudiant ne touche à rien (utilise des valeurs par défaut ou des pass)
- La solution doit être COURTE (max 20 lignes) et ne pas importer de libs lourdes (pas de pandas, polars, spark — utilise uniquement la stdlib Python ou du SQL pur)
- expected_output pour type "table": une liste de dicts JSON sérialisable, ex: [{"name": "Alice", "score": 95}, ...]
- expected_output pour type "terminal": string avec les lignes de sortie
- expected_output pour type "value": string avec la valeur attendue`
}

export function buildChatSystemPrompt(ctx: UserContext): string {
  return `${buildSystemPrompt(ctx)}

Tu es dans un mode CHAT avec l'étudiant.
Il peut te poser des questions sur n'importe quel concept de son parcours Data Engineer OpenClassrooms.
Il peut aussi coller du code à reviewer, ou demander de l'aide sur un exercice OCR.

Si il colle du code :
- Identifie les problèmes (bugs, mauvaises pratiques, performance)
- Suggère des améliorations concrètes avec les outils du parcours (Polars, Docker, Spark, etc.)
- Donne la version corrigée avec commentaires
- Explique chaque changement en lien avec les bonnes pratiques Data Engineer

Réponds en français, de manière conversationnelle mais précise et technique.`
}
