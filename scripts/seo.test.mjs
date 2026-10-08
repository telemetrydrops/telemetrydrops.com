import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { elements, attribute, htmlFiles } from './build-agent-content.mjs';

const files = await htmlFiles('dist');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

test('sitemap exactly covers indexable built pages and every alternate exists', async () => {
  const expected = [];
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const links = nodes.filter((node) => node.tagName === 'link');
    const canonicals = links.filter((node) => attribute(node, 'rel') === 'canonical');
    assert.equal(canonicals.length, 1, file);
    const canonical = attribute(canonicals[0], 'href');
    const noindex = nodes.some((node) => attribute(node, 'name') === 'robots' && /noindex/.test(attribute(node, 'content') ?? ''));
    if (!noindex) expected.push(canonical);
    for (const link of links.filter((node) => attribute(node, 'type') === 'text/markdown')) await access(`dist${attribute(link, 'href')}`);
    const content = await readFile(file.replace(/\.html$/, '.md'), 'utf8');
    assert.ok(content.length > 100, file);
    assert.ok(!content.includes('<script'), file);
    for (const script of nodes.filter((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')) JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''));
  }
  assert.deepEqual(urls.sort(), expected.sort());
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://telemetrydrops.com/events/'));
  assert.ok(!urls.some((url) => /404|otca-practice-exam/.test(url)));
});

test('homepage is readable without JavaScript, has sequential headings and business contact data', async () => {
  const nodes = elements(parse(await readFile('dist/index.html', 'utf8')));
  const headings = nodes.filter((node) => /^h[1-6]$/.test(node.tagName ?? ''));
  assert.equal(headings.filter((node) => node.tagName === 'h1').length, 1);
  let previous = 0;
  for (const heading of headings) { const level = Number(heading.tagName[1]); assert.ok(level <= previous + 1, `Skipped from h${previous} to h${level}`); previous = level; }
  const content = await readFile('dist/index.md', 'utf8');
  assert.ok(content.length > 500);
  assert.match(content, /one year of access/);
  assert.doesNotMatch(content, /lifetime access/);
  const orgNode = nodes.find((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json');
  const org = JSON.parse(orgNode.childNodes[0].value);
  assert.equal(org.contactPoint.email, 'contact@telemetrydrops.com');
  assert.equal(org.address.addressLocality, 'Berlin');
});

test('agents can read prices consistent with visible course pages and navigate the guide', async () => {
  const guide = await readFile('dist/llms.txt', 'utf8');
  assert.match(guide, /When to use this site/);
  for (const [slug, price, availability] of [['otel-track', '499', 'InStock'], ['otel-specialization', '1999', 'OutOfStock']]) {
    const nodes = elements(parse(await readFile(`dist/products/${slug}/index.html`, 'utf8')));
    const courseNode = nodes.find((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json');
    const course = JSON.parse(courseNode.childNodes[0].value);
    assert.equal(course.offers.price, price);
    assert.equal(course.offers.availability, `https://schema.org/${availability}`);
    assert.equal(course.offers.priceCurrency, 'EUR');
    const content = await readFile(`dist/products/${slug}/index.md`, 'utf8');
    assert.match(content, new RegExp(price === '1999' ? '€1,999' : '€499'));
  }
  for (const match of guide.matchAll(/\]\(https:\/\/telemetrydrops.com(.*?)\)/g)) {
    const path = match[1];
    await access(`dist${path}${path.endsWith('/') ? 'index.html' : ''}`);
  }
  const article = await readFile('dist/blog/severity-based-log-routing/index.md', 'utf8');
  assert.match(article, /```/);
  assert.match(article, /https:\/\//);
  const comparison = await readFile('dist/products/index.md', 'utf8');
  assert.match(comparison, /\| Price \| €1,999 \| €499 \|/);
});

test('training pages identify their instructor and do not advertise unavailable enrollment or unsupported ratings', async () => {
  const profilePath = '/instructors/juraci-paixao-krohling/';
  const profile = elements(parse(await readFile(`dist${profilePath}index.html`, 'utf8')));
  const person = JSON.parse(profile.find((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json').childNodes[0].value);
  assert.equal(person['@type'], 'Person');
  assert.equal(person.url, `https://telemetrydrops.com${profilePath}`);
  const specialization = await readFile('dist/products/otel-specialization/index.md', 'utf8');
  assert.doesNotMatch(specialization, /Enroll now/);
  assert.match(specialization, /Join waitlist/);
  const courseHtml = await readFile('dist/products/otel-specialization/index.html', 'utf8');
  assert.match(courseHtml, /href="#waitlist"/);
  assert.match(courseHtml, /id="waitlist"/);
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    for (const script of nodes.filter((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')) {
      const schema = JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''));
      assert.notEqual(schema['@type'], 'Review', file);
      if (schema['@type'] === 'TechArticle') assert.equal(schema.author['@id'], person['@id']);
    }
  }
  const archived = await readFile('dist/events/2026/01/berlin/otel-collector-workshop/index.md', 'utf8');
  assert.match(archived, /Registration closed/);
  assert.doesNotMatch(archived, /Reserve your seat|Save your spot/);
  const learning = await readFile('dist/learn/index.md', 'utf8');
  assert.match(learning, /Weaver/);
  assert.match(learning, /severity-based/);
});


test('the five branded cards have correct dimensions and are selected by page and section', async () => {
  const cards = JSON.parse(await readFile('src/data/og-cards.json', 'utf8'));
  const hashes = new Set();
  for (const card of cards) {
    const png = await readFile(`dist${card.image}`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    hashes.add(createHash('sha256').update(png).digest('hex'));
    const nodes = elements(parse(await readFile(`dist${card.path}index.html`, 'utf8')));
    const meta = (name) => attribute(nodes.find((node) => attribute(node, 'property') === name || attribute(node, 'name') === name), 'content');
    assert.equal(meta('og:image'), `https://telemetrydrops.com${card.image}`);
    assert.equal(meta('twitter:image'), meta('og:image'));
    assert.equal(meta('og:image:alt'), card.alt);
    assert.equal(meta('twitter:image:alt'), card.alt);
    assert.equal(meta('og:image:type'), 'image/png');
  }
  assert.equal(hashes.size, 5, 'Cards must contain different page copy');
  for (const file of files.filter((file) => /dist\/(blog|products|events)\//.test(file))) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const image = attribute(nodes.find((node) => attribute(node, 'property') === 'og:image'), 'content');
    assert.ok(image.startsWith('https://'), file);
    if (image.startsWith('https://telemetrydrops.com/')) await access(`dist${new URL(image).pathname}`);
  }
});

test('page schema connects to a stable publisher, website, and preview image', async () => {
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const schemas = nodes.filter((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')
      .map((node) => JSON.parse(node.childNodes.map((child) => child.value ?? '').join('')));
    const graph = schemas.flatMap((schema) => schema['@graph'] ?? [schema]);
    const org = graph.find((node) => node['@type'] === 'Organization');
    const website = graph.find((node) => node['@type'] === 'WebSite');
    const page = graph.find((node) => node['@type'] === 'WebPage');
    const canonical = attribute(nodes.find((node) => attribute(node, 'rel') === 'canonical'), 'href');
    const image = attribute(nodes.find((node) => attribute(node, 'property') === 'og:image'), 'content');
    assert.equal(website.publisher['@id'], org['@id'], file);
    assert.equal(page.isPartOf['@id'], website['@id'], file);
    assert.equal(page.url, canonical, file);
    assert.equal(page.primaryImageOfPage.url, image, file);
    const article = graph.find((node) => node['@type'] === 'TechArticle');
    if (article) {
      assert.equal(article.mainEntityOfPage['@id'], page['@id'], file);
      assert.equal(article.image, image, file);
    }
  }
});

test('full agent export contains exactly the indexable page content', async () => {
  const full = await readFile('dist/llms-full.txt', 'utf8');
  const sources = [...full.matchAll(/^Source: (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(sources.sort(), [...urls].sort());
  assert.ok(!sources.some((url) => /404|otca-practice-exam/.test(url)));
  const guide = await readFile('dist/llms.txt', 'utf8');
  assert.doesNotMatch(guide, /https:\/\/telemetrydrops.com\/otca-practice-exam\//);
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const canonical = attribute(nodes.find((node) => attribute(node, 'rel') === 'canonical'), 'href');
    if (urls.includes(canonical)) assert.ok(full.includes(await readFile(file.replace(/\.html$/, '.md'), 'utf8')), file);
  }
});
