# Blog design spec

Add a blog to telemetrydrops.com optimized for traditional SEO and LLM citation (AI-SEO). The blog serves as a thought leadership hub, SEO lead generation engine, and content repurposing platform for the existing knowledge base.

## Goals

1. Rank for OpenTelemetry-related search terms and drive organic traffic to the site
2. Structure content so AI assistants (ChatGPT, Claude, Perplexity) cite Telemetry Drops when answering OTel questions
3. Repurpose existing content from `ai-context/` and blog post drafts into polished, search-optimized articles
4. Build trust that converts readers to course customers over time

## Content architecture

### Content collections

Blog posts live in `src/content/blog/` as `.md` files. Astro content collections provide schema validation and type-safe access.

Each post uses this frontmatter schema:

```yaml
---
title: "You don't have too much telemetry. You have bad telemetry."
slug: "bad-telemetry-not-volume-problem"
description: "Why observability cost problems are governance problems, not volume problems. A practical framework for identifying and eliminating telemetry waste before reaching for sampling."
publishedAt: 2026-04-15          # ISO date
updatedAt: 2026-04-15            # optional, shows "Updated on" when present
author: "juraci"                 # key into author-data.ts
tags: ["collector", "cost-optimization"]
series: "telemetry-quality"      # optional, groups related posts
seriesOrder: 1                   # optional, ordering within series
ogImage: "/blog/og/bad-telemetry-not-volume-problem.png"  # optional
readingTime: 8                   # computed at build, can be overridden
# AI-SEO fields
tldr: "Most organizations don't have a telemetry volume problem — they have a governance problem. Fix bad telemetry at the source before sampling."
keyTakeaways:
  - "Telemetry cost is a governance problem, not a volume problem"
  - "Health check floods, debug log leaks, and high-cardinality metrics are the top offenders"
  - "Fix at source, not at pipe — collector filtering is a safety net, not a strategy"
faqEntries:
  - question: "How do I reduce OpenTelemetry Collector costs?"
    answer: "Start by auditing what you collect. Most cost comes from health check traces, abandoned debug logs, and high-cardinality metrics — not from valuable telemetry."
  - question: "Should I use sampling to reduce telemetry costs?"
    answer: "Only after eliminating bad telemetry. Sampling garbage gives you a smaller pile of garbage. Clean first, then sample intentionally."
---
```

**Required fields**: `title`, `slug`, `description`, `publishedAt`, `author`, `tags`, `tldr`, `keyTakeaways`.

**Optional fields**: `updatedAt`, `series`, `seriesOrder`, `ogImage`, `readingTime` (auto-computed if omitted), `faqEntries`.

### Author data

Author information lives in `src/data/author-data.ts` to keep frontmatter DRY:

```typescript
export const authors = {
  juraci: {
    name: "Juraci Paixão Kröhling",
    role: "OpenTelemetry Maintainer & Instructor",
    avatar: "/authors/juraci.jpg",
    bio: "OpenTelemetry maintainer and founder of Telemetry Drops, where he teaches observability engineering through hands-on courses.",
    social: {
      linkedin: "https://www.linkedin.com/in/jpkroehling",
      github: "https://github.com/jpkrohling",
      bluesky: ""
    }
  }
};
```

Posts reference authors by key (`author: "juraci"`). The collection schema validates that the key exists.

### Tag taxonomy

Tags use a controlled vocabulary defined in the content collection schema. Astro validates tags at build time; adding a new tag requires updating the schema.

| Tag | Covers |
|---|---|
| `collector` | Collector architecture, components, configuration, deployment |
| `instrumentation` | SDK usage, auto-instrumentation, manual instrumentation patterns |
| `traces` | Distributed tracing, spans, context propagation |
| `metrics` | Metric types, cardinality, Prometheus interop |
| `logs` | Log collection, deduplication, routing |
| `sampling` | Head sampling, tail sampling, rate limiting |
| `cost-optimization` | Telemetry governance, volume reduction, efficient pipelines |
| `ottl` | OpenTelemetry Transformation Language |
| `kubernetes` | Operator, target allocator, k8s-specific patterns |
| `semantic-conventions` | Naming, resource attributes, signal conventions |
| `architecture` | Pipeline design, deployment patterns, scaling |
| `security` | Pipeline security, authentication, data privacy |

