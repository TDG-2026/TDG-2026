import NextLink from 'next/link';
import {locales, localePath} from '@/lib/i18n/config';
import {getTranslator} from '@/lib/i18n/catalog';
import {localizeMetadata} from '@/lib/i18n/metadata';
import {isPublished} from '@/lib/i18n/published';
import {pageMeta, webPageSchema, breadcrumbs} from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

// Reviewed languages get links; the rest are listed as plain text until published.
const publishedLocales = locales.filter((l) => isPublished(l.code));
const upcomingLocales = locales.filter((l) => !isPublished(l.code));

const META = pageMeta('Website Languages | Travel Genie',
  'See which languages the Travel Genie website is available in and which are coming after native review.', '/languages',
  {robots: {index: false, follow: true}});
export async function generateMetadata({params}) { const {locale} = await params; return localizeMetadata(META, locale); }

export default async function LanguagesPage({params}) {
  const {locale} = await params;
  const t = await getTranslator(locale);
  return (
    <section className="section static-page">
      <StructuredData data={[webPageSchema({locale, t, path: '/languages', name: META.title.absolute, description: META.description}),
        breadcrumbs([['Home', '/'], ['Website languages', '/languages']], locale, t)]} />
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('Languages')}</span>
          <h1 className="title">{t('Choose your language')}</h1>
          <p className="lead">{publishedLocales.length > 1
            ? t('Travel Genie is available in {count} languages. Each language is released only after a native speaker has reviewed it. Your choice is saved on this device for 180 days.', {count: publishedLocales.length})
            : t('Travel Genie is currently available in English. Each new language is released only after a native speaker has reviewed it.')}</p>
        </div>

        <ul className="language-list">
          {publishedLocales.map((l) => (
            <li key={l.code}>
              <NextLink href={localePath('/', l.code)} hrefLang={l.code} prefetch={false} aria-current={l.code === locale ? 'page' : undefined}>
                <strong lang={l.code} dir={l.dir}>{l.name}</strong><small>{l.english} · {t('Reviewed')}</small>
              </NextLink>
            </li>
          ))}
        </ul>

        {upcomingLocales.length > 0 && (
          <>
            <h2 className="sub-title">{t('Coming soon')}</h2>
            <p>{t('These languages are being translated and reviewed. They will appear here as soon as they are ready.')}</p>
            <ul className="language-list language-list--upcoming">
              {upcomingLocales.map((l) => (
                <li key={l.code}>
                  <span>
                    <strong lang={l.code} dir={l.dir}>{l.name}</strong><small>{l.english} · {t('In preparation')}</small>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="sub-title">{t('How is my language chosen?')}</h2>
        <p className="answer-first">{t('The website uses a language from the page address or your saved choice. On a first visit it checks your browser language, then your region, and otherwise shows English. Only languages that have passed native review are offered.')}</p>
      </div>
    </section>
  );
}