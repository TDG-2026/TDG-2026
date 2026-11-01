import {canonicalLocale, codes, DEFAULT_LOCALE} from './config.js';
import {languagesForCountry, countryCodes} from './countries.js';

const ALIAS = {iw: 'he', in: 'id', fil: 'tl', no: 'nb', nn: 'nb', sh: 'sr', mo: 'ro', prs: 'fa', 'fa-af': 'fa', 'pa-arab': 'ur', 'pa-pk': 'ur'};

export function parseAcceptLanguage(header = '') {
  return header.slice(0, 4096).split(',').map((part, i) => {
    const [raw, ...params] = part.trim().split(';');
    const qPart = params.find((p) => /^\s*q=/i.test(p));
    return {tag: raw.toLowerCase(), q: qPart ? Number(qPart.split('=')[1]) : 1, index: i};
  }).filter((x) => /^(?:[a-z]{2,3}(?:-[a-z0-9]{2,8})*|\*)$/.test(x.tag) && Number.isFinite(x.q) && x.q >= 0 && x.q <= 1)
    .sort((a, b) => b.q - a.q || a.index - b.index);
}

function match(tag, country) {
  const exact = canonicalLocale(tag); if (exact) return exact;
  if (ALIAS[tag]) return ALIAS[tag];
  if (tag === 'pt') return country === 'BR' ? 'pt-BR' : 'pt-PT';
  if (tag.startsWith('pt-')) return tag === 'pt-br' ? 'pt-BR' : 'pt-PT';
  if (tag === 'zh' || tag.startsWith('zh-')) return /(?:hant|tw|hk|mo)/.test(tag) || (tag === 'zh' && ['TW', 'HK', 'MO'].includes(country)) ? 'zh-Hant' : 'zh-Hans';
  const base = tag.split('-')[0];
  return canonicalLocale(base) || ALIAS[base];
}

// available: optional list of locales good enough for automatic selection (explicit URL/cookie always win).
export function resolveLocale({urlLocale, cookie, acceptLanguage = '', country = '', available = null} = {}) {
  const explicit = canonicalLocale(urlLocale); if (explicit) return {locale: explicit, reason: 'url'};
  const saved = canonicalLocale(cookie); if (saved) return {locale: saved, reason: 'manual'};
  country = countryCodes.includes(country) ? country : '';
  const prefs = parseAcceptLanguage(acceptLanguage);
  const ok = (c) => !available || available.includes(c);
  const allowed = (c) => {
    const hits = prefs.filter((p) => p.tag === '*' || c.toLowerCase() === p.tag || c.toLowerCase().startsWith(p.tag + '-')).sort((a, b) => b.tag.length - a.tag.length);
    return !hits.length || hits[0].q !== 0;
  };
  for (const p of prefs) { if (p.q === 0 || p.tag === '*') continue; const m = match(p.tag, country); if (m && allowed(m) && ok(m)) return {locale: m, reason: 'browser'}; }
  for (const m of languagesForCountry(country)) if (allowed(m) && ok(m)) return {locale: m, reason: country ? 'region' : 'default'};
  return {locale: codes.filter(ok).find(allowed) || DEFAULT_LOCALE, reason: 'default'};
}

// Trusted only behind an edge that overwrites the header. Vercel is detected automatically.
const GEO_HEADER = {vercel: 'x-vercel-ip-country', cloudflare: 'cf-ipcountry', cloudfront: 'cloudfront-viewer-country'};
export function trustedCountry(headers, provider = process.env.GEO_PROVIDER || (process.env.VERCEL ? 'vercel' : '')) {
  const key = GEO_HEADER[provider];
  const c = key ? headers.get(key)?.toUpperCase() : '';
  return countryCodes.includes(c) ? c : '';
}