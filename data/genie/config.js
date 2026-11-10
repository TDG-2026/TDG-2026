
import { locales as websiteLocales } from '../../lib/i18n/config.js';
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
  storeUrl: site.storeUrl,

  defaultLocale: 'en',
  showDraftLocales: true,

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
//         'machine'    = a supported locale with localized Genie interface strings;
//                        detailed website/catalog answers may still fall back to English.
//         'draft'      = not ready for the Genie language selector.
export const locales = websiteLocales.map((l) => ({
  code: l.code, native: l.name, english: l.english, dir: l.dir,
  status: l.code === 'en' ? 'production' : 'draft',
}));

export const DEFAULT_LOCALE = 'en';

// Country → suggested language (only applied if the visitor hasn't chosen a language).
export const countries = [
  ['NL', 'nl'], ['BE', 'nl'], ['DE', 'de'], ['AT', 'de'], ['CH', 'de'],
  ['FR', 'fr'], ['ES', 'es'], ['IT', 'it'],
  ['AF', 'ps'], ['PK', 'ur'],
  ['SA', 'ar'], ['AE', 'ar'], ['QA', 'ar'], ['KW', 'ar'], ['OM', 'ar'],
  ['BH', 'ar'], ['EG', 'ar'], ['JO', 'ar'], ['LB', 'ar'], ['IQ', 'ar'],
  ['GB', 'en'], ['US', 'en'], ['CA', 'en'], ['AU', 'en'],
].map(([code, locale]) => ({ code, locale }));