## URL structure and routing

| Route | Page file | Purpose |
|---|---|---|
| `/blog/` | `src/pages/blog/index.astro` | Blog index with card grid and tag filter |
| `/blog/[slug]/` | `src/pages/blog/[slug].astro` | Individual post |
| `/blog/tags/` | `src/pages/blog/tags/index.astro` | All tags overview |
| `/blog/tags/[tag]/` | `src/pages/blog/tags/[tag].astro` | Posts filtered by tag |
| `/blog/series/[series]/` | `src/pages/blog/series/[series].astro` | Series landing page |
| `/blog/rss.xml` | `src/pages/blog/rss.xml.ts` | RSS feed |

**No date segments in URLs.** `/blog/bad-telemetry-not-volume-problem/` keeps URLs clean, evergreen, and shorter (better for SEO and LLM citation).

**No pagination URLs.** The blog index shows all posts with client-side tag filtering. This avoids thin paginated pages that dilute SEO authority.

## SEO implementation

### JSON-LD structured data

Every blog post renders two JSON-LD blocks:

**TechArticle schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "You don't have too much telemetry. You have bad telemetry.",
  "description": "Why observability cost problems are governance problems...",
  "datePublished": "2026-04-15",
  "dateModified": "2026-04-15",
  "author": {
    "@type": "Person",
    "name": "Juraci Paixão Kröhling",
    "jobTitle": "OpenTelemetry Maintainer",
    "url": "https://www.linkedin.com/in/jpkroehling",
    "sameAs": [
      "https://github.com/jpkrohling",
      "https://www.linkedin.com/in/jpkroehling"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "TelemetryDrops",
    "url": "https://telemetrydrops.com",
    "logo": "https://telemetrydrops.com/logo.svg"
  },
  "keywords": ["collector", "cost-optimization"],
  "url": "https://telemetrydrops.com/blog/bad-telemetry-not-volume-problem/",
  "mainEntityOfPage": "https://telemetrydrops.com/blog/bad-telemetry-not-volume-problem/"
}
```

**FAQPage schema** (when `faqEntries` are present):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I reduce OpenTelemetry Collector costs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start by auditing what you collect..."
      }
    }
  ]
}
```

### Meta tags

