import {localizeMetadata} from '@/lib/i18n/metadata';
import {getTranslator} from '@/lib/i18n/catalog';
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

const META = pageMeta('Travel Agency Software & GDS Desk Tools | Travel Genie',
  'Magic Toolbar prepares DOCS, CTCM and CTCE entries for Amadeus, Travelport and Sabre, with F1–F12 shortcuts and desk tools for Windows. From $30/month.', '/');
export async function generateMetadata({params}) { const {locale} = await params; return localizeMetadata(META, locale); }

export default async function Home({params}) {
  const {locale} = await params;
  const t = await getTranslator(locale);
  return (
    <>
      <StructuredData data={[
        webPageSchema({locale, t, path: '/', name: META.title.absolute, description: META.description, speakable: ['#brand-summary', '.answer-first']}),
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
      <EcosystemIntro />
      <ProductCatalogue products={products} categories={categories} />
      <GetStarted />
      <Faq locale={locale} />
      <FinalCta />
    </>
  );
}