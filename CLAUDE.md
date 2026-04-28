# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

- Read `PRD.md` before substantial changes. `AGENTS.md` treats it as mandatory.
- Also check `AGENTS.md` for repo-specific constraints.
- Important: some product docs lag the current implementation. When docs and code disagree on the active stack, trust the current code paths before making changes.

## Repository shape

This repo has three active application surfaces that share the same product domain:

- `Frontend/` — Next.js 15.5.15 App Router web app
- `Backend/` — FastAPI API and business logic
- `Mobile/` — Flutter cross-platform mobile client (ACTIVE)
- `Android/` — Native Jetpack Compose client (LEGACY: DEPRECATED)

The backend is the system of record for household/dependent/timeline data. Both the web app and Android app consume backend APIs and both have Gemini-based voice integrations that rely on backend tool endpoints.

## Common commands

### Frontend (`Frontend/`)

Use `npm`; the checked-in lockfile is `package-lock.json`.

```bash
cd Frontend
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run test:run
npm run e2e
npx vitest run __tests__/lib/auth.test.ts
```

Notes:
- `package.json` declares Node `24.x`, but GitHub Actions currently builds with Node `20`, so avoid casual engine/tooling changes.
- There is a `bun.lock`, but the actual scripts and CI are npm-based.

### Backend (`Backend/`)

Preferred local workflow uses `uv`, while CI installs from `requirements.txt`.

```bash
cd Backend
uv sync --extra dev
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
ruff check app/
mypy app/ --ignore-missing-imports
pytest tests/ -v
pytest tests/test_households.py -v
pytest tests/test_households.py -k create -v
```

CI-compatible install path:

```bash
cd Backend
pip install -r requirements.txt
```

Notes:
- Backend defaults to port `8080` locally.
- Environment is loaded from `.env` or `Backend/.env`.

### Mobile (Flutter) (`Mobile/`)

Active mobile development uses Flutter.

```bash
cd Mobile
flutter pub get
flutter run
flutter build apk
```

### Android (Legacy) (`Android/`)

Native Android is legacy. Prefer Android Studio. If local Gradle is available:

```bash
cd Android
gradle :app:assembleDebug
```

## High-level architecture

### Backend ownership

The FastAPI app in `Backend/app/main.py` initializes config, CORS, startup health checks, and mounts the `/api/v1` router assembled in `Backend/app/api/v1/router.py`.

The backend owns:
- household and dependent CRUD
- generated health timelines
- reminders, medicine, pregnancy, growth, auth, sync, notifications
- voice tool endpoints used by Gemini clients

Core backend structure:
- `app/api/v1/` — route modules by feature
- `app/core/` — settings, database, auth, startup health
- `app/models/` — SQLModel persistence models
- `app/schemas/` — request/response schemas
- `app/services/` — business logic, especially the deterministic health schedule engine
- `tests/` — backend test suite

### Deterministic health logic vs AI

This codebase is intentionally deterministic-first for medical workflows:
- schedule generation and medical status logic belong in backend services/rules
- LLMs are for explanation, conversational UX, and OCR-adjacent assistance, not for deciding schedules or safety outcomes

When touching health logic, look in `Backend/app/services/health_schedule/` before changing API or UI behavior.

### Web app structure

The web app is a Next.js App Router project with protected app routes under `Frontend/app/(app)/` and shared layout/navigation in `Frontend/components/AppLayout.tsx`.

Important pieces:
- `Frontend/lib/api.ts` — typed fetch client for backend REST APIs; attaches bearer token from `localStorage` and clears auth state on `401`
- `Frontend/components/AppLayout.tsx` — main authenticated shell and global `VoiceFAB`
- `Frontend/hooks/use-live-api.ts` — core Gemini Live session hook, audio handling, session protection, and tool declarations
- `Frontend/lib/gemini-voice.ts` — thin bridge over `useLiveAPI`
- `Frontend/components/VoiceFAB.tsx` — UI entry point for voice sessions

The frontend talks directly to Gemini for live voice, but uses backend endpoints for tool data.

### Voice flow

Current voice stack is Gemini-based, not Vapi-based.

Web flow:
1. `VoiceFAB` starts a session.
2. `use-live-api.ts` opens the Gemini Live session, fetches household/dependent context from backend APIs, and declares tools.
3. Tool calls are fulfilled via backend voice endpoints in `Backend/app/api/v1/voice.py`.

Mobile (Flutter) flow mirrors this architecture.

Legacy Android flow:
- `Android/app/src/main/java/com/vaxibabu/vaxi/data/voice/GeminiVoiceClient.kt` manages session state and session protection.
- `Android/app/src/main/java/com/vaxibabu/vaxi/data/voice/VoiceToolHandler.kt` forwards Gemini tool calls to the FastAPI backend.

Do not reintroduce Vapi/ElevenLabs-style code paths unless the user explicitly wants a voice stack change.

### Mobile (Flutter) structure

The Flutter app in `Mobile/` is the active cross-platform client.
- `lib/main.dart` — entry point
- `lib/screens/` — UI screens
- `lib/services/` — API and voice services

### Legacy Android structure

The Android app in `Android/` is a separate native client (deprecated).
- `ui/` — screens, view models, Compose UI
- `navigation/NavGraph.kt` — auth-gated navigation and floating voice entry points
- `data/api/` — backend API interfaces
- `data/auth/` — auth/session storage
- `data/voice/` — Gemini voice session and tool bridge
- `di/` — Hilt modules

The Android app uses `BuildConfig` values sourced from `local.properties`, not from `.env` files.

## Important repo-specific constraints

- `PRD.md` and `AGENTS.md` both emphasize avoiding speculative architecture changes.
- Backend data logic is SQLModel-based; do not assume Prisma owns backend persistence.
- The currently active voice implementation is Gemini Live in both web and Android code.
- The frontend and backend are both wired around a backend base URL of `http://localhost:8080` by default.
- The Android-specific `Android/CLAUDE.md` is generated project context for that subproject; use it as supplemental detail, not as the repository-wide source of truth.

## Practical navigation hints

When investigating a feature, start from these anchors:
- API surface: `Backend/app/api/v1/router.py`
- Backend startup/config: `Backend/app/main.py`, `Backend/app/core/config.py`
- Web data client: `Frontend/lib/api.ts`
- Web authenticated shell: `Frontend/components/AppLayout.tsx`
- Web voice runtime: `Frontend/hooks/use-live-api.ts`
- Android navigation: `Android/app/src/main/java/com/vaxibabu/vaxi/navigation/NavGraph.kt`
- Android voice runtime: `Android/app/src/main/java/com/vaxibabu/vaxi/data/voice/GeminiVoiceClient.kt`

## Testing/linting expectations from CI

Frontend CI runs:
- `npm run lint`
- `npm run test:run`
- `npm run build`

Backend CI runs:
- `ruff check app/`
- `mypy app/ --ignore-missing-imports`
- `pytest tests/ -v --cov=app --cov-report=xml`

Security CI runs Trivy and TruffleHog across the repo.
