import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import {breadcrumbs} from '@/lib/seo';
import Icon from '@/components/Icon';
import StatusBadge from '@/components/StatusBadge';
import { products, findProduct, trademarkNote } from '@/data/products';
import { site } from '@/data/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.filter((p) => p.status !== 'soon' && !p.path).map((p) => ({ slug: p.slug }));
}

async function generateSourceMetadata({ params }) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/products/${p.slug}` },
    robots: p.published ? undefined : { index: false, follow: true },
    openGraph: { title: p.name, description: p.summary, url: `/products/${p.slug}` },
  };
}

function Pending({ items, intro }) {
  return (
    <L as="div" className="pending-box">
      <L as="p">{intro}</L>
      <L as="ul">
        {items.map((item) => (
          <L as="li" key={item}><L as="span" className="pending">Being confirmed</L>{item}</L>
        ))}
      </L>
    </L>
  );
}

const Value = ({ children }) => children ?? <L as="span" className="pending">To be confirmed</L>;

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.status !== 'soon' && !p.path)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  const action = product.downloadUrl
    ? { href: product.downloadUrl, label: 'Download', icon: 'download' }
    : site.contactUrl
      ? { href: site.contactUrl, label: 'Contact Travel Genie', icon: 'chat' }
      : null;

  return (
    <>
      <JsonLd data={breadcrumbs([['Home','/'],['Products','/products'],[product.name,product.path || `/products/${product.slug}`]])}/>
      <L as="section" className="detail-hero">
        <L as="div" className="container">
          <L as="nav" aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/">Home</Link><L as="span" aria-hidden="true">/</L>
            <Link href="/#products">More Products</Link><L as="span" aria-hidden="true">/</L>
            <L as="span" aria-current="page">{product.name}</L>
          </L>
          <L as="div" className="detail-head">
            <L as="span" className={`ptile ptile--lg tone-${product.tone}`} aria-hidden="true">{product.tile}</L>
            <L as="div">
              <L as="p" className="eyebrow">{product.category}</L>
              <L as="h1">{product.name}</L>
              <L as="p" className="by">by Travel Genie · Separate application</L>
            </L>
          </L>
          <L as="p" className="lead">{product.summary}</L>
        </L>
      </L>

      <L as="section" className="section section--tight">
        <L as="div" className="container detail-grid">
          <L as="div" className="detail-main">
            <L as="article" className="dblock">
              <L as="h2" id="the-problem-it-solves">The problem it solves</L>
              <L as="p">{product.problem}</L>
            </L>

            {product.workflow && (
              <L as="article" className="dblock">
                <L as="h2" id="how-it-works">How it works</L>
                <L as="ol" className="flow">
                  <L as="li"><L as="span">Input</L><L as="strong">{product.workflow.input}</L></L>
                  <L as="li"><L as="span">Action</L><L as="strong">{product.workflow.action}</L></L>
                  <L as="li"><L as="span">Output</L><L as="strong">{product.workflow.output}</L></L>
                </L>
              </L>
            )}

            <L as="article" className="dblock">
              <L as="h2" id="capabilities">Capabilities</L>
              {product.features.length ? (
                <L as="ul" className="checklist">
                  {product.features.map((f) => <L as="li" key={f}><Icon name="check" />{f}</L>)}
                </L>
              ) : (
                <Pending intro="Detailed capabilities are published only after they are verified in a release. Currently being confirmed:" items={product.pending} />
              )}
            </L>

            <L as="article" className="dblock">
              <L as="h2" id="screenshots">Screenshots</L>
              {product.screenshots.length ? (
                <L as="div" className="gallery">
                  {product.screenshots.map((s) => (
                    <figure key={s.src}>
                      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 960px) 100vw, 760px" />
                      {s.caption && <L as="figcaption">{s.caption}</L>}
                    </figure>
                  ))}
                </L>
              ) : (
                <L as="div" className="shot-frame"><Icon name="camera" size={28} /><L as="p">Verified screenshots will appear here with the first public release.</L></L>
              )}
            </L>

            <L as="article" className="dblock">
              <L as="h2" id="requirements-and-limitations">Requirements &amp; limitations</L>
              {product.requirements.length || product.limitations.length ? (
                <L as="div" className="two-col">
                  <L as="div"><L as="h3" id="requirements">Requirements</L><L as="ul">{product.requirements.map((r) => <L as="li" key={r}>{r}</L>)}</L></L>
                  <L as="div"><L as="h3" id="known-limitations">Known limitations</L><L as="ul">{product.limitations.map((l) => <L as="li" key={l}>{l}</L>)}</L></L>
                </L>
              ) : (
                <L as="p">Supported versions, requirements and known limitations will be listed with the release.</L>
              )}
            </L>

            <L as="article" className="dblock">
              <L as="h2" id="your-data">Your data</L>
              <L as="p">{product.privacy || 'A data-flow explanation specific to this application (what stays on your PC, what is saved and what, if anything, uses an online service) will be published before release.'}</L>
            </L>

            <L as="p" className="tm-note">{trademarkNote}</L>
          </L>

          <L as="aside" className="detail-aside">
            <L as="div" className="panel info-panel">
              <L as="h2" className="h-sm" id="product-information">Product information</L>
              <dl className="info-list">
                <L as="div"><L as="dt">Status</L><L as="dd"><StatusBadge status={product.status} /></L></L>
                <L as="div"><L as="dt">Version</L><L as="dd"><Value>{product.releaseVersion}</Value></L></L>
                <L as="div"><L as="dt">Platform</L><L as="dd"><Value>{product.platform}</Value></L></L>
                <L as="div"><L as="dt">Category</L><L as="dd">{product.category}</L></L>
                <L as="div"><L as="dt">Licence</L><L as="dd">Separate from Magic Toolbar</L></L>
                <L as="div"><L as="dt">Last reviewed</L><L as="dd"><Value>{product.lastReviewed}</Value></L></L>
              </dl>
              {action ? (
                <L as="a" href={action.href} className="btn btn--primary btn--block"><Icon name={action.icon} />{action.label}</L>
              ) : (
                <Link href="/#products" className="btn btn--ghost btn--block">Browse all products</Link>
              )}
            </L>

            {related.length > 0 && (
              <L as="div" className="panel related">
                <L as="h2" className="h-sm" id="related-products">Related products</L>
                <L as="ul">
                  {related.map((r) => (
                    <L as="li" key={r.id}>
                      <Link href={r.path || `/products/${r.slug}`}>
                        <L as="span" className={`ptile ptile--sm tone-${r.tone}`} aria-hidden="true">{r.tile}</L>
                        <L as="span">{r.name}</L>
                      </Link>
                    </L>
                  ))}
                </L>
              </L>
            )}
          </L>
        </L>
      </L>
    </>
  );
}
export async function generateMetadata(props){const {locale}=await props.params;return localizeMetadata(await generateSourceMetadata(props),locale);}
