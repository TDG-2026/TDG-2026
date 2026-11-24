import {getCatalog} from './catalog.js';
import {createTranslator} from './translate.js';
import {localePath} from './config.js';
import {PUBLISHED_LOCALES, isPublished} from './published.js';

export async function localizeMetadata(meta, locale) {
  const catalog = await getCatalog(locale);
  const t = createTranslator(catalog.source, catalog.messages);

  const canonical = meta.alternates?.canonical || '/';
  const path = localePath(canonical, locale);

  // Single source of truth for what is public: lib/i18n/published.js
  const indexable = isPublished(locale) && meta.robots?.index !== false;

  // hreflang only makes sense with two or more published languages,
  // and only on pages that are themselves indexable.
  const languages = {};
  if (indexable && PUBLISHED_LOCALES.length > 1) {
    for (const code of PUBLISHED_LOCALES) {
      languages[code] = localePath(canonical, code);
    }
    languages['x-default'] = localePath(canonical, 'en');
  }

  const title =
    typeof meta.title === 'string'
      ? t(meta.title)
      : meta.title
        ? Object.fromEntries(Object.entries(meta.title).map(([k, v]) => [k, t(v)]))
        : undefined;

  return {
    ...meta,
    title,
    description: t(meta.description),
    alternates: {
      canonical: path,
      ...(Object.keys(languages).length ? {languages} : {}),
    },
    robots: isPublished(locale) ? meta.robots : {index: false, follow: true},
    openGraph: {
      ...meta.openGraph,
      title: t(meta.openGraph?.title),
      description: t(meta.openGraph?.description),
      url: path,
      locale,
      images: meta.openGraph?.images?.map((image) => ({...image, alt: t(image.alt)})),
    },
    twitter: {
      ...meta.twitter,
      title: t(meta.twitter?.title),
      description: t(meta.twitter?.description),
    },
  };
}