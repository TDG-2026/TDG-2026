
import {L} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import Icon from './Icon';
import { site, mascot } from '@/data/site';

export default function FinalCta() {
  const primary = site.downloadUrl
    ? { href: '/download', label: 'Download for Windows' }
    : { href: '#toolbar', label: 'Explore Magic Toolbar' };

  return (
    <L as="section" className="section">
      <L as="div" className="container">
        <L as="div" className="cta-band">
          <L as="div">
            <L as="p" className="eyebrow eyebrow--gold">Ready when you are</L>
            <L as="h2" className="title">Your travel desk, with a little <L as="span" className="grad grad--gold">genie magic.</L></L>
            <L as="p" className="lead">Passport details, passenger contacts and desk tools in one Windows workspace.</L>
            <L as="div" className="hero-actions">
              <L as="a" href={primary.href} className="btn btn--gold btn--lg">{primary.label}<Icon name="arrowRight" /></L>
              <L as="a" href="#products" className="btn btn--light btn--lg">Browse products</L>
            </L>
          </L>
          <L as="div" className="portal cta-portal" aria-hidden="true">
            <Image src={mascot.src} alt="" fill sizes="220px" className="portal-img" />
          </L>
        </L>
      </L>
    </L>
  );
}