Each post renders:
- `<title>` — post title + " | Telemetry Drops Blog"
- `<meta name="description">` — from `description` frontmatter
- `<meta name="keywords">` — from `tags`
- `<link rel="canonical">` — full URL
- `<meta property="og:type" content="article">`
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- `<meta property="article:published_time">`, `article:modified_time`, `article:tag`
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta name="twitter:title">`, `twitter:description`, `twitter:image`

### Semantic HTML

Post pages use proper HTML5 semantics:
- `<article>` wrapping the entire post
- `<header>` for title, author, date, reading time
- `<time datetime="...">` for dates
- `<nav>` for breadcrumbs (`Home > Blog > Post Title`) and table of contents
- `<aside>` for the sticky TOC sidebar
- `<section>` for key takeaways and FAQ
- `<footer>` for author bio and tags
- Heading hierarchy: single `<h1>` for title, `<h2>`/`<h3>` for content sections

## LLM citation optimization (AI-SEO)

Six techniques to maximize the likelihood that AI assistants cite Telemetry Drops:

1. **TL;DR block** — The `tldr` field renders as a visible summary at the top of each post inside a `<section class="tldr">` with a clear heading. LLMs extract concise, self-contained statements that can be quoted directly.

2. **FAQ sections** — `faqEntries` render as a visible FAQ section at the bottom of each post with `FAQPage` JSON-LD markup. LLMs match user questions against these Q&A pairs and cite the source.

3. **Key takeaways** — `keyTakeaways` render as a visible bulleted list and are included in JSON-LD. These give LLMs extractable, attributable facts.

4. **Consistent entity naming** — Use full names ("OpenTelemetry Collector", not "the collector") in key positions: title, description, tldr, takeaways, FAQ answers. LLMs associate entities with sources through consistent naming.

5. **Author authority signals** — `Person` schema with `jobTitle: "OpenTelemetry Maintainer"` and `sameAs` links to GitHub/LinkedIn. LLMs weigh content from recognized domain experts.

6. **Direct answers** — Posts that directly answer common questions in the first paragraph or FAQ get cited over content that builds gradually. Each post should have a definitive answer up front (for LLMs), then the nuanced deep-dive (for human readers).

## Page layouts

### Blog post page (two-column with sticky TOC)

**Desktop (>1024px):**
- Article content on the left (~65% width), max-width constrained for readability
- Sticky table of contents on the right (~35% width), highlights current section on scroll
- TOC collapses to inline (above article) on mobile

**Post structure top to bottom:**
1. Breadcrumb navigation: Home > Blog > Post Title
2. Tag pills and reading time
3. Post title (`<h1>`)
4. Author byline with avatar, name, date
5. TL;DR block (orange left border, muted background)
6. Article body (prose, code blocks, tables)
7. Key takeaways section
8. FAQ section (if `faqEntries` present)
9. Author bio card with social links
10. Soft CTA: "Telemetry Drops offers hands-on OpenTelemetry courses for engineering teams. Learn more at telemetrydrops.com/products"
11. Tag pills
12. Series navigation (if part of a series): Previous / Next post links

### Blog index page (card grid)

**Layout:**
- Page title: "Blog"
- Subtitle: "Practical OpenTelemetry and observability engineering"
- Tag filter bar: horizontal row of tag pills, "All" selected by default, client-side filtering
- Card grid: 2 columns on desktop, 1 column on mobile
- Each card shows: tag pills, title, description excerpt, date, reading time
- Cards link to the full post

### Tag pages

Same card grid layout as the blog index, filtered to a single tag. Page title is the tag name with a count of posts.

### Series pages

Ordered list of posts in the series with title, description, and reading status. Series description at the top explaining the arc of the series.

## Markdown rendering

**Syntax highlighting:** Shiki (built into Astro). Zero client-side JS. Theme matches the site's dark palette.

**Code block features:**
- Language label in the top-right corner
- Copy button on hover
- Line highlighting support via Shiki's `{1,3-5}` syntax
- Optional file name display via code block meta (e.g., ` ```yaml title="collector-config.yaml" `)

**Remark/rehype plugins:**
- `remark-gfm` — tables, strikethrough, task lists
- `rehype-autolink-headings` — anchor links on headings for deep-linking
- Reading time computation: a custom remark plugin calculates word count during build and injects the value into the content collection entry. The `readingTime` frontmatter field overrides the computed value when present.

**No MDX by default.** Posts are plain `.md`. MDX can be enabled per-post if a specific article needs an embedded React component.

## RSS feed

Located at `/blog/rss.xml`. Built with `@astrojs/rss`.

- Full post content in the feed (not excerpts)
- Each entry: `title`, `description`, `pubDate`, `link`, `categories` (from tags)
- Feed title: "Telemetry Drops Blog"
- Feed description: "Practical OpenTelemetry and observability engineering"

## Sitemap integration

Extend the existing sitemap:
- All blog posts with `lastmod` from `updatedAt` or `publishedAt`
- Tag pages and series pages included
- Blog index page at higher priority than individual tag pages

## Navigation updates

