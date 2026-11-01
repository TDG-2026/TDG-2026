import {products} from '../../data/products.js';
import { locales, genie, DEFAULT_LOCALE } from '../../data/genie/config.js';
import { strings } from '../../data/genie/i18n.js';
import { intents, gdsEntries, GDS_LABELS, GDS_ALIASES, MAIN_CHIPS } from '../../data/genie/knowledge.js';

export { MAIN_CHIPS };

// Genie's languages come from the website registry (data/genie/config.js).
// A language is offered when its status is not 'draft', or when drafts are switched on.
const ACTIVE = locales.filter((l) => genie.showDraftLocales || l.status !== 'draft');
const ACTIVE_CODES = new Set(ACTIVE.map((l) => l.code));
export const activeLocales = ACTIVE;
export const isLocale = (code) => ACTIVE_CODES.has(code);
export const getLocale = (code) => ACTIVE.find((l) => l.code === code) || ACTIVE[0];
const ok = (c) => (c && ACTIVE_CODES.has(c) ? c : null);
const identity = (s) => s;

// Hand-written UI catalogs that use a different key than the website code.
const STRING_KEYS = { fa: 'fa-AF' };
// UI strings: hand-written Genie catalog first, then the website translation catalog (localize), then English.
export function t(code, localize = null) {
  const base = localize ? Object.fromEntries(Object.entries(strings.en).map(([k, v]) => [k, localize(v)])) : strings.en;
  return { ...base, ...(strings[code] || strings[STRING_KEYS[code]] || {}) };
}

export function normalize(s = '') {
  return s.normalize('NFKC').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
}

const ALIASES = {
  zh: 'zh-Hans', 'zh-cn': 'zh-Hans', 'zh-sg': 'zh-Hans', 'zh-hans': 'zh-Hans',
  'zh-tw': 'zh-Hant', 'zh-hk': 'zh-Hant', 'zh-mo': 'zh-Hant', 'zh-hant': 'zh-Hant',
  pt: 'pt-BR', 'fa-af': 'fa', 'fa-ir': 'fa', prs: 'fa', in: 'id',
  // Pakistani Punjabi (Shahmukhi script) readers are served Urdu until a pa-Arab catalog exists.
  'pa-arab': 'ur', 'pa-pk': 'ur',
};

export function matchLocale(tag) {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  const hit = (c) => (c && ACTIVE_CODES.has(c) ? c : null);
  const exact = ACTIVE.find((l) => l.code.toLowerCase() === lower);
  if (exact) return exact.code;
  if (hit(ALIASES[lower])) return ALIASES[lower];
  const parts = lower.split('-');
  for (let i = parts.length - 1; i > 0; i -= 1) {
    const p = parts.slice(0, i).join('-');
    if (hit(ALIASES[p])) return ALIASES[p];
    const m = ACTIVE.find((l) => l.code.toLowerCase() === p);
    if (m) return m.code;
  }
  return null;
}

export function detectBrowserLocale(langs = []) {
  for (const l of langs) { const m = matchLocale(l); if (m) return m; }
  return DEFAULT_LOCALE;
}

// ---------------------------------------------------------------------------
// Language detection (no external service)
// ---------------------------------------------------------------------------
const ARABIC_FAMILY = new Set(['ar', 'ur', 'fa', 'ps']);
const NEPALI_WORDS = new Set(['छ', 'छन्', 'हुन्छ', 'तपाईं', 'तपाई', 'तपाईंको', 'तपाईको', 'मलाई', 'गर्नुहोस्', 'हजुर', 'चाहन्छु', 'सक्छु', 'कति', 'पर्छ']);

// Detects the language from the script the visitor types in. Returns null for Latin text.
// `current` is a hint (remembered language or phone-country language) used to settle shared scripts.
export function detectScript(text = '', current = DEFAULT_LOCALE) {
  if (/[\u0A00-\u0A7F]/.test(text)) return ok('pa') || ok('hi');
  if (/[\u0980-\u09FF]/.test(text)) return ok('bn');
  if (/[\u0900-\u097F]/.test(text)) {
    const nepali = current === 'ne' || text.split(/\s+/).some((w) => NEPALI_WORDS.has(w.replace(/[।?!,.]/g, '')));
    return (nepali && ok('ne')) || ok('hi');
  }
  if (/[\u0E00-\u0E7F]/.test(text)) return ok('th');
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return ok('ko');
  if (/[\u3040-\u30FF]/.test(text)) return ok('ja');
  if (/[\u4E00-\u9FFF]/.test(text)) return current.startsWith('zh') && ok(current) ? current : ok('zh-Hans');
  if (/[іїєґ]/i.test(text)) return ok('uk');
  if (/[ўқғҳ]/i.test(text)) return ok('uz') || ok('ru');
  if (/[\u0400-\u04FF]/.test(text)) return current === 'uk' && ok('uk') ? 'uk' : ok('ru');
  if (/[\u0600-\u06FF]/.test(text)) {
    if (/[ښږځڅډټړګېۍ]/.test(text)) return ok('ps') || (current === 'fa' ? ok('fa') : null) || ok('ur') || ok('fa');
    if (/[ےڈٹڑںھۓ]/.test(text)) return ok('ur');
    if (ARABIC_FAMILY.has(current) && ok(current)) return current;
    if (/[پچژگکی]/.test(text)) return ok('fa');
    return ok('ar');
  }
  return null;
}

