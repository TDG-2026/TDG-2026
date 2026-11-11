import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveLocale, parseAcceptLanguage, trustedCountry} from '../lib/i18n/resolve.js';
import {locales, localePath, splitPath} from '../lib/i18n/config.js';
import {ENABLED} from '../lib/i18n/locales.registry.js';
import {availableLocales} from '../lib/i18n/available.js';
import {countryCodes, languagesForCountry} from '../lib/i18n/countries.js';
import {proxy} from '../proxy.js';
import {NextRequest} from 'next/server.js';

const expectedLocales = ['en', 'nl', 'de', 'fr', 'it', 'es', 'ps', 'ar', 'ur'];

test('the launch registry contains exactly the nine requested locales', () => {
  assert.deepEqual(ENABLED, expectedLocales);
  assert.deepEqual(locales.map((locale) => locale.code), expectedLocales);
  assert.deepEqual(availableLocales, expectedLocales);
  assert.equal(new Set(locales.map((locale) => locale.code)).size, 9);
  assert.equal(locales.find((locale) => locale.code === 'ps')?.dir, 'rtl');
  assert.equal(locales.find((locale) => locale.code === 'ar')?.dir, 'rtl');
  assert.equal(locales.find((locale) => locale.code === 'ur')?.dir, 'rtl');
});

test('URL, saved preference, browser language and region have predictable precedence', () => {
  assert.equal(resolveLocale({urlLocale: 'fr', cookie: 'ur', acceptLanguage: 'de', country: 'NL'}).locale, 'fr');
  assert.equal(resolveLocale({cookie: 'ur', acceptLanguage: 'de', country: 'NL'}).locale, 'ur');
  assert.equal(resolveLocale({acceptLanguage: 'de-DE', country: 'NL'}).locale, 'de');
  assert.equal(resolveLocale({acceptLanguage: 'zz', country: 'NL'}).locale, 'nl');
  assert.equal(resolveLocale({acceptLanguage: 'zz', country: 'AF'}).locale, 'ps');
  assert.equal(resolveLocale({acceptLanguage: 'zz', country: 'PK'}).locale, 'ur');
  assert.equal(resolveLocale({acceptLanguage: 'zz', country: 'XX'}).locale, 'en');
  assert.equal(resolveLocale({cookie: 'evil', acceptLanguage: 'fr'}).locale, 'fr');
});

test('weighted language negotiation respects q-values and supported locales', () => {
  assert.equal(resolveLocale({acceptLanguage: 'de;q=0.4,fr;q=0.9,en;q=0.7'}).locale, 'fr');
  assert.equal(resolveLocale({acceptLanguage: 'fr;q=0,en;q=0.5', country: 'FR'}).locale, 'en');
  assert.equal(resolveLocale({acceptLanguage: 'fr;q=0,*;q=0.2', country: 'FR'}).locale, 'en');
  assert.equal(resolveLocale({acceptLanguage: '*;q=0,fr;q=1'}).locale, 'fr');
  assert.equal(resolveLocale({acceptLanguage: 'fr;q=broken,de;q=2,nl;q=0.8'}).locale, 'nl');
  assert.equal(parseAcceptLanguage('fr;q=broken').length, 0);
});

test('country detection uses trusted edge headers only', () => {
  const headers = new Headers({'cf-ipcountry': 'PK', 'x-vercel-ip-country': 'FR'});
  assert.equal(trustedCountry(headers, ''), '');
  assert.equal(trustedCountry(headers, 'cloudflare'), 'PK');
  assert.equal(trustedCountry(headers, 'vercel'), 'FR');
  assert.equal(trustedCountry(new Headers({'cf-ipcountry': 'XX'}), 'cloudflare'), '');
  assert.equal(trustedCountry(new Headers({'x-vercel-ip-country': 'NL'}), 'vercel'), 'NL');
});

