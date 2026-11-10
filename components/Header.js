'use client';

import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import { usePathname } from 'next/navigation';
import {Image} from '@/lib/i18n/client';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import LanguageSwitcher from './LanguageSwitcher';
import {splitPath} from '@/lib/i18n/config';
import { site, navLinks, mascot } from '@/data/site';

export default function Header() {
  const pathname = splitPath(usePathname()).path;
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cta = { href: site.storeUrl, label: 'Get it from Microsoft Store' };

  return (
    <L as="header" className="site-header">
      <L as="div" className="container header-inner">
        <Link href="/" className="brand" aria-label="Travel Genie home">
          <Image src={mascot.src} alt="" width={40} height={40} />
          <L as="span">Travel <L as="b">Genie</L></L>
        </Link>

        <L as="nav" className="nav" aria-label="Main">
          {navLinks.map((l) => <Link key={l.href} href={l.href} aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</Link>)}
        </L>

        <LanguageSwitcher/>
        <L as="a" href={cta.href} target="_blank" rel="noopener noreferrer"
          className="btn btn--primary btn--sm header-cta" data-conversion="header_store">
          {cta.label}
        </L>

        <L as="button"
          ref={btnRef} type="button" className="menu-btn"
          aria-expanded={open} aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
          <L as="span" className="sr-only">{open ? 'Close menu' : 'Open menu'}</L>
        </L>
      </L>

      {open && (
        <L as="div" id="mobile-menu" ref={panelRef} className="mobile-panel">
          <L as="nav" className="container" aria-label="Mobile">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <L as="a" href={cta.href} target="_blank" rel="noopener noreferrer"
              className="btn btn--primary" data-conversion="mobile_header_store"
              onClick={() => setOpen(false)}>
              {cta.label}
            </L>
          </L>
        </L>
      )}
    </L>
  );
}