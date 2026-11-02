import {site} from '../data/site.js';
import {localePath} from './i18n/config.js';

export const UPDATED = '2026-10-31';
export const absolute = (path = '/') => new URL(path, site.url + '/').href;
export const localizedUrl = (path = '/', locale = 'en') => absolute(localePath(path, locale));

const ORG_ID = absolute('/#organization');
const SITE_ID = absolute('/#website');
const APP_ID = absolute('/products/magic-toolbar#application');
const LOGO_URL = absolute('/images/genie-mascot.png');
const OG_IMAGE = {url: '/images/genie-mascot.png', width: 1254, height: 1254, alt: 'Travel Genie mascot'};

// Builds a PostalAddress from site.address, using only the fields that are filled in.
function postalAddress() {
  const a = site.address || {};
  const fields = {
    streetAddress: a.street, addressLocality: a.city, addressRegion: a.region,
    postalCode: a.postalCode, addressCountry: a.country,
  };
  const filled = Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
  return Object.keys(filled).length ? {'@type': 'PostalAddress', ...filled} : null;
}

export function organizationSchema() {
  const address = postalAddress();
  return {
    '@type': 'Organization', '@id': ORG_ID, name: site.name, url: site.url,
    description: site.description,
    logo: {'@type': 'ImageObject', url: LOGO_URL, width: 1254, height: 1254},
    image: LOGO_URL,
    email: site.supportEmail,
    ...(address ? {address} : {}),
    contactPoint: [{
      '@type': 'ContactPoint', contactType: 'customer support',
      email: site.supportEmail, telephone: '+' + site.whatsappNumber,
      url: localizedUrl(site.contactUrl || '/contact', 'en'),
      availableLanguage: site.supportLanguages && site.supportLanguages.length ? site.supportLanguages : ['English'],
    }],
    ...(site.author && site.author.name ? {founder: {'@id': absolute('/about#author')}} : {}),
    sameAs: site.sameAs || [],
  };
}

// Full author node: a named Person if configured in site.author, otherwise the complete Organization
// (identical to the layout node, so there is no incomplete duplicate in the graph).
function authorNode() {
  const a = site.author;
  if (a && a.name) {
    return {
      '@type': 'Person', '@id': absolute('/about#author'), name: a.name, url: absolute(a.url || '/en/about'),
      ...(a.jobTitle ? {jobTitle: a.jobTitle} : {}), sameAs: a.sameAs || [], worksFor: {'@id': ORG_ID},
    };
  }
  return organizationSchema();
}

export function pageMeta(title, description, path, options = {}) {
  return {
    title: {absolute: title}, description, alternates: {canonical: path},
    openGraph: {title, description, url: path, type: 'website', siteName: site.name, images: [OG_IMAGE]},
    twitter: {card: 'summary', title, description, images: [OG_IMAGE.url]},
    ...options,
  };
}

export function websiteSchema(locale = 'en') {
  return {
    '@type': 'WebSite', '@id': SITE_ID, url: site.url, name: site.name, alternateName: site.product,
    description: site.description, inLanguage: locale, publisher: {'@id': ORG_ID},
  };
}

export function webPageSchema({locale = 'en', t = (s) => s, path = '/', name, description, speakable, type = 'WebPage', datePublished = UPDATED, dateModified = UPDATED}) {
  const url = localizedUrl(path, locale);
  return {
    '@type': type, '@id': url + '#webpage', url, name: t(name), description: t(description), inLanguage: locale,
    isPartOf: {'@id': SITE_ID}, publisher: {'@id': ORG_ID}, author: authorNode(), datePublished, dateModified,
    ...(speakable ? {speakable: {'@type': 'SpeakableSpecification', cssSelector: speakable}} : {}),
  };
}

export function breadcrumbs(items, locale = 'en', t = (s) => s) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({'@type': 'ListItem', position: i + 1, name: t(name), item: localizedUrl(path, locale)})),
  };
}

export function appSchema(locale = 'en', t = (s) => s) {
  return {
    '@type': 'SoftwareApplication', '@id': APP_ID, name: site.product, applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Travel agency productivity software', operatingSystem: 'Windows 11 (64-bit)',
    description: t('A Windows workspace for travel agents to prepare DOCS, CTCM and CTCE entries and use everyday desk tools.'),
    url: localizedUrl('/products/magic-toolbar', locale), image: LOGO_URL,
    screenshot: absolute('/images/screens/passport-gds.webp'), inLanguage: locale,
    ...(site.downloadUrl ? {downloadUrl: site.downloadUrl} : {}),
        featureList: ['Passport to NAME, DOCS, CTCM and CTCE entries', 'Amadeus, Travelport and Sabre formats', 'F1–F12 text shortcuts',
      'Visa photo checker', 'GDS decode search', 'Translation and magnifier', 'Reminders and phone directory',
      'Meeting mute hotkeys for Zoom, Microsoft Teams and browsers'].map(t),
    publisher: {'@id': ORG_ID},
    offers: [
      {'@type': 'Offer', name: t('Monthly plan'), price: '30', priceCurrency: 'USD', url: localizedUrl('/pricing', locale), availability: 'https://schema.org/InStock', description: t('Monthly subscription; activation arranged through the team.')},
      {'@type': 'Offer', name: t('Yearly plan'), price: '220', priceCurrency: 'USD', url: localizedUrl('/pricing', locale), availability: 'https://schema.org/InStock', description: t('Annual subscription; activation arranged through the team.')},
    ],
  };
}

// Accepts [question, answer] pairs or {q, a} objects.
export function faqSchema(pairs, t = (s) => s, {name, description} = {}) {
  return {
    '@type': 'FAQPage',
    name: t(name || 'Magic Toolbar frequently asked questions'),
    description: t(description || 'Common questions about Travel Genie Magic Toolbar: who it is for, passport reading, shortcuts, visa photos, saved records, system needs and support.'),
    mainEntity: pairs.map((p) => {
      const [q, a] = Array.isArray(p) ? p : [p.q, p.a];
      return {'@type': 'Question', name: t(q), text: t(q), acceptedAnswer: {'@type': 'Answer', text: t(a)}};
    }),
  };
}

export function articleSchema({locale = 'en', t = (s) => s, path, headline, description, section, datePublished = UPDATED, dateModified = UPDATED, wordCount}) {
  const url = localizedUrl(path, locale);
  return {
    '@type': 'TechArticle', '@id': url + '#article', headline: t(headline), description: t(description),
    ...(section ? {articleSection: t(section)} : {}), inLanguage: locale, datePublished, dateModified, wordCount,
    mainEntityOfPage: {'@id': url + '#webpage'}, image: LOGO_URL,
    author: authorNode(), publisher: {'@id': ORG_ID}, isPartOf: {'@id': SITE_ID},
  };
}