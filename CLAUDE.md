# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: Use `bun` instead of `npm` for all package operations.

```bash
# Development server (auto-reloading with instant preview)
bun run dev

# Build for production
bun run build

# Build for development environment
bun run build:dev

# Preview production build locally
bun run preview

# Lint the codebase
bun run lint

# Run tests (watch mode for development)
bun run test

# Run tests once (CI/CD)
bun run test:run

# Run tests with coverage
bun run test:coverage

## Testing Standards

**Test Co-location**: Tests are placed next to their subjects (not in `__tests__` directories)
- `src/components/SEO.tsx` → `src/components/SEO.integration.test.tsx`
- `src/data/seo-data.ts` → `src/data/seo-data.test.ts`

**Test Strategy**: Focus on business logic and value, avoid implementation details
- Use real data and actual business flows
- Test user-facing functionality and SEO requirements
- Avoid mocking external libraries when possible

# Install packages
bun add <package-name>

# Install dev dependencies
bun add -D <package-name>
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **Backend**: Supabase (database, auth, edge functions)
- **State Management**: TanStack Query for server state
- **Deployment**: Netlify with SPA redirect configuration

### Project Structure

**Core Application**:
- `src/App.tsx` - Main app with routing setup and providers
- `src/components/Layout.tsx` - Shared layout wrapper with navigation
- `src/pages/` - Route-based page components

**Data Layer**:
- `src/data/product-data.ts` - Product catalog with courses, features, curriculum
- `src/data/testimonial-data.ts` - Customer testimonials linked to products
- `src/integrations/supabase/` - Supabase client and type definitions

**Component Architecture**:
- `src/components/ui/` - shadcn/ui primitive components
- `src/components/` - Application-specific components
- `src/lib/utils.ts` - Utility functions (primarily `cn` for className merging)

### Key Business Logic

**Product System**:
- Two main products: "OTel Specialization" (€1,297) and "OTel Track" (€597)
- Products have slugs (`otel-specialization`, `otel-track`), features, detailed curriculum, and availability status
- Product routing: `/products/:slug` with dynamic product detail pages

**Lead Capture**:
- Waitlist system for unavailable products via `LeadCaptureForm`
- Data stored in Supabase `waitlist` table
- Email notifications sent via Supabase Edge Functions

**Testimonial System**:
- Customer testimonials linked to specific products via `productIds` array
- Helper functions for getting product-specific or random testimonials

### Routing Structure
- `/` - Homepage with hero, features, testimonials
- `/products` - Product catalog with comparison table
- `/products/:slug` - Individual product detail pages
- `/privacy-policy`, `/terms-of-use`, `/imprint` - Legal pages
- Netlify SPA redirect handles client-side routing

### Key Integration Points

**Supabase Configuration**:
- Project ID: `gqslgkgqolvrlfbmpbgu`
- Edge function: `send-waitlist-notification` for email handling
- Tables: `waitlist` for lead capture

**Content Management**:
- All product content, pricing, and curriculum managed in TypeScript data files
- Testimonials include avatar URLs pointing to `/testimonials/` directory
- Company contact: `contact@telemetrydrops.com`

### Development Notes

**Styling System**:
- Uses Tailwind with custom color palette (`telemetria-orange`, `telemetria-dark`, etc.)
- Component variants managed via `class-variance-authority`
- Responsive design with mobile-first approach

**State Management**:
- TanStack Query for server state (Supabase interactions)
- Local component state for forms and UI interactions
- Toast notifications via shadcn/ui Sonner integration

**Type Safety**:
- Comprehensive TypeScript interfaces for products, testimonials, and forms
- Supabase types auto-generated in `src/integrations/supabase/types.ts`

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):
- **Main Job**: Lint, test, and build on every push/PR to main
- **SEO Validation Job**: Validates SEO files (robots.txt, sitemap.xml) and runs SEO-specific tests
- **Uses Bun**: All package management and script execution uses Bun
- **Automated Checks**: Ensures code quality and SEO implementation integrity