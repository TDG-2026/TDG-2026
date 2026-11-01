// English source strings are kept in one keyed structure to make future 18-language
// translation and locale switching easier. Add other locale files with the same keys.
export const translations = {
  nav: {
    home: 'Home', about: 'About', pricing: 'Pricing', download: 'Download', blog: 'Blog', contact: 'Contact',
    magicToolbar: 'Magic Toolbar', howItWorks: 'How it works', moreProducts: 'More Products', help: 'Help',
  },
  hero: {
    title: 'Travel Genie Magic Toolbar',
    slogan: 'Your Travel Desk. Reimagined.',
    subtitle: 'One toolbar. Every essential at your fingertips.',
    takeTour: 'Take the tour', explore: 'Explore Magic Toolbar', download: 'Download for Windows',
  },
  pricing: {
    currency: 'USD', monthly: { title: 'Monthly', price: '$30', period: 'month' },
    yearly: { title: 'Yearly', price: '$220', period: 'year', regularPrice: '$360', savings: '$140' },
    lifetime: { title: 'Lifetime', price: 'Contact for pricing' },
  },
};
