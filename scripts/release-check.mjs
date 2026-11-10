import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

// Load .env files without extra dependencies (existing environment variables win).
for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  const path = resolve(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const { products } = await import('../data/products.js');
const { site } = await import('../data/site.js');

const errors = [];
const warnings = [];

const url = process.env.NEXT_PUBLIC_SITE_URL;
if (!url) errors.push('NEXT_PUBLIC_SITE_URL is not set.');
else {
  if (!url.startsWith('https://')) errors.push(`NEXT_PUBLIC_SITE_URL must use https:// (got ${url}).`);
  if (/localhost|127\.0\.0\.1|YOUR-CONFIRMED-DOMAIN/i.test(url)) errors.push(`NEXT_PUBLIC_SITE_URL is a placeholder or local address (${url}).`);
}
if (!existsSync(resolve(root, 'public/images/genie-mascot.webp'))) {
  errors.push('Missing public/images/genie-mascot.webp.');
}

const { heroScreen, tourScreens } = await import('../data/screens.js');

for (const s of [heroScreen, ...tourScreens]) {
  const imagePath = resolve(
    root,
    'public',
    s.src.replace(/^\/+/, '')
  );

  if (!existsSync(imagePath)) {
    errors.push(`Missing screenshot: ${s.src}`);
  }
}

const ids = new Set();
const slugs = new Set();
for (const p of products) {
  if (ids.has(p.id)) errors.push(`Duplicate product id: ${p.id}`);
  if (slugs.has(p.slug)) errors.push(`Duplicate product slug: ${p.slug}`);
  ids.add(p.id); slugs.add(p.slug);

  if (!p.published) continue;
  const need = (cond, msg) => { if (!cond) errors.push(`[${p.slug}] published but ${msg}`); };
  need(p.status !== 'soon', 'status is "soon".');
  need(p.summary?.length > 20, 'summary is missing.');
  need(p.features?.length >= 3, 'has fewer than 3 verified features.');
  need(p.requirements?.length >= 1, 'has no requirements.');
  need(p.limitations?.length >= 1, 'has no known limitations.');
  need(p.screenshots?.length >= 1, 'has no screenshots.');
  need(p.privacy, 'has no data-flow explanation.');
  need(p.releaseVersion, 'has no release version.');
  need(p.lastReviewed, 'has no lastReviewed date.');
  for (const s of p.screenshots || []) {
    if (!existsSync(resolve(root, 'public', s.src.replace(/^\//, '')))) errors.push(`[${p.slug}] screenshot not found: ${s.src}`);
    if (!s.alt) errors.push(`[${p.slug}] screenshot without alt text: ${s.src}`);
  }
}

if (!products.some((p) => p.published)) warnings.push('Specialist applications remain previews and are excluded from the sitemap.');
if (!site.storeUrl || site.storeUrl !== 'https://apps.microsoft.com/detail/9P1J21G2Z9LZ' ||
    site.storeProductId !== '9P1J21G2Z9LZ' ||
    !site.storePackageIdentity ||
    !site.storePublisherDisplayName) {
  errors.push('The official Microsoft Store URL or supplied product identity is missing or inconsistent.');
}
if (!site.contactUrl && !site.supportEmail) warnings.push('No contact destination configured.');
if (!site.legal.privacy || !site.legal.terms) warnings.push('Privacy and/or terms pages are not configured.');

for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);
if (errors.length) { console.error(`\nRelease check failed with ${errors.length} error(s).`); process.exit(1); }
console.log('\n✔  Release check passed.');