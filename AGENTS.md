# Social Engagement Dashboard — Agent Guide

## Stack (exact versions)
- Angular 21.2+ — standalone components (no NgModules), application builder (`@angular/build:application`)
- Angular Material 21.2 (`MatSidenav`, `MatToolbar`, `MatList`, `MatIcon`, `MatCard`)
- Vitest 4 (via `@angular/build:unit-test` builder) — not Karma
- TypeScript 5.9, npm 10.9.2
- No HttpClient — Supabase REST API called via raw `fetch()` in `src/app/services/supabase.service.ts`

## Commands
| Cmd | What |
|-----|------|
| `npm start` | `ng serve` (dev server on `localhost:4200`) |
| `npm test` | `ng test` (Vitest, not Karma) |
| `npm run build` | production build to `dist/` |
| `npm run watch` | dev build with watch |
| Prettier | `npx prettier --write "src/**/*.{ts,html,css}"` |

No lint or typecheck scripts are configured beyond what `ng build` provides.

## Architecture
- **Entrypoint**: `src/main.ts` bootstraps `App` standalone component with `appConfig`
- **Routing**: `src/app/app.routes.ts` — lazy-loaded via `loadComponent: () => import(...)` (default exports)
- **Supabase service**: `src/app/services/supabase.service.ts` — injectable (`providedIn: 'root'`), uses Fetch API directly (no `supabase-js` library)
- **4 lazy pages**: `dashboard`, `executions`, `comments`, `settings` under `src/app/pages/`
- **Components dir**: `src/app/components/` — empty, ready for shared/reusable components
- **Environment**: `src/environments/environment.ts` (prod) / `environment.development.ts` — Supabase URL and anon key use placeholders (`SUPABASE_URL_PLACEHOLDER`, `SUPABASE_ANON_KEY_PLACEHOLDER`); injected via CI from GitHub Secrets

## Agent skills installed (`.agents/skills/`)
Load via `skill` tool when working on: components, signals, routing, HTTP, forms, Angular Material, or Supabase.

## Conventions
- All components are `standalone: true` — no NgModule wrappers
- Page components use `default export` class (for `loadComponent` lazy syntax)
- Supabase queries are raw `fetch()` to PostgREST REST API (not `supabase-js`)
- Prettier: `singleQuote: true`, `printWidth: 100`, Angular HTML parser
- Indent: 2 spaces, UTF-8, final newline

## Testing (Vitest)
- Spec files co-located: `src/**/*.spec.ts`
- Vitest globals available in spec files (`describe`, `it`, `expect`)
- Test builder: `@angular/build:unit-test`
- Run all: `npm test` (or `ng test`)
- Single file: not configured — pass spec path via Vitest CLI

## Supabase
- Instance: `ghznkyqfgsupbndnucuc` (`https://ghznkyqfgsupbndnucuc.supabase.co`)
- Tables: `execution_logs`, `commented_posts`, `daily_comment_count`, `settings`
- Auth: anon key in environment files (RLS not yet configured — tables fully exposed)
- No `supabase-js` dependency — just REST calls with `apikey` header

## CI/CD
- Workflow: `.github/workflows/deploy.yml` — runs on push to `main`
- Builds with `npm ci && npm run build` after injecting Supabase secrets
- Environment files use placeholders (`SUPABASE_URL_PLACEHOLDER`, `SUPABASE_ANON_KEY_PLACEHOLDER`)
- Before first deploy, add these **GitHub Secrets** to the repo:
  - `SUPABASE_URL` — `https://ghznkyqfgsupbndnucuc.supabase.co`
  - `SUPABASE_ANON_KEY` — the anon key from `src/environments/environment.ts` (previous value)
- Deploys to **GitHub Pages** via `upload-pages-artifact` + `deploy-pages`
- **Optional**: set a `BASE_HREF` **GitHub Variable** if deploying as a project site (e.g. `/social-engagement-dashboard/`). Defaults to `/` for user/org sites.
- To enable: go to repo Settings → Pages → Source → "GitHub Actions"

## State
- Pre-commit — no commits made yet, repo is fresh
- No remote configured
