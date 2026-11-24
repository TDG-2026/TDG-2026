import {site, mascot} from '@/data/site';
import {indexableResources as resources} from '@/data/resources';
import {heroScreen, tourScreens} from '@/data/screens';
import {localePath} from '@/lib/i18n/config';
import {PUBLISHED_LOCALES} from '@/lib/i18n/published';

const PAGES = [
  ['/', 1, 'weekly'],
  ['/products/magic-toolbar', 0.9, 'monthly'],
  ['/pricing', 0.8, 'monthly'],
  ['/download', 0.8, 'monthly'],
  ['/products', 0.7, 'monthly'],
  ['/guide', 0.7, 'monthly'],
  ['/resources', 0.7, 'weekly'],
  ['/support', 0.6, 'monthly'],
  ['/about', 0.5, 'yearly'],
  ['/contact', 0.5, 'yearly'],
  ['/security-and-privacy', 0.5, 'yearly'],

  ...resources.map((r) => [
    '/resources/' + r.slug,
    0.7,
    'monthly',
    r.updated || r.published,
  ]),
];

const abs = (p) => site.url + p;

const IMAGES = {
  '/': [mascot.src, heroScreen.src].map(abs),
  '/products/magic-toolbar': [
    heroScreen.src,
    ...tourScreens.map((s) => s.src),
  ].map(abs),
};

export default function sitemap() {
  // Single source of truth: lib/i18n/published.js
  const published = PUBLISHED_LOCALES;

  const entries = published.flatMap((locale) =>
    PAGES.map(([path, priority, changeFrequency, lastModified]) => ({
      url: site.url + localePath(path, locale),
      ...(lastModified ? {lastModified} : {}),
      changeFrequency,
      priority,
      ...(IMAGES[path] ? {images: IMAGES[path]} : {}),
    }))
  );

  // The GDS Search Engine currently indexes only English.
  if (published.includes('en')) {
    entries.push({
      url: site.url + localePath('/gds-search-engine', 'en'),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return entries;
}