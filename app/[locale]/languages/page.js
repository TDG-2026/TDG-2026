import NextLink from 'next/link';
import {locales, localePath} from '@/lib/i18n/config';
import {getCatalog, getTranslator} from '@/lib/i18n/catalog';
import {localizeMetadata} from '@/lib/i18n/metadata';
import {pageMeta, webPageSchema, breadcrumbs} from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

const LANGUAGE_FLAGS = {
  nl: '🇳🇱', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹',
  es: '🇪🇸', ps: '🇦🇫', ar: '🇸🇦', ur: '🇵🇰',
};

const META = pageMeta('Website Languages | Travel Genie',
  'Choose from nine configured website languages. See translation readiness and how browser and region language detection works.', '/languages');
export async function generateMetadata({params}) { const {locale} = await params; return localizeMetadata(META, locale); }

export default async function LanguagesPage({params}) {
  const {locale} = await params;
  const t = await getTranslator(locale);
  const rows = await Promise.all(locales.map(async (l) => { const c = await getCatalog(l.code); return {...l, coverage: c.coverage, published: c.published, machine: c.machine}; }));
  return (
    <section className="section static-page">
      <StructuredData data={[webPageSchema({locale, t, path: '/languages', name: META.title.absolute, description: META.description}),
        breadcrumbs([['Home', '/'], ['Website languages', '/languages']], locale, t)]} />
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('Languages')}</span>
          <h1 className="title">{t('Choose your language')}</h1>
          <p className="lead">{t('Travel Genie offers {count} language choices. Full page translations are released after review. Choose the language you prefer; your choice is saved on this device for 180 days.', {count: locales.length})}</p>
        </div>
        <ul className="language-list">
          {rows.map((l) => {
            const status = l.code === 'en' || (l.published && !l.machine) ? t('Reviewed') : l.published ? t('Automatic translation')
              : t('In preparation · {percent}% translated', {percent: Math.round(l.coverage * 100)});
            return <li key={l.code}>
              <NextLink href={localePath('/', l.code)} hrefLang={l.code} prefetch={false} aria-current={l.code === locale ? 'page' : undefined}>
                <strong lang={l.code} dir={l.dir}><span aria-hidden="true">{LANGUAGE_FLAGS[l.code] || '🌐'} </span>{l.name}</strong><small>{l.english} · {status}</small>
              </NextLink>
            </li>;
          })}
        </ul>
        <h2 className="sub-title">{t('How is my language chosen?')}</h2>
        <p className="answer-first">{t('The website first respects an explicit language in the page address and your saved preference. On a first visit it checks your browser language, then your region when the hosting platform provides a trusted country signal, and finally English. Some non-English page catalogs are still awaiting translation and native review; those pages remain out of search indexes until ready. You can change language at any time from the menu.')}</p>
      </div>
    </section>
  );
}