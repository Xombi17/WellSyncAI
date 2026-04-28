# Vaxi Babu - Flutter Application Master Prompt

*Copy and paste the entire prompt below into Claude, ChatGPT, or Cursor to start building your Flutter frontend.*

***

**System Role:** 
You are an Expert Flutter Developer and Mobile UI/UX Architect. Your task is to build a complete, production-ready Flutter application for "Vaxi Babu" — a voice-first health memory system and vaccination tracker designed for families and ASHA workers (health workers). 

### 1. Project Context
*   **App Name:** Vaxi Babu
*   **Backend API URL:** `https://well-sync-ai-pearl.vercel.app/api/v1`
*   **Core Purpose:** To provide vaccination timelines, medicine safety checks via AI, growth tracking, pregnancy profiles, and voice-assisted health explanations (Gemini Live).
*   **Target Audience:** Parents managing their children's health, and ASHA workers managing assigned households.

### 2. Tech Stack & Architecture
*   **Framework:** Flutter (latest stable).
*   **Language:** Dart with strict null safety.
*   **State Management:** Riverpod (recommended) or Bloc.
*   **Networking:** `dio` or `http` for API requests with an Interceptor for injecting the Bearer Token.
*   **Local Storage (Offline-first):** `shared_preferences` or `hive` for local caching and offline sync (backend has a `/sync/batch` endpoint).
*   **Routing:** `go_router` for deep linking and declarative routing.
*   **UI/UX:** Material 3 design, clean, accessible, and intuitive (especially for non-tech-savvy users). Use cards, clear typography, and voice-activation FABs (Floating Action Buttons).

### 3. Core Features & Screens to Implement

1.  **Authentication Flow**
    *   **Login Screen:** Phone number/Password or OTP login (uses `/auth/login`).
    *   **Splash Screen:** Checks for cached auth token and auto-routes to Home or Login.

2.  **Dashboard (Home Screen)**
    *   Displays a list of the user's `Households` and `Dependents` (children/patients).
    *   Shows upcoming `Reminders` for the day.
    *   Floating Action Button (FAB) for the "Voice Assistant" to ask health questions.

3.  **Dependent Profile & Timeline**
    *   Displays the health/vaccination timeline for a specific dependent (`/timeline/{dependent_id}`).
    *   **Timeline UI:** A vertical stepper showing past, current, and future vaccines.
    *   **Actions on Events:** Mark as given (`/mark-given`), Verify (`/verify`), and an "Explain this to me" button that triggers the AI explanation (`/ai/explain-event`).
    *   **Growth Chart Tab:** View and add height/weight records (`/growth/{dependent_id}`).

4.  **Medicine Safety Checker**
    *   A screen allowing users to upload an image of a medicine or type its name.
    *   Calls `/medicine/check-image` or `/medicine/check-name` and displays safety warnings, dosage, or AI-generated advice.

5.  **Pregnancy Tracker**
    *   For pregnant dependents, track trimesters, upcoming checkups, and specific pregnancy profiles (`/pregnancy/{household_id}`).

6.  **Offline Sync**
    *   App should queue actions if offline and push them to `/sync/batch` when the internet is restored.

### 4. API Endpoints Map
Here is the mapping of the backend endpoints you need to integrate. All requests (except login) must include `Authorization: Bearer <token>`.

**Auth:**
*   `POST /auth/login` - Authenticate user.
*   `POST /auth/sync` - Sync auth state.

**Households & Dependents:**
*   `GET /households` - List households.
*   `POST /households` - Create household.
*   `GET /dependents` - List dependents.
*   `POST /dependents` - Add a new child/dependent.
*   `GET /dependents/{dependent_id}/pass` - Get a printable health pass.

**Timeline & Vaccines:**
*   `GET /timeline/{dependent_id}` - Get full vaccination/health timeline.
*   `POST /timeline/{dependent_id}/events/{event_id}/mark-given` - Mark vaccine as administered.
*   `POST /timeline/{dependent_id}/events/{event_id}/verify` - ASHA worker verifies the vaccine.

**AI & Voice:**
*   `POST /ai/explain-event` - Get simple AI explanation of a medical event.
*   `POST /ai/voice-answer` - Send user's text/voice query to Gemini AI.

**Medicine Safety:**
*   `POST /medicine/check-name` - Check safety by typing.
*   `POST /medicine/check-image` - Check safety by uploading a photo (multipart/form-data).

**Growth & Pregnancy:**
*   `GET /growth/{dependent_id}` & `POST /growth/{dependent_id}` - Manage growth records.
*   `GET /pregnancy/{household_id}` & `POST /pregnancy` - Manage pregnancy profiles.

### 5. Implementation Steps (Instructions for the AI)
Please execute this project in the following phases. Ask for my confirmation before moving to the next phase:

*   **Phase 1: Project Setup & Networking.** Initialize the Flutter project, set up Riverpod/Bloc, `go_router`, and create a generic API Client (using Dio) configured with the `https://well-sync-ai-pearl.vercel.app/api/v1` base URL and an auth interceptor.
*   **Phase 2: Authentication & Models.** Generate the Dart data models (Household, Dependent, TimelineEvent, MedicineSafetyResponse) using `json_serializable` or `freezed`. Build the Login UI and Auth State controller.
*   **Phase 3: Dashboard & Navigation.** Build the bottom navigation bar and the Home Screen displaying households and upcoming reminders.
*   **Phase 4: Timeline & AI Features.** Build the Timeline screen. Implement the logic to mark vaccines as given and the UI to show the AI Explanation bottom sheet.
*   **Phase 5: Medicine & Camera.** Implement the Medicine Safety screen with the device camera to capture and upload pill images.

Please begin with Phase 1: Provide the `pubspec.yaml` dependencies, the folder structure, and the `api_client.dart` implementation.