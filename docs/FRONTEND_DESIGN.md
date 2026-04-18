# Vaxi Babu — Frontend Design Document

**Version:** 1.0
**Date:** 2026-04-11
**Phase:** 2 - Frontend Core

---

## Overview

This document outlines the frontend design for Vaxi Babu, a voice-first health memory system for families. The frontend connects to the FastAPI backend and provides a mobile-first, accessible interface for low-literacy users.

---

## Tech Stack

| Technology      | Purpose         |
| --------------- | --------------- |
| Next.js 16      | Framework       |
| TypeScript      | Type safety     |
| Tailwind CSS    | Styling         |
| TanStack Query  | Server state    |
| React Hook Form | Form handling   |
| Zod             | Validation      |
| Framer Motion   | Animations      |
| Prisma          | Database ORM    |
| Dexie (future)  | Offline storage |

---

## Pages Required

### 0. Landing Page (`/`)

**Purpose:** Public landing page - first impression for new users

**Features:**

- App logo and tagline ("Your family's health memory")
- Value proposition in simple language
- Language selector (English / हिंदी)
- "Get Started" CTA button
- Brief feature highlights (3-4 bullet points)
- How it works (2-3 steps)
- Trust indicators (free, private, voice-first)
- Login link (for returning users)

**Design:**

- Clean, welcoming aesthetic
- Minimal text (visual-first)
- Large "Get Started" button
- Mobile-optimized
- Fast load (static preferred)

**Flow:**

```
[Landing] → [Select Language] → [Create Household or Login] → [Dashboard]
```

---

### 1. Dashboard/Home (`/`)

**Purpose:** Quick action hub after login

**Features:**

- Welcome message with household name
- "Next Due" card (most urgent health action)
- Quick action buttons: "Add Child", "View Timeline", "Check Medicine"
- Recent activity summary
- Voice interaction trigger (microphone icon)
- Reminders count badge

**Design:**

- Action-oriented dashboard
- Cards for key info
- Large, touch-friendly buttons (min 56px tap targets)
- Voice-first: actions accessible via voice commands

---

### 2. Onboarding - Create Household (`/households/new`)

**Purpose:** Set up family unit

**Form Fields:**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Household Name | text | 3-200 chars | Yes |
| Primary Language | select (en/hi) | | Yes |
| Village/Town | text | 0-200 chars | No |
| State | text | 0-100 chars | No |
| District | text | 0-100 chars | No |

**Flow:**

1. Enter household details
2. Redirect to add first dependent

---

### 3. Household List (`/households`)

**Purpose:** View and manage families

**Features:**

- List all households
- Search/filter by name
- Delete with confirmation
- Edit household details

---

### 4. Add Dependent (`/dependents/new`)

**Purpose:** Add family member (child/pregnant/adult/elder)

**Form Fields:**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Name | text | 2-200 chars | Yes |
| Type | select (child/adult/elder/pregnant) | | Yes |
| Date of Birth | date | | Yes (if child/adult/elder) |
| Sex | select (male/female/other) | | Yes |
| Expected Delivery Date | date | | Yes (if pregnant) |
| Notes | textarea | 0-500 chars | No |

**Auto-Action:** On save, generate health timeline for children

---

### 5. Dependent List (`/dependents`)

**Purpose:** View family members

**Features:**

- List dependents by household
- Filter by type
- Show age/DOB
- Link to individual timeline

---

### 6. Health Timeline (`/timeline/[dependent_id]`)

**Purpose:** View vaccination and health schedule

**Features:**

- Timeline visualization (vertical)
- Status badges: 🟢 Upcoming | 🟡 Due | 🔴 Overdue | ✅ Completed
- Next due event at top (prominent)
- Filter by status
- Filter by category (vaccination/checkup/vitamin)
- Mark as complete with:
  - Date done
  - Location
  - Healthcare worker name
- AI explanation button per event

**Event Card:**

```
┌────────────────────────────────────┐
│ 💉 BCG                              │
│ Due: 2026-04-15  |  Window: Apr 15-30 │
│ Status: DUE                         │
│ [Explain] [Mark Done]              │
└────────────────────────────────────┘
```

---

### 7. Medicine Safety Checker (`/medicine`)

**Purpose:** Check medicine safety via image or name

**Methods:**

**A. Upload Image**

- Drag & drop or camera capture
- Supported: JPEG, PNG, WebP, HEIC
- Show OCR extracted text
- Display safety result

**B. Enter Name**

- Text input for medicine name
- Optional: concern (pregnancy/children/allergy)
- Display safety result

**Safety Result Display:**
| Bucket | Display | Color |
|--------|---------|-------|
| common_use | ✅ Usually okay | Green |
| use_with_caution | ⚠️ Use with caution | Yellow |
| insufficient_information | ❓ Not enough info | Gray |
| consult_doctor_urgently | 🚨 Talk to doctor now | Red |

---

### 8. Reminders (`/reminders`)

**Purpose:** View pending reminders

**Features:**

- List by household/dependent
- Filter by status (pending/snoozed/completed)
- Snooze action (set date)
- Mark as done
- Voice notification trigger

---

### 9. Settings (`/settings`)

**Purpose:** App configuration

**Options:**

- Language (English/Hindi)
- Notification preferences
- Voice settings
- Data export/import (future)

---

## Component Library

### Core Components

