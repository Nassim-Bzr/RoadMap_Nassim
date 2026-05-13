import type { Phase } from "./types";

export const DEV_PHASES: Phase[] = [
  {
    id: "vp1",
    title: "PYTHON BACKEND",
    subtitle: "FastAPI · SQLAlchemy · Auth · Deploy",
    period: "En parallèle",
    color: "#6a9a7e",
    icon: "🐍",
    weeks: [
      {
        id: "vw1",
        title: "FastAPI Mastery",
        tasks: [
          { id: "v1", label: "FastAPI CRUD + Pydantic", day: "Lun", url: "https://fastapi.tiangolo.com/tutorial/", resource: "FastAPI Tutorial (EXCELLENT)", exercise: "GET/POST/PUT/DELETE\nPydantic validation\nlocalhost:8000/docs → Swagger" },
          { id: "v2", label: "SQLAlchemy + PostgreSQL", day: "Mar", url: "https://fastapi.tiangolo.com/tutorial/sql-databases/", resource: "FastAPI SQL Tutorial", exercise: "Models, sessionmaker, Depends\nCRUD complet avec DB" },
          { id: "v3", label: "Auth JWT + OAuth2", day: "Mer", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/", resource: "FastAPI Security", exercise: "JWT tokens, OAuth2PasswordBearer\nProtected routes, registration" },
          { id: "v4", label: "Middleware + CORS", day: "Jeu", url: "https://fastapi.tiangolo.com/tutorial/middleware/", resource: "FastAPI Middleware", exercise: "CORS pour React, custom middleware\nHTTPException, error handlers" },
          { id: "v5", label: "Background + WebSocket", day: "Ven", url: "https://fastapi.tiangolo.com/tutorial/background-tasks/", resource: "FastAPI Background Tasks", exercise: "BackgroundTasks, WebSocket\nProgress pipeline temps réel" },
          { id: "v6", label: "ML model serving", day: "Sam", url: "https://youtu.be/1zMQBe0l1bM", resource: "ML+FastAPI YouTube", exercise: "pickle.load, POST /predict\nUpload CSV, async processing" },
          { id: "v7", label: "Deploy Railway/Render", day: "Sam", url: "https://railway.app/", resource: "Railway (gratuit)", exercise: "Dockerfile FastAPI, PostgreSQL cloud\nURL publique → CV + GitHub" },
        ],
      },
    ],
  },
  {
    id: "vp2",
    title: "NEXT.JS MASTERY",
    subtitle: "App Router · RSC · Auth · Prisma",
    period: "En parallèle",
    color: "#6a80b8",
    icon: "▲",
    weeks: [
      {
        id: "vw2",
        title: "Next.js Fondations",
        tasks: [
          { id: "v8", label: "App Router + routing", day: "Lun", url: "https://nextjs.org/docs/app", resource: "Next.js App Router docs", exercise: "app/page.tsx, layout.tsx\nDynamic [id], route groups" },
          { id: "v9", label: "Server vs Client Components", day: "Mar", url: "https://youtu.be/TQQPAU21ZUw", resource: "YouTube Server Components", exercise: "'use client' vs server default\nFetch data côté serveur" },
          { id: "v10", label: "Server Actions + Data Fetching", day: "Mer", url: "https://nextjs.org/docs/app/building-your-application/data-fetching", resource: "Next.js Data Fetching", exercise: "'use server', revalidatePath\ncache, revalidate options" },
          { id: "v11", label: "Middleware + Route Handlers", day: "Jeu", url: "https://nextjs.org/docs/app/building-your-application/routing/middleware", resource: "Next.js Middleware", exercise: "middleware.ts auth check\napp/api/route.ts handlers" },
          { id: "v12", label: "Tailwind + shadcn/ui", day: "Ven", url: "https://ui.shadcn.com/", resource: "shadcn/ui", exercise: "Responsive, dark mode\nComponents: Button, Card, Dialog" },
          { id: "v13", label: "Projet: App Next.js moderne", day: "Sam", url: "https://vercel.com/", resource: "Vercel deploy", exercise: "Dashboard App Router\nDeploy Vercel → GitHub" },
        ],
      },
      {
        id: "vw3",
        title: "Next.js Avancé",
        tasks: [
          { id: "v14", label: "NextAuth.js", day: "Lun", url: "https://next-auth.js.org/", resource: "NextAuth.js docs", exercise: "Google/GitHub OAuth\nCredentials, sessions, JWT" },
          { id: "v15", label: "Prisma ORM", day: "Mar", url: "https://www.prisma.io/docs/getting-started", resource: "Prisma Getting Started", exercise: "schema.prisma, migrate dev\nprisma.visit.findMany()" },
          { id: "v16", label: "TanStack Query", day: "Mer", url: "https://tanstack.com/query/latest/", resource: "TanStack Query docs", exercise: "useQuery, useMutation\nCache, optimistic updates" },
          { id: "v17", label: "ISR + Streaming", day: "Jeu", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming", resource: "Next.js Streaming", exercise: "revalidate, Suspense boundaries\nLoading UI progressif" },
          { id: "v18", label: "Testing (Vitest+Playwright)", day: "Ven", url: "https://nextjs.org/docs/app/building-your-application/testing", resource: "Next.js Testing", exercise: "Unit: Vitest, E2E: Playwright\nCI: GitHub Actions" },
          { id: "v19", label: "Projet: SaaS Full-Stack", day: "Sam", url: "https://github.com/shadcn-ui/taxonomy", resource: "Taxonomy (shadcn)", exercise: "Auth+dashboard+API\nNext.js+FastAPI → deploy" },
        ],
      },
    ],
  },
  {
    id: "vp3",
    title: "TYPESCRIPT + AI DEV",
    subtitle: "Generics · Zod · Cursor · Claude",
    period: "En parallèle",
    color: "#9878a8",
    icon: "🤖",
    weeks: [
      {
        id: "vw4",
        title: "TypeScript Avancé",
        tasks: [
          { id: "v20", label: "Generics + Utility types", day: "Lun", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", resource: "TS Handbook Generics", exercise: "<T>, Partial, Pick, Omit\nRecord, ReturnType" },
          { id: "v21", label: "Zod validation", day: "Mar", url: "https://zod.dev/", resource: "Zod docs", exercise: "z.object({...}), parse()\nZod + React Hook Form" },
          { id: "v22", label: "tRPC end-to-end types", day: "Mer", url: "https://trpc.io/docs", resource: "tRPC docs", exercise: "Type-safe API, no schema gen\ntRPC + Next.js" },
        ],
      },
      {
        id: "vw5",
        title: "AI-Assisted Dev",
        tasks: [
          { id: "v23", label: "Prompt engineering code", day: "Lun", url: "https://docs.anthropic.com/claude/docs", resource: "Claude docs", exercise: "Contexte+contraintes+format\nChain-of-thought pour debug" },
          { id: "v24", label: "Cursor + Copilot", day: "Mar", url: "https://cursor.sh/", resource: "Cursor IDE", exercise: "Tab completion, chat, composer\nComparer Cursor vs Copilot" },
          { id: "v25", label: "Code review + refactoring IA", day: "Mer", url: "https://docs.claude.com", resource: "Claude docs", exercise: "Soumettre code pour review\nRefactoring assisté par IA" },
          { id: "v26", label: "Générer tests+docs IA", day: "Jeu", url: "https://github.com/features/copilot", resource: "GitHub Copilot", exercise: "Tests pytest générés par IA\nDocstrings automatiques" },
          { id: "v27", label: "Projet: App complète avec IA", day: "Sam", url: "https://v0.dev/", resource: "Vercel v0", exercise: "Build app 3h Cursor+Claude\nDocumenter IA vs toi" },
        ],
      },
    ],
  },
  {
    id: "vp4",
    title: "FREELANCE",
    subtitle: "Auto-entrepreneur · Clients · Pricing",
    period: "En parallèle",
    color: "#c4854e",
    icon: "💼",
    weeks: [
      {
        id: "vw6",
        title: "Setup Indépendant",
        tasks: [
          { id: "v28", label: "Auto-entrepreneur URSSAF", day: "Lun", url: "https://www.autoentrepreneur.urssaf.fr/", resource: "URSSAF", exercise: "Créer statut en ligne\nTVA, URSSAF, impôts" },
          { id: "v29", label: "Portfolio + Malt/Comet", day: "Mar", url: "https://www.malt.fr/", resource: "Malt plateforme FR", exercise: "Profil complet, TJM 450-600€\nPositionnement Data+Full-Stack" },
          { id: "v30", label: "Trouver clients", day: "Mer", url: "https://youtu.be/5K5wvplH1bw", resource: "Freelance Dev YouTube", exercise: "LinkedIn outreach, réseau\nPremiers projets tarif réduit" },
          { id: "v31", label: "Pricing + devis + factures", day: "Jeu", url: "https://www.henrri.com/", resource: "Henrri (factures gratuites)", exercise: "Calculer TJM, template devis\nCGV, mentions légales" },
          { id: "v32", label: "Landing page freelance", day: "Ven", url: "https://astro.build/", resource: "Astro (site statique)", exercise: "nassim-data.dev\nServices, portfolio, contact, SEO" },
        ],
      },
    ],
  },
];
