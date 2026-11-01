
import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <L as="section" className="section notfound">
      <L as="div" className="container">
        <L as="p" className="eyebrow">404</L>
        <L as="h1" className="title">This page vanished in a puff of smoke.</L>
        <L as="p" className="lead">The link may be old or mistyped. Try the homepage or the product catalogue.</L>
        <L as="div" className="hero-actions">
          <Link href="/" className="btn btn--primary">Go to homepage</Link>
          <Link href="/#products" className="btn btn--ghost">Browse products</Link>
        </L>
      </L>
    </L>
  );
}