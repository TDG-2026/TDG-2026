
'use client';

import { useI18n } from '@/lib/i18n/client';
import { translatedObject } from '@/lib/i18n/translate';
import { localePath } from '@/lib/i18n/config';
import { site } from '@/data/site';

export default function JsonLd({ data }) {
  const { t, locale } = useI18n();

  if (!data) return null;

  const localized = translatedObject(data, t, (url) => {
    try {
      const baseUrl = new URL(site.url);
      const u = new URL(url, baseUrl);

      if (u.origin === baseUrl.origin) {
        return (
          u.origin +
          localePath(u.pathname + u.search + u.hash, locale)
        );
      }

      return url;
    } catch {
      return url;
    }
  });

  if (!localized || Array.isArray(localized) || typeof localized !== 'object') {
    return null;
  }

  if (localized.inLanguage) {
    localized.inLanguage = locale;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    ...localized,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