// Common words per Latin-script language. Kept under "keywords" so the i18n extractor skips them.
const LATIN_LANGS = [
  { lang: 'en', keywords: 'the is are and how what which price cost can you does for my need want please thanks install support hello' },
  { lang: 'fr', keywords: 'le les est et comment quel quelle prix pour vous je bonjour merci combien des une avec pas' },
  { lang: 'es', keywords: 'el los es y como cómo qué precio para usted hola gracias cuánto cuanto quiero necesito con' },
  { lang: 'pt-BR', keywords: 'os é como qual preço preco para você voce olá ola obrigado quanto quero preciso não nao com' },
  { lang: 'it', keywords: 'il lo è come quale prezzo per ciao grazie quanto voglio non sono con' },
  { lang: 'de', keywords: 'der die das ist und wie was preis für fur sie ich hallo danke kostet brauche nicht mit' },
  { lang: 'tr', keywords: 've bir nasıl nasil ne fiyat fiyatı için icin merhaba teşekkürler kaç istiyorum nedir mı' },
  { lang: 'id', keywords: 'apa bagaimana harga harganya untuk saya anda halo terima kasih berapa ingin bisa tidak yang dengan gimana' },
  { lang: 'ms', keywords: 'apa bagaimana harga harganya untuk saya anda terima kasih berapa mahu boleh tidak yang dengan tak' },
  { lang: 'uz', keywords: 'qanday narxi narx salom rahmat kerak uchun nima bormi qancha' },
  { lang: 'roman', keywords: 'kya hai hain ka ki mein mujhe aap kaise kese kesay kitna kitne kitni chahiye nahi nahin karna kar bhai yeh ye hy plz batao bataein' },
];
const GREETINGS = { keywords: 'hello bonjour hola ola olá ciao hallo merhaba halo salom' };
const LATIN_SETS = LATIN_LANGS.map(({ lang, keywords }) => [lang, new Set(keywords.split(' '))]);
const GREET_SET = new Set(GREETINGS.keywords.split(' '));

