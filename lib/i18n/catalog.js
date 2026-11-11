import {cache} from 'react';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {canonicalLocale} from './config.js';
import {createTranslator, normalizeText} from './translate.js';

const HUMAN_REVIEW_STATES = new Set(['reviewed', 'published']);

export const getSource = cache(async () => JSON.parse(
  await readFile(path.join(process.cwd(), 'messages/source.json'), 'utf8')
));

export const getCatalog = cache(async (input) => {
  const locale = canonicalLocale(input) || 'en';
  const source = await getSource();
  let catalog;

  try {
    catalog = JSON.parse(
      await readFile(path.join(process.cwd(), 'messages', `${locale}.json`), 'utf8')
    );
  } catch {
    catalog = {locale, status: 'draft', messages: {}};
  }

  const keys = Object.keys(source).filter((key) => source[key]?.retired !== true);
  const messages = {};

  for (const key of keys) {
    const message = catalog.messages?.[key];
    if (
      message?.text &&
      message.sourceHash === source[key].hash
    ) {
      messages[key] = message;
    }
  }

  const values = Object.values(messages);
  const complete = values.length === keys.length;
  const reviewed = complete && values.every((message) =>
    HUMAN_REVIEW_STATES.has(message.status) &&
    message.review?.sourceHash === message.sourceHash
  );

  // Machine translations never become indexable by default. A locale is
  // published only after complete coverage and matching human review records.
  const published = locale === 'en' || (
    catalog.status === 'published' && reviewed
  );

  return {
    ...catalog,
    locale,
    messages,
    complete,
    published,
    machine: values.some((message) => message.status === 'machine-translated'),
    coverage: keys.length ? values.length / keys.length : 1,
    source,
  };
});

export async function getTranslator(locale) {
  const catalog = await getCatalog(locale);
  return createTranslator(catalog.source, catalog.messages);
}

// Only the browser needs translated text; source hashes and source locations stay server-side.
export async function getClientDictionary(locale) {
  const catalog = await getCatalog(locale);
  if (catalog.locale === 'en') return {};

  const dictionary = {};
  for (const [key, message] of Object.entries(catalog.messages)) {
    dictionary[normalizeText(catalog.source[key].text)] = message.text;
  }
  return dictionary;
}
