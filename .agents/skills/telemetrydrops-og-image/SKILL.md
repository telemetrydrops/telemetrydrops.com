---
name: telemetrydrops-og-image
description: Render branded Telemetry Drops Open Graph PNGs for pages, articles, courses, podcasts, and events. Use for Telemetry Drops social cards, share images, and link previews.
---

# Telemetry Drops OG images

Create 1200×630 PNGs with the bundled renderer, Inter font, and Telemetry Drops logo. The design uses the site's charcoal (#0a0a0a, #121212), orange (#ea580c), warm cream (#fef3c7), white, and orange-to-amber accent. Telemetry paths and signal nodes echo the logo; keep all meaningful copy in the left text area.

Run commands from the repository root. Set up the renderer once:

```sh
python3 .agents/skills/telemetrydrops-og-image/scripts/og_image.py setup
```

Render a card with a short headline, optional supporting text, and a topic label. Wrap accent words in asterisks; actual newlines force line breaks. Copy should describe the current page without inventing prices, availability, or certification claims.

```sh
python3 .agents/skills/telemetrydrops-og-image/scripts/og_image.py render \
  --headline 'Master *OpenTelemetry.*' \
  --body 'Hands-on courses from project contributors.' \
  --label 'EXPERT-LED TRAINING' --out public/og/home.png
```

Read the JSON metrics. Overflow fails before writing a new PNG; shorten the copy and rerender. Aim for headline size ≥64px, then inspect the PNG at full size and at link-preview size before delivering it. Missing fonts or logo are errors; restore bundled assets rather than substituting fonts or identities.

The five page cards and their alt text live in `src/data/og-cards.json`. Regenerate them together:

```sh
python3 .agents/skills/telemetrydrops-og-image/scripts/og_image.py batch
```

`--scale 2` produces 2400×1260 export copies; deployed cards use the default 1200×630 because the site's metadata declares that size. For a new page card, add its canonical path, image path, label, headline, body, and descriptive alt text to the catalog. Metadata uses exact matches, then a section card, then Home. Blog frontmatter can supply an explicit `ogImage` and `ogImageAlt`.

`OG_IMAGE_VENV` can override the private environment at `~/.cache/telemetrydrops/og-image-venv`. Rendering needs no network once setup is complete. Inter is bundled under the SIL Open Font License in `assets/fonts/OFL.txt`.