function detectLatin(text, hint) {
  const low = text.toLowerCase();
  if (/[ăđơư]|[\u1EA0-\u1EF9]/.test(low)) return ok('vi');
  const score = Object.fromEntries(LATIN_SETS.map(([lang]) => [lang, 0]));
  for (const tok of low.split(/[^\p{L}]+/u).filter(Boolean)) {
    for (const [lang, set] of LATIN_SETS) if (set.has(tok)) score[lang] += GREET_SET.has(tok) ? 2 : 1;
  }
  if (/[ñ¿¡]/.test(low)) score.es += 3;
  if (/[ãõ]/.test(low)) score['pt-BR'] += 3;
  if (/[ğışİ]/.test(text)) score.tr += 3;
  if (/ß/.test(low)) score.de += 3;
  if (/[äöü]/.test(low) && !/[ğışİ]/.test(text)) score.de += 1;
  if (/[œëîïû]/.test(low)) score.fr += 1;
  if (/[ìò]/.test(low)) score.it += 1;
  if (/o[ʻ‘’'`]|g[ʻ‘’'`]/i.test(low)) score.uz += 2;
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [[top, best], [, second]] = ranked;
  if (best < 2) return null;
  if ((top === 'id' || top === 'ms') && Math.abs(score.id - score.ms) <= 1) return ok(hint === 'ms' ? 'ms' : 'id') || ok('ms');
  if (best === second) return null;
  if (top === 'roman') return hint === 'hi' ? ok('hi') || ok('ur') : ok('ur') || ok('hi');
  if (top === 'uz') return ok('uz') || ok('ru');
  return ok(top);
}

// Full message detection: script first, then Latin languages; plain Latin text defaults to English.
export function detectLanguage(text = '', hint = DEFAULT_LOCALE) {
  const byScript = detectScript(text, hint || DEFAULT_LOCALE);
  if (byScript) return byScript;
  if (!/\p{Script=Latin}/u.test(text)) return null;
  return detectLatin(text, hint) || ok('en');
}

// Phone country code → starting language (longest prefix wins). Only used when the message itself is unclear.
const PHONE_LOCALES = [
  ['92', 'ur'], ['93', 'fa'], ['98', 'fa'], ['91', 'hi'], ['880', 'bn'], ['977', 'ne'],
  ['966', 'ar'], ['971', 'ar'], ['965', 'ar'], ['974', 'ar'], ['973', 'ar'], ['968', 'ar'], ['962', 'ar'], ['963', 'ar'],
  ['961', 'ar'], ['964', 'ar'], ['967', 'ar'], ['970', 'ar'], ['20', 'ar'], ['212', 'ar'], ['213', 'ar'], ['216', 'ar'],
  ['218', 'ar'], ['249', 'ar'], ['222', 'ar'],
  ['90', 'tr'], ['994', 'tr'], ['7', 'ru'], ['375', 'ru'], ['996', 'ru'], ['992', 'ru'], ['993', 'ru'], ['998', 'uz'],
  ['33', 'fr'], ['32', 'fr'], ['352', 'fr'], ['221', 'fr'], ['223', 'fr'], ['224', 'fr'], ['225', 'fr'], ['226', 'fr'],
  ['227', 'fr'], ['228', 'fr'], ['229', 'fr'], ['235', 'fr'], ['236', 'fr'], ['237', 'fr'], ['241', 'fr'], ['242', 'fr'],
  ['243', 'fr'], ['261', 'fr'], ['509', 'fr'],
  ['34', 'es'], ['52', 'es'], ['54', 'es'], ['56', 'es'], ['57', 'es'], ['51', 'es'], ['58', 'es'], ['53', 'es'],
  ['591', 'es'], ['593', 'es'], ['595', 'es'], ['598', 'es'], ['502', 'es'], ['503', 'es'], ['504', 'es'], ['505', 'es'],
  ['506', 'es'], ['507', 'es'],
  ['55', 'pt-BR'], ['351', 'pt-BR'], ['244', 'pt-BR'], ['258', 'pt-BR'], ['238', 'pt-BR'],
  ['62', 'id'], ['60', 'ms'], ['673', 'ms'], ['84', 'vi'], ['66', 'th'], ['86', 'zh-Hans'],
  ['39', 'it'], ['49', 'de'], ['43', 'de'], ['41', 'de'],
].sort((a, b) => b[0].length - a[0].length);

export function localeFromPhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  for (const [prefix, code] of PHONE_LOCALES) if (digits.startsWith(prefix)) return ok(code);
  return null;
}

// "Urdu", "English", "Français", "language: ar" → switch language. Bare codes need the "language" prefix.
const LANGUAGE_NAMES = new Map();
const LANGUAGE_CODES = new Map();
for (const l of ACTIVE) {
  for (const n of [l.english, l.native]) if (n) LANGUAGE_NAMES.set(normalize(n), l.code);
  LANGUAGE_CODES.set(l.code.toLowerCase(), l.code);
}
export function parseLanguageCommand(text = '') {
  const raw = normalize(text).trim().replace(/[.!?؟]+$/, '').trim();
  const prefixed = raw.match(/^(?:language|lang|زبان|اللغة)\s*[:\-]?\s*(.+)$/);
  const value = (prefixed ? prefixed[1] : raw).trim();
  return LANGUAGE_NAMES.get(value) || (prefixed ? LANGUAGE_CODES.get(value) : null) || null;
}

// One call for chat channels: command → message language → remembered → phone country → English.
export function resolveChatLocale({ text = '', phone = '', remembered = null } = {}) {
  const command = parseLanguageCommand(text);
  if (command) return { locale: command, source: 'command' };
  const saved = ok(remembered);
  const hint = saved || localeFromPhone(phone);
  const detected = detectLanguage(text, hint || DEFAULT_LOCALE);
  if (detected) return { locale: detected, source: 'message' };
  if (saved) return { locale: saved, source: 'remembered' };
  if (hint) return { locale: hint, source: 'phone' };
  return { locale: DEFAULT_LOCALE, source: 'default' };
}

// ---------------------------------------------------------------------------
// Intent matching and answers
// ---------------------------------------------------------------------------
const INTENTS = intents.map((i) => ({ ...i, _kw: i.keywords.map(normalize) }));
const BY_ID = Object.fromEntries(INTENTS.map((i) => [i.id, i]));
const LATIN = /^[a-z0-9 ]+$/;

function tokenize(text) {
  return new Set(text.split(/[^\p{L}\p{N}]+/u).filter(Boolean));
}

function scoreIntent(intent, text, tokens) {
  let score = 0;
  for (const kw of intent._kw) {
    if (LATIN.test(kw)) {
      if (kw.includes(' ')) { if (text.includes(kw)) score += 3; }
      else if (kw.length <= 3) { if (tokens.has(kw)) score += 2; }
      else if ([...tokens].some((tk) => tk === kw || tk.startsWith(kw))) score += 2;
    } else if (text.includes(kw)) score += 2; // non-Latin scripts and hyphenated terms: substring match
  }
  // Explicit technical acronyms outrank generic prompts such as 'what is'.
  if (intent.entryType && tokens.has(intent.entryType)) score += 8;
  return score * (intent.weight ?? 1);
}

function detectGds(text, tokens) {
  for (const [code, aliases] of Object.entries(GDS_ALIASES)) {
    if (aliases.some((a) => tokens.has(a) || (a.length > 3 && text.includes(a)))) return code;
  }
  return null;
}

const fill = (text, vars) => (vars && text ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text);

// Hand-written translation first, then the website catalog (localize), then English. Placeholders are filled last.
function pick(obj, locale, localize = identity, vars = null) {
  if (obj?.[locale]) return { value: fill(obj[locale], vars), lang: locale };
  const en = obj?.en;
  if (!en || locale === 'en') return { value: fill(en, vars), lang: 'en' };
  const raw = localize(en);
  return { value: fill(raw, vars), lang: raw && raw !== en ? locale : 'en' };
}

export function buildAnswer(id, locale = DEFAULT_LOCALE, gds = null, localize = identity) {
  const it = BY_ID[id];
  if (!it) return fallback(locale, localize);
  const ans = pick(it.answer, locale, localize, it.vars);
  let text = ans.value;
  if (it.appendix) {
    const extra = pick(it.appendix, locale, localize, it.appendix.vars);
    if (extra.value) text += `\n\n${extra.value}`;
  }
  const out = { intent: id, text, lang: ans.lang, chips: it.followUps || [], wa: it.handoff || null, webOnly: !!it.webOnly, code: null, codeNote: null };
  if (it.entryType && gdsEntries[it.entryType]) {
    const rows = gdsEntries[it.entryType];
    out.code = (gds ? [gds] : Object.keys(rows)).map((g) => ({ label: GDS_LABELS[g], value: rows[g] }));
    out.codeNote = pick(it.codeNote, locale, localize).value || null;
  }
  return out;
}

function fallback(locale, localize = identity) {
  return { intent: 'fallback', text: t(locale, localize).fallback, lang: locale, chips: ['features', 'pricing', 'support'], wa: 'General question', code: null };
}

export function reply(input, locale = DEFAULT_LOCALE, localize = identity) {
  const text = normalize(input);
  const catalogProduct = products.find(p => text.includes(normalize(p.name)) || text.includes(normalize(localize(p.name))) || text.includes(p.slug) || (p.id==='b2b-b2c-portal' && /b2b|b2c/.test(text)) || (p.id==='agency-account-system' && text.includes('account system')));
  if (catalogProduct) return {intent:'catalog-product',text:localize(catalogProduct.name)+'\n'+localize(catalogProduct.summary)+'\n'+localize('This is a separate product preview. Detailed capabilities, pricing and public availability are being confirmed. Contact the team for current information.')+'\n'+localize('Product page:')+' '+(catalogProduct.path || '/products/'+catalogProduct.slug),lang:'en',chips:['features','pricing','support'],wa:catalogProduct.name,code:null};
  const tokens = tokenize(text);
  let best = null;
  let bestScore = 0;
  for (const it of INTENTS) {
    const translatedLabel=normalize(localize(it.label?.en||''));
    const labelMatch=translatedLabel&&translatedLabel!==normalize(it.label?.en||'')&&text.includes(translatedLabel);
    const s = scoreIntent(it, text, tokens)+(labelMatch?8:0);
    if (s > bestScore) { best = it; bestScore = s; }
  }
  if (!best || bestScore < 1) return fallback(locale, localize);
  return buildAnswer(best.id, locale, detectGds(text, tokens), localize);
}

const CHIP_KEYS = { features: 'chipFeatures', pricing: 'chipPricing', install: 'chipInstall', demo: 'chipDemo', support: 'chipSupport' };
export function chipLabel(id, locale, localize = identity) {
  if (CHIP_KEYS[id]) return t(locale, localize)[CHIP_KEYS[id]];
  const it = BY_ID[id];
  return it?.label?.[locale] || (it?.label?.en ? localize(it.label.en) : null) || id;
}

export function answerCoverage(locale) {
  if (locale === 'en') return 1;
  return intents.filter((i) => i.answer[locale]).length / intents.length;
}

export function whatsappLink({ topic, question, locale, country, page }) {
  const lines = [`Hello Travel Genie, I'd like help with: ${topic}.`];
  if (question) lines.push(`My question: ${question.slice(0, 280)}`);
  if (locale) lines.push(`Preferred language: ${locale.english} (${locale.code})`);
  if (country) lines.push(`Country: ${country}`);
  if (page) lines.push(`Page: ${page}`);
  return `https://wa.me/${genie.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}