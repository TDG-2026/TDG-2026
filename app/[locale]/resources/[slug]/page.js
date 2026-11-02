import NextLink from 'next/link';
import {notFound} from 'next/navigation';
import {resources, findResource} from '@/data/resources';
import {getTranslator} from '@/lib/i18n/catalog';
import {localizeMetadata} from '@/lib/i18n/metadata';
import {localePath} from '@/lib/i18n/config';
import {pageMeta, webPageSchema, articleSchema, faqSchema, breadcrumbs, localizedUrl, UPDATED} from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

export const dynamicParams = false;
export function generateStaticParams() { return resources.map((r) => ({slug: r.slug})); }

const SEO_TITLES = {
  'passport-docs-ctcm-ctce-gds': 'Passport DOCS Entry: Amadeus, Galileo, Sabre | Travel Genie',
  'ctcm-ctce-passenger-contacts': 'CTCM & CTCE Entry: Amadeus, Galileo, Sabre | Travel Genie',
  'adult-child-infant-name-entry-gds': 'Adult, Child & Infant Name Entry in GDS | Travel Genie',
  'amadeus-commands-notes': 'Amadeus Commands Notes & Cheat Sheet | Travel Genie',
  'travelport-galileo-commands-notes': 'Travelport Galileo Commands Cheat Sheet | Travel Genie',
  'sabre-commands-notes': 'Sabre Commands Notes & Cheat Sheet | Travel Genie',
  'visa-photo-preparation': 'Visa Photo Fixer: Size, Quality & Rotate | Travel Genie',
  'f1-f12-hotkeys-saved-messages': 'F1–F12 Hotkeys for Saved Messages | Travel Genie',
  'translator-for-travel-agents': 'Translator for Travel Agents | Travel Genie',
  'mute-meeting-apps-hotkey': 'Mute Zoom, Teams & Meet Sound With a Hotkey | Travel Genie',
  'mute-zoom-meeting-hotkey': 'Mute Zoom During a WhatsApp Call: Hotkey | Travel Genie',
  'travel-agent-shortcuts-notes': 'Travel Desk Shortcuts & Notes | Travel Genie',
  'travel-agency-software-checklist': 'Travel Agency Software Checklist | Travel Genie',
};

// Call-to-action per guide category: [heading, text]
const CTA = {
  'Photo tools': ['Fix visa photos in minutes', 'Magic Toolbar checks visa photo size, improves quality and straightens tilted photos on Windows, so you can prepare each application photo in minutes.'],
    'Desk productivity': ['Make your travel desk faster', 'Magic Toolbar puts F1–F12 saved messages, a translator, notes, reminders and meeting mute hotkeys together on Windows, so your daily desk work moves faster.'],
};
const DEFAULT_CTA = ['Ready to prepare entries faster?', 'Magic Toolbar prepares NAME, DOCS, CTCM and CTCE entries for Amadeus, Travelport and Sabre on Windows. You check each entry, then copy it into your GDS.'];

const fmt = (d, locale) => { try { return new Intl.DateTimeFormat(locale, {dateStyle: 'long', timeZone: 'UTC'}).format(new Date(d + 'T00:00:00Z')); } catch { return d; } };
// A table cell with no lowercase letters is treated as a GDS code: never translated, always left-to-right.
const isCode = (s) => !/[a-z]/.test(String(s));
const extraText = (x = {}) => [...(x.steps || []), ...((x.table && x.table.rows) || []).flat()].join(' ');

export async function generateMetadata({params}) {
  const {locale, slug} = await params;
  const r = findResource(slug); if (!r) return {};
  const meta = pageMeta(SEO_TITLES[r.slug] || r.title, r.description, '/resources/' + r.slug);
  meta.openGraph = {...meta.openGraph, type: 'article', publishedTime: r.published || UPDATED, modifiedTime: r.updated || UPDATED};
  return localizeMetadata(meta, locale);
}

