
import {localizeMetadata} from '@/lib/i18n/metadata';
import {L, Link, Image} from '@/lib/i18n/client';
import JsonLd from '@/components/JsonLd';
import ToolbarCore from '@/components/ToolbarCore';
import WorkflowDemo from '@/components/WorkflowDemo';
import ProductTour from '@/components/ProductTour';
import FeatureStory from '@/components/FeatureStory';
import Faq from '@/components/Faq';
import {appSchema, breadcrumbs, pageMeta} from '@/lib/seo';
import {site} from '@/data/site';

const sourceMetadata = pageMeta(
  'Magic Toolbar | Travel Agent Productivity Software',
  'Prepare DOCS, CTCM and CTCE entries for supported GDS formats. Explore twelve Windows travel desk tools, setup guidance and pricing.',
  '/products/magic-toolbar'
);

export async function generateMetadata({params}) {
  const {locale} = await params;
  return localizeMetadata(sourceMetadata, locale);
}

export default async function Page({params}) {
  const {locale} = await params;

  return (
    <>
      <JsonLd data={appSchema(locale)} />

      <JsonLd
        data={breadcrumbs(
          [
            ['Home', '/'],
            ['Products', '/products'],
            ['Magic Toolbar', '/products/magic-toolbar'],
          ],
          locale
        )}
      />

      <L as="section" className="section static-page">
        <L as="div" className="container">

          <L as="nav" className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {' / '}
            <Link href="/products">Products</Link>
            {' / '}
            <L as="span" aria-current="page">
              Magic Toolbar
            </L>
          </L>

          <L as="div" className="upgrade-split">

            <L as="div">
              <L as="p" className="eyebrow">
                Windows productivity for travel agents
              </L>

              <L as="h1" className="title">
                Travel Genie
                <br />
                <L as="span" className="grad">
                  Magic Toolbar
                </L>
              </L>

              <L as="p" className="lead">
                Magic Toolbar is a Windows workspace for travel desks.
                It helps prepare passenger passport and contact entries
                in Amadeus, Travelport and Sabre formats, alongside
                shortcuts, reminders, photo tools and a directory.
                You review every field and copy the result into your
                own GDS.
              </L>

              <L as="div" className="page-cta">
                <L
                  as="a"
                  className="btn btn--primary"
                  href={site.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-conversion="product_store"
                >
                  Get it from Microsoft Store
                </L>

                <Link className="btn btn--ghost" href="/guide">
                  Installation guide
                </Link>
              </L>

              <L as="p" className="fineprint">
                Windows 11, 64-bit · 3-day trial · $30/month or $220/year
              </L>
            </L>

            <figure className="card product-proof">
              <Image
                src="/images/screens/passport-gds.webp"
                alt="Magic Toolbar passport details and prepared entries in three GDS formats"
                width={1892}
                height={930}
                sizes="(max-width:760px) 100vw, 50vw"
                priority
              />

              <L as="figcaption">
                Actual application screen. Review the fields before
                using generated entries.
              </L>
            </figure>

          </L>

          <L as="div" className="answer-table">
            <L as="table">
              <L as="caption">
                What Magic Toolbar does — and where you stay in control
              </L>

              <L as="thead">
                <L as="tr">
                  <L as="th" scope="col">Task</L>
                  <L as="th" scope="col">Toolbar support</L>
                  <L as="th" scope="col">Your next step</L>
                </L>
              </L>

              <L as="tbody">
                <L as="tr">
                  <L as="th" scope="row">Passport details</L>
                  <L as="td">Prepare DOCS and passenger name fields</L>
                  <L as="td">
                    Review passport, dates and passenger association
                  </L>
                </L>

                <L as="tr">
                  <L as="th" scope="row">Passenger contacts</L>
                  <L as="td">Prepare CTCM and CTCE formats</L>
                  <L as="td">
                    Confirm passenger mobile, country code and email
                  </L>
                </L>

                <L as="tr">
                  <L as="th" scope="row">GDS work</L>
                  <L as="td">Copy reviewed text</L>
                  <L as="td">
                    Use your own GDS session and verify the response
                  </L>
                </L>

                <L as="tr">
                  <L as="th" scope="row">Visa photographs</L>
                  <L as="td">
                    Frame, straighten and check configured dimensions
                  </L>
                  <L as="td">
                    Confirm the destination's current official specification
                  </L>
                </L>
              </L>
            </L>

            <L as="p">
              Magic Toolbar does not issue tickets, hold inventory or
              guarantee document acceptance. Separate specialist
              applications are not included.{' '}
              <Link href="/security-and-privacy">
                Read about data handling
              </Link>.
            </L>
          </L>

          {/* GDS SEARCH ENGINE — CONTEXTUAL INTERNAL LINK */}
          <L
            as="section"
            aria-labelledby="magic-toolbar-gds-search"
            style={{
              margin: '38px 0 12px',
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
              Free GDS Command Reference Tool
            </L>

            <L
              as="h2"
              id="magic-toolbar-gds-search"
              style={{
                margin: '0 0 14px',
                color: '#ffffff',
                fontSize: 'clamp(23px, 3vw, 32px)',
                lineHeight: 1.25,
              }}
            >
              Search &amp; Compare Amadeus, Galileo and Sabre Commands
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
              Need a GDS command reference while working with
              Magic Toolbar? Use the Travel Desk Genie All GDS
              Search Engine to discover and compare available
              Amadeus, Travelport/Galileo and Sabre commands
              for reservation, ticketing, hotel, passport DOCS,
              CTCM and CTCE tasks.
            </L>

            <Link
              href="/gds-search-engine"
              aria-label="Open the Travel Desk Genie All GDS Search Engine"
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
              Explore All GDS Commands
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
              The GDS Search Engine is a separate browser-based
              reference tool. It does not connect to a live GDS
              or execute booking and ticketing transactions.
            </L>
          </L>

        </L>
      </L>

      <ToolbarCore />
      <FeatureStory />
      <WorkflowDemo />
      <ProductTour />
      <Faq />
    </>
  );
}
