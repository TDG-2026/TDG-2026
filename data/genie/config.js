
import { locales as websiteLocales } from '../../lib/i18n/config.js';
import { availableLocales } from '../../lib/i18n/available.js';
import { site } from '../site.js';

export const genie = {
  name: 'Genie at your service',
  shortName: 'Genie',

  // Avatar image: 256–512 px square.
  // Place the image at /public/images/genie-avatar.webp.
  // If unavailable, use the mascot image as a fallback.
  avatar: {
    src: '/images/genie-avatar.webp',
    fallbackSrc: '/images/genie-mascot.webp',
  },

  whatsappNumber: site.whatsappNumber,
  supportEmail: site.supportEmail,
  downloadUrl: site.downloadUrl,

  defaultLocale: 'en',
  showDraftLocales: false,

  // Demo reminder bubble: once per browser session.
  nudges: {
    enabled: true,
    firstDelayMs: 30000,
    visibleMs: 8000,
    gapMs: 22000,
    count: 5,
  },

  position: 'right',
  maxStoredMessages: 60,
};

export const pricing = { currency: 'USD', monthly: 30, yearly: 220, yearlyRegular: 360 };

// status: 'production' = English source.
//         'machine'    = the website has this language at least 90% translated (lib/i18n/available.js),
//                        so Genie offers it, using the same translation catalog for answers and UI.
//         'draft'      = not translated yet; Genie answers in English unless showDraftLocales is true.
export const locales = websiteLocales.map((l) => ({
  code: l.code, native: l.name, english: l.english, dir: l.dir,
  status: l.code === 'en' ? 'production' : availableLocales.includes(l.code) ? 'machine' : 'draft',
}));

export const DEFAULT_LOCALE = 'en';

// Country → suggested language (only applied if the visitor hasn't chosen a language).
export const countries = [
  ['PK', 'ur'], ['IN', 'hi'], ['BD', 'bn'], ['NP', 'ne'], ['AF', 'fa'], ['IR', 'fa'],
  ['AE', 'ar'], ['SA', 'ar'], ['QA', 'ar'], ['KW', 'ar'], ['OM', 'ar'], ['BH', 'ar'], ['EG', 'ar'], ['JO', 'ar'],
  ['LB', 'ar'], ['IQ', 'ar'], ['SY', 'ar'], ['YE', 'ar'], ['PS', 'ar'], ['MA', 'ar'], ['DZ', 'ar'], ['TN', 'ar'],
  ['LY', 'ar'], ['SD', 'ar'],
  ['TR', 'tr'], ['AZ', 'tr'], ['RU', 'ru'], ['KZ', 'ru'], ['KG', 'ru'], ['TJ', 'ru'], ['BY', 'ru'], ['UZ', 'uz'],
  ['FR', 'fr'], ['BE', 'fr'], ['LU', 'fr'], ['SN', 'fr'], ['CI', 'fr'], ['CM', 'fr'], ['ML', 'fr'], ['BF', 'fr'],
  ['NE', 'fr'], ['TG', 'fr'], ['BJ', 'fr'], ['GN', 'fr'], ['CD', 'fr'], ['MG', 'fr'],
  ['ES', 'es'], ['MX', 'es'], ['AR', 'es'], ['CO', 'es'], ['PE', 'es'], ['CL', 'es'], ['VE', 'es'], ['EC', 'es'],
  ['BR', 'pt-BR'], ['PT', 'pt-BR'], ['AO', 'pt-BR'], ['MZ', 'pt-BR'],
  ['ID', 'id'], ['MY', 'ms'], ['BN', 'ms'], ['TH', 'th'], ['VN', 'vi'], ['CN', 'zh-Hans'],
  ['IT', 'it'], ['DE', 'de'], ['AT', 'de'], ['CH', 'de'],
  ['GB', 'en'], ['US', 'en'], ['CA', 'en'], ['AU', 'en'],
].map(([code, locale]) => ({ code, locale }));