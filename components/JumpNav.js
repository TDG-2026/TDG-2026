
import {L} from '@/lib/i18n/client';
const links = [
  ['#passport', 'Passport & DOCS'],
  ['#ctcm', 'CTCM'],
  ['#ctce', 'CTCE'],
  ['#desk-tools', 'Desk tools'],
  ['#products', 'More Products'],
  ['#faq', 'FAQ'],
];

export default function JumpNav() {
  return (
    <L as="nav" className="jumpnav" aria-label="Jump to section">
      <L as="div" className="container jumpnav-inner">
        <L as="span" className="jumpnav-label">Jump to</L>
        {links.map(([href, label]) => <L as="a" key={href} href={href}>{label}</L>)}
      </L>
    </L>
  );
}