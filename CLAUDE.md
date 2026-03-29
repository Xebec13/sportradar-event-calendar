# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.1** with App Router (`app/` directory) — see AGENTS.md warning about breaking changes
- **React 19.2.4** + TypeScript 5
- **Tailwind CSS v4** — configured via PostCSS (`@tailwindcss/postcss`), imported as `@import "tailwindcss"` in CSS (not `@tailwind` directives)
- **ESLint 9** flat config format (`eslint.config.mjs`)

## Architecture

This is an early-stage project. Source lives entirely in `app/` using the App Router convention:

- `app/layout.tsx` — root layout, loads Geist/Geist Mono fonts via `next/font`
- `app/page.tsx` — home page
- `app/globals.css` — global styles with CSS custom properties for theming

Path alias `@/*` resolves to the project root.

## Next.js Docs

Before writing any Next.js code, consult `node_modules/next/dist/docs/`. Key sections:

- `01-app/` — App Router APIs and conventions
- `02-pages/` — Pages Router (legacy, avoid unless needed)
- `03-architecture/` — internals
