// GDS notes PDFs stored in public/download/.
// Each file name matches its guide slug, so the guide and its PDF stay linked.
export const GDS_PDFS = {
  'amadeus-commands-notes': {
    gds: 'Amadeus',
    tone: 'amadeus',
    file: '/download/amadeus-commands-notes.pdf',
    title: 'Amadeus Commands Notes PDF',
    label: 'Download Amadeus notes PDF',
    blurb:
      'Printable Amadeus command notes for travel agents. Keep them open beside your GDS or print them for training.',
  },
  'travelport-galileo-commands-notes': {
    gds: 'Travelport / Galileo',
    tone: 'travelport',
    file: '/download/travelport-galileo-commands-notes.pdf',
    title: 'Travelport Galileo Commands Notes PDF',
    label: 'Download Travelport notes PDF',
    blurb:
      'Printable Travelport Galileo command notes for travel agents. Keep them open beside your GDS or print them for training.',
  },
  'sabre-commands-notes': {
    gds: 'Sabre',
    tone: 'sabre',
    file: '/download/sabre-commands-notes.pdf',
    title: 'Sabre Commands Notes PDF',
    label: 'Download Sabre notes PDF',
    blurb:
      'Printable Sabre command notes for travel agents. Keep them open beside your GDS or print them for training.',
  },
};

// Display order: Amadeus, Travelport, Sabre.
export const GDS_PDF_LIST = [
  'amadeus-commands-notes',
  'travelport-galileo-commands-notes',
  'sabre-commands-notes',
].map((slug) => ({slug, ...GDS_PDFS[slug]}));