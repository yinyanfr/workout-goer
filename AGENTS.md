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
npm run lint         # ESLint (max-warnings 0)
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test         # Vitest run
npm run test:watch   # Vitest watch mode
npm run typecheck    # tsc --noEmit
npm install          # triggers postinstall → umi setup (generates src/.umi/) + husky init
```

There are **no test, lint, typecheck, or CI scripts** configured.

## Quality

- **ESLint** (`eslint src/ --ext .ts,.tsx --max-warnings 0`) — extends Umi's built-in preset
- **Prettier** (`.prettierrc`) — semi, double quotes, trailing commas
- **Husky + lint-staged** (`.husky/pre-commit`) — auto-formats + lints staged files on commit
- **Vitest** (`.vitest.config.ts`) — jsdom, globals, `@/` path alias. Test setup mocks `window.matchMedia` for antd compatibility.
- **Tests** in `src/__tests__/` — plan-utils, validate-plan, smoke (PlanList + WeeklyPlan render)
- **CI** (`.github/workflows/ci.yml`) — runs lint → test on push/PR
- **CD** (`.github/workflows/deploy.yml`) — deploys to Firebase Hosting on push to `main` (needs `FIREBASE_TOKEN` secret)

## Architecture

- **Routes** defined in `.umirc.ts` — this is the single source of truth, not file names:
  `/` → `pages/index.tsx`, `/plans` → `pages/plans.tsx`, `/plans/:week` → `pages/weekly.tsx`, `/user` → `pages/user.tsx`
- **Layout** wraps all pages via `layouts/index.tsx` — provides `AuthProvider` (Firebase auth context) → `I18nProvider` (custom context) → antd `ConfigProvider` (locale + dark/light theme) + fixed navbar (frosted glass, brand, nav links, UserMenu, locale switch, theme toggle).
- **Dark mode**: persisted to `localStorage`, applied via `<html data-theme>` for custom Less and antd `ConfigProvider theme.algorithm`. CSS variables in `layouts/index.less` define the palette.
- **i18n**: custom lightweight implementation (`src/hooks/useI18n.tsx`, `src/locales/`). `I18nProvider` wraps the app, `useI18n()` returns `{ t, locale, setLocale }`. 4 locales: `zh-CN`, `en-US`, `fr-FR`, `ja-JP`. Persisted to `localStorage`. antd component locale is fed via `ConfigProvider locale`. Translations cover UI chrome only — plan data content (exercise names, phase descriptions from `plans.json`) stays in Chinese.
- **Landing page**: minimal dark hero with a 3D wireframe canvas animation (`src/components/HeroCanvas.tsx`) — two rotating toruses, a double-helix, particle field. Pure Canvas 2D + math, no libraries.
- `src/.umi/` is **auto-generated** by `umi setup` — never edit by hand.
- `tsconfig.json` extends the generated `src/.umi/tsconfig.json`.

## Firebase

- Project ID: `workout-goer`
- Firebase config is hardcoded in `src/services/index.ts` (standard for frontend Firebase).
- **Auth**: Google Sign-In via Firebase Auth (`src/hooks/useAuth.tsx` provides `AuthProvider` + `useAuth()` hook). `UserMenu` component in nav shows sign-in button or avatar dropdown.
- **Firestore rules**: `user/{userId}` and `plans/{userId}` owned by the authenticated user.
- **Services**: `src/services/index.ts` exports `auth`, `db`, `getUserProfile(uid)`, `saveUserProfile(uid, data)`.
- **Hosting**: serves `dist/`, rewrites all routes to `/index.html` (SPA pattern).
- Firebase CLI commands use `--project workout-goer` or rely on `.firebaserc`.

## Data model

- App types in `src/global.d.ts`: `WeeklyPlan`, `WorkOut` (Aerobic | Strength), `Plans`
- Plan types in `src/types/plan.ts` mirror the actual `plans.json` structure (snake_case keys). Utility `src/utils/plan-utils.ts` provides week lookup logic.
- Richer type definitions and an example plan live in `src/examples/` — these are **design references**, not yet integrated into the app.

## Current state

- **Landing page**: 3D canvas hero + i18n text overlay.
- **Plans page**: loads plan from Firestore `plans/{uid}`. Auth-guarded (redirects to `/user` if not logged in). Empty state with "Import Plan" button when no plan exists. When plan exists: renders antd `Collapse` with 4 phases + [Import New] [Delete] buttons. `PlanImporter` modal accepts JSON paste (supports both camelCase and snake_case, normalizes to snake_case on save).
- **Weekly page**: loads plan from Firestore, drills into a single week via route param. Auth-guarded.
- **User page**: profile form (display name, gender, age, height, weight, bio) — loads from and saves to Firestore `user/{uid}`.
- **Auth**: Google Sign-In working via Firebase Auth. Login state persisted across sessions. `UserMenu` in nav.
- **Services**: `src/services/index.ts` exports `auth`, `db`, `getUserProfile(uid)`, `saveUserProfile(uid, data)`, `getUserPlan(uid)`, `saveUserPlan(uid, plan)`, `deleteUserPlan(uid)`, `validateAndNormalizePlan(json)`.
- Plan data is no longer hardcoded; `plans.json` is only used as a reference/example.
