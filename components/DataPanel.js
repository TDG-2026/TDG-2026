
import {L} from '@/lib/i18n/client';
import Icon from './Icon';
import Reveal from './Reveal';

const items = [
  {
    icon: 'lock',
    title: 'Stays on your PC',
    text: "Passport OCR and image editing run locally in documented releases. The website never asks you to upload passports.",
  },
  {
    icon: 'shield',
    title: 'Saved when you choose',
    text: "Family records you save are protected with Windows DPAPI for your Windows account. Use the module Export/Import to move them. Copying the raw file to another account won't work.",
  },
  {
    icon: 'globe',
    title: 'Uses an online service',
    text: "Travel Genie Translate sends the text you select to an online translation service (Google, as shown in the app).",
  },
];

export default function DataPanel() {
  return (
    <L as="section" className="section section--violet">
      <L as="div" className="container">
        <L as="div" className="section-head center">
          <L as="p" className="eyebrow">Your data, clearly explained</L>
          <L as="h2" className="title" id="know-where-passenger-data-goes">Know where passenger data goes</L>
        </L>
        <L as="div" className="trio">
          {items.map((it, i) => (
            <Reveal key={it.title} className="card" delay={i * 90}>
              <L as="span" className="itile"><Icon name={it.icon} /></L>
              <L as="h3">{it.title}</L>
              <L as="p">{it.text}</L>
            </Reveal>
          ))}
        </L>
        <L as="div" className="boundary">
          <Icon name="info" />
          <L as="p">
            <L as="strong">Magic Toolbar prepares entries; it isn&apos;t a GDS.</L> It doesn&apos;t search live fares, hold
            inventory or issue tickets, and it isn&apos;t affiliated with Amadeus, Sabre, Travelport or any airline.
          </L>
        </L>
      </L>
    </L>
  );
}