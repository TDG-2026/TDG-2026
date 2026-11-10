import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { site } from '../data/site.js';
import { heroScreen, tourScreens } from '../data/screens.js';
import { resources, findResource } from '../data/resources.js';
import { organizationSchema, appSchema, faqSchema, pageMeta } from '../lib/seo.js';

const root = resolve(import.meta.dirname, '..');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(/^https:\/\//.test(site.url), 'Canonical site URL must use HTTPS.');
check(site.publisherName === 'Travel Desk Genie', 'Publisher identity must be Travel Desk Genie.');
check(site.name === 'Travel Genie', 'Product brand identity must remain Travel Genie.');
check(Boolean(site.supportEmail), 'A canonical support email must be configured.');

const org = organizationSchema();
check(org['@type'] === 'Organization', 'Organization JSON-LD must describe an Organization.');
check(org.name === site.publisherName, 'Organization name must match the publisher identity.');
check(org.brand?.name === site.name, 'Organization must identify the Travel Genie brand.');
check(!org.address || Boolean(org.address.addressLocality || org.address.streetAddress || org.address.addressRegion || org.address.postalCode), 'Do not publish a country-only PostalAddress.');

const app = appSchema();
check(app['@type'] === 'SoftwareApplication', 'SoftwareApplication JSON-LD must be present.');
check(app.brand?.name === site.name, 'SoftwareApplication must identify the Travel Genie brand.');
check(app.downloadUrl === site.storeUrl, 'SoftwareApplication downloadUrl must use the official Microsoft Store listing.');
check(app.identifier === site.storeProductId, 'SoftwareApplication identifier must match the supplied Store product ID.');
check(!app.featureList.some((item) => /meeting mute|zoom mute/i.test(item)), 'Unverified meeting-audio claims must not appear in SoftwareApplication schema.');
check((app.offers || []).every((offer) => !('availability' in offer)), 'Do not assert stock availability for subscription offers.');

const faq = faqSchema([['Example question?', 'Example answer.']]);
check(faq.mainEntity[0]?.name === 'Example question?', 'FAQPage must include the question name.');
check(!('text' in faq.mainEntity[0]), 'Do not emit unsupported Question.text markup.');

const meta = pageMeta('Example title', 'Example description', '/');
check(meta.alternates?.canonical === '/', 'Page metadata must provide a canonical path.');
check(meta.twitter?.card === 'summary_large_image', 'Twitter cards should use a large image preview.');
check(meta.openGraph?.images?.[0]?.width === 512 && meta.openGraph?.images?.[0]?.height === 512, 'Open Graph dimensions must match the actual 512px mascot asset.');

const unverifiedSlugs = ['mute-meeting-apps-hotkey', 'mute-zoom-meeting-hotkey'];
for (const slug of unverifiedSlugs) check(Boolean(findResource(slug)), `Legacy guide route must remain available: ${slug}`);
for (const resource of resources) {
  check(resource.title?.trim().length > 8, `Resource title is missing or too short: ${resource.slug}`);
  check(resource.description?.trim().length > 40, `Resource description is missing or too short: ${resource.slug}`);
  check(resource.sections?.length >= 2, `Resource needs substantive answer content: ${resource.slug}`);
  for (const related of resource.related || []) check(Boolean(findResource(related)), `Broken or unpublished related resource ${related} referenced by ${resource.slug}`);
}

for (const asset of [heroScreen, ...tourScreens]) {
  const path = resolve(root, 'public', asset.src.replace(/^\/+/, ''));
  check(existsSync(path), `Missing public image: ${asset.src}`);
  check(Boolean(asset.alt?.trim()), `Public image needs descriptive alt text: ${asset.src}`);
}

if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`);
  console.error(`\nSEO/AEO validation failed: ${errors.length} issue(s).`);
  process.exit(1);
}
console.log('✔ SEO/AEO source validation passed.');
console.log(`✔ ${resources.length} public resources checked; publisher, product brand, schema, metadata and image references are consistent.`);
