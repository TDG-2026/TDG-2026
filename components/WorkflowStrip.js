
import {L} from '@/lib/i18n/client';
import Icon from './Icon';
import Reveal from './Reveal';

const steps = [
  { icon: 'passport', title: 'Review passport details', text: 'Read the passport through the supported desktop path, check the parsed fields and resolve any warnings.' },
  { icon: 'grid', title: 'Prepare DOCS & contacts', text: 'Choose the GDS and passenger, then prepare the DOCS, CTCM and CTCE entries.' },
  { icon: 'copy', title: 'Verify and copy', text: 'Check the generated entry, copy it into your GDS and move on to the next task.' },
];

export default function WorkflowStrip() {
  return (
    <L as="section" id="how-it-works" className="section section--soft">
      <L as="div" className="container">
        <L as="div" className="section-head center">
          <L as="p" className="eyebrow">How it works</L>
          <L as="h2" className="title">Three steps from passport to <L as="span" className="grad">GDS entry</L></L>
        </L>
        <L as="ol" className="steps">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="step" delay={i * 90}>
              <L as="span" className="step-num">{i + 1}</L>
              <L as="span" className="itile"><Icon name={s.icon} /></L>
              <L as="h3">{s.title}</L>
              <L as="p">{s.text}</L>
            </Reveal>
          ))}
        </L>
      </L>
    </L>
  );
}