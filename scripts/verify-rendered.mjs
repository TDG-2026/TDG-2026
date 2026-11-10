import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {locales, splitPath} from '../lib/i18n/config.js';
import {products} from '../data/products.js';
import {UNVERIFIED_RESOURCE_SLUGS} from '../data/resources.js';
import {getCatalog} from '../lib/i18n/catalog.js';
import {site} from '../data/site.js';

const root = path.resolve('.next/server/app');
const report = [];
// Normalise Windows backslashes so "ur\\pricing.html" is matched as "ur/pricing.html".
const allFiles = fs.readdirSync(root, {recursive: true}).map((f) => String(f).split(path.sep).join('/'));
const htmlFiles = allFiles.filter((f) => f.endsWith('.html') && locales.some((l) => f === l.code + '.html' || f.startsWith(l.code + '/')));
const rendered = new Map(htmlFiles.map((file) => ['/' + file.slice(0, -5), fs.readFileSync(path.join(root, file), 'utf8')]));

for (const [route, html] of rendered) {
  const {locale, path: routePath} = splitPath(route);
  const info = locales.find((l) => l.code === locale);
  const catalog = await getCatalog(locale);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title, route + ' missing title');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route + ' requires one H1');
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, site.url + route, route + ' incorrect canonical');
  assert(html.includes(`<html lang="${locale}" dir="${info.dir}"`), route + ' HTML locale mismatch');
  assert(!html.includes('http://localhost:3000'), route + ' localhost leaked');
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(m[1]);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, route + ' duplicate IDs');
  const resourceSlug = routePath.startsWith('/resources/')
  ? routePath.slice('/resources/'.length)
  : '';

const draft = !catalog.published
  || routePath.startsWith('/platform/')
  || UNVERIFIED_RESOURCE_SLUGS.has(resourceSlug)
  || products.some((p) =>
    !p.published && (p.path || '/products/' + p.slug) === routePath
  )
  || ['/privacy', '/terms', '/refund', '/delivery'].includes(routePath);
  assert.equal(html.includes('content="noindex, follow"'), draft, route + ' indexing mismatch');
  if (draft) assert(!/<link[^>]+rel="alternate"[^>]+hrefLang=/.test(html), route + ' draft must not advertise SEO alternates');
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const u = new URL(href, 'https://test.invalid' + route);
    const target = decodeURIComponent(u.pathname);
    const content = rendered.get(target);
    assert(content !== undefined || fs.existsSync(path.join('public', target)), route + ' missing link ' + href);
    if (content && u.hash) assert(content.includes('id="' + decodeURIComponent(u.hash.slice(1)) + '"'), route + ' missing anchor ' + href);
  }
  report.push({route, locale, title, canonical, noindex: draft});
}

// Every locale must render exactly the same set of pages as English.
const perLocale = Object.fromEntries(locales.map((l) => [l.code, report.filter((r) => r.locale === l.code).length]));
const pagesPerLocale = perLocale.en;
assert(pagesPerLocale > 0, 'No English pages rendered — run npm run build first');
for (const [code, n] of Object.entries(perLocale)) assert.equal(n, pagesPerLocale, `${code} renders ${n} pages, English renders ${pagesPerLocale}`);
assert.equal(report.length, pagesPerLocale * locales.length, `Expected ${pagesPerLocale} pages × ${locales.length} locales`);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml.body'), 'utf8');
for (const locale of locales) {
  if (!(await getCatalog(locale.code)).published) assert(!sitemap.includes(site.url + '/' + locale.code + '/'), locale.code + ' draft leaked into sitemap');
}

fs.writeFileSync('RENDERED_AUDIT.json', JSON.stringify({
  status: 'passed', checkedAt: new Date().toISOString(), pageCount: report.length, pagesPerLocale, localeCount: locales.length,
  scope: 'Production HTML: locale/direction, titles, one H1, canonical URLs, noindex, JSON-LD parsing, unique IDs and internal links/anchors. Browser interactions and live provider calls are not covered.',
  pages: report,
}, null, 2) + '\n');
console.log(`Passed ${report.length} localized pages (${pagesPerLocale} per locale) across ${locales.length} locales.`);