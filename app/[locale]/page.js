
import {localizeMetadata} from '@/lib/i18n/metadata';
import {getTranslator} from '@/lib/i18n/catalog';
import {L, Link} from '@/lib/i18n/client';
import {pageMeta, webPageSchema, appSchema, faqSchema} from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Hero from '@/components/Hero';
import JumpNav from '@/components/JumpNav';
import AnswerHub from '@/components/AnswerHub';
import FeatureStory from '@/components/FeatureStory';
import WorkflowDemo from '@/components/WorkflowDemo';
import ToolbarCore from '@/components/ToolbarCore';
import ProductTour from '@/components/ProductTour';
import WorkflowStrip from '@/components/WorkflowStrip';
import DataPanel from '@/components/DataPanel';
import EcosystemIntro from '@/components/EcosystemIntro';
import ProductCatalogue from '@/components/ProductCatalogue';
import GetStarted from '@/components/GetStarted';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';
import {faqs} from '@/data/faqs';
import {answers} from '@/data/answers';
import {products, categories} from '@/data/products';
import {site} from '@/data/site';

const META = pageMeta(
  'Travel Agency Software & GDS Desk Tools | Travel Genie',
  'Magic Toolbar prepares DOCS, CTCM and CTCE entries for Amadeus, Travelport and Sabre, with F1–F12 shortcuts and desk tools for Windows. From $30/month.',
  '/'
);

export async function generateMetadata({params}) {
  const {locale} = await params;
  return localizeMetadata(META, locale);
}

export default async function Home({params}) {
  const {locale} = await params;
  const t = await getTranslator(locale);

  return (
    <>
      <StructuredData data={[
        webPageSchema({
          locale,
          t,
          path: '/',
          name: META.title.absolute,
          description: META.description
        }),
        appSchema(locale, t),
        faqSchema([...answers.map((a) => [a.q, a.a]), ...faqs], t),
      ]} />

      <Hero />
      <JumpNav />
      <AnswerHub locale={locale} />
      <FeatureStory />
      <WorkflowDemo />
      <ToolbarCore />
      <ProductTour />
      <WorkflowStrip />
      <DataPanel />

      {/* GDS SEARCH ENGINE — INTERNAL LINKING FEATURE */}
      <section
        className="section"
        id="gds-search-feature"
        aria-labelledby="gds-search-feature-title"
      >
        <div className="container">
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              padding: 'clamp(24px, 5vw, 48px)',
              background:
                'linear-gradient(135deg, #082e72 0%, #075fc4 55%, #087fbd 100%)',
              color: '#ffffff',
              boxShadow: '0 18px 45px rgba(7, 75, 150, 0.18)',
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '760px',
              }}
            >
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#c6eaff',
                }}
              >
                Free GDS Command Reference Tool
              </p>

              <h2
                id="gds-search-feature-title"
                style={{
                  margin: '0 0 16px',
                  color: '#ffffff',
                  fontSize: 'clamp(25px, 3.3vw, 38px)',
                  lineHeight: 1.2,
                  fontWeight: 850,
                }}
              >
                Travel Desk Genie All GDS Search Engine
              </h2>

              <p
                style={{
                  margin: '0 0 20px',
                  maxWidth: '680px',
                  color: '#e3f2ff',
                  fontSize: 'clamp(15px, 1.6vw, 17px)',
                  lineHeight: 1.8,
                }}
              >
                Search, compare and copy GDS command references for
                Amadeus, Travelport/Galileo and Sabre — all in one
                place. Explore reservation, ticketing, hotel,
                passport DOCS, CTCM and CTCE topics with an
                easy-to-use comparison search.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginBottom: '24px',
                }}
              >
                {[
                  'Amadeus Commands',
                  'Travelport / Galileo',
                  'Sabre Commands',
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: '8px 13px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255,255,255,0.32)',
                      background: 'rgba(255,255,255,0.10)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 650,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href="/gds-search-engine"
                aria-label="Open Travel Desk Genie All GDS Search Engine"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '48px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#084a99',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 22px rgba(0,0,0,0.14)',
                }}
              >
                Search &amp; Compare GDS Commands
                <span aria-hidden="true">↗</span>
              </Link>

              <p
                style={{
                  margin: '16px 0 0',
                  color: '#cce8ff',
                  fontSize: '12px',
                  lineHeight: 1.6,
                }}
              >
                Educational reference only. Verify commands
                against current GDS and airline documentation
                before use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <L
        as="section"
        className="section static-page"
        id="account-privacy"
        aria-labelledby="account-privacy-title"
      >
        <L as="div" className="container static-narrow">
          <L as="p" className="eyebrow">
            Your account and your information
          </L>

          <L as="h2" id="account-privacy-title">
            Google sign-in, privacy and support
          </L>

          <L as="p">
            Travel Genie Magic Toolbar is developed by Travel Desk Genie.
            Google sign-in identifies your customer account using your name,
            verified email address and Google account identifier. Machine
            activation, device approval and paid subscription access are
            managed separately. Signing in does not purchase or renew a
            subscription.
          </L>

          <L as="p">
            Read our{' '}
            <Link href="/security-and-privacy">
              Security &amp; Privacy notice
            </Link>{' '}
            for details about Google identity information, Cloudflare account
            and subscription records, local tools and privacy requests.
            See our{' '}
            <Link href="/terms">Terms of Service</Link>{' '}
            for service conditions.
          </L>

          <L as="p">
            For account, subscription or privacy assistance, email{' '}
            <a href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>.
          </L>
        </L>
      </L>

      <EcosystemIntro />
      <ProductCatalogue products={products} categories={categories} />
      <GetStarted />
      <Faq locale={locale} />
      <FinalCta />
    </>
  );
}
