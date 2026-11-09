import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resources, indexableResources, findResource, UNVERIFIED_RESOURCE_SLUGS} from '../data/resources.js';

const config = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8');
const route = readFileSync(new URL('../app/[locale]/resources/[slug]/page.js', import.meta.url), 'utf8');
const library = readFileSync(new URL('../app/[locale]/resources/page.js', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../app/sitemap.js', import.meta.url), 'utf8');
const feeds = [
  readFileSync(new URL('../app/llms.txt/route.js', import.meta.url), 'utf8'),
  readFileSync(new URL('../app/llms-full.txt/route.js', import.meta.url), 'utf8'),
];

for (const slug of ['mute-zoom-meeting-hotkey', 'mute-meeting-apps-hotkey']) {
  assert.ok(findResource(slug), `Missing resource data for ${slug}`);
  assert.ok(resources.some((r) => r.slug === slug), `Missing route data for ${slug}`);
  assert.ok(UNVERIFIED_RESOURCE_SLUGS.has(slug), `${slug} must remain marked unverified`);
  assert.ok(!indexableResources.some((r) => r.slug === slug), `${slug} must stay out of indexable feeds`);
  assert.ok(!config.includes(`source: '/:locale/resources/${slug}'`), `${slug} must not be redirected away`);
}
assert.ok(route.includes('UNVERIFIED_RESOURCE_SLUGS.has(r.slug)'), 'Resource route must apply the noindex/status guard');
assert.ok(library.includes('Pre-release guide'), 'Resource library must label these guides as pre-release');
assert.ok(sitemap.includes('indexableResources as resources'), 'Sitemap must only include indexable resources');
for (const feed of feeds) assert.ok(feed.includes('indexableResources as resources'), 'AI feeds must only include indexable resources');

console.log('✔ Both meeting-guide URLs resolve from resource data.');
console.log('✔ Neither URL is redirected to /resources.');
console.log('✔ Both pages carry a release-status notice and noindex metadata.');
console.log('✔ Unverified guides are excluded from sitemap and llms feeds.');
