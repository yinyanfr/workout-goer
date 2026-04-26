# AGENTS.md - workout-goer

## Stack
- **UmiJS v4** (React framework) — not Next.js, not CRA
- **npm** only (`npmClient: "npm"` in `.umirc.ts`, `.npmrc` set to npm registry)
- **Firebase** (Firestore region `eur3`, Auth, Hosting)
- **antd v6** (direct dependency; the old `ant-design` Umi plugin was an empty placeholder and has been removed)

## Commands
```bash
npm run dev          # start dev server (also: npm start)
npm run build        # production build → dist/
npm install          # triggers postinstall → umi setup (generates src/.umi/)
```

There are **no test, lint, typecheck, or CI scripts** configured.

## Architecture
- **Routes** defined in `.umirc.ts` — this is the single source of truth, not file names:
  `/` → `pages/index.tsx`, `/plans` → `pages/plans.tsx`, `/plans/:week` → `pages/weekly.tsx`
  Note: `pages/user.tsx` exists but is **not wired** to any route.
- **Layout** wraps all pages via `layouts/index.tsx` (Umi convention).
- `src/.umi/` is **auto-generated** by `umi setup` — never edit by hand.
- `tsconfig.json` extends the generated `src/.umi/tsconfig.json`.

## Firebase
- Project ID: `workout-goer`
- Firebase config is hardcoded in `src/services/index.ts` (standard for frontend Firebase).
- **Firestore rules**: data partitioned by user — `users/{userId}` and `plans/{userId}` owned by the authenticated user.
- **Hosting**: serves `dist/`, rewrites all routes to `/index.html` (SPA pattern).
- Firebase CLI commands use `--project workout-goer` or rely on `.firebaserc`.

## Data model
- App types in `src/global.d.ts`: `WeeklyPlan`, `WorkOut` (Aerobic | Strength), `Plans`
- Richer type definitions and an example plan live in `src/examples/` — these are **design references**, not yet integrated into the app.

## Current state
- Most components are **stubs/placeholders**: `PlanList.tsx` is a TODO comment, all pages contain placeholder text.
- The app is early-stage scaffolding; expect to build out real logic in pages, components, and services.
