# Search and agent readiness

Telemetry Drops is a public OpenTelemetry education and marketing site with an external enrollment platform. Its primary agent tasks are comparing courses, retrieving practical technical guidance, finding workshops, and establishing who runs the business. Public pages are statically rendered; forms and the practice exam require JavaScript. There is no public purchase API or MCP server.

## Live assessment

[Is Agentic report](https://is-agentic.com/scan/telemetrydrops.com), measured on October 3, 2026 at 08:31 UTC: **70/100**. The raw public API evidence is in `seo-agent-readiness-baseline.json`. This measures the deployed site, not the working-tree changes. Its inferred App classification does not describe the site's primary business function; the site declares Business. The declaration selects a report view and does not award points.

| Area | Live evidence | Implementation in this checkout |
| --- | --- | --- |
| Content access | Homepage has 5,367 characters of raw content, but skips H1 to H3 | Sequential homepage headings; named video control and a direct YouTube link |
| Retrieval | HTML returned to Markdown requests; no `Vary: Accept` | Build-generated Markdown of each page's main content; Netlify content negotiation |
| Missing pages | HTTP 404 is correct; Markdown error body absent | Keep 404 status and supply Markdown recovery links when requested |
| Agent guidance | No when-to-use instruction file | Generated `/llms.txt` describes use cases, current courses, resources, and boundaries |
| Business identity | Organization schema lacks contact and address | Real support details and Berlin address from the imprint; linked contact page |
| Brand discovery | Scanner finds the domain at position 6 for its brand query | Consistent organization name, alternate brand name, site name, and contact details; external discovery needs monitoring |
| Pricing discovery | Browser report flags pricing; public JSON issue list differs | Course and catalog Offer schemas derive price and availability from product data; `/pricing` redirects to the catalog |
| Agent navigation | Observed journey tries `/docs` and `/courses` and reaches 404s | Permanent redirects to the technical blog and course catalog |

The report UI and API show different secondary findings despite sharing the score and timestamp. Treat each as an observation rather than an exhaustive inventory or guaranteed ranking forecast.

## SEO and answer quality

The HTML provides titles, descriptions, a declared English language, canonical URLs, social previews, and crawlable internal links. Blog articles provide author identity, publication and update dates, summaries, key takeaways, FAQs, and TechArticle markup. These are useful foundations for both search indexing and answer citation.

The build generates the sitemap from all indexable HTML pages, including every blog post, populated tag page, event, course, and reference page. Noindex pages are excluded, and fabricated modification dates are avoided. Canonicals default to the current page rather than the homepage, normalize trailing slashes, and remove query strings. Images accept either absolute URLs or site-relative paths. Repeated brand suffixes are avoided.

Course Offer data uses the catalog as its source: OTel Track is €499 and purchasable; OTel Specialization is €1,999 and unavailable for purchase, with a waitlist. Metadata omits stale early-bird pricing and does not describe waitlist enrollment as a preorder. The homepage describes one year of access, matching the course catalog, and describes the completion certificate explicitly. Course completion must not be represented as CNCF OTCA certification.

Markdown is generated from the built main content, preserving headings, links, code blocks, and comparison tables. It includes the canonical source URL and page description. HTML advertises the Markdown alternate, blog RSS, and agent guide. Separate Markdown assets are marked noindex to avoid competing with canonical HTML in search.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) prioritizes ordinary SEO and useful content; it requires no special AI schema or instruction file. The agent guide and Markdown support make retrieval easier for compatible clients but do not promise inclusion in AI answers. Structured data should remain consistent with visible facts. FAQ markup is not a promise of a rich result.

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
