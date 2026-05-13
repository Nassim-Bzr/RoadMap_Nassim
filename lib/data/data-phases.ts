import type { Phase } from "./types";
import { PHASE1_PYTHON_PANDAS } from "./phases/phase-1a-python-pandas";
import { PHASE1_POLARS_SQL } from "./phases/phase-1b-polars-sql";
import { PHASE1_NUMPY_APIS } from "./phases/phase-1c-numpy-apis";
import { PHASE1_GEO } from "./phases/phase-1d-geo";
import { PHASE1_VIZ } from "./phases/phase-1e-viz";
import { PHASE1_GIT_ARCHI } from "./phases/phase-1f-git-archi";
import { PHASE2_CORE_DE } from "./phases/phase-2-core-de";
import { PHASE2_DBT_AIRFLOW } from "./phases/phase-2b-dbt-airflow";
import { PHASE2_QUALITY_POSTGRES } from "./phases/phase-2c-quality-postgres";
import { PHASE3_SCALING } from "./phases/phase-3-scaling";
import { PHASE3_KAFKA_DUCKDB } from "./phases/phase-3b-kafka-duckdb";
import { PHASE4_ML } from "./phases/phase-4-ml";

export const DATA_PHASES: Phase[] = [
  {
    id: "dp1",
    title: "FONDATIONS",
    subtitle: "Python · SQL · Pandas · Polars · GeoPandas · NumPy · APIs · Git",
    period: "Mai–Juil 2026",
    color: "#6a9fa8",
    icon: "🧱",
    weeks: [
      ...PHASE1_PYTHON_PANDAS,
      ...PHASE1_POLARS_SQL,
      ...PHASE1_NUMPY_APIS,
      ...PHASE1_GEO,
      ...PHASE1_VIZ,
      ...PHASE1_GIT_ARCHI,
    ],
  },
  {
    id: "dp2",
    title: "CORE DATA ENGINEERING",
    subtitle: "Docker · dbt · Airflow · Quality · PostgreSQL Avancé",
    period: "Août–Nov 2026",
    color: "#c49a5c",
    icon: "⚙️",
    weeks: [
      ...PHASE2_CORE_DE,
      ...PHASE2_DBT_AIRFLOW,
      ...PHASE2_QUALITY_POSTGRES,
    ],
  },
  {
    id: "dp3",
    title: "SCALING & CLOUD",
    subtitle: "Spark · AWS · Kafka · PostGIS · DuckDB · Lakehouse",
    period: "Déc 2026–Mar 2027",
    color: "#8878b5",
    icon: "☁️",
    weeks: [
      ...PHASE3_SCALING,
      ...PHASE3_KAFKA_DUCKDB,
    ],
  },
  {
    id: "dp4",
    title: "ML & DEEP LEARNING",
    subtitle: "Maths · scikit-learn · PyTorch · Transformers · MLOps",
    period: "Avr–Juil 2027",
    color: "#b86a6a",
    icon: "🧠",
    weeks: [
      ...PHASE4_ML,
    ],
  },
  {
    id: "dp5",
    title: "EXPERTISE & CDI",
    subtitle: "System Design · Entretiens · Mémoire IPSSI",
    period: "Août–Oct 2027",
    color: "#6a8fa8",
    icon: "🏆",
    weeks: [
      {
        id: "w22",
        title: "System Design + CDI",
        tasks: [
          {
            id: "d111",
            label: "System design data",
            day: "Lun",
            description: "System design = architecturer une solution data à grande échelle (1TB/jour, 1M users). Sujet incontournable en entretien Senior. ByteByteGo et Designing Data-Intensive Apps sont les références.",
            url: "https://youtu.be/ZgdS0EUmn70",
            resource: "ByteByteGo",
            resources: [
              { type: "video", title: "ByteByteGo - System Design", url: "https://www.youtube.com/c/ByteByteGo" },
              { type: "book", title: "Designing Data-Intensive Apps (Kleppmann)", url: "https://dataintensive.net/" },
              { type: "github", title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
              { type: "github", title: "Awesome System Design", url: "https://github.com/madd86/awesome-system-design" },
            ],
            exercise: "Designer pipeline 1TB/jour:\n- Sources: 100 véhicules × 10K events/h\n- Stockage: S3 partitionné + Glue catalog\n- Compute: Spark/Flink selon latence\n- Serving: API + cache Redis\n- Monitoring: Datadog + alertes\n\nDessiner architecture sur excalidraw.\nÉcrire trade-offs (cost, latency, complexity).\nCalculer storage + compute estimé.",
          },
          {
            id: "d112",
            label: "Mock interviews techniques",
            day: "Mar",
            description: "S'entraîner aux entretiens : SQL window functions, Python coding, system design. Pramp = pair-programming gratuit. 3 mock minimum avant les vrais entretiens = différence entre stress et confiance.",
            url: "https://www.pramp.com/",
            resource: "Pramp (gratuit)",
            resources: [
              { type: "tool", title: "Pramp (mock interviews gratuit)", url: "https://www.pramp.com/" },
              { type: "tool", title: "interviewing.io", url: "https://interviewing.io/" },
              { type: "doc", title: "DataLemur (SQL interview prep)", url: "https://datalemur.com/" },
              { type: "github", title: "Data Engineering Interview Questions", url: "https://github.com/andkret/Cookbook" },
            ],
            exercise: "Faire 3 mocks Pramp:\n1. SQL coding (window functions, CTEs)\n2. Python data manipulation (Pandas/Polars)\n3. System design data pipeline\n\nEnregistre tes mocks (avec accord).\nÉcoute après → repère répétitions, hésitations.\nRefais les exercices ratés.",
          },
          {
            id: "d113",
            label: "LeetCode SQL + Python",
            day: "Mer",
            description: "Practice exercices type entretien. LeetCode SQL Database section (200+ exercises). DataLemur = LeetCode spécialisé data. 30 SQL + 15 Python = niveau confortable pour entretiens.",
            url: "https://leetcode.com/problemset/database/",
            resource: "LeetCode SQL Problems",
            resources: [
              { type: "tool", title: "LeetCode SQL", url: "https://leetcode.com/problemset/database/" },
              { type: "tool", title: "DataLemur (data interview)", url: "https://datalemur.com/" },
              { type: "tool", title: "StrataScratch (real questions)", url: "https://www.stratascratch.com/" },
              { type: "tool", title: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" },
            ],
            exercise: "Plan 4 semaines:\n- Semaine 1: LeetCode SQL Easy (15 exos)\n- Semaine 2: SQL Medium (15) - focus window/CTE\n- Semaine 3: SQL Hard (10) + Python Easy (10)\n- Semaine 4: System Design + behavioral\n\nTime yourself: 25 min max par exo.\nSi blocage > 30min: lis solution puis refais sans regarder.",
          },
          {
            id: "d114",
            label: "Mémoire IPSSI",
            day: "Jeu",
            description: "Le mémoire = ton 1er livrable d'expertise. Bien fait = différence entre 'OK' et 'recruté direct chez X'. Intégrer projets concrets + bibliographie sérieuse + soutenance maîtrisée.",
            url: "https://www.notion.so/",
            resource: "Notion (rédaction)",
            resources: [
              { type: "tool", title: "Notion (rédaction structurée)", url: "https://www.notion.so/" },
              { type: "tool", title: "Zotero (bibliographie)", url: "https://www.zotero.org/" },
              { type: "doc", title: "How to write thesis", url: "https://www.scribbr.fr/memoire/" },
              { type: "tool", title: "Excalidraw (diagrammes)", url: "https://excalidraw.com/" },
            ],
            exercise: "Structure recommandée:\n1. Intro (10p): contexte, problématique, plan\n2. État de l'art (20p): littérature + outils\n3. Méthode (15p): architecture, choix techniques\n4. Résultats (15p): chiffres, graphiques\n5. Discussion (10p): limites, perspectives\n6. Conclusion (5p)\n\nTimeline (3 mois):\n- M1: rédaction + revue littérature\n- M2: implémentation + résultats\n- M3: rédaction finale + slides + répét",
          },
          {
            id: "d115",
            label: "Négociation CDI",
            day: "Ven",
            description: "Négocier salaire = +5-15K€/an immédiat. Prepare avec data (Glassdoor, levels.fyi, Talent.io). Ne donne JAMAIS la 1ère fourchette. Objectif: 65-85K€ pour Data Engineer junior 1-2 ans expérience à Paris.",
            url: "https://www.levels.fyi/",
            resource: "levels.fyi (salaires tech)",
            resources: [
              { type: "tool", title: "levels.fyi (salaires monde)", url: "https://www.levels.fyi/" },
              { type: "tool", title: "Talent.io (FR salaires)", url: "https://www.talent.io/" },
              { type: "tool", title: "Glassdoor France", url: "https://www.glassdoor.fr/" },
              { type: "video", title: "Negotiation Hannan Pegley", url: "https://youtu.be/u9BoG1n1948" },
            ],
            exercise: "Recherche marché:\n- Talent.io: TJM data engineer junior Paris\n- Glassdoor: salaires entreprises ciblées\n- LinkedIn: contacter 3 data engineers, demander leur fourchette\n\nObjectifs réalistes 2026 (Paris, 1-2 ans XP):\n- Junior: 45-55K€\n- Confirmé: 55-70K€\n- Senior: 70-100K€+\n\nScript négociation:\n'Compte tenu de mes compétences en X, Y, Z et de mes 2 projets concrets, j'attends une fourchette entre 60 et 70K€'\n\nTOUJOURS demander temps de réflexion avant signature.",
          },
          {
            id: "d116",
            label: "Signer CDI 🎉",
            day: "Sam",
            description: "L'objectif final ! Tu as appris Python avancé, SQL, Polars, Spark, dbt, Airflow, ML. Tu as un portfolio GitHub. Tu négocies bien. Tu signes ton 1er CDI Data Engineer. Bravo, c'est mérité.",
            url: "",
            resource: "Tu l'as fait!",
            resources: [
              { type: "article", title: "First Day at Work Tips", url: "https://www.themuse.com/advice/your-first-day-at-work-tips" },
            ],
            exercise: "Avant signature:\n✓ Salaire OK ?\n✓ Tickets resto + mutuelle ?\n✓ Stack technique alignée ?\n✓ Manager rencontré ?\n✓ Possibilité remote ?\n✓ Période d'essai (max 4 mois) ?\n✓ Clause non-concurrence ?\n\nPremier mois CDI:\n- Comprendre le business (pas seulement la tech)\n- Mapper les data sources\n- Identifier 3 quick wins\n- Build relationships (1:1 avec managers/collègues)\n- Ne change rien dans les premiers 3 mois\n\nCélèbre 🎉 puis continue à apprendre !",
          },
        ],
      },
    ],
  },
];
