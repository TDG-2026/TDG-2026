import {site, mascot} from '@/data/site';
import {resources} from '@/data/resources';
import {heroScreen, tourScreens} from '@/data/screens';
import {locales, localePath} from '@/lib/i18n/config';
import {getCatalog} from '@/lib/i18n/catalog';
import {UPDATED} from '@/lib/seo';

const PAGES = [['/', 1, 'weekly'], ['/products/magic-toolbar', 0.9, 'monthly'], ['/pricing', 0.8, 'monthly'], ['/download', 0.8, 'monthly'],
  ['/products', 0.7, 'monthly'], ['/guide', 0.7, 'monthly'], ['/resources', 0.7, 'weekly'], ['/support', 0.6, 'monthly'], ['/about', 0.5, 'yearly'],
  ['/contact', 0.5, 'yearly'], ['/security-and-privacy', 0.5, 'yearly'], ['/languages', 0.4, 'monthly'],
  ...resources.map((r) => ['/resources/' + r.slug, 0.7, 'monthly', r.updated || UPDATED])];
const abs = (p) => site.url + p;
const IMAGES = {'/': [mascot.src, heroScreen.src].map(abs), '/products/magic-toolbar': [heroScreen.src, ...tourScreens.map((s) => s.src)].map(abs)};

export default async function sitemap() {
  const published = [];
  for (const l of locales) if ((await getCatalog(l.code)).published) published.push(l.code);
  return published.flatMap((locale) => PAGES.map(([path, priority, changeFrequency, lastModified = UPDATED]) => ({
    url: site.url + localePath(path, locale), lastModified, changeFrequency, priority, ...(IMAGES[path] ? {images: IMAGES[path]} : {}),
  })));
}