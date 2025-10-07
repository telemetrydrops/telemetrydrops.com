# Repository Guidelines

## Project Structure & Module Organization
Astro pages live under `src`. Use `src/pages` for routes, `src/layouts` for wrappers, `src/components/astro` for static components, and `src/components/ui` for React islands that ship JavaScript. Shared data stays in `src/data`, helpers in `src/lib`, and the Supabase client under `src/integrations`. Supabase edge functions and SQL migrations live in `supabase/functions` and `supabase/migrations`. Static assets (icons, fonts, OpenGraph images) belong in `public/`. The build pipeline writes to `dist/`; never edit generated files.

## Build, Test, and Development Commands
Install dependencies with `bun install`. Use `bun run dev` for the local server at `http://localhost:4321`. `bun run build` creates the production bundle, while `bun run build:dev` mirrors build issues without optimization. Preview the production output via `bun run preview`. Quality gates: run `bun run lint` for Astro linting and `bun run type-check` for TypeScript diagnostics before opening a PR.

## Coding Style & Naming Conventions
Stick to TypeScript across React islands and utilities. Follow Astro/TS defaults: two spaces in scripts, tabs already present in `.astro` templates are fine—match surrounding code. Name files and components with PascalCase (e.g., `LeadCaptureForm.tsx`, `ProductCard.astro`), hooks with `use` prefixes, and data modules with descriptive nouns (`product-data.ts`). Tailwind classes are arranged by layout → color → state; keep variants near each other. Run `bun run lint` after formatting to confirm Astro style conventions.

## Testing Guidelines
There is not yet a dedicated automated test suite; rely on `bun run lint`, `bun run type-check`, and manual checks in the browser. When adding substantial features, prefer lightweight component or e2e tests (e.g., Vitest or Playwright) colocated under `src/tests` and wire the command into package scripts. Always document manual verification steps in your PR until automated coverage exists.

## Commit & Pull Request Guidelines
Commits use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`) as seen in history. Keep commits scoped and message bodies imperative. PRs should include a concise summary, screenshots or GIFs for UI changes, linked issues, and a checklist of commands run. Ensure Supabase env variables remain in `.env` and never land in git. Request review once the branch builds cleanly with `bun run build`.
