# WellSyncAI

> A voice-first health memory system for families.

WellSync AI lets families track and recall health information through natural voice interaction, powered by Groq AI and Vapi.

## Monorepo Layout

```
wellsync-ai/
├── apps/
│   ├── web/          # Next.js 16 frontend (App Router, TypeScript, Tailwind, shadcn/ui)
│   └── api/          # FastAPI backend (Python)
├── packages/
│   ├── ui/           # Shared React component library
│   ├── shared-types/ # TypeScript types shared across apps
│   ├── database/     # Prisma ORM schema and client (Neon Postgres)
│   ├── health-rules/ # Business logic for health rules
│   ├── api-client/   # Auto-generated or hand-crafted API client
│   ├── config/       # Shared configuration (ESLint, Tailwind, etc.)
│   └── prompts/      # AI prompt templates and utilities
├── docs/
│   ├── requirements/ # Project requirements
│   ├── architecture/ # Architecture decision records
│   ├── api/          # API documentation
│   ├── prompts/      # Prompt engineering notes
│   └── changelog/    # Release notes
└── .github/
    ├── instructions/ # AI-agent coding instructions
    ├── prompts/      # GitHub Copilot prompt files
    └── workflows/    # CI/CD workflows
```

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend   | FastAPI, Python                                 |
| Database  | Neon Postgres, Prisma ORM                       |
| Voice     | Vapi AI                                         |
| AI        | Groq API                                        |
| Monorepo  | Turborepo, pnpm                                 |
| Offline   | PWA, IndexedDB                                  |
| Testing   | Vitest, React Testing Library, Pytest, Playwright |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev
```
