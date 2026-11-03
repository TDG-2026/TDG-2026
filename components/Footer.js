
import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import { site, mascot } from '@/data/site';
import { products, trademarkNote } from '@/data/products';

export default function Footer() {
  const named = products.filter((p) => p.status !== 'soon');
  const year = new Date().getFullYear();

  return (
    <L as="footer" className="site-footer">
      <L as="div" className="container footer-grid">
        <L as="div" className="footer-brand">
          <Link href="/" className="brand brand--light">
            <Image src={mascot.src} alt="" width={40} height={40} />
            <L as="span">Travel <L as="b">Genie</L></L>
          </Link>
          <L as="p">Passport details, passenger contacts and everyday travel desk tools in one Windows workspace.</L>
          {site.supportEmail && <L as="p"><L as="a" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</L></L>}
        </L>

        <L as="div">
          <L as="h2" id="magic-toolbar">Magic Toolbar</L>
          <L as="ul">
            <L as="li"><Link href="/#passport">Passport &amp; DOCS</Link></L>
            <L as="li"><Link href="/#ctcm">CTCM</Link></L>
            <L as="li"><Link href="/#ctce">CTCE</Link></L>
            <L as="li"><Link href="/#desk-tools">Desk tools</Link></L>
            <L as="li"><Link href="/#how-it-works">How it works</Link></L>
          </L>
        </L>

        <L as="div">
          <L as="h2" id="more-products">More Products</L>
          <L as="ul">
            {named.map((p) => <L as="li" key={p.id}><Link href={p.path || `/products/${p.slug}`}>{p.name}</Link></L>)}
          </L>
        </L>

        <L as="div">
          <L as="h2" id="help-and-resources">Help &amp; resources</L>
          <L as="ul">
            <L as="li"><Link href="/about">About Travel Genie</Link></L>
            <L as="li"><Link href="/#faq">FAQ</Link></L>
            <L as="li"><Link href="/#get-started">Getting started</Link></L>
            <L as="li"><Link href="/contact">Contact</Link></L>
            <L as="li"><Link href="/pricing">Pricing</Link></L>
            <L as="li"><Link href="/download">Download</Link></L>
            <L as="li"><Link href="/resources">Resources</Link></L><L as="li"><Link href="/support">Support</Link></L><L as="li"><Link href="/security-and-privacy">Security &amp; data</Link></L><L as="li"><Link href="/languages">Languages</Link></L><L as="li"><Link href="/guide">User Guide</Link></L>


          </L>
        </L>
        <L as="div"><L as="h2" id="legal">Legal</L><L as="ul">{Object.entries(site.legal).map(([key, href]) => <L as="li" key={key}><Link href={href}>{key[0].toUpperCase() + key.slice(1)}</Link></L>)}</L></L>
      </L>
      <L as="div" className="container footer-bottom">
        <L as="p">© {year} Travel Genie. All rights reserved.</L>
        <L as="p" className="tm">{trademarkNote}</L>
      </L>
    </L>
  );
}