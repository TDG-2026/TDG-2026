import {getTranslator} from '@/lib/i18n/catalog';
import {faqs} from '@/data/faqs';

const slug = (s) => 'faq-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async function Faq({locale = 'en'}) {
  const t = await getTranslator(locale);
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">{t('FAQ')}</span>
          <h2 id="faq-title">{t('Frequently asked questions')}</h2>
          <p className="section-intro">{t('Short, direct answers about Magic Toolbar for travel agents. Each one covers a real question from the travel desk, from passport reading and shortcuts to saved records, system needs and getting help from our team.')}</p>
        </header>
        <div className="faq-grid">
          {faqs.map(([q, a]) => (
            <article className="faq-card" key={q}>
              <h3 id={slug(q)}>{t(q)}</h3>
              <p className="answer-first">{t(a)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}