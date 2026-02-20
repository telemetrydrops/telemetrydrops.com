# Telemetry Drops Website

Marketing website for [Telemetry Drops](https://telemetrydrops.com) — OpenTelemetry training courses and workshops.

Built with Astro, React, Tailwind CSS, and Supabase. Deployed on Netlify.

## Getting Started

```bash
bun install
bun run dev
```

The dev server runs at `http://localhost:4321` with hot reload.

## Scripts

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `bun run dev`        | Start development server         |
| `bun run build`      | Production build                 |
| `bun run build:dev`  | Development build                |
| `bun run preview`    | Preview production build locally |
| `bun run lint`       | Lint with `astro check`          |
| `bun run type-check` | TypeScript type checking         |

## Project Structure

```
src/
├── pages/            # File-based routing (Astro pages)
├── layouts/          # Shared layout components
├── components/       # Astro and React components
│   └── ui/           # shadcn/ui primitives (React)
├── data/             # Product catalog, testimonials, SEO data
├── integrations/     # Supabase client and types
└── lib/              # Utility functions
```

## Key Pages

- `/` — Homepage
- `/products/` — Product catalog
- `/products/[slug]/` — Product detail pages
- `/events/` — Workshops and events
- `/ottl-cheatsheet/` — OTTL reference
- `/otca-practice-exam/` — OTCA practice exam

## Tech Stack

- **Framework**: [Astro](https://astro.build) with static site generation
- **UI**: React 19 islands for interactive components, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (database, auth, edge functions)
- **Deployment**: Netlify
