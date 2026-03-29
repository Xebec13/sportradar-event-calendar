# CLAUDE.md

@AGENTS.md
@ARCHITECTURE.md

## Role & Collaboration

We work as partners with clearly defined roles:

- **You (David)**: layout, component planning, design decisions, final approval
- **Me (Claude)**: code logic, best practices, challenging my own solutions before presenting them
- **Together**: code comments — I never write them alone, not even one-liners

**Language**: Polish for all conversation between us. English for everything else: code, variable names, function names, hook names, file names, commits.

**Workflow**:
1. You create the layout and placeholders — I fill in the logic
2. I always present a plan with reasoning before writing any code
3. One component at a time
4. I ask when something is unclear — I never guess
5. If a solution is rejected, I remember it and propose an alternative after discussion

## Project Context

Full task description: `TASK.md`

Goal: a finished product — strictly what TASK.md defines, no scope creep. Mobile First. UI inspired by sports score sites (Flashscore style). You already have a layout and vision — you lead on structure and design decisions.

Commits align 1:1 with tasks from TASK.md.

## Features

### Core (Required)
1. **Calendar View** — monthly grid for current month; days with events marked with indicator; optional: show event name directly on day cell
2. **Event Detail Page** — `/events/[id]` — full info: date, time, sport, teams, venue, status
3. **Add Event** — form with all fields; event added to calendar in current session (no persistence required)
4. **Responsiveness** — mobile (375px), tablet (768px), desktop (1280px); touch interactions on smaller screens
5. **Navigation** — navbar accessible from all pages; links: Calendar, Add Event

### Optional (treating as required)
6. **Filters** — filter events by sport type and date range
7. **Styling & Animations** — polished UI with transitions (route changes, modal open/close, event appear)
8. **Persistent Storage** — localStorage: events survive page refresh
9. **Testing** — unit tests for key logic (date helpers, filters, form validation)

### Deliverables
- Public GitHub repository
- README.md: project overview, setup instructions, decisions & assumptions
- Clean commit history reflecting feature-by-feature progression

## Design System

**Color palette** (Tailwind only — no custom colors):
- Background: `neutral-900`
- Text: `neutral-50`
- Primary: `blue-600`
- Accent: `red-500`
- Hierarchy through lower-opacity variants of these four

**Typography**: Source Sans 3 — for everything

**Vibe**: minimalism, precision, sports-app aesthetic. 60-30-10 color rule. Perfect pixel proportions. This is a recruitment task — every decision should reflect thoughtful planning and clean code.

## Stack

- **Next.js 16.2.1** — App Router (`app/`); breaking changes possible — see AGENTS.md
- **React 19.2.4** + **TypeScript 5** — strict mode, no `any`
- **Tailwind CSS v4** — `@import "tailwindcss"` (not `@tailwind`); `@theme` for tokens
- **ESLint 9** — flat config (`eslint.config.mjs`)
- **lucide-react ^1.7.0** — icon library; installed
- **Motion** — animation library; not yet installed; ask before adding; documentation: TBD
- **No other libraries** — native Next.js/React; ask before installing anything

**Mock data**: `data/events.json` (JSON format)

## Architecture

See `ARCHITECTURE.md` — do not change folder structure without discussion.

## Documentation

Read documentation only when genuinely uncertain — not before every task. When unsure, ask first; read docs only as a last resort.

- **Next.js 16** (local): `node_modules/next/dist/docs/01-app/`
- **Tailwind CSS v4** (local): `node_modules/tailwindcss/`
- **Motion**: TBD after adding the library

## Conventions

- **Tailwind**: max 10 utility classes per element (excluding hover/focus/responsive variants); if exceeded — stop and discuss component extraction
- **Tailwind class order**: when editing or correcting Tailwind classes, always sort them according to the official Tailwind CSS class order convention (layout → box model → typography → visual → interactive)
- **Components**: PascalCase, one per file; maximize reusability; single-use components colocated with their page
- **Types**: explicit interfaces for all data shapes; no `any`; no implicit types
- **File names**: kebab-case for non-components
- **Comments**: never written by Claude alone — created together
- **URL params**: `searchParams` for filters (shareable URLs)
- **Principles**: DRY and SOLID

## Constraints

- Never install packages without asking
- Never use `any`
- Never change folder structure without discussion
- Never write code before explaining the plan
- Never write comments alone
- Never over-interpret — ask when something is unclear
- Remember rejected solutions and never repeat them

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

No test runner configured yet — will be added at Task 9.
