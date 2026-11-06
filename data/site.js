export const site = {
  name: 'Travel Genie',
  product: 'Travel Genie Magic Toolbar',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.traveldeskgenie.com').replace(/\/$/, ''),
  description: 'Travel Genie brings travel agency tools together: Windows productivity, passport entries, passenger contacts, and practical GDS workflow guides.',
  downloadUrl: 'https://www.traveldeskgenie.com/download/Travel-Genie-Magic-Toolbar.exe',
  releaseVersion: null,
  contactUrl: '/contact',
  supportEmail: 'traveldeskgenie@gmail.com',
  whatsappNumber: '923477444312',
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

  // Official public profiles (Instagram, Facebook, YouTube).
  // Add only genuine, publicly accessible company profiles.
  // These links help establish consistent brand identity.
  sameAs: [
     'https://www.instagram.com/traveldeskgenie/',
     'https://www.facebook.com/profile.php?id=61596073299276',
     'https://www.youtube.com/channel/UCXcwiBG0ojtQK3M0UEZ8Lqw',
  ],


  // Author and brand information.
  // Use genuine company or author details only.
  author: {
    name: 'TravelDeskGenie',
    jobTitle: 'Travel Technology Platform',
    url: 'https://www.traveldeskgenie.com/en/about',
    sameAs: [
      'https://www.facebook.com/profile.php?id=61596073299276',
    ],
  },

  // Legal and policy pages.
  legal: {
    privacy: '/privacy',
    terms: '/terms',
    refund: '/refund',
    delivery: '/delivery',
  },
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/resources', label: 'Resources' },
  { href: '/guide', label: 'User Guide' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

export const mascot = {
  src: '/images/genie-mascot.webp',
  width: 1254,
  height: 1254,
  alt: 'TravelDeskGenie mascot, a friendly blue genie holding a globe surrounded by a golden airplane',
};

