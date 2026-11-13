
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GdsSearch from '../../../components/gds/GdsSearch';
import GdsSeoContent, { faqs } from '../../../components/gds/GdsSeoContent';
import { absolute, breadcrumbs, pageMeta, webPageSchema } from '../../../lib/seo';

const locales = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'ps', 'ur'];
const route = '/gds-search-engine';

const title = 'GDS Commands Search Engine | Amadeus, Sabre & Galileo';

const description =
  'Search and compare Amadeus, Sabre and Travelport/Galileo GDS commands. Explore reservation, ticketing, hotel, passport DOCS and contact SSR references.';

const relatedGuides = [
  {
    slug: 'passport-docs-ctcm-ctce-gds',
    title: 'Passport DOCS Entry in Amadeus, Galileo and Sabre',
    description:
      'Learn how to prepare passport SSR DOCS entries, compare GDS formats and check passenger document details.',
    category: 'Passenger documentation',
  },
  {
    slug: 'ctcm-ctce-passenger-contacts',
    title: 'CTCM and CTCE Passenger Contact Entries',
    description:
      'Understand passenger mobile and email SSR entries, including GDS formatting and passenger association.',
    category: 'Passenger contacts',
  },
  {
    slug: 'adult-child-infant-name-entry-gds',
    title: 'Adult, Child and Infant Name Entry in GDS',
    description:
      'Compare passenger name entry formats and the additional details required for children and infants.',
    category: 'Passenger names',
  },
  {
    slug: 'amadeus-commands-notes',
    title: 'Amadeus Commands Notes and Cheat Sheet',
    description:
      'Explore Amadeus availability, booking, passenger details, pricing and decoding command examples.',
    category: 'Amadeus commands',
  },
  {
    slug: 'travelport-galileo-commands-notes',
    title: 'Travelport Galileo Commands Cheat Sheet',
    description:
      'Review Travelport Galileo commands for availability, reservations, passenger entries, pricing and decoding.',
    category: 'Travelport/Galileo commands',
  },
  {
    slug: 'sabre-commands-notes',
    title: 'Sabre Commands Notes and Cheat Sheet',
    description:
      'Find Sabre command examples for reservations, passenger details, fare pricing and decoding.',
    category: 'Sabre commands',
  },
];

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) return {};

  const url = absolute(`/${locale}${route}`);

  return pageMeta(title, description, url, {
    alternates: { canonical: url },
    robots: { index: locale === 'en', follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Travel Desk Genie',
      locale: locale === 'en' ? 'en_US' : locale,
    },
  });
}

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const url = absolute(`/${locale}${route}`);

  const page = {
  ...webPageSchema({
    locale,
    path: route,
    name: 'Travel Desk Genie All GDS Search Engine',
    description,
  }),
  url,
  '@id': `${url}#webpage`,
  mainEntity: { '@id': `${url}#search-tool` },
  about: [
    {
      '@type': 'Thing',
      name: 'Global Distribution System (GDS) commands',
    },
    {
      '@type': 'Thing',
      name: 'Amadeus, Sabre and Travelport/Galileo command comparison',
    },
  ],
};

  const graph = [
    page,

    breadcrumbs(
      [
        ['Home', '/'],
        ['All GDS Search Engine', route],
      ],
      locale
    ),

    {
      '@type': 'WebApplication',
      '@id': `${url}#search-tool`,
      name: 'Travel Desk Genie All GDS Search Engine',
      url,
      description:
        'Browser-based reference search for comparing stored Amadeus, Travelport/Galileo and Sabre commands. Does not execute live GDS transactions.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any operating system with a modern web browser',
      isAccessibleForFree: true,
      inLanguage: 'en',
      publisher: { '@id': absolute('/#organization') },
      isPartOf: { '@id': `${url}#webpage` },
    },

    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: 'en',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ];

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');

  return (
    <>
      <GdsSearch />

      <GdsSeoContent locale={locale} />

      {/* Related GDS guides — contextual internal links */}
      <section
        aria-labelledby="related-gds-guides-title"
        style={{
          padding: '44px 20px 64px',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
          }}
        >
          <p className="eyebrow">
            GDS learning resources
          </p>

          <h2
            id="related-gds-guides-title"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              lineHeight: 1.2,
              margin: '0 0 14px',
            }}
          >
            Learn GDS Commands: Step-by-Step Guides
          </h2>

          <p
            style={{
              maxWidth: '780px',
              lineHeight: 1.8,
              margin: '0 0 28px',
            }}
          >
            Explore practical guides for Amadeus, Travelport/Galileo
            and Sabre. Learn how to prepare passenger passport DOCS,
            CTCM and CTCE contact entries, enter adult, child and
            infant names, and use common reservation and pricing
            commands. These guides complement the GDS Search Engine
            with explanations, examples and workflow checks.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
              gap: '18px',
            }}
          >
            {relatedGuides.map((guide) => (
              <article
                key={guide.slug}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <p
                  className="eyebrow"
                  style={{
                    margin: 0,
                    fontSize: '12px',
                  }}
                >
                  {guide.category}
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: '19px',
                    lineHeight: 1.4,
                  }}
                >
                  <Link
                    href={`/${locale}/resources/${guide.slug}`}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    {guide.title}
                  </Link>
                </h3>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.7,
                    flexGrow: 1,
                  }}
                >
                  {guide.description}
                </p>

                <Link
                  className="text-link"
                  href={`/${locale}/resources/${guide.slug}`}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Read the guide →
                </Link>
              </article>
            ))}
          </div>

          <p
            style={{
              margin: '24px 0 0',
              fontSize: '13px',
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            GDS commands and airline procedures can change.
            Always verify entries against your current GDS
            documentation and your agency's workflow.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    </>
  );
}
