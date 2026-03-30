# Architecture

## Overview

The project is divided into four distinct layers:

- **`app/`** — routing only (Next.js App Router pages and root layout)
- **`components/`** — all UI logic and presentational components
- **`lib/`** — pure TypeScript logic with no JSX (date helpers, filters, validation, localStorage)
- **`data/`** — static mock data (JSON seed + sport constants)
- **`tests/`** — all test files in one place; use `@/` absolute imports to reference source

Page files in `app/` do one thing: import a component from `components/` and wire up props. No UI logic lives in `app/`.

---

## Folder Structure

```
sportradar-event-calendar/
├── app/
│   ├── layout.tsx                # Root layout — Navbar + font + globals.css
│   ├── page.tsx                  # / → Calendar view (Server Component)
│   ├── events/
│   │   └── [id]/
│   │       └── page.tsx          # /events/[id] → Event detail
│   └── add-event/
│       └── page.tsx              # /add-event → Add event form
│
├── components/
│   ├── ui/                       # Generic primitives — no domain knowledge
│   │   ├── Logo.tsx
│   │   ├── Badge.tsx
│   │   ├── GridBg.tsx
│   │   ├── TeamBadge.tsx
│   │   └── icons/
│   │       ├── Icons.tsx         # <Icon name="..." /> component
│   │       └── icon-registry.ts  # Single source of truth for Lucide imports
│   ├── nav/
│   │   └── Nav.tsx
│   ├── calendar/
│   │   ├── Calendar.tsx          # Orchestrator — composes all calendar sub-components
│   │   ├── CalendarHeader.tsx    # Month/year title + prev/next navigation
│   │   ├── CalendarControls.tsx  # Sport filter + date picker trigger
│   │   ├── CalendarGrid.tsx      # Monthly day grid with event indicators
│   │   ├── CalendarEventList.tsx # List of events for selected day
│   │   ├── CalendarPicker.tsx    # Inline date picker popover
│   │   └── index.ts              # Barrel — all calendar exports
│   ├── events/
│   │   ├── Event.tsx             # Orchestrator — composes all event detail sub-components
│   │   ├── EventHeader.tsx       # Back link + competition breadcrumb
│   │   ├── EventMeta.tsx         # Venue, date, time secondary info row
│   │   ├── EventScoreBlock.tsx   # Teams + score + status
│   │   ├── EventTimeline.tsx     # Goals, cards, periods timeline
│   │   └── index.ts              # Barrel — all event exports
│   └── forms/
│       ├── Form.tsx              # Shell — layout + cancel link (Client)
│       └── AddEventForm.tsx      # Controlled form with validation (Client)
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── date-helpers.ts           # Date calculations (unit-testable)
│   ├── event-filters.ts          # Filter logic (unit-testable) — not yet implemented
│   ├── form-validation.ts        # Validation logic (unit-testable)
│   └── local-storage.ts          # localStorage read/write abstraction
│
├── hooks/
│   ├── use-events.ts             # Event state + localStorage sync
│   └── use-click-outside.ts      # Ref-based outside click detection
│
├── tests/                        # All test files — centralized, use @/ absolute imports
│   ├── date-helpers.test.ts      # Pure unit tests — no DOM
│   ├── form-validation.test.ts   # Pure unit tests — no DOM
│   ├── use-events.test.ts        # Hook tests — renderHook + act
│   └── AddEventForm.test.tsx     # Component tests — render + userEvent
│
└── data/
    ├── events.json               # Mock seed data
    └── sports.ts                 # SPORTS constant — list of supported sport slugs
```

**Why `components/` parallel to `app/` (not colocated)?**
Component dependencies cross route boundaries — `Nav` is global, calendar components depend on event types from the events feature. The parallel structure makes every component equally discoverable regardless of which route uses it.

**Why `lib/` for pure logic?**
Task 9 requires unit tests for date helpers, filters, and validation. Logic in `lib/` has no React dependency — tests run as plain TypeScript with no DOM. No JSX in `lib/`, no imports from `components/`.

**Why `data/` at root?**
Placing it inside `app/` risks exposing it as a URL segment in certain Next.js configurations. Root-level `data/` communicates intent clearly: static seed, not a route.

**Why barrel `index.ts` files in `calendar/` and `events/`?**
Both folders contain multiple closely related sub-components. A barrel keeps import paths short and makes the public API of each feature explicit — consumers import from `@/components/calendar`, not from individual files.

**Why `icons/icon-registry.ts`?**
Single source of truth for all Lucide icon imports. Adding an icon means editing one file; `IconName` type is derived automatically — no manual enum maintenance.

---

## Routing

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Calendar view, current month |
| `/events/[id]` | `app/events/[id]/page.tsx` | Event detail |
| `/add-event` | `app/add-event/page.tsx` | Add event form |

**`[id]` not `[...slug]`** — catch-all routes are for hierarchical URL structures (e.g. `/shop/clothing/tops`). This project has one flat dynamic segment per route. `[id]` returns `params.id: string` directly — no array handling.

**Teams page** — not in TASK.md, not in scope.

**Next.js 16 breaking change** — `params` is a `Promise`. Server Component pages must `await params`:
```ts
const { id } = await params
```

