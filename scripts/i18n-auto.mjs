#!/usr/bin/env node
// Travel Genie v6 — automatic translation with automated QA.
// Provider order: Azure Translator v3 (if AZURE_TRANSLATOR_KEY is set), then self-hosted LibreTranslate
// (if LIBRETRANSLATE_URL is set) as an automatic fallback when Azure is missing or fails.
// Usage: node scripts/i18n-auto.mjs [all|<codes...>] [--tier=1] [--force] [--upgrade] [--status-only]
import {readFile, writeFile, rename} from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {localeRegistry} from '../lib/i18n/locales.registry.js';

for (const f of ['.env.local', '.env']) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const ROOT = process.cwd(), MSG = path.join(ROOT, 'messages');
const argv = process.argv.slice(2);
const has = (f) => argv.includes('--' + f);
const val = (f, d) => { const a = argv.find((x) => x.startsWith(`--${f}=`)); return a ? a.slice(f.length + 3) : d; };
const STATUS_ONLY = has('status-only'), FORCE = has('force'), UPGRADE = has('upgrade');
const TIER = Number(val('tier', 99)), MAX_FAIL = Number(val('max-fail', 0.02));
const MIN_AVAILABLE = Number(process.env.I18N_AVAILABLE_MIN || val('min-available', 0.9));
const names = argv.filter((a) => !a.startsWith('--') && a !== 'all');
const KEY = process.env.AZURE_TRANSLATOR_KEY, REGION = process.env.AZURE_TRANSLATOR_REGION;
const ENDPOINT = (process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com').replace(/\/+$/, '');
if (!ENDPOINT.startsWith('https://')) throw new Error('AZURE_TRANSLATOR_ENDPOINT must use HTTPS');
const LIBRE_URL = (process.env.LIBRETRANSLATE_URL || '').replace(/\/+$/, '');
const LIBRE_KEY = process.env.LIBRETRANSLATE_API_KEY || '';
const GOOD = new Set(['reviewed', 'published', 'qa-passed']);
const ORIGIN = 'Azure Translator (machine) + automated QA';
const LIBRE_ORIGIN = 'LibreTranslate (self-hosted machine) + automated QA';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let azureDown = !KEY;

const GLOSSARY = ['Travel Genie Magic Toolbar', 'Travel Genie Translate', 'Travel Genie', 'Magic Toolbar', 'Genie', 'Amadeus', 'Sabre', 'Travelport+', 'Travelport',
  'Galileo', 'Worldspan', 'Apollo', 'Abacus', 'GDS', 'NAME', 'DOCS', 'CTCM', 'CTCE', 'SSR', 'PNR', 'MRZ', 'OCR', 'APIS', 'IATA', 'WhatsApp', 'Windows 11',
  'Windows', 'Zoom', 'DPAPI', 'NADRA', 'Emirates', 'Google', 'USD', 'F1–F12', 'Shift+F1', 'Ctrl + Shift + Z', 'Ctrl+V', 'COPY ALL', 'JPEG', 'PNG', 'BMP',
  'PDF', 'A4', 'API', 'B2B', 'B2C', 'CRM', '1A', '1G', '1S', '24/7',
  // v6.3: shortcuts and feature names used in the guides
  'Ctrl+Shift+Z', 'Alt+A', 'Alt+V', 'Container Manager', 'Visa Photo Fixer',
  // v6.3: GDS commands and codes that appear inside sentences
  'SRDOCS', 'SSRDOCS', 'SRCTCM', 'SRCTCE', 'SSRCTCM', 'SSRCTCE', '3DOCS', '3CTCM', '3CTCE', '3INFT', 'CTCR', 'HK1', 'SR', 'SI',
  'CHD', 'INF', 'MI', 'FI', 'AN', 'SS', 'NM', 'AP', 'TK', 'RF', 'ER', 'RT', 'XE', 'XI', 'FXP', 'FXX', 'FQD', 'DAC', 'DAN', 'DNA', 'HE',
  'FQ', 'FD', 'WP', 'WPRQ',
  // v6.3: CTCE email markers written in prose
  '(..)', '(./)'];
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const TERMS = [...new Set(GLOSSARY)].sort((a, b) => b.length - a.length).map(reEsc).join('|');
const PROTECT = new RegExp([
  '\\{[A-Za-z0-9_]+\\}', 'https?://[^\\s<>"\']+', '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}',
  '\\b[A-Z][A-Z0-9]*(?:[/.][A-Z0-9]+)+\\b', `(?<![\\p{L}\\p{N}])(?:${TERMS})(?![\\p{L}\\p{N}])`,
  // v6.3: any uppercase/number token that contains . / * - or @ (N.  /P1  -1.1  *P-C08  .CD  W/*  N.I/)
  '(?<![\\p{L}\\p{N}./*@-])(?=[A-Z0-9./*@-]*[./*@-])(?=[A-Z0-9./*@-]*[A-Z0-9])[A-Z0-9./*@-]{2,}(?![\\p{L}\\p{N}])',
  '\\$\\d[\\d,.]*', '\\*\\*', '//',
].join('|'), 'gu');

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unescHtml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
function protect(text) {
  let out = '', last = 0;
  for (const m of text.matchAll(PROTECT)) { out += escHtml(text.slice(last, m.index)) + `<span class="notranslate" translate="no">${escHtml(m[0])}</span>`; last = m.index + m[0].length; }
  return (out + escHtml(text.slice(last))).replace(/\n/g, '<br/>');
}
function unprotect(html) {
  return unescHtml(html.replace(/<br\s*\/?>/gi, '\n').replace(/<span[^>]*notranslate[^>]*>([\s\S]*?)<\/span>/gi, '$1').replace(/<\/?[a-z][^>]*>/gi, '')).replace(/[ \t]+\n/g, '\n').trim();
}
function qa(src, out) {
  const issues = [];
  if (!out || !out.trim()) issues.push('empty');
  for (const m of src.matchAll(PROTECT)) if (!out.includes(m[0])) issues.push('missing ' + m[0]);
  if (src.replace(PROTECT, '').trim().length > 30) { const r = out.length / src.length; if (r < 0.15 || r > 4) issues.push('length ratio ' + r.toFixed(2)); }
  if ((src.match(/\n/g) || []).length !== (out.match(/\n/g) || []).length) issues.push('line breaks');
  return issues;
}
const readJson = async (f, fb) => { try { return JSON.parse(await readFile(f, 'utf8')); } catch { return fb; } };
async function writeJsonAtomic(file, data) { const tmp = file + '.tmp'; await writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8'); await rename(tmp, file); }

async function azure(texts, to) {
  const url = `${ENDPOINT}/translate?api-version=3.0&from=en&to=${encodeURIComponent(to)}&textType=html`;
  for (let attempt = 1; attempt <= 6; attempt++) {
    let res;
    try {
      res = await fetch(url, {method: 'POST', signal: AbortSignal.timeout(60000),
        headers: {'Ocp-Apim-Subscription-Key': KEY, ...(REGION ? {'Ocp-Apim-Subscription-Region': REGION} : {}), 'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify(texts.map((Text) => ({Text})))});
    } catch (e) { if (attempt === 6) throw e; await sleep(2 ** attempt * 1000); continue; }
    if (res.ok) {
      const data = await res.json();
      if (!Array.isArray(data) || data.length !== texts.length) throw new Error('Malformed Azure response');
      return data.map((d) => d?.translations?.[0]?.text ?? '');
    }
    if (res.status === 429 || res.status >= 500) { await sleep((Number(res.headers.get('retry-after')) || 2 ** attempt) * 1000); continue; }
    throw new Error(`Azure ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  throw new Error('Azure retries exhausted');
}

// ---- Self-hosted LibreTranslate fallback (no account, no third party) ----
async function libreLanguageSet() {
  try {
    const r = await fetch(`${LIBRE_URL}/languages`, {signal: AbortSignal.timeout(10000)});
    if (!r.ok) return null;
    return new Set((await r.json()).map((l) => l.code));
  } catch { return null; }
}
function libreCodeFor(loc, set) {
  if (!set) return null;
  const candidates = [loc.code, loc.mt, loc.code.split('-')[0], loc.code === 'zh-Hans' ? 'zh' : null, loc.code === 'pt-BR' ? 'pt' : null];
  return candidates.find((c) => c && set.has(c)) || null;
}
async function libre(texts, target) {
  const res = await fetch(`${LIBRE_URL}/translate`, {method: 'POST', signal: AbortSignal.timeout(300000),
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({q: texts, source: 'en', target, format: 'html', ...(LIBRE_KEY ? {api_key: LIBRE_KEY} : {})})});
  if (!res.ok) throw new Error(`LibreTranslate ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const out = Array.isArray(data.translatedText) ? data.translatedText : [data.translatedText];
  if (out.length !== texts.length) throw new Error('Malformed LibreTranslate response');
  return out;
}
async function viaLibre(htmls, target) {
  const out = [];
  for (let i = 0; i < htmls.length; i += 20) out.push(...await libre(htmls.slice(i, i + 20), target));
  return out;
}

function batches(items) {
  const out = []; let cur = [], size = 0;
  for (const it of items) { if (cur.length && (cur.length >= 100 || size + it.html.length > 40000)) { out.push(cur); cur = []; size = 0; } cur.push(it); size += it.html.length; }
  if (cur.length) out.push(cur); return out;
}

const source = await readJson(path.join(MSG, 'source.json'), null);
if (!source) { console.error('messages/source.json missing — run npm run i18n:extract first.'); process.exit(1); }
const keys = Object.keys(source);
const targets = new Set(localeRegistry.filter((l) => l.code !== 'en' && l.tier <= TIER && (!names.length || names.includes(l.code))).map((l) => l.code));
const libreSet = !STATUS_ONLY && LIBRE_URL ? await libreLanguageSet() : null;
if (!STATUS_ONLY) {
  if (LIBRE_URL && !libreSet) console.warn(`LibreTranslate not reachable at ${LIBRE_URL}: fallback disabled for this run.`);
  if (!KEY && !libreSet) console.warn('No translation provider configured: running QA on existing translations only.');
  else if (!KEY) console.log('AZURE_TRANSLATOR_KEY not set: using self-hosted LibreTranslate.');
}
const report = {generatedAt: new Date().toISOString(), totalMessages: keys.length, locales: {}};
const available = ['en'];

for (const loc of localeRegistry.filter((l) => l.code !== 'en')) {
  const file = path.join(MSG, loc.code + '.json');
  const catalog = await readJson(file, {locale: loc.code, status: 'draft', messages: {}});
  catalog.locale = loc.code; catalog.messages ||= {};
  const active = !STATUS_ONLY && targets.has(loc.code);
  if (active) {
    try {
      for (const k of Object.keys(catalog.messages)) if (!source[k]) delete catalog.messages[k];
      const libreCode = libreCodeFor(loc, libreSet);
      const todo = [];
      for (const k of keys) {
        const m = catalog.messages[k];
        const fresh = m?.text && m.sourceHash === source[k].hash;
        if (fresh && (m.status === 'reviewed' || m.status === 'published')) continue;
        const upgradable = UPGRADE && !azureDown && fresh && m.origin === LIBRE_ORIGIN;
        if (fresh && !FORCE && !upgradable) {
          if (m.status !== 'qa-passed') { const issues = qa(source[k].text, m.text); m.status = issues.length ? 'needs-review' : 'qa-passed'; if (issues.length) m.qa = issues; else delete m.qa; }
          continue;
        }
        todo.push({k, html: protect(source[k].text)});
      }
      if (todo.length && azureDown && !libreCode) {
        console.warn(`[${loc.code}] skipped: Azure unavailable and LibreTranslate does not offer this language.`);
      } else if (todo.length) {
        let done = 0;
        for (const group of batches(todo)) {
          let out = null, origin = ORIGIN;
          if (!azureDown) {
            try { out = await azure(group.map((x) => x.html), loc.mt); }
            catch (e) {
              azureDown = true;
              if (!libreCode) throw e;
              console.warn(`\n[${loc.code}] Azure failed (${e.message.slice(0, 120)}). Switching to LibreTranslate for the rest of this run.`);
            }
          }
          if (!out) { out = await viaLibre(group.map((x) => x.html), libreCode); origin = LIBRE_ORIGIN; }
          group.forEach((x, i) => {
            const text = unprotect(out[i]); const issues = qa(source[x.k].text, text);
            catalog.messages[x.k] = {text, sourceHash: source[x.k].hash, status: issues.length ? 'needs-review' : 'qa-passed', origin,
              translatedAt: new Date().toISOString(), ...(issues.length ? {qa: issues} : {})};
          });
          done += group.length; await writeJsonAtomic(file, catalog);
          process.stdout.write(`\r[${loc.code}] ${done}/${todo.length} (${origin === ORIGIN ? 'Azure' : 'LibreTranslate'})   `);
        }
        process.stdout.write('\n');
      }
    } catch (e) { console.error(`\n[${loc.code}] failed: ${e.message}`); report.locales[loc.code] = {error: e.message}; }
  }
  const valid = keys.filter((k) => catalog.messages[k]?.text && catalog.messages[k].sourceHash === source[k].hash);
  const good = valid.filter((k) => GOOD.has(catalog.messages[k].status)).length;
  const libreCount = valid.filter((k) => catalog.messages[k].origin === LIBRE_ORIGIN).length;
  const coverage = valid.length / keys.length;
  if (active && catalog.status !== 'published') {
    catalog.status = valid.length === keys.length && 1 - good / keys.length <= MAX_FAIL ? 'machine-published' : 'draft';
    await writeJsonAtomic(file, catalog);
  }
  if (coverage >= MIN_AVAILABLE) available.push(loc.code);
  report.locales[loc.code] = {...report.locales[loc.code], coverage: +coverage.toFixed(4), good, needsReview: valid.length - good, libre: libreCount, status: catalog.status};
}

await writeFile(path.join(ROOT, 'lib/i18n/available.js'),
  `// Generated by scripts/i18n-auto.mjs. Locales with enough translated content for automatic negotiation.\nexport const availableLocales=${JSON.stringify(available)};\n`);
if (!STATUS_ONLY) await writeJsonAtomic(path.join(ROOT, 'I18N_AUTO_REPORT.json'), report);
console.log(`Available for auto-negotiation: ${available.length}/${localeRegistry.length} locales.`);