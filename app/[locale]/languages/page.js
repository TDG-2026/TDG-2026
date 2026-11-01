import NextLink from 'next/link';
import {locales, localePath} from '@/lib/i18n/config';
import {getCatalog, getTranslator} from '@/lib/i18n/catalog';
import {localizeMetadata} from '@/lib/i18n/metadata';
import {pageMeta, webPageSchema, breadcrumbs} from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

const META = pageMeta('Website Languages | Travel Genie',
  'Use the Travel Genie website in your language. See every supported language, its translation status and how language detection works.', '/languages');
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
          <p className="lead">{t('Travel Genie is built for {count} languages. Pick the one you read best. Your choice is saved on this device for 180 days.', {count: locales.length})}</p>
        </div>
        <ul className="language-list">
          {rows.map((l) => {
            const status = l.code === 'en' || (l.published && !l.machine) ? t('Reviewed') : l.published ? t('Automatic translation')
              : t('In preparation · {percent}% translated', {percent: Math.round(l.coverage * 100)});
            return <li key={l.code}>
              <NextLink href={localePath('/', l.code)} hrefLang={l.code} prefetch={false} aria-current={l.code === locale ? 'page' : undefined}>
                <strong lang={l.code} dir={l.dir}>{l.name}</strong><small>{l.english} · {status}</small>
              </NextLink>
            </li>;
          })}
        </ul>
        <h2 className="sub-title">{t('How is my language chosen?')}</h2>
        <p className="answer-first">{t('The website first uses the language in the page address. If there is none, it uses the language you chose before, then your browser languages, then your region when the hosting platform provides it, and finally English. Automatic detection only picks languages that are fully translated. You can change the language at any time from the menu at the top.')}</p>
      </div>
    </section>
  );
}