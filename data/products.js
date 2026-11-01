export const categories = ['Documents', 'Contacts & CRM', 'Proposals', 'Sales & Reporting', 'Online Platforms'];

export const trademarkNote =
  'Third-party names such as NADRA, WhatsApp, Amadeus, Sabre, Travelport and Emirates describe purpose or compatibility only. Travel Genie is not affiliated with or endorsed by their owners.';

const base = {
  status: 'preview',     // 'available' | 'preview' | 'soon'
  published: false,      // true = indexable + in sitemap (release check enforces completeness)
  platform: null,
  features: [],
  requirements: [],
  limitations: [],
  screenshots: [],       // [{ src, alt, caption, width, height }]
  privacy: null,
  releaseVersion: null,
  downloadUrl: null,
  lastReviewed: null,
};

export const products = [
  {
    ...base,
    id: 'nadra-visa-cross-check',
    slug: 'nadra-visa-cross-check',
    name: 'Travel Genie NADRA Visa Cross-Check',
    category: 'Documents',
    tile: 'NV',
    tone: 'violet',
    summary: 'A focused workspace for cross-checking passenger document details before visa or booking work.',
    problem: 'Document details are often re-typed and compared by eye across several sources. A focused cross-check helps staff catch mismatches before they become problems.',
    workflow: { input: 'Passenger document details', action: 'Structured cross-check with manual review', output: 'A reviewed record for the next step' },
    pending: ['Exact fields compared', 'Supported documents and sources', 'Manual-review steps', 'Output format', 'Storage and retention'],
    keywords: ['nadra', 'visa', 'document', 'cross check', 'passport'],
  },
  {
    ...base,
    id: 'whatsapp-contact-extractor',
    slug: 'whatsapp-contact-number-extractor',
    name: 'Travel Genie WhatsApp Contact Number Extractor',
    category: 'Contacts & CRM',
    tile: 'WE',
    tone: 'green',
    summary: 'A contact-number extraction workspace for organising customer numbers.',
    problem: 'Customer numbers end up scattered across chats and notes. A dedicated workspace keeps them organised for legitimate follow-up.',
    workflow: { input: 'Customer conversation data', action: 'Number extraction and review', output: 'An organised contact list' },
    pending: ['Accepted input', 'Extraction method', 'De-duplication', 'Consent context', 'Export formats', 'Limits'],
    keywords: ['whatsapp', 'contacts', 'numbers', 'extract', 'export'],
  },
  {
    ...base,
    id: 'whatsapp-observation-desk',
    slug: 'whatsapp-customer-observation-desk',
    name: 'Travel Genie WhatsApp Customer Observation Desk',
    category: 'Contacts & CRM',
    tile: 'WO',
    tone: 'teal',
    summary: 'A customer observation workspace for keeping track of customer conversations.',
    problem: 'Enquiries arrive all day across many chats. An observation desk gives the team one place to see who needs attention.',
    workflow: { input: 'Customer conversations', action: 'Observation and notes', output: 'A clear view of who needs attention' },
    pending: ['Capture method', 'Recorded fields', 'Follow-up actions', 'Retention', 'Team access'],
    keywords: ['whatsapp', 'customer', 'observation', 'follow up', 'desk'],
  },
  {
    ...base,
    id: 'crm-all-gds',
    slug: 'crm-for-all-gds',
    name: 'CRM for All GDS',
    category: 'Contacts & CRM',
    tile: 'CR',
    tone: 'blue',
    summary: 'Customer management built around everyday travel operations.',
    problem: 'Customer history often lives in different systems and spreadsheets. A travel-focused CRM keeps it in one place.',
    workflow: { input: 'Customer and booking information', action: 'Organise, search and follow up', output: 'One customer view for the team' },
    pending: ['Exact supported systems (tested list)', 'Import methods', 'Actual integrations', 'User roles', 'Sync behaviour'],
    keywords: ['crm', 'gds', 'customers', 'amadeus', 'sabre', 'travelport'],
  },
  {
    ...base,
    id: 'amadeus-proposal-generator',
    slug: 'amadeus-proposal-generator',
    name: 'Amadeus Proposal Generator',
    category: 'Proposals',
    tile: 'AP',
    tone: 'indigo',
    summary: 'Prepare clear, presentable travel proposals for customers.',
    problem: 'Turning itinerary details into a proposal a customer can read takes time. A generator shortens the step between quoting and sending.',
    workflow: { input: 'Itinerary details', action: 'Proposal formatting and branding', output: 'A customer-ready proposal' },
    pending: ['Input formats', 'Output formats', 'Itinerary and fare sources', 'Branding options', 'Limitations'],
    keywords: ['amadeus', 'proposal', 'quote', 'itinerary', 'pdf'],
  },
  {
    ...base,
    id: 'emirates-sales-report',
    slug: 'emirates-portal-sales-report-automation',
    name: 'Emirates Portal Sales Report Automation',
    category: 'Sales & Reporting',
    tile: 'ER',
    tone: 'red',
    summary: 'A workflow for preparing portal sales reports with less manual effort.',
    problem: 'Compiling sales reports by hand is repetitive and error-prone. A defined workflow makes the routine predictable.',
    workflow: { input: 'Portal sales data', action: 'Report preparation workflow', output: 'A sales report ready to review' },
    pending: ['Supported portal', 'Authentication method', 'Permissions', 'Export formats', 'Failure handling'],
    keywords: ['emirates', 'portal', 'sales', 'report', 'automation'],
  },
  {...base,id:'agency-account-system',slug:'travel-agency-account-system',path:'/platform/travel-agency-account-system',name:'Online Travel Agency Account System',category:'Online Platforms',tile:'AC',tone:'blue',summary:'An online travel-agency operations concept. Scope and public availability are being confirmed.',problem:'Agency teams need clear account workflows across their daily operations.',workflow:null,pending:['Confirmed modules','Access and roles','Data handling','Pricing and availability'],keywords:['online','agency','accounts','platform']},
  {...base,id:'b2b-b2c-portal',slug:'b2b-b2c-travel-portal',path:'/platform/b2b-b2c-travel-portal',name:'Travel Agent Portal — B2B & B2C',category:'Online Platforms',tile:'B2',tone:'violet',summary:'A planned portal for business and consumer travel workflows. Booking and supplier capabilities are not confirmed.',problem:'Business and consumer travel workflows need clearly defined access and responsibilities.',workflow:null,pending:['Booking capabilities','Supplier connectivity','Payment scope','Roles and availability'],keywords:['b2b','b2c','portal','online']},

];

export const findProduct = (slug) => products.find((p) => p.slug === slug && p.status !== 'soon');