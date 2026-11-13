
import {localizeMetadata} from '@/lib/i18n/metadata';
import {L, Link} from '@/lib/i18n/client';
import {resources, UNVERIFIED_RESOURCE_SLUGS} from '@/data/resources';
import JsonLd from '@/components/JsonLd';
import {pageMeta, breadcrumbs} from '@/lib/seo';

const sourceMetadata = pageMeta(
  'Travel Desk Guides | Travel Genie Resources',
  'Practical guides to passport entries, DOCS, CTCM, CTCE, visa photo preparation and Windows productivity for travel agents.',
  '/resources'
);

export async function generateMetadata({params}) {
  const {locale} = await params;
  return localizeMetadata(sourceMetadata, locale);
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          ['Home', '/'],
          ['Resources', '/resources'],
        ])}
      />

      <L as="section" className="section static-page">
        <L as="div" className="container">

          <L as="p" className="eyebrow">
            The travel desk library
          </L>

          <L as="h1" className="title">
            Clear answers.
            <br />
            <L as="span" className="grad">
              Useful at your desk.
            </L>
          </L>

          <L as="p" className="lead">
            Understand the task, check the details and find your next
            step. These guides explain the supplied workflows and
            their limits, without asking for passenger documents.
          </L>

          {/* GDS SEARCH ENGINE — FEATURED INTERNAL LINK */}
          <L
            as="section"
            aria-labelledby="resources-gds-search-title"
            style={{
              margin: '30px 0 36px',
              padding: 'clamp(22px, 4vw, 36px)',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg, #082e72 0%, #075fc4 58%, #087fbd 100%)',
              color: '#ffffff',
              boxShadow: '0 14px 35px rgba(7, 75, 150, 0.16)',
            }}
          >
            <L
              as="p"
              style={{
                margin: '0 0 10px',
                color: '#cceaff',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
              }}
            >
              Featured Free GDS Reference Tool
            </L>

            <L
              as="h2"
              id="resources-gds-search-title"
              style={{
                margin: '0 0 14px',
                color: '#ffffff',
                fontSize: 'clamp(23px, 3vw, 32px)',
                lineHeight: 1.25,
              }}
            >
              Travel Desk Genie All GDS Search Engine
            </L>

            <L
              as="p"
              style={{
                margin: '0 0 20px',
                maxWidth: '760px',
                color: '#e3f2ff',
                fontSize: '15px',
                lineHeight: 1.8,
              }}
            >
              Search, compare and copy GDS command references for
              Amadeus, Travelport/Galileo and Sabre in one place.
              Explore reservation, ticketing, hotel, passport DOCS,
              CTCM and CTCE topics with side-by-side comparisons.
            </L>

            <Link
              href="/gds-search-engine"
              aria-label="Explore the Travel Desk Genie All GDS Search Engine"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                minHeight: '46px',
                padding: '11px 20px',
                borderRadius: '11px',
                background: '#ffffff',
                color: '#084a99',
                fontSize: '14px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 7px 18px rgba(0,0,0,0.12)',
              }}
            >
              Search &amp; Compare GDS Commands
              <span aria-hidden="true">↗</span>
            </Link>

            <L
              as="p"
              style={{
                margin: '15px 0 0',
                color: '#cce8ff',
                fontSize: '12px',
                lineHeight: 1.6,
              }}
            >
              Educational reference only. Verify command formats
              against current GDS and airline documentation.
            </L>
          </L>

          {/* EXISTING RESOURCE GUIDES — UNCHANGED */}
          <L as="div" className="resource-grid">
            {resources.map((r) => (
              <L
                as="article"
                className="card upgrade-card"
                key={r.slug}
              >
                <L as="p" className="eyebrow">
                  {r.category}
                  {UNVERIFIED_RESOURCE_SLUGS.has(r.slug)
                    ? ' · Pre-release guide'
                    : ''}
                </L>

                <L as="h2" id={r.slug}>
                  <Link href={'/resources/' + r.slug}>
                    {r.title}
                  </Link>
                </L>

                <L as="p">
                  {r.description}
                </L>

                <Link
                  className="text-link"
                  href={'/resources/' + r.slug}
                >
                  Read the guide →
                </Link>
              </L>
            ))}
          </L>

        </L>
      </L>
    </>
  );
}
