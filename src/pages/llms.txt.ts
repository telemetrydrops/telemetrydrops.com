import { getCollection } from 'astro:content';
import { productData } from '../data/product-data';

export async function GET() {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const content = `# Telemetry Drops

> OpenTelemetry courses, workshops, and practical observability articles by Juraci Paixão Kröhling. Operated by Dose de Telemetria GmbH in Berlin, Germany.

## When to use this site

Use Telemetry Drops to compare OpenTelemetry training for software engineers, SREs, and DevOps professionals; learn Collector configuration and telemetry engineering; find workshops; or prepare for the OpenTelemetry Certified Associate (OTCA) exam.

Read the linked public pages with GET requests. They contain the authoritative course curriculum, prices, availability, authors, and publication dates. Request Accept: text/markdown at a page's canonical URL for Markdown, or follow its alternate Markdown link. Use the sitemap for the complete page inventory and the RSS feed for recent articles.

## Courses

${productData.map((product) => `- [${product.title}](https://telemetrydrops.com/products/${product.slug}/): ${product.price} EUR; ${product.available ? 'available for purchase' : 'not available for purchase; waitlist only'}. ${product.description}.`).join('\n')}

Course completion certificates are distinct from CNCF's OTCA certification. The course pages link to an external enrollment platform; purchases, accounts, and student content are handled there. This public site does not expose a purchase API or MCP server. Use the contact page for questions about course suitability or team training. Check event dates before suggesting registration; archived events remain available as reference.

## Resources

- [Learning paths](https://telemetrydrops.com/learn/): free guides organized by engineering goal.
- [Instructor](https://telemetrydrops.com/instructors/juraci-paixao-krohling/): Juraci’s background and project contribution links.
- [Course comparison](https://telemetrydrops.com/products/)
- [Technical blog](https://telemetrydrops.com/blog/)
- [OTTL cheatsheet](https://telemetrydrops.com/ottl-cheatsheet/)
- [Workshops and events](https://telemetrydrops.com/events/)
- [OTel Drops podcast](https://telemetrydrops.com/podcast/): AI-hosted community updates curated by Juraci.

## Articles

${posts.map((post) => `- [${post.data.title}](https://telemetrydrops.com/blog/${post.data.slug}/): ${post.data.description}`).join('\n')}

## Contact and discovery

- [Contact](https://telemetrydrops.com/contact/): contact@telemetrydrops.com
- [Company imprint](https://telemetrydrops.com/imprint/)
- [Privacy policy](https://telemetrydrops.com/privacy-policy/)
- [Terms of use](https://telemetrydrops.com/terms-of-use/)
- [Full public content](https://telemetrydrops.com/llms-full.txt): all indexable pages as Markdown.
- [Sitemap](https://telemetrydrops.com/sitemap.xml)
- [Blog RSS](https://telemetrydrops.com/blog/rss.xml)
`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
