# WellSync AI — Final Project Requirements

> **Status**: Draft  
> **Last updated**: 2026-04-11

## 1. Overview

WellSync AI is a voice-first health memory system for families. It allows family members to log, recall, and share health information using natural voice interaction.

## 2. Goals

- Provide a frictionless way to capture health events (symptoms, medications, appointments, vitals) by voice.
- Make health history accessible to the entire family in a structured, searchable way.
- Support offline usage via PWA + IndexedDB so the app works without internet.
- Respect user privacy — all health data is stored in the family's own Neon Postgres instance.

## 3. User Stories

- As a parent, I want to say "log that my son had a fever of 38.5°C today" and have it saved automatically.
- As a family member, I want to ask "what medications is grandma taking?" and get an accurate answer.
- As a caregiver, I want to receive a weekly summary of notable health events.

## 4. Stack

| Layer     | Technology                                                      |
|-----------|-----------------------------------------------------------------|
| Frontend  | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend   | FastAPI, Python 3.12+                                           |
| Database  | Neon Postgres, Prisma ORM                                       |
| Voice     | Vapi AI                                                         |
| AI        | Groq API                                                        |
| Monorepo  | Turborepo, pnpm                                                 |
| Offline   | PWA, IndexedDB                                                  |
| Testing   | Vitest, React Testing Library, Pytest, Playwright               |

## 5. Architecture Constraints

- Frontend and backend are separate apps under `apps/`.
- Shared TypeScript types live in `packages/shared-types`.
- Database schema and Prisma client live in `packages/database`.
- Business rules (e.g., medication interaction checks) live in `packages/health-rules`.
- AI prompt templates live in `packages/prompts`.
- No third-party data sharing — all AI calls happen server-side via `apps/api`.

## 6. Out of Scope (v1)

- Real-time multi-user collaboration
- Native mobile apps (iOS/Android)
- Third-party EHR integrations
