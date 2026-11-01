import NextLink from 'next/link';
import {getTranslator} from '@/lib/i18n/catalog';
import {localePath} from '@/lib/i18n/config';
import {answers} from '@/data/answers';

export default async function AnswerHub({locale}) {
  const t = await getTranslator(locale);
  return (
    <section className="section answer-hub" aria-labelledby="answers-title">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">{t('Quick answers')}</span>
          <h2 id="answers-title" className="title">{t('Travel agency software questions, answered')}</h2>
        </div>
        <div className="answer-grid">
          {answers.map((a) => (
            <article key={a.id} id={a.id} className="answer-card">
              <h3>{t(a.q)}</h3>
              <p className="answer-first">{t(a.a)}</p>
              <NextLink className="text-link" href={localePath(a.link.href, locale)}>{t(a.link.label)} →</NextLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}