| Component    | Purpose                                    |
| ------------ | ------------------------------------------ |
| Button       | Primary, secondary, danger, voice triggers |
| Input        | Text, date, select, textarea               |
| Card         | Event cards, summary cards                 |
| Badge        | Status indicators                          |
| Timeline     | Vertical health timeline                   |
| VoiceButton  | Microphone trigger for voice input         |
| LoadingState | Skeleton loaders                           |
| EmptyState   | No data states                             |
| ErrorState   | Error handling                             |

### Shared Types

```typescript
interface Household {
  id: string;
  name: string;
  primary_language: "en" | "hi";
  village_town?: string;
  state?: string;
  district?: string;
}

interface Dependent {
  id: string;
  household_id: string;
  name: string;
  type: "child" | "adult" | "elder" | "pregnant";
  date_of_birth: string;
  sex: "male" | "female" | "other";
  expected_delivery_date?: string;
}

interface HealthEvent {
  id: string;
  dependent_id: string;
  household_id: string;
  name: string;
  schedule_key: string;
  category: "vaccination" | "checkup" | "vitamin" | "reminder";
  dose_number?: number;
  due_date: string;
  window_start?: string;
  window_end?: string;
  status: "upcoming" | "due" | "overdue" | "completed";
  completed_at?: string;
  completed_by?: string;
  location?: string;
}

interface MedicineCheck {
  detected_medicine: string;
  bucket:
    | "common_use"
    | "use_with_caution"
    | "insufficient_information"
    | "consult_doctor_urgently";
  why_caution: string;
  next_step: string;
}
```

---

## API Integration

### Backend Endpoints

| Endpoint                         | Method           | Purpose                 |
| -------------------------------- | ---------------- | ----------------------- |
| `/api/v1/households`             | GET, POST        | List/create households  |
| `/api/v1/households/:id`         | GET, PUT, DELETE | Single household        |
| `/api/v1/dependents`             | GET, POST        | List/create dependents  |
| `/api/v1/dependents/:id`         | GET, PUT, DELETE | Single dependent        |
| `/api/v1/timeline/:dependent_id` | GET              | Get health timeline     |
| `/api/v1/timeline/:id/complete`  | POST             | Mark event complete     |
| `/api/v1/reminders`              | GET              | List reminders          |
| `/api/v1/medicine/check-name`    | POST             | Check medicine by name  |
| `/api/v1/medicine/check-image`   | POST             | Check medicine by image |
| `/api/v1/ai/explain-event`       | POST             | AI explanation          |
| `/api/v1/voice/webhook`          | POST             | Vapi voice calls        |

### TanStack Query Setup

```typescript
// Query keys
const keys = {
  households: ["households"] as const,
  dependents: (householdId: string) => ["dependents", householdId] as const,
  timeline: (dependentId: string) => ["timeline", dependentId] as const,
  reminders: (householdId: string) => ["reminders", householdId] as const,
};
```

---

## Voice-First Design Rules

1. **Big buttons:** Minimum 56px height for touch
2. **High contrast:** WCAG AA compliant
3. **Simple language:** Grade 5 reading level
4. **Voice triggers:** Always accessible via mic
5. **Text fallback:** Always available when voice fails

---

## Animations (Framer Motion)

| Animation        | Use Case              |
| ---------------- | --------------------- |
| Fade in          | Page transitions      |
| Slide up         | Modal opens           |
| Scale tap        | Button press feedback |
| Stagger children | List items            |

---

## Responsive Breakpoints

| Breakpoint | Width  | Target           |
| ---------- | ------ | ---------------- |
| sm         | 640px  | Mobile landscape |
| md         | 768px  | Tablet           |
| lg         | 1024px | Desktop          |
| xl         | 1280px | Large desktop    |

**Mobile-first:** Design for 320px first, then scale up

---

## Implementation Priority

### P0 - Must Have

1. Household create/list
2. Dependent create/list
3. Health timeline display
4. Mark event complete
5. Next due prominent display

### P1 - Should Have

6. Medicine check by name
7. Medicine check by image
8. Reminders view
9. Search/filter

### P2 - Nice to Have

10. Settings page
11. Voice trigger
12. Offline support
13. Data export

---

## File Structure

```
Frontend/src/
├── app/
│   ├── page.tsx                    # Home
│   ├── layout.tsx                  # Root layout
│   ├── households/
│   │   ├── page.tsx               # List
│   │   └── new/page.tsx            # Create
│   ├── dependents/
│   │   ├── page.tsx               # List
│   │   └── new/page.tsx           # Create
│   ├── timeline/
│   │   └── [dependent_id]/page.tsx
│   ├── medicine/
│   │   └── page.tsx
│   ├── reminders/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/
│   ├── ui/                        # Base components
│   ├── forms/                     # Form components
│   ├── timeline/                  # Timeline components
│   └── voice/                     # Voice components
├── lib/
│   ├── api.ts                     # API client
│   ├── query.ts                   # Query setup
│   └── utils.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

---

## Success Criteria (from ROADMAP.md Phase 2)

1. ✅ Next.js app runs with TypeScript strict mode
2. ✅ User can create and manage households
3. ✅ User can add/edit/remove dependents
4. ✅ Health timeline displays correctly with status indicators
5. ✅ Next due action is prominently displayed
6. ✅ User can mark events as done
7. ✅ Prisma schema syncs with database
8. ✅ Basic authentication works (login/logout)
9. ✅ Mobile-responsive design works on 320px+ screens

---

## Notes

- All medical content: never diagnose, always default to "consult doctor"
- Voice-first: minimize typing, maximize voice
- Offline-ready: cache key data for low-connectivity
- Simplicity: one action per screen when possible
