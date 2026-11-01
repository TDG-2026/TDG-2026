import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {pageMeta} from '@/lib/seo';
import {Link} from '@/lib/i18n/client';
import { site } from '@/data/site';

const sourceMetadata=pageMeta('Magic Toolbar Pricing | Travel Genie','Compare Magic Toolbar plans: $30 monthly, $220 yearly or lifetime access by enquiry. USD pricing, a 3-day trial and team-assisted activation.','/pricing');

export default function PricingPage() {
  const emailSubject = encodeURIComponent('Travel Genie Lifetime Pricing');
  const emailBody = encodeURIComponent('Hello Travel Genie,\n\nI would like to ask about lifetime pricing for Magic Toolbar.\n');
  return (
    <L as="section" className="section static-page pricing-page">
      <L as="div" className="container">
        <L as="div" className="section-head center">
          <L as="p" className="eyebrow">Simple, transparent pricing</L>
          <L as="h1" className="title">Choose the plan that <L as="span" className="grad">works for you</L></L>
          <L as="p" className="lead">Your travel desk is waiting for a little genie magic. All prices are in US dollars (USD).</L>
        </L>
        <L as="div" className="pricing-grid">
          <L as="article" className="price-card">
            <L as="p" className="eyebrow">Flexible</L><L as="h2" id="monthly">Monthly</L>
            <L as="p" className="price"><L as="span">$30</L> <L as="small">/ month</L></L>
            <L as="p">Pay month by month.</L>
            <Link className="btn btn--ghost btn--block" href="/contact?plan=monthly">Ask about this plan</Link>
          </L>
          <L as="article" className="price-card price-card--featured">
            <L as="span" className="price-badge">Save $140 per year</L>
            <L as="p" className="eyebrow">Best annual value</L><L as="h2" id="yearly">Yearly</L>
            <L as="p" className="price"><L as="span">$220</L> <L as="small">/ year</L></L>
            <L as="p" className="old-price">Regular yearly price: <s>$360</s></L>
            <L as="p">Pay annually and save compared with twelve monthly payments.</L>
            <Link className="btn btn--primary btn--block" href="/contact?plan=yearly">Ask about this plan</Link>
          </L>
          <L as="article" className="price-card">
            <L as="p" className="eyebrow">One-time arrangement</L><L as="h2" id="lifetime">Lifetime</L>
            <L as="p" className="price price-contact"><L as="span">Contact for pricing</L></L>
            <L as="p">Contact us to discuss lifetime pricing and availability.</L>
            <L as="div" className="price-contact-actions">
              <L as="a" className="btn btn--primary btn--block" href={`mailto:${site.supportEmail}?subject=${emailSubject}&body=${emailBody}`}>Email for pricing</L>
              <L as="a" className="btn btn--ghost btn--block" href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp us</L>
            </L>
          </L>
        </L>
        <L as="p" className="fineprint center">Questions about plans? <Link className="text-link" href="/contact">Contact Travel Genie</Link>. Start with the 3-day trial from our download page. Activation is arranged through our team; this website does not process payments.</L>
      </L>
    </L>
  );
}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