export default async function ResourcePage({params}) {
  const {locale, slug} = await params;
  const r = findResource(slug); if (!r) notFound();
  const t = await getTranslator(locale);
  const path = '/resources/' + r.slug;
  const url = localizedUrl(path, locale);
  const published = r.published || UPDATED, modified = r.updated || UPDATED;
  const words = r.sections.reduce((n, [q, a, x]) => n + `${q} ${a} ${extraText(x)}`.trim().split(/\s+/).length, 0);
  const minutes = Math.max(2, Math.round(words / 200));
  const related = (r.related || []).map(findResource).filter(Boolean);
  const [ctaTitle, ctaText] = CTA[r.category] || DEFAULT_CTA;

  const faqPairs = r.sections.filter(([q]) => q.trim().endsWith('?'));
  const howTos = r.sections
    .map(([q, , x], i) => (x && x.steps ? {
      '@type': 'HowTo', '@id': `${url}#howto-${i + 1}`, name: t(q), inLanguage: locale,
      step: x.steps.map((s, n) => ({'@type': 'HowToStep', position: n + 1, name: t(s), text: t(s)})),
    } : null))
    .filter(Boolean);

  return (
    <article className="section static-page">
      <StructuredData data={[
        webPageSchema({locale, t, path, name: r.title, description: r.description, speakable: ['.article-summary', '.answer-first'], datePublished: published, dateModified: modified}),
        articleSchema({locale, t, path, headline: r.title, description: r.description, section: r.category, datePublished: published, dateModified: modified, wordCount: words}),
        faqPairs.length ? faqSchema(faqPairs, t, {name: r.title, description: r.description}) : null,
        ...howTos,
        breadcrumbs([['Home', '/'], ['Resources', '/resources'], [r.title, path]], locale, t),
      ].filter(Boolean)} />
      <div className="container static-narrow">
        <nav className="breadcrumb" aria-label={t('Breadcrumb')}>
          <NextLink href={localePath('/', locale)}>{t('Home')}</NextLink><span aria-hidden="true">/</span>
          <NextLink href={localePath('/resources', locale)}>{t('Resources')}</NextLink><span aria-hidden="true">/</span>
          <span aria-current="page">{t(r.title)}</span>
        </nav>
        <span className="eyebrow">{t(r.category)}</span>
        <h1 className="title article-title">{t(r.title)}</h1>
        <p className="lead article-summary">{t(r.description)}</p>
        <p className="content-date">{t('By Travel Genie')} · {t('Published')} <time dateTime={published}>{fmt(published, locale)}</time> · {t('Updated')} <time dateTime={modified}>{fmt(modified, locale)}</time> · {t('{minutes} min read', {minutes})}</p>
        <nav className="toc" aria-labelledby="toc-title">
          <h2 id="toc-title" className="h-sm">{t('On this page')}</h2>
          <ol>{r.sections.map(([q], i) => <li key={i}><a href={`#q${i + 1}`}>{t(q)}</a></li>)}</ol>
        </nav>
        {r.sections.map(([q, a, x = {}], i) => (
          <section key={i} className="dblock" aria-labelledby={`q${i + 1}`}>
            <h2 id={`q${i + 1}`}>{t(q)}</h2>
            <p className="answer-first">{t(a)}</p>
            {x.steps && (
              <ol className="howto-steps">{x.steps.map((s, n) => <li key={n}>{t(s)}</li>)}</ol>
            )}
            {x.code && (
              <pre className="code-block" dir="ltr" translate="no"><code>{[].concat(x.code).join('\n')}</code></pre>
            )}
            {x.table && (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr>{x.table.head.map((h) => <th key={h} scope="col">{t(h)}</th>)}</tr></thead>
                  <tbody>
                    {x.table.rows.map((row, ri) => (
                      <tr key={ri}>{row.map((c, ci) => (
                        <td key={ci}>{isCode(c) ? <code dir="ltr" translate="no">{c}</code> : t(c)}</td>
                      ))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
        {related.length > 0 && <aside aria-labelledby="related-title">
          <h2 id="related-title" className="sub-title">{t('Related guides')}</h2>
          <ul className="resource-related">{related.map((x) => <li key={x.slug}><NextLink className="text-link" href={localePath('/resources/' + x.slug, locale)}>{t(x.title)}</NextLink></li>)}</ul>
        </aside>}
        <div className="flagship-banner">
          <div><h2>{t(ctaTitle)}</h2><p>{t(ctaText)}</p></div>
          <NextLink className="btn btn--primary" href={localePath('/products/magic-toolbar', locale)}>{t('Explore Magic Toolbar')}</NextLink>
        </div>
      </div>
    </article>
  );
}