**Navbar:**
- Add "Blog" link between "Products" and "Podcast"
- Active state highlighting on any `/blog/*` route

**Footer:**
- Add "Blog" link to footer navigation
- Add RSS feed link

**robots.txt:**
- Verify `/blog/` is crawlable
- Ensure sitemap reference is present

## SEO data integration

Add blog-related entries to `src/data/seo-data.ts`:

```typescript
blog: {
  title: "OpenTelemetry Blog — Practical Observability Engineering",
  description: "Technical articles on OpenTelemetry, observability engineering, and telemetry best practices. Written by OTel maintainers and practitioners.",
  keywords: "OpenTelemetry blog, observability engineering, OTel articles, telemetry best practices",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Telemetry Drops Blog",
    "description": "Practical OpenTelemetry and observability engineering",
    "publisher": {
      "@type": "Organization",
      "name": "TelemetryDrops",
      "url": "https://telemetrydrops.com"
    }
  }
}
```

## Soft CTA approach

Each post includes:
1. **Author bio card** at the bottom — avatar, name, role, short bio, social links
2. **One-line CTA** below the bio: "Telemetry Drops offers hands-on OpenTelemetry courses for engineering teams. Learn more at telemetrydrops.com/products"

No newsletter signup, no pop-ups, no urgency language. The blog builds authority; the site structure handles conversion.

## Content sourcing

Blog content comes from two sources:
1. **Adapted posts** — Existing drafts from `jpkrohling/content/blog-posts/` polished and published with original frontmatter
2. **New original content** — Written fresh, using `ai-context/` as the authoritative technical reference

Publishing cadence is quality-driven with no fixed schedule.

## Style guide

All blog content follows the existing style guide at `jpkrohling/content/style-guide.md`:
- Direct, technical voice for DevOps/SRE practitioners
- Problem-solution framing with narrative arc
- Prose over bullet lists
- Complete, runnable code examples
- No marketing language, filler phrases, or emojis
- Active voice, short sentences for complex topics
- Honest about trade-offs and limitations

## Files to create or modify

**New files:**
- `src/content/config.ts` — content collection schema definition
- `src/content/blog/` — directory for blog post `.md` files
- `src/pages/blog/index.astro` — blog index page
- `src/pages/blog/[slug].astro` — individual post page
- `src/pages/blog/tags/index.astro` — all tags page
- `src/pages/blog/tags/[tag].astro` — tag filter page
- `src/pages/blog/series/[series].astro` — series landing page
- `src/pages/blog/rss.xml.ts` — RSS feed
- `src/components/astro/BlogPostCard.astro` — card component for the grid
- `src/components/astro/BlogPostLayout.astro` — two-column post layout with sticky TOC
- `src/components/astro/TableOfContents.astro` — sticky TOC component
- `src/components/astro/AuthorBio.astro` — author bio card
- `src/components/astro/TagPill.astro` — tag pill component
- `src/components/astro/SeriesNav.astro` — previous/next navigation for series
- `src/components/astro/Breadcrumbs.astro` — breadcrumb navigation
- `src/components/astro/BlogSEO.astro` — blog-specific JSON-LD generation
- `src/data/author-data.ts` — author information
- `src/data/tag-data.ts` — tag definitions and descriptions (for tag pages)

**Modified files:**
- `src/components/astro/Navbar.astro` — add Blog link
- `src/components/astro/Footer.astro` — add Blog and RSS links
- `src/data/seo-data.ts` — add blog SEO entry
- `astro.config.mjs` — add remark/rehype plugins, configure Shiki theme
- `package.json` — add `@astrojs/rss`, `remark-gfm`, `rehype-autolink-headings`, reading time plugin

## Out of scope

- Multiple languages / i18n
- Newsletter / email subscription
- Comments system
- Search functionality (can be added later)
- CMS integration
- OG image auto-generation (manual for now, can automate later)
- Analytics dashboard for blog metrics (PostHog already tracks page views)
