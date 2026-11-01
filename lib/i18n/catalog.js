import {cache} from 'react';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {canonicalLocale} from './config.js';
import {createTranslator, normalizeText} from './translate.js';

const MACHINE_INDEX = process.env.I18N_INDEX_MACHINE !== 'false';
const MAX_FAIL = Number(process.env.I18N_MAX_FAIL || 0.02);
const HUMAN = new Set(['reviewed', 'published']);
const GOOD = new Set(['reviewed', 'published', 'qa-passed']);

export const getSource = cache(async () => JSON.parse(await readFile(path.join(process.cwd(), 'messages/source.json'), 'utf8')));

export const getCatalog = cache(async (input) => {
  const locale = canonicalLocale(input) || 'en';
  const source = await getSource();
  let catalog;
  try { catalog = JSON.parse(await readFile(path.join(process.cwd(), 'messages', locale + '.json'), 'utf8')); }
  catch { catalog = {locale, status: 'draft', messages: {}}; }
  const keys = Object.keys(source);
  const messages = {};
  for (const k of keys) { const m = catalog.messages?.[k]; if (m?.text && m.sourceHash === source[k].hash) messages[k] = m; }
  const vals = Object.values(messages);
  const complete = vals.length === keys.length;
  const human = locale === 'en' || (complete && catalog.status === 'published' && vals.every((m) => HUMAN.has(m.status)));
  const good = vals.filter((m) => GOOD.has(m.status)).length;
  const machine = !human && MACHINE_INDEX && complete && ['published', 'machine-published'].includes(catalog.status)
    && (1 - good / Math.max(1, keys.length)) <= MAX_FAIL;
  return {...catalog, locale, messages, complete, published: human || machine, machine,
    coverage: keys.length ? vals.length / keys.length : 1, source};
});

export async function getTranslator(locale) { const c = await getCatalog(locale); return createTranslator(c.source, c.messages); }

// Only what the browser needs: no hashes, no source locations. English ships {}.
export async function getClientDictionary(locale) {
  const c = await getCatalog(locale);
  if (c.locale === 'en') return {};
  const dict = {};
  for (const [k, m] of Object.entries(c.messages)) dict[normalizeText(c.source[k].text)] = m.text;
  return dict;
}