# Sportradar Event Calendar

A sports event calendar built as a recruitment task for Sportradar. The goal was to create a polished, production-quality frontend application — not just a working prototype.

---

## Overview

The app lets users browse a monthly calendar of sports events, view full event details, add new events during a session, and filter the schedule by sport. All data survives page refresh via localStorage. The visual language is inspired by sports score sites like Flashscore: dark background, high contrast, minimal chrome.

---

## Features

### Core (required)

| # | Task | Status |
|---|------|--------|
| 1 | **Calendar View** — monthly grid, current month highlighted, event indicators on days | Done |
| 2 | **Event Detail Page** — full info: sport, teams, score, venue, date/time, status, timeline | Done |
| 3 | **Add Event** — controlled form with inline validation, new events appear on the calendar | Done |
| 4 | **Responsiveness** — tested at 375 px (mobile), 768 px (tablet), 1280 px (desktop) | Done |
| 5 | **Navigation** — sticky navbar with hamburger menu on mobile, accessible from every page | Done |

### Optional (treated as required)

| # | Feature | Status |
|---|---------|--------|
| 6 | **Filters** — filter by sport type; date range via an inline calendar picker; filters sync to URL searchParams so links are shareable | Done |
| 7 | **Styling** — consistent design system, Source Sans 3 font, grid background accent | Done |
| 8 | **Persistent Storage** — localStorage with graceful fallback to JSON seed on corruption | Done |
| 9 | **Testing** — unit tests for date helpers, form validation, `useEvents` hook, and `AddEventForm` component | Done |

---

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start

# Lint
npm run lint

# Run tests (watch mode)
npm run test

# Run tests (CI / single pass)
npm run test:run
```

Node 20+ required.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 — strict mode, no `any` |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react ^1.7.0 |
| Testing | Vitest + jsdom + @testing-library/react |

---

## Design System

**Philosophy**: minimalism and precision — sports-app aesthetic, 60-30-10 color rule, nothing decorative that doesn't carry information.

**Color palette** (Tailwind only — no hex values, no custom names):

| Role | Token |
|------|-------|
| Page background | `neutral-900` |
| Primary text | `neutral-50` |
| Component background | `blue-950` |
| Accent / highlight | `red-600` |
| Hierarchy | lower-opacity variants of the four above |

**Typography**: [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) — loaded via `next/font/google`, applied globally. Clean and readable at small sizes, well-suited for dense data.

**Mobile First**: all layouts are designed for 375 px first, then scaled up with Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). Touch targets are large enough for fingers; the nav collapses to a hamburger on small screens.

---

## Architecture

```
sportradar-event-calendar/
├── app/                        # Routing only — no UI logic
│   ├── layout.tsx              # Root layout: Navbar + font + globals.css
│   ├── page.tsx                # / → Calendar
│   ├── events/[id]/page.tsx    # /events/:id → Event detail
│   └── add-event/page.tsx      # /add-event → Add event form
│
├── components/
│   ├── ui/                     # Generic primitives (Badge, GridBg, TeamBadge, Icons)
│   ├── nav/                    # Nav.tsx — sticky header with mobile hamburger
│   ├── calendar/               # Calendar orchestrator + all sub-components
│   ├── events/                 # Event detail orchestrator + all sub-components
│   └── forms/                  # Form shell + AddEventForm (with tests)
│
├── lib/                        # Pure TypeScript — no JSX
│   ├── types.ts                # All interfaces (SportEvent, Team, EventResult, …)
│   ├── date-helpers.ts         # Date calculations (tested)
│   ├── form-validation.ts      # Validation logic (tested)
│   └── local-storage.ts        # localStorage read/write abstraction
│
├── hooks/
│   ├── use-events.ts           # Single source of truth for event state + localStorage sync
│   └── use-click-outside.ts    # Ref-based outside-click detection for dropdowns
│
├── data/
│   ├── events.json             # Mock seed data
│   └── sports.ts               # SPORTS constant — list of supported sport slugs
│
└── tests/                      # Co-located test files
```

**Key decisions:**

- **Server vs Client components** — default is Server Component; `"use client"` only where `useState`, `useEffect`, or browser APIs are needed. This keeps the bundle small.
- **URL-synced filters** — sport and date range filters live in `searchParams`, not component state. Links are shareable; filters survive refresh without localStorage.
- **`use-events` as the single source of truth** — the only hook that reads and writes `localStorage`. No other module touches storage directly.
- **Typed icon registry** — all Lucide imports go through `icon-registry.ts`; `IconName` type is derived automatically, so adding an icon means editing one file.

---

## Data Model

Events follow the structure from the provided JSON file, extended with fields needed for user-added events:

```ts
interface SportEvent {
  id: string;
  sport: string;             // 'soccer' | 'hockey'
  status: 'played' | 'scheduled' | 'live' | 'cancelled';
  dateVenue: string;         // YYYY-MM-DD
  timeVenueUTC: string;      // HH:MM:SS
  stadium: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  result: EventResult | null;
  originCompetitionName: string;
  // ...
}
```

User-added events use `stagePosition: null` on both teams — the detail page handles this gracefully.

---

## Testing

Tests cover the four areas with the most logic:

| File | What is tested |
|------|---------------|
| `tests/date-helpers.test.ts` | `isSameDay`, `formatDateString`, `getEventsForDay`, `getMonthGrid` — edge cases, leap years, month boundaries |
| `tests/form-validation.test.ts` | `validateNewEvent`, `isFormValid` — required fields, format rules, cross-field same-team check |
| `tests/use-events.test.ts` | Initialization from seed, `addEvent` — id generation, localStorage sync, field mapping |
| `tests/AddEventForm.test.tsx` | Rendering, submit validation, onBlur inline validation, error clearing |

`lib/` tests run as plain TypeScript (no DOM). Hook and component tests use `renderHook`, `render`, `screen`, and `userEvent`.

---

## Assumptions & Decisions

- **No database** — the task explicitly allows runtime-only persistence; localStorage was chosen as the optional persistent storage bonus.
- **Soccer and ice hockey** — the provided JSON contains only these two sports; the `SPORTS` constant reflects that.
- **`[id]` not `[...slug]`** — the route has one flat dynamic segment; a catch-all was not appropriate.
- **No animation library** — animations were deferred; only CSS transitions are used where needed (Tailwind `transition` utilities).
- **Strict TypeScript** — `any` is never used; all data shapes have explicit interfaces.
- **Max 10 Tailwind classes per element** — enforced as a self-imposed rule to keep templates readable and encourage component extraction.
