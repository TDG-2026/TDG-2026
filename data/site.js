export const socialProfiles = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/traveldeskgenie-undefined-54609944b/' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61596073299276' },
  { name: 'Instagram', url: 'https://www.instagram.com/traveldeskgenie/' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCXcwiBG0ojtQK3M0UEZ8Lqw' },
  { name: 'X', url: 'https://x.com/traveldeskgenie' },
];

export const site = {
  name: 'Travel Genie',
  publisherName: 'Travel Desk Genie',
  product: 'Travel Genie Magic Toolbar',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.traveldeskgenie.com').replace(/\/$/, ''),
  description: 'Travel Genie brings travel agency tools together: Windows productivity, passport entries, passenger contacts, and practical GDS workflow guides.',
  storeUrl: 'https://apps.microsoft.com/detail/9P1J21G2Z9LZ',
  storeProductId: '9P1J21G2Z9LZ',
  storePackageIdentity: 'TravelDeskGenie.TravelDeskGenieMagicToolbar',
  storePublisherDisplayName: 'TravelDeskGenie',
  releaseVersion: null,
  contactUrl: '/contact',
  supportEmail: 'inquiry@traveldeskgenie.com',
  generalEmail: 'traveldeskgenie@gmail.com',
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

  // Schema identity links are generated from the same profile list used in the footer.
  sameAs: socialProfiles.map(({url}) => url),

  // Publisher identity is the organization; do not invent a named individual author.

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
  width: 512,
  height: 512,
  alt: 'TravelDeskGenie mascot, a friendly blue genie holding a globe surrounded by a golden airplane',
};

