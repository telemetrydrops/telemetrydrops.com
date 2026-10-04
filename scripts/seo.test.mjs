import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
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
