---
applyTo: "apps/api/**"
---

# Backend Instructions

The backend lives in `apps/api` and is a **FastAPI** application written in **Python 3.12+**.

## Stack

- **FastAPI** — async REST API framework
- **Prisma (Python client)** — database access to Neon Postgres
- **Groq API** — LLM inference
- **Vapi AI** — voice webhook handling
- **Pytest** — testing

## Rules for AI Agents

1. All route handlers go under `apps/api/app/routers/`.
2. All data models (Pydantic schemas) go under `apps/api/app/schemas/`.
3. All database access logic goes under `apps/api/app/services/`.
4. Never expose raw database models in API responses — always use Pydantic schemas.
5. Never put API keys or secrets in source code; read them from environment variables.
6. All Groq and Vapi calls must be made server-side, never forwarded from the frontend.
7. Write Pytest tests for all route handlers and service functions.
8. Keep the database schema source of truth in `packages/database/prisma/schema.prisma`; do not define separate SQL migrations by hand.
