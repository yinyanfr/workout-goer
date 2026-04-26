# Development Guide

## Prerequisites

- Node.js 18+
- npm
- A Firebase project with:
  - Authentication (Google provider enabled)
  - Cloud Firestore (region `eur3`)
  - Hosting (optional, for deployment)

## Setup

```bash
git clone https://github.com/yinyanfr/workout-goer.git
cd workout-goer
npm install
```

`npm install` triggers `umi setup` which generates `src/.umi/` — the framework's auto-generated runtime. Never edit files in this directory.

## Dev Server

```bash
npm run dev     # starts on http://localhost:8000
```

Hot reload is enabled by default. The dev server proxies API calls if configured, but this project uses Firebase client-side SDKs directly — no proxy needed.

## Build

```bash
npm run build   # outputs to dist/
```

The production build is served by Firebase Hosting. All routes rewrite to `/index.html` (SPA pattern).

## Project Architecture

```
src/
├── components/       # Reusable UI components
│   ├── PlanList.tsx          # Phase hierarchy (Collapse cards with tables)
│   ├── WeeklyPlan.tsx        # Single week detail view
│   ├── PlanImporter.tsx      # JSON import modal with code editor
│   ├── HeroCanvas.tsx        # 3D wireframe canvas animation
│   ├── UserMenu.tsx          # Google sign-in button / avatar dropdown
│   ├── LocaleSelect.tsx      # Language switcher
│   └── ThemeSwitch.tsx       # Dark/light toggle
├── hooks/            # React context hooks
│   ├── useAuth.tsx           # AuthProvider + useAuth() — Firebase auth state
│   └── useI18n.tsx           # I18nProvider + useI18n() — custom i18n
├── layouts/          # App shell
│   └── index.tsx             # AuthProvider → I18nProvider → ConfigProvider → Nav → Outlet → Footer
├── locales/          # Translation dictionaries
│   ├── index.ts              # LocaleDict type + localeNames
│   ├── zh-CN.ts / en-US.ts / fr-FR.ts / ja-JP.ts
├── pages/            # Route components (matched by .umirc.ts)
│   ├── index.tsx             # / — 3D hero landing page
│   ├── plans.tsx             # /plans — plan overview + import/delete
│   ├── weekly.tsx            # /plans/:week — single week drill-down
│   ├── user.tsx              # /user — profile form
│   └── help.tsx              # /help — JSON format reference
├── services/         # Firebase SDK layer
│   └── index.ts              # app init, auth, db, CRUD, JSON validator
├── types/            # TypeScript types
│   └── plan.ts               # PlanData, PhaseData, CardioData, etc. (snake_case)
├── utils/            # Utilities
│   └── plan-utils.ts         # getWeekData(), parseWeekRange()
└── examples/         # Reference files (not used at runtime)
    ├── plans.json            # Example 24-week plan
    ├── plan.d.ts             # Type definitions (camelCase, design reference)
    └── prompt.md             # LLM prompt template
```

## Key Patterns

### Routing

Routes are defined in `.umirc.ts`, not inferred from file names:

```ts
routes: [
  { path: "/", component: "index" },
  { path: "/plans", component: "plans" },
  { path: "/plans/:week", component: "weekly" },
  { path: "/user", component: "user" },
  { path: "/help", component: "help" },
]
```

### Provider Nesting

The layout wraps the app in this order:

```
AuthProvider          # Firebase auth state
  └─ I18nProvider     # Locale context
       └─ AppShell    # ConfigProvider (antd theme + locale) → Nav → Outlet
```

### Firebase Data Model

```
user/{uid}       # UserProfile: displayName, gender, age, height, weight, bio
plans/{uid}      # PlanData: goal, principles, phases[], ...
```

Each user has exactly one plan document. Creating a new plan overwrites the old one.

### i18n

- Custom lightweight implementation — no libraries
- 4 locales, ~70 keys each
- Lazy-loaded via dynamic `import()` 
- Keys use dot notation: `"plans.principles"`, `"table.week"`
- Parameter interpolation: `t("weekly.weekTitle", { week: 5 })` → "第5周"
- UI chrome only — plan data content stays in source language

### Dark Mode

- `<html data-theme="dark|light">` attribute for CSS variables
- antd `ConfigProvider theme.algorithm` for component-level theming
- Persisted to `localStorage`
- Entry point: `src/components/ThemeSwitch.tsx`

## Firebase CLI

```bash
npx firebase-tools deploy --project workout-goer     # full deploy
npx firebase-tools deploy --only hosting              # hosting only
npx firebase-tools deploy --only firestore:rules      # rules only
```

The project alias is configured in `.firebaserc`.