---

## State Management

```
data/events.json  (seed)
       ↓
use-events hook  (useState + localStorage sync)
       ↓
Calendar.tsx  (Client orchestrator)
       ↑
URL searchParams  →  lib/event-filters.ts (to be extracted — Task 9)
```

- **Filters live in URL** (`searchParams`) — shareable links, survive refresh without localStorage, zero component state
- **`use-events`** is the single source of truth for runtime event data — the only place that reads and writes localStorage
- **`lib/local-storage.ts`** exposes exactly two functions: `loadEvents()` and `saveEvents(events)`

---

## Server vs Client Components

Default is Server Component. `"use client"` only when the component needs `useState`, `useEffect`, browser APIs, or interactive event handlers.

| Component | Type | Reason |
|---|---|---|
| `app/page.tsx` | Server | Reads `searchParams` |
| `app/events/[id]/page.tsx` | Server | `await params` |
| `app/add-event/page.tsx` | Server | Shell only |
| `Calendar.tsx` | **Client** | `useEvents`, `useSearchParams` |
| `CalendarHeader.tsx` | **Client** | `useRouter`, `useSearchParams` |
| `CalendarControls.tsx` | **Client** | `useState`, `useRouter`, `useSearchParams` |
| `CalendarGrid.tsx` | **Client** | `useRouter`, `useSearchParams` |
| `CalendarPicker.tsx` | **Client** | Controlled date picker UI |
| `CalendarEventList.tsx` | Server | Pure render from props |
| `Event.tsx` | Server | Pure render from props |
| `EventHeader.tsx` | Server | Pure render from props |
| `EventMeta.tsx` | Server | Pure render from props |
| `EventScoreBlock.tsx` | Server | Pure render from props |
| `EventTimeline.tsx` | Server | Pure render from props |
| `Nav.tsx` | **Client** | `useState` for menu toggle |
| `Form.tsx` | **Client** | Layout shell with cancel link |
| `AddEventForm.tsx` | **Client** | `useState`, submit handler |

Props crossing the Server→Client boundary must be serializable — no functions, no class instances, no `Date` objects.

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component files | PascalCase | `CalendarGrid.tsx` |
| Non-component files | kebab-case | `date-helpers.ts`, `use-events.ts` |
| Directories | kebab-case | `add-event/`, `icons/` |
| Hook exports | camelCase with `use` prefix | `useEvents`, `useClickOutside` |
| Interfaces | PascalCase | `SportEvent`, `EventFilter` |
| Constants | SCREAMING_SNAKE_CASE | `SPORTS`, `DAY_HEADERS` |
| Test files | centralized in `tests/` | `tests/date-helpers.test.ts` |

One component per file. No default exports for non-component modules.

---

## Tailwind CSS v4

- Import: `@import "tailwindcss"` — not `@tailwind base/components/utilities`
- Theme tokens defined in `@theme` block in `globals.css`
- Color palette: `neutral-900`, `neutral-50`, `blue-950` (primary bg), `blue-900/80` (nav hover), `red-600` and their opacity variants — no hex values, no custom color names
- Max 10 utility classes per element (excluding `hover:`, `focus:`, responsive variants). Exceeded → stop and discuss component extraction

---

## localStorage Contract

- Storage key: `"sportradar-events"`
- On app load: read from localStorage, fall back to `data/events.json` seed if empty or corrupted
- On add event: append to state array, write full array to localStorage
- Corruption handling: catch `JSON.parse` errors, fall back to seed silently
- No other module touches localStorage directly — only `lib/local-storage.ts`

---

## Testing Strategy

**Framework**: Vitest + jsdom + `@testing-library/react` + `@testing-library/user-event`

**Config**: `vitest.config.ts` — plugins: `@vitejs/plugin-react`, `vite-tsconfig-paths`; environment: `jsdom`; setup: `vitest.setup.ts` (imports `@testing-library/jest-dom`)

**Test files — centralized in `tests/`; all imports use `@/` absolute paths:**

| File | Scope | Tools |
|---|---|---|
| `tests/date-helpers.test.ts` | `isSameDay`, `formatDateString`, `getEventsForDay`, `getMonthGrid` — edge cases, leap years, month boundaries | Vitest only — no DOM |
| `tests/form-validation.test.ts` | `validateNewEvent`, `isFormValid` — required fields, format rules, cross-field (same-team) | Vitest only — no DOM |
| `tests/use-events.test.ts` | initialization, `addEvent` — id generation, localStorage sync, field mapping | `renderHook`, `act` |
| `tests/AddEventForm.test.tsx` | rendering, submit validation, onBlur inline validation, error clearing | `render`, `screen`, `userEvent` |

**Not tested**: `event-filters.ts` (not yet implemented), `local-storage.ts`, `use-click-outside.ts`, all other components.

---

## Animation Plan

Motion library not yet installed — deferred, to be decided after Task 9.

Planned animation points (if implemented):
- Page transitions — route change fade
- Calendar cell hover — background shift
- Event indicator — fade in on mount
- Add event form — slide in on mount
- Filter changes — opacity transition on list re-render
