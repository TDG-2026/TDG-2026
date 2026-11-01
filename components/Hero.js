'use client';
import {L, useI18n, Image} from '@/lib/i18n/client';
import Icon from './Icon';
import {site, mascot} from '@/data/site';
import {heroScreen, heroCallouts} from '@/data/screens';

export default function Hero() {
  const {t: tr} = useI18n();
  const primary = site.downloadUrl
    ? {href: '/download', label: tr('Download for Windows') + (site.releaseVersion ? ' · v' + site.releaseVersion : ''), icon: 'download'}
    : {href: '#toolbar', label: 'Explore Magic Toolbar', icon: 'arrowRight'};
  return (
    <L as="section" className="hero" aria-labelledby="hero-title">
      <L as="div" className="container hero-grid">
        <L as="div" className="hero-copy">
          <L as="span" className="eyebrow">Travel agency software for Windows</L>
          <L as="h1" id="hero-title">Travel agency software for <L as="span" className="grad">faster GDS desk work.</L></L>
          <L as="p" className="lead" id="brand-summary">Magic Toolbar is Windows software for travel agents. Paste a passport and it makes NAME, DOCS, CTCM and CTCE entries for Amadeus, Travelport and Sabre. It also adds shortcuts, reminders and a translator. You check each entry, then copy it into your GDS.</L>
          <L as="div" className="hero-slogan">Magic Toolbar. <L as="span" className="grad">Your travel desk, reimagined.</L></L>
          <L as="div" className="hero-actions">
            <L as="a" href={primary.href} className="btn btn--primary btn--lg" data-conversion="hero_primary">{primary.label}<Icon name={primary.icon} /></L>
            <L as="a" href="#desk-tools" className="btn btn--ghost btn--lg">Take the tour</L>
          </L>
          <L as="ul" className="hero-meta">
            <L as="li"><Icon name="check" size={16} />You review every entry</L>
            <L as="li"><Icon name="lock" size={16} />Passport OCR runs on your PC</L>
            <L as="li"><Icon name="grid" size={16} />Amadeus, Travelport &amp; Sabre formats</L>
          </L>
        </L>
        <L as="div" className="hero-stage">
          <L as="div" className="hero-halo" aria-hidden="true" />
          <L as="div" className="hero-ring" aria-hidden="true" />
          <L as="div" className="portal hero-portal">
            <Image src={mascot.src} alt={mascot.alt} fill priority fetchPriority="high" sizes="(max-width: 960px) 70vw, 420px" className="portal-img" />
          </L>
        </L>
      </L>
      <L as="div" className="container">
        <L as="div" className="showcase">
          <figure className="showcase-frame">
            <Image src={heroScreen.src} alt={heroScreen.alt} width={heroScreen.width} height={heroScreen.height} sizes="(max-width: 1280px) 100vw, 1240px" />
          </figure>
          <L as="ul" className="callouts">
            {heroCallouts.map((c) => <L as="li" key={c.text} className={`callout c-${c.pos}`}><Icon name={c.icon} size={16} />{c.text}</L>)}
          </L>
        </L>
        <L as="div" className="showcase-caption">A real Travel Genie screen: one passport, three GDS formats.{' '}
          <L as="a" href={heroScreen.src} target="_blank" rel="noopener noreferrer">View full size ↗</L></L>
      </L>
    </L>
  );
}