test('country directory covers the nine-language launch markets', () => {
  assert.equal(new Set(countryCodes).size, 250);
  for (const country of ['NL', 'DE', 'FR', 'IT', 'ES', 'AF', 'PK', 'SA', 'GB']) {
    assert(countryCodes.includes(country));
  }
  assert(languagesForCountry('NL').includes('nl'));
  assert(languagesForCountry('DE').includes('de'));
  assert(languagesForCountry('FR').includes('fr'));
  assert(languagesForCountry('IT').includes('it'));
  assert(languagesForCountry('ES').includes('es'));
  assert(languagesForCountry('AF').includes('ps'));
  assert(languagesForCountry('PK').includes('ur'));
  assert(languagesForCountry('SA').includes('ar'));
});

test('localized routes preserve query/hash and protect external links and assets', () => {
  assert.equal(
    localePath('/fr/contact?plan=yearly&product=Magic%20Toolbar#prepare-enquiry', 'ur'),
    '/ur/contact?plan=yearly&product=Magic%20Toolbar#prepare-enquiry'
  );
  assert.equal(localePath('/', 'ar'), '/ar');
  assert.equal(localePath('/en', 'en'), '/en');
  for (const href of [
    'https://example.com/a',
    '//example.com/a',
    'mailto:test@example.com',
    '#section',
    '/images/photo.webp',
    '/api/whatsapp',
  ]) {
    assert.equal(localePath(href, 'fr'), href);
  }
  assert.equal(splitPath('/nl/contact').path, '/contact');
  assert.equal(splitPath('/ps/contact').locale, 'ps');
});

test('proxy negotiates browser locale and preserves explicit/saved choices', () => {
  const browser = proxy(new NextRequest('https://example.com/contact?plan=yearly', {
    headers: {'accept-language': 'nl-NL,nl;q=0.9,en;q=0.8'},
  }));
  assert.equal(browser.status, 307);
  assert.equal(browser.headers.get('location'), 'https://example.com/nl/contact?plan=yearly');
  assert.match(browser.headers.get('cache-control'), /no-store/);
  assert.match(browser.headers.get('set-cookie') || '', /tg-language-auto=nl/);

  const explicit = proxy(new NextRequest('https://example.com/ar/contact', {
    headers: {'accept-language': 'fr', cookie: 'tg-language=ur'},
  }));
  assert.equal(explicit.headers.get('location'), null);

  const saved = proxy(new NextRequest('https://example.com/pricing', {
    headers: {cookie: 'tg-language=ur', 'accept-language': 'fr'},
  }));
  assert.equal(saved.headers.get('location'), 'https://example.com/ur/pricing');
});

test('retired locale prefixes are consolidated to English', () => {
  const response = proxy(new NextRequest('https://example.com/fa/contact'));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://example.com/en/contact');
});

test('Azure and LibreTranslate website translation integrations are removed', () => {
  assert.equal(fs.existsSync('lib/i18n/provider.mjs'), false);
  assert.equal(fs.existsSync('scripts/i18n-auto.mjs'), false);
  assert.equal(fs.existsSync('scripts/i18n.mjs'), false);
  assert.equal(fs.existsSync('.env.local'), false);
  const envExample = fs.readFileSync('.env.example', 'utf8');
  assert(!/AZURE_TRANSLATOR|LIBRETRANSLATE|TRANSLATION_PROVIDER/.test(envExample));
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(!Object.keys(packageJson.scripts).some((key) =>
  /^(i18n:auto|i18n:release|translate:auto)$/.test(key)
));

assert.equal(
  packageJson.scripts['translate:deepl'],
  'node scripts/translate-deepl-once.mjs'
);
});

test('all primary product download destinations use the central Store URL', () => {
  const site = fs.readFileSync('data/site.js', 'utf8');
  assert.match(site, /storeUrl: 'https:\/\/apps\.microsoft\.com\/detail\/9P1J21G2Z9LZ'/);
  for (const file of [
    'components/Hero.js',
    'components/Header.js',
    'components/FinalCta.js',
    'app/[locale]/download/page.js',
    'app/[locale]/products/magic-toolbar/page.js',
  ]) {
    const content = fs.readFileSync(file, 'utf8');
    assert(content.includes('site.storeUrl'), `${file} must use the central Store URL`);
  }
});
