export const site = {
  name: 'Travel Genie',
  product: 'Travel Genie Magic Toolbar',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.traveldeskgenie.com').replace(/\/$/, ''),
  description: 'Travel Genie brings travel agency tools together: Windows productivity, passport entries, passenger contacts, and practical GDS workflow guides.',
  downloadUrl: 'https://www.traveldeskgenie.com/download/Travel-Genie-Magic-Toolbar.exe',
  releaseVersion: null,
  contactUrl: '/contact',
  supportEmail: 'waqarjim@gmail.com',
  whatsappNumber: '923498441446',
  // Languages your support team actually answers in (schema contactPoint.availableLanguage).
  supportLanguages: ['English'],
  // Business address for Organization schema. Only filled fields are output; leave blank to keep private.
  address: {
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'PK',
  },
  // Official public profiles (LinkedIn, Facebook, YouTube): strong entity/GEO signal.
  // Scanners show "partial author" until at least one real link is added.
  sameAs: [
    // 'https://www.linkedin.com/company/YOUR-PAGE',
    // 'https://www.facebook.com/YOUR-PAGE',
    // 'https://www.youtube.com/@YOUR-CHANNEL',
  ],
  // Optional named author (stronger E-E-A-T). Leave name empty to credit the company instead.
  author: {
    name: '',            // e.g. 'M Waqar Gull'
    jobTitle: '',        // e.g. 'Founder, Travel Genie'
    url: '/en/about',
    sameAs: [],          // e.g. ['https://www.linkedin.com/in/YOUR-PROFILE']
  },
  legal: {privacy: '/privacy', terms: '/terms', refund: '/refund', delivery: '/delivery'},
};

export const navLinks = [
  {href: '/', label: 'Home'}, {href: '/products', label: 'Products'},
  {href: '/pricing', label: 'Pricing'}, {href: '/resources', label: 'Resources'},
  {href: '/guide', label: 'User Guide'}, {href: '/support', label: 'Support'},
  {href: '/contact', label: 'Contact'},
];

export const mascot = {src: '/images/genie-mascot.webp', width: 1254, height: 1254,
  alt: 'Travel Genie mascot: a friendly blue genie holding a globe circled by a golden plane'};