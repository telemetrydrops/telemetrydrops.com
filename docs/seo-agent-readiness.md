# Search and agent readiness

Telemetry Drops is a public OpenTelemetry education and marketing site with an external enrollment platform. Its primary agent tasks are comparing courses, retrieving practical technical guidance, finding workshops, and establishing who runs the business. Public pages are statically rendered; forms and the practice exam require JavaScript. There is no public purchase API or MCP server.

## Live assessment

[Is Agentic report](https://is-agentic.com/scan/telemetrydrops.com), measured on October 4, 2026 at 19:53 UTC: **75/100** overall. The website view reports **90%** readiness with all six essential website checks passing. The overall report includes API and CLI criteria despite this site having no public purchase API. The site's Business declaration selects a report view and does not award points. The report UI and API group secondary findings differently; neither is an exhaustive inventory or a ranking forecast. `seo-agent-readiness-baseline.json` is the archived October 3 measurement, not the current result.

Production verification covers successful HTML and Markdown retrieval with `Vary: Accept`, Markdown 404 recovery, contact and address data, and price/availability parity. The homepage Lighthouse assessment on October 4 scored SEO 92, accessibility 96 and agent browsing 3/3; performance was 70 mobile and 66 desktop. Mobile lab LCP was 8.6 seconds and desktop lab TBT was 1,060 milliseconds. PageSpeed had no real-user data; these results do not establish field Core Web Vitals or ranking performance.

## SEO and answer quality

The HTML provides titles, descriptions, a declared English language, canonical URLs, social previews, and crawlable internal links. Blog articles provide author identity, publication and update dates, summaries, key takeaways, FAQs, and TechArticle markup. These are useful foundations for both search indexing and answer citation.

The build generates the sitemap from all indexable HTML pages, including every blog post, populated tag page, event, course, and reference page. Noindex pages are excluded, and fabricated modification dates are avoided. Canonicals default to the current page rather than the homepage, normalize trailing slashes, and remove query strings. Images accept either absolute URLs or site-relative paths. Repeated brand suffixes are avoided, and the brand is appended only when the combined title fits within 60 characters. Indexable pages allow large image previews.

Course Offer data uses the catalog as its source: OTel Track is €499 and purchasable; OTel Specialization is €1,999 and unavailable for purchase, with a waitlist. Metadata omits stale early-bird pricing and does not describe waitlist enrollment as a preorder. The homepage describes one year of access, matching the course catalog, and describes the completion certificate explicitly. Course completion must not be represented as CNCF OTCA certification.

The `/learn/` hub organizes public guides by Collector pipelines, instrumentation and telemetry contracts, and community learning. The instructor page at `/instructors/juraci-paixao-krohling/` provides project evidence and the local Person identity referenced by article author schema. Homepage and course pages link to that identity. Testimonials remain visible without unsupported numeric ratings or standalone Review markup. Waitlist navigation uses ordinary fragment links, and archived January 2026 registration is closed.


Markdown is generated from the built main content, preserving headings, links, code blocks, and comparison tables. It includes the canonical source URL and page description. HTML advertises the Markdown alternate, blog RSS, and agent guide. Separate Markdown assets are marked noindex to avoid competing with canonical HTML in search. `/llms-full.txt` combines the guide with the Markdown body of every indexable page, generated from the same rendered HTML. The guide and full export omit the noindex practice exam and error page. All pages carry linked Organization, WebSite, and WebPage identities; article schema connects its author, publisher, page, and social image to those identities.

Google's [AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) prioritizes ordinary SEO and useful content; it requires no special AI schema or instruction file. The agent guide and Markdown support make retrieval easier for compatible clients but do not promise inclusion in AI answers. Structured data should remain consistent with visible facts. FAQ markup is not a promise of a rich result.

## Social previews

`src/data/og-cards.json` owns the five 1200×630 PNG cards for Home, Products, Blog, Podcast, and Events, including copy and descriptive alt text. Metadata chooses an exact page card, then a matching section card, then Home. Article frontmatter can override `ogImage` and `ogImageAlt`; absolute image URLs are supported. Open Graph declares image dimensions, MIME type when recognized, and alt text; Twitter shares the image and alt text.

The repository skill at `.agents/skills/telemetrydrops-og-image/SKILL.md` renders the cards offline with bundled Inter and logo assets after Playwright setup. Its palette comes from the site: charcoal, orange, warm cream, white, and an orange-to-amber headline accent. The renderer auto-fits headlines, rejects overflowing copy or blank canvases, and prints layout metrics. Inspect generated PNGs before publishing.

## Deployment and verification

Netlify runs `bun run build`, publishes `dist`, and discovers the Markdown edge function in `netlify/edge-functions`. The build writes the sitemap and Markdown assets after Astro renders the pages. CI checks generated output and the response handler through `bun run test:seo`.

The edge function handles GET and HEAD, preserves ordinary HTML and redirect behavior, and varies HTML and Markdown responses on Accept. Markdown responses are not cached and discard the HTML response's content length, encoding, and validators. Asset requests and writes pass through. Missing or unavailable Markdown assets fall back to the original HTML. Unknown HTML paths requested as Markdown return status 404 and a useful recovery body.

The Astro preview serves the generated assets but does not execute Netlify edge functions or deployment redirect rules. Local handler tests are therefore necessary but do not replace deployment verification. Validate a Netlify preview or production deployment with:

```sh
curl -sS -L -i -H 'Accept: text/markdown' https://telemetrydrops.com/
curl -sS -L -i -H 'Accept: text/html' https://telemetrydrops.com/
curl -sS -L -i -H 'Accept: text/markdown' https://telemetrydrops.com/__agent-readiness-missing
curl -sS -L -i https://telemetrydrops.com/courses
curl -sS -L -i https://telemetrydrops.com/pricing
curl -sS https://telemetrydrops.com/llms.txt
curl -sS https://telemetrydrops.com/sitemap.xml
```

Check the final body as well as status and headers: Markdown homepage with `Content-Type: text/markdown` and `Vary: Accept`; HTML homepage for ordinary browser requests; Markdown error with status 404. Verify form behavior using the deployed Supabase settings. Local build validation uses placeholder settings and does not prove submissions work. Rescan the public domain with Is Agentic only after the changes are deployed. Ora may reuse a scan within its six-hour freshness window, so confirm the new report timestamp and evidence before interpreting the score.

## Remaining work

- Use Google Search Console to check indexing, sitemap acceptance, selected canonicals, search queries, and performance. No Search Console access or traffic data is available in this audit, so ranking, coverage, and conversion improvements are unmeasured.
- Confirm the intentional `noindex` on the OTCA practice exam. It remains excluded from search; its canonical now points to its own page. If search acquisition is desired, publish a substantive indexable introduction before changing this policy.
- Confirm course language, recording completion, and current instructor roles with the business owner. The catalog's recording-in-progress wording and testimonial references to Portuguese leave questions agents cannot safely answer. Do not infer these facts from the site's English UI.
- Keep archived workshop pages clearly distinguishable from open registration. Dates and availability need ongoing editorial maintenance.
- Improve brand citations and reputable inbound links, with consistent public company details. A technical patch alone cannot guarantee a higher brand-search position.
- Measure agent task completion after deployment: compare the two courses and prices, find a relevant Collector article and cite its author/date, identify an upcoming workshop, and recover from an unknown URL. Purchases and student access remain external workflows; this audit does not verify them.
