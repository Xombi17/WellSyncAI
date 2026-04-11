---
applyTo: "**"
---

# Repository Instructions

This repository is a **monorepo** managed with **Turborepo** and **pnpm workspaces**.

## Structure

| Path                   | Purpose                                              |
|------------------------|------------------------------------------------------|
| `apps/web`             | Next.js 16 frontend                                  |
| `apps/api`             | FastAPI backend                                      |
| `packages/database`    | Prisma schema and generated client                   |
| `packages/ui`          | Shared React component library                       |
| `packages/shared-types`| TypeScript types shared between frontend and backend |
| `packages/health-rules`| Health-domain business logic                         |
| `packages/api-client`  | API client for the frontend to call the backend      |
| `packages/config`      | Shared tooling configuration (ESLint, Tailwind, …)   |
| `packages/prompts`     | AI prompt templates and helpers                      |
| `docs/`                | Project documentation                                |
| `.github/`             | CI/CD workflows and AI-agent instructions            |

## Rules for AI Agents

1. **Read the requirements first**: Always read `docs/requirements/wellsync_final_project_requirements.md` before making changes.
2. **Respect the split**: Keep frontend code in `apps/web`, backend code in `apps/api`, database code in `packages/database`, and documentation in `docs/`.
3. **No cross-contamination**: Do not add Python code to frontend packages or TypeScript code to the Python backend.
4. **Minimal changes**: Make the smallest change that fully addresses the task. Do not refactor unrelated code.
5. **No secrets**: Never commit `.env` files or API keys.
