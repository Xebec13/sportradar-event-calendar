# Architecture

## Overview

The project is divided into four distinct layers:

- **`app/`** — routing only (Next.js App Router pages and root layout)
- **`components/`** — all UI logic and presentational components
- **`lib/`** — pure TypeScript logic with no JSX (date helpers, filters, validation, localStorage)
- **`data/`** — static mock data (JSON seed)

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
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   ├── calendar/
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarCell.tsx
│   │   └── CalendarHeader.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   └── EventDetail.tsx
│   ├── filters/
│   │   └── FilterBar.tsx
│   └── forms/
│       └── AddEventForm.tsx
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── date-helpers.ts           # Date calculations (unit-testable)
│   ├── event-filters.ts          # Filter logic (unit-testable)
│   ├── form-validation.ts        # Validation logic (unit-testable)
│   └── local-storage.ts          # localStorage read/write abstraction
│
├── hooks/
│   └── use-events.ts             # Event state + localStorage sync
│
└── data/
    └── events.json               # Mock seed data
```

**Why `components/` parallel to `app/` (not colocated)?**
Component dependencies cross route boundaries — `Navbar` is global, `CalendarCell` depends on event types from the events feature. The parallel structure makes every component equally discoverable regardless of which route uses it.

**Why `lib/` for pure logic?**
Task 9 requires unit tests for date helpers, filters, and validation. Logic in `lib/` has no React dependency — tests run as plain TypeScript with no DOM. No JSX in `lib/`, no imports from `components/`.

**Why `data/` at root?**
Placing it inside `app/` risks exposing it as a URL segment in certain Next.js configurations. Root-level `data/` communicates intent clearly: static seed, not a route.

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
Components
       ↑
URL searchParams  →  lib/event-filters.ts
```

- **Filters live in URL** (`searchParams`) — shareable links, survive refresh without localStorage, zero component state
- **`use-events`** is the single source of truth for runtime event data — the only place that reads and writes localStorage
- **`lib/local-storage.ts`** exposes exactly two functions: `loadEvents()` and `saveEvents(events)`

---

## Data Model

Defined in `lib/types.ts`:

```ts
interface SportEvent {
  id: string
  date: string      // ISO 8601: "2019-07-18"
  time: string      // "18:30"
  sport: string
  homeTeam: string
  awayTeam: string
  venue?: string
  status?: "scheduled" | "live" | "finished"
}

interface EventFilter {
  sport: string | null
  dateFrom: string | null  // ISO 8601
  dateTo: string | null    // ISO 8601
}
```

`id` is always a string — consistent with URL params. New events get `crypto.randomUUID()`. Dates are stored as ISO 8601 strings; conversion to `Date` objects happens only inside `lib/date-helpers.ts`.

---

## Server vs Client Components

Default is Server Component. `"use client"` only when the component needs `useState`, `useEffect`, browser APIs, or interactive event handlers.

| Component | Type | Reason |
|---|---|---|
| `app/page.tsx` | Server | Reads `searchParams` |
| `app/events/[id]/page.tsx` | Server | `await params` |
| `app/add-event/page.tsx` | Server | Shell only |
| `CalendarGrid.tsx` | Server | Pure render from props |
| `CalendarCell.tsx` | Server | Pure render from props |
| `EventDetail.tsx` | Server | Pure render from props |
| `Navbar.tsx` | **Client** | `usePathname` for active link |
| `AddEventForm.tsx` | **Client** | `useState`, submit handler |
| `FilterBar.tsx` | **Client** | Controlled inputs, `router.push` |
| `use-events.ts` | **Client** | `useState`, localStorage |

Props crossing the Server→Client boundary must be serializable — no functions, no class instances, no `Date` objects.

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component files | PascalCase | `CalendarCell.tsx` |
| Non-component files | kebab-case | `date-helpers.ts`, `use-events.ts` |
| Directories | kebab-case | `add-event/`, `date-helpers/` |
| Hook exports | camelCase with `use` prefix | `useEvents` |
| Interfaces | PascalCase | `SportEvent`, `EventFilter` |
| Test files | co-located in `lib/` | `date-helpers.test.ts` |

One component per file. No default exports for non-component modules.

---

## Tailwind CSS v4

- Import: `@import "tailwindcss"` — not `@tailwind base/components/utilities`
- Theme tokens defined in `@theme` block in `globals.css`
- Color palette: only `neutral-900`, `neutral-50`, `blue-600`, `red-500` and their opacity variants — no hex values, no custom color names
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

Test runner to be added at Task 9. Test files co-located with source in `lib/`.

| File | What to test |
|---|---|
| `date-helpers.ts` | Month grid generation, day-has-events check, date formatting |
| `event-filters.ts` | Filter by sport, filter by date range, combined filters, empty results |
| `form-validation.ts` | Required fields, date format, time format |

No component tests, no localStorage tests (mocking adds complexity with no value for this task scope), no snapshot tests.

---

## Animation Plan

Motion library not yet installed — to be added before Task 7.

Planned animation points:
- Page transitions — route change fade
- Calendar cell hover — background shift
- Event indicator — fade in on mount
- Add event form — slide in on mount
- Filter changes — opacity transition on list re-render
