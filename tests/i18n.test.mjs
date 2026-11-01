import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveLocale,parseAcceptLanguage,trustedCountry} from '../lib/i18n/resolve.js';
import {locales,localePath,splitPath} from '../lib/i18n/config.js';
import {ENABLED} from '../lib/i18n/locales.registry.js';
import {availableLocales} from '../lib/i18n/available.js';
import {countryCodes,languagesForCountry} from '../lib/i18n/countries.js';
import {proxy} from '../proxy.js';
import {NextRequest} from 'next/server.js';

// Older helper modules: loaded if present; their tests are skipped if v6 removed them.
const tr = await import('../lib/i18n/translate.js').catch(() => ({}));
const provider = await import('../lib/i18n/provider.mjs').catch(() => null);

// resolveLocale negotiates across all ENABLED locales.
// The proxy then applies availability (>= 90% translated) before redirecting a visitor.
const resolve = (args) => resolveLocale(args).locale;
const avail = (code) => availableLocales.includes(code);
const auto = (code) => (avail(code) ? code : 'en');

test('URL, cookie, browser, country, English precedence', () => {
  assert.equal(resolve({urlLocale: 'fr', cookie: 'ur', acceptLanguage: 'de', country: 'PK'}), 'fr');
  assert.equal(resolve({cookie: 'ur', acceptLanguage: 'de', country: 'FR'}), 'ur');
  assert.equal(resolve({acceptLanguage: 'en-US', country: 'AE'}), 'en');
  assert.equal(resolve({acceptLanguage: 'zz', country: 'PK'}), 'ur');
  assert.equal(resolve({acceptLanguage: 'zz', country: 'XX'}), 'en');
  assert.equal(resolve({cookie: 'evil', acceptLanguage: 'fr'}), 'fr');
});

test('weighted language negotiation and exclusions', () => {
  assert.equal(resolve({acceptLanguage: 'de;q=0.4,fr;q=0.9,en;q=0.7'}), 'fr');
  assert.equal(resolve({acceptLanguage: 'fr;q=0,en;q=0.5', country: 'FR'}), 'en');
  assert.equal(resolve({acceptLanguage: 'fr;q=0,*;q=0.2', country: 'FR'}), 'en');
  assert.equal(resolve({acceptLanguage: '*;q=0,fr;q=1'}), 'fr');
  assert.equal(resolve({acceptLanguage: 'fr;q=broken,de;q=2,ru;q=0.8'}), 'ru');
  assert.equal(parseAcceptLanguage('fr;q=broken').length, 0);
});

test('Chinese and Portuguese tags resolve to the enabled variants', () => {
  for (const [tag, cc, want] of [['zh-Hans', 'TW', 'zh-Hans'], ['zh-Hans', 'CN', 'zh-Hans'], ['pt-BR', 'PT', 'pt-BR'], ['pt', 'BR', 'pt-BR']]) {
    assert.equal(resolve({acceptLanguage: tag, country: cc}), want, `${tag} / ${cc}`);
  }
});

test('regional headers are opt-in and reject unknown codes', () => {
  const h = new Headers({'cf-ipcountry': 'PK', 'x-vercel-ip-country': 'FR'});
  assert.equal(trustedCountry(h, ''), '');
  assert.equal(trustedCountry(h, 'cloudflare'), 'PK');
  assert.equal(trustedCountry(h, 'vercel'), 'FR');
  assert.equal(trustedCountry(new Headers({'cf-ipcountry': 'XX'}), 'cloudflare'), '');
});

test('served locales match the enabled registry', () => {
  assert.equal(locales.length, ENABLED.length);
  assert.equal(new Set(locales.map((l) => l.code)).size, ENABLED.length);
  assert.deepEqual(new Set(locales.map((l) => l.code)), new Set(ENABLED));
  assert(locales.some((l) => l.code === 'en'));
  for (const code of availableLocales) assert(ENABLED.includes(code), `${code} is available but not enabled`);
});

test('complete country directory', () => {
  assert.equal(new Set(countryCodes).size, 250);
  for (const c of ['PS', 'VA', 'TW', 'XK', 'HK', 'MO', 'PR', 'AW', 'CW']) assert(countryCodes.includes(c));
  const ca = languagesForCountry('CA');
  assert(ca.includes('en') && ca.includes('fr'));
  assert(languagesForCountry('CH').includes('it'));
});

test('route localization preserves query/hash and protects external/assets', () => {
  assert.equal(localePath('/fr/contact?plan=yearly&product=Magic%20Toolbar#prepare-enquiry', 'ur'), '/ur/contact?plan=yearly&product=Magic%20Toolbar#prepare-enquiry');
  assert.equal(localePath('/', 'ar'), '/ar');
  assert.equal(localePath('/en', 'en'), '/en');
  for (const href of ['https://example.com/a', '//example.com/a', 'mailto:test@example.com', '#section', '/images/photo.webp', '/api/whatsapp']) assert.equal(localePath(href, 'fr'), href);
  assert.equal(splitPath('/pt-BR/pricing').path, '/pricing');
});

