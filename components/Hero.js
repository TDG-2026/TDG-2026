'use client';

import { Image, L, useI18n } from '@/lib/i18n/client';
import { heroCallouts, heroScreen } from '@/data/screens';
import { mascot, site } from '@/data/site';
import Icon from './Icon';

export default function Hero() {
  const { t: tr } = useI18n();

  const primary = {
    href: site.storeUrl,
    label: tr('Get it from Microsoft Store'),
    icon: 'download',
  };

  return (
    <L as="section" className="hero" aria-labelledby="hero-title">
      <L as="div" className="container hero-grid">
        <L as="div" className="hero-copy">
          <L as="span" className="eyebrow">Magic Toolbar for Windows</L>

          <L as="h1" id="hero-title">
            Travel agency software for{' '}
            <L as="span" className="grad">faster GDS desk work.</L>
          </L>

          <L as="p" className="lead" id="brand-summary">
            Magic Toolbar turns passport details into NAME, DOCS, CTCM and CTCE
            entries for Amadeus, Travelport and Sabre. Review each entry before
            copying it into your GDS.
          </L>

          <L as="p" className="hero-slogan">
            Time is money.{' '}
            <L as="span" className="grad">Travel Desk Genie saves both.</L>
          </L>

          <L as="div" className="hero-actions">
            <L
              as="a"
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
              data-conversion="hero_primary"
            >
              {primary.label}
              <Icon name={primary.icon} />
            </L>
            <L as="a" href="#desk-tools" className="btn btn--ghost btn--lg">
              Take the tour
            </L>
          </L>

          <L as="ul" className="hero-meta">
            <L as="li"><Icon name="check" size={16} />You review every entry</L>
            <L as="li"><Icon name="lock" size={16} />Passport OCR runs on your PC</L>
            <L as="li"><Icon name="grid" size={16} />Shortcuts, reminders and translation</L>
          </L>
        </L>

        <L as="div" className="hero-stage">
          <L as="div" className="hero-halo" aria-hidden="true" />
          <L as="div" className="hero-ring" aria-hidden="true" />

          <L as="div" className="portal hero-portal">
            <Image
              src={mascot.src}
              alt={mascot.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 460px) calc((100vw - 40px) * 0.82), 345px"
              className="portal-img"
            />
          </L>
        </L>
      </L>

      <L as="div" className="container">
        <L as="div" className="showcase">
          <figure className="showcase-frame">
            <Image
              src={heroScreen.src}
              alt={heroScreen.alt}
              width={heroScreen.width}
              height={heroScreen.height}
              sizes="(max-width: 1280px) calc(100vw - 40px), 1240px"
            />
          </figure>

          <L as="ul" className="callouts">
            {heroCallouts.map((callout) => (
              <L
                as="li"
                key={callout.text}
                className={`callout c-${callout.pos}`}
              >
                <Icon name={callout.icon} size={16} />
                {callout.text}
              </L>
            ))}
          </L>
        </L>

        <L as="div" className="showcase-caption">
          Magic Toolbar in action. One passport, three GDS formats.{' '}
          <L
            as="a"
            href={heroScreen.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            View full size ↗
          </L>
        </L>
      </L>
    </L>
  );
}