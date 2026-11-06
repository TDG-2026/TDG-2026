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
          description: META.description,
          speakable: ['#brand-summary', '.answer-first']
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
            <a href="mailto:info@traveldeskgenie.com">
              info@traveldeskgenie.com
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