test('proxy redirects negotiated routes temporarily and leaves explicit locales alone', () => {
  const r = proxy(new NextRequest('https://example.com/contact?plan=yearly', {headers: {'accept-language': 'fr'}}));
  assert.equal(r.status, 307);
  assert.equal(r.headers.get('location'), `https://example.com/${auto('fr')}/contact?plan=yearly`);
  assert.match(r.headers.get('cache-control'), /no-store/);
  const explicit = proxy(new NextRequest('https://example.com/ar/contact', {headers: {'accept-language': 'fr', cookie: 'tg-language=ur'}}));
  assert.equal(explicit.headers.get('location'), null);
  const saved = proxy(new NextRequest('https://example.com/pricing', {headers: {cookie: 'tg-language=ur', 'accept-language': 'fr'}}));
  assert.equal(saved.headers.get('location'), 'https://example.com/ur/pricing');
});

test('catalog messages interpolate values without translating user data',
  {skip: !(tr.createTranslator && tr.translatedObject) && 'createTranslator/translatedObject not exported in v6'}, () => {
  const t = tr.createTranslator({a: {text: 'Hello {name}'}, b: {text: 'Contact'}}, {a: {text: 'Bonjour {name}'}, b: {text: 'Contactez-nous'}});
  assert.equal(t('Hello {name}', {name: 'AHMED'}), 'Bonjour AHMED');
  assert.equal(t('Contact'), 'Contactez-nous');
  assert.equal(t('AB1234567'), 'AB1234567');
  assert.equal(t('Unknown copy'), 'Unknown copy');
  const data = tr.translatedObject({name: 'Contact', '@type': 'Thing', price: 30, url: '/contact'}, t, (x) => '/fr' + x);
  assert.equal(data.name, 'Contactez-nous');
  assert.equal(data.price, 30);
  assert.equal(data.url, '/fr/contact');
});

test('glossary and placeholders survive translation and missing tokens fail closed', {skip: !provider && 'provider.mjs not present'}, () => {
  const original = 'Travel Genie uses GDS, CTCM and CTCE for {passenger}.';
  const p = provider.protect(original);
  assert.equal(provider.restore(p.text, p.values), original);
  assert.throws(() => provider.restore('missing', p.values), /protected/);
});

test('provider batches source text and preserves Portuguese variants', {skip: !provider && 'provider.mjs not present'}, async () => {
  let called;
  const env = {TRANSLATION_PROVIDER: 'azure', AZURE_TRANSLATOR_KEY: 'test-key'};
  const result = await provider.translateBatch(['Hello Travel Genie'], 'pt-PT', {env, fetcher: async (url, options) => {
    called = {url, options};
    const body = JSON.parse(options.body);
    return {ok: true, json: async () => body.map((x) => ({translations: [{text: x.Text.replace('Hello', 'Olá')}]}))};
  }});
  assert.deepEqual(result, ['Olá Travel Genie']);
  assert.equal(called.url.searchParams.get('to'), 'pt-pt');
  assert.equal(called.options.headers['Ocp-Apim-Subscription-Key'], 'test-key');
});

test('provider retries only bounded failures and rejects malformed results', {skip: !provider && 'provider.mjs not present'}, async () => {
  let calls = 0;
  const env = {TRANSLATION_PROVIDER: 'azure', AZURE_TRANSLATOR_KEY: 'test'};
  await assert.rejects(provider.translateBatch(['Hello'], 'fr', {env, retryDelay: 0, fetcher: async () => { calls++; return {ok: false, status: 429}; }}), /HTTP 429/);
  assert.equal(calls, 3);
  await assert.rejects(provider.translateBatch(['Hello'], 'fr', {env, fetcher: async () => ({ok: true, json: async () => []})}), /count mismatch/);
  await assert.rejects(provider.translateBatch(['Hello'], 'fr', {env: {}}), /Configure/);
});

test('available locales have catalogs and credentials are absent from client code', () => {
  for (const l of locales) {
    const file = `messages/${l.code}.json`;
    if (!fs.existsSync(file)) { assert(!avail(l.code), `${l.code} is available but has no catalog`); continue; }
    const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(catalog.locale, l.code);
    assert(catalog.messages);
  }
  const client = fs.readFileSync('lib/i18n/client.js', 'utf8');
  assert(!client.includes('AZURE_TRANSLATOR_KEY'));
  assert(!client.includes('LIBRETRANSLATE'));
});