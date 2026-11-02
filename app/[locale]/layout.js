import '../globals.css';
import {locales, localeInfo} from '@/lib/i18n/config';
import {getCatalog, getClientDictionary} from '@/lib/i18n/catalog';
import {LocaleProvider, L} from '@/lib/i18n/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageNotice from '@/components/LanguageNotice';
import LanguageSuggest from '@/components/LanguageSuggest';
import CookieConsent from '@/components/CookieConsent';
import ChatLauncher from '@/components/ChatLauncher';
import SiteTools from '@/components/SiteTools';
import StructuredData from '@/components/StructuredData';
import {site} from '@/data/site';
import {organizationSchema, websiteSchema} from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() { return locales.map(({code}) => ({locale: code})); }
export const viewport = {width: 'device-width', initialScale: 1,
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#ffffff'}, {media: '(prefers-color-scheme: dark)', color: '#0a1028'}]};
export async function generateMetadata() {
  return {metadataBase: new URL(site.url), applicationName: site.name, authors: [{name: site.name, url: site.url}],
    creator: site.name, publisher: site.name, category: 'technology', formatDetection: {telephone: false, email: false, address: false}};
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  const info = localeInfo(locale);
  const [catalog, dict] = await Promise.all([getCatalog(info.code), getClientDictionary(info.code)]);
  return (
    <html lang={info.code} dir={info.dir} data-scroll-behavior="smooth">
      <body>
        <LocaleProvider locale={info.code} dict={dict} complete={catalog.complete} published={catalog.published} machine={catalog.machine}>
          <StructuredData data={[organizationSchema(), websiteSchema(info.code)]} />
          <L as="a" className="skip-link" href="#main">Skip to content</L>
          <Header />
          <LanguageNotice />
          <LanguageSuggest />
          <main id="main">{children}</main>
          <Footer />
          <CookieConsent />
          <ChatLauncher />
          <SiteTools />
        </LocaleProvider>
      </body>
    </html>
  );
}