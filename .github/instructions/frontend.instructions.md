---
applyTo: "apps/web/**"
---

# Frontend Instructions

The frontend lives in `apps/web` and is a **Next.js 16 App Router** application written in **TypeScript**.

## Stack

- **Next.js 16** (App Router, React Server Components)
- **TypeScript** — strict mode enabled
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component primitives
- **Framer Motion** — animations
- **Vapi AI** — voice interface SDK
- **PWA + IndexedDB** — offline support

## Rules for AI Agents

1. All new pages go under `apps/web/src/app/`.
2. All reusable UI components go in `packages/ui` or `apps/web/src/components/` if they are app-specific.
3. Never call the Groq or Vapi APIs directly from the frontend — route all AI calls through `apps/api`.
4. Shared TypeScript types must be imported from `packages/shared-types`, not duplicated.
5. Follow the file-based routing conventions of the Next.js App Router (e.g., `page.tsx`, `layout.tsx`, `loading.tsx`).
6. Use Tailwind classes for all styling; avoid inline styles.
7. Write Vitest unit tests for utility functions and React Testing Library tests for components.
8. Write Playwright e2e tests for user-facing flows.
