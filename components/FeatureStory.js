
import {L} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import Icon from './Icon';
import Reveal from './Reveal';
import { heroScreen } from '@/data/screens';

export default function FeatureStory() {
  return (
    <L as="section" className="section">
      <L as="div" className="container">
        <L as="div" id="passport" className="split">
          <Reveal>
            <L as="p" className="eyebrow">Passport details &amp; DOCS</L>
            <L as="h2" className="title">One passport. <L as="span" className="grad">Every entry you need.</L></L>
            <L as="p" className="lead">
              Paste or read the passport, and Magic Toolbar fills in the passenger fields and prepares the NAME, DOCS,
              CTCM and CTCE entries for Sabre, Travelport and Amadeus, all side by side.
            </L>
            <L as="ul" className="checklist">
              <L as="li"><Icon name="check" />Finds the machine-readable zone and verifies its check digits</L>
              <L as="li"><Icon name="check" />Checks passport expiry and shows whether it’s valid</L>
              <L as="li"><Icon name="check" />Works out passenger type and title from the date of birth</L>
              <L as="li"><Icon name="check" />Flags what needs a second look, such as a mobile number without a country code</L>
              <L as="li"><Icon name="check" />Copy a single entry, or save and COPY ALL</L>
            </L>
            <L as="p" className="note">
              <L as="strong">Know the limits:</L> image quality matters, and missing details stay blank until you confirm
              them. Check every generated entry before it goes into a booking.
            </L>
          </Reveal>

          <Reveal delay={120}>
            <figure className="zoom-crop">
              <Image
                src={heroScreen.src}
                alt="Close-up of the Travelport panel: parsed passenger fields with generated NAME, DOCS, CTCE and CTCM entries and copy buttons"
                fill sizes="(max-width: 1200px) 110vw, 860px"
              />
              <L as="figcaption" className="chip chip--info zoom-label">Close-up · Travelport panel</L>
            </figure>
          </Reveal>
        </L>

        <L as="div" className="duo">
          <Reveal id="ctcm" className="card feature-card">
            <L as="span" className="itile"><Icon name="phone" /></L>
            <L as="p" className="eyebrow">CTCM</L>
            <L as="h3" id="passenger-mobile-contact">Passenger mobile contact</L>
            <L as="p"><L as="strong">CTCM</L> carries the <L as="em">passenger&apos;s</L> mobile number, so the airline can reach the traveller about schedule changes and disruptions. Magic Toolbar prepares it for each GDS and warns when the country code is missing.</L>
            <L as="code" className="code">SI.P1/SSRCTCMTKHK1/923000000000</L>
          </Reveal>
          <Reveal id="ctce" className="card feature-card" delay={100}>
            <L as="span" className="itile"><Icon name="mail" /></L>
            <L as="p" className="eyebrow">CTCE</L>
            <L as="h3" id="passenger-email-contact">Passenger email contact</L>
            <L as="p"><L as="strong">CTCE</L> carries the <L as="em">passenger&apos;s</L> email address. Special characters are encoded the way GDS entries expect, for example <L as="code">@</L> written as <L as="code">//</L>.</L>
            <L as="code" className="code">SI.P1/SSRCTCETKHK1/AHMED.KHAN//EXAMPLE.COM</L>
          </Reveal>
        </L>
        <L as="p" className="fineprint center">
          Code examples use synthetic data. Always confirm formats against your GDS. Passenger contacts are different from agency contacts.
        </L>
      </L>
    </L>
  );
}