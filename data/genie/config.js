import {locales as websiteLocales} from '../../lib/i18n/config.js';
import {availableLocales} from '../../lib/i18n/available.js';
import { site } from '../site.js';

export const genie = {
  name: 'Genie at your service',
  shortName: 'Genie',
  // AVATAR PLACEHOLDER: drop your square image (256–512 px) at /public/images/genie-avatar.webp.
  // Until it exists, the mascot is shown; if both fail, a "G" badge appears.
  avatar: { src: '/images/genie-avatar.webp', fallbackSrc: '/images/genie-mascot.webp' },
  whatsappNumber: site.whatsappNumber,
  supportEmail: site.supportEmail,
  downloadUrl: site.downloadUrl,
  defaultLocale: 'en',
  showDraftLocales: false,      // true = also offer languages the website has not translated yet
  // "Book a demo" reminder bubble (once per browser session): one every 30 s, 5 times.
  nudges: {
    enabled: true,
    firstDelayMs: 30000, // first reminder 30 s after the page loads
    visibleMs: 8000,     // each reminder stays on screen for 8 s
    gapMs: 22000,        // 22 s pause, so a new reminder starts every 30 s
    count: 5,            // number of reminders
  },
  position: 'right',           // 'right' | 'left'
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