import {localizeMetadata} from '@/lib/i18n/metadata';
import {L, Link} from '@/lib/i18n/client';
import {pageMeta} from '@/lib/seo';
import {site} from '@/data/site';

const sourceMetadata = pageMeta(
  'Get Travel Genie Magic Toolbar from Microsoft Store | Travel Genie',
  'Find Travel Genie Magic Toolbar in the official Microsoft Store. Review Windows requirements, choose Get or Install in Microsoft Store, and contact support if you need help.',
  '/download'
);

export default function DownloadPage() {
  return (
    <L as="section" className="section static-page">
      <L as="div" className="container">
        <L as="div" className="section-head">
          <L as="p" className="eyebrow">Official Microsoft Store listing</L>
          <L as="h1" className="title">
            Get Travel Genie Magic Toolbar
          </L>
          <L as="p" className="lead">
            Install Travel Genie Magic Toolbar through Microsoft's official
            Store experience. Microsoft Store handles availability, download
            and installation on your Windows device.
          </L>
        </L>

        <L as="div" className="upgrade-split">
          <L as="article" className="card upgrade-card">
            <L as="span" className="chip">Windows · Microsoft Store</L>
            <L as="h2">One trusted place to get the app.</L>
            <L as="p">
              Magic Toolbar helps travel agents prepare passenger passport and
              contact entries for Amadeus, Travelport and Sabre, alongside
              everyday desk tools. Review every generated entry before using it.
            </L>
            <L
              as="a"
              href={site.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
              data-conversion="download_store"
            >
              Get it from Microsoft Store ↗
            </L>
            <L as="p" className="fineprint">
              The Store listing opens in a new tab. Select Get or Install in
              Microsoft Store and follow Microsoft's prompts. Installation
              requires your confirmation; this website cannot install the app
              silently.
            </L>
            <L as="p">
              Need help with installation? <Link href="/support">Visit support</Link>
              {' '}or <Link href="/contact">contact our team</Link>.
            </L>
          </L>

          <L as="aside" className="card upgrade-card">
            <L as="p" className="eyebrow">Before you install</L>
            <L as="h2">A quick setup checklist</L>
            <L as="ul">
              <L as="li">A compatible Windows device.</L>
              <L as="li">A Microsoft account if Microsoft Store requests one.</L>
              <L as="li">Permission to install apps on your device.</L>
              <L as="li">Review generated passenger details before use.</L>
            </L>
            <L as="p" className="fineprint">
              Store availability and installation options are determined by
              Microsoft and may vary by device, region and account.
            </L>
            <L as="p">
              <L as="strong">Microsoft Store publisher:</L> {site.storePublisherDisplayName}
            </L>
            <L as="p">
              <L as="strong">Store product ID:</L> {site.storeProductId}
            </L>
          </L>
        </L>
      </L>
    </L>
  );
}

export async function generateMetadata({params}) {
  const {locale} = await params;
  return localizeMetadata(sourceMetadata, locale);
}
