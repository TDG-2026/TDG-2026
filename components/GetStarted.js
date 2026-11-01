
import {L} from '@/lib/i18n/client';
import Icon from './Icon';
import Reveal from './Reveal';
import { site } from '@/data/site';
import {Link} from '@/lib/i18n/client';

const steps = [
  { title: 'Get the official release', text: 'Download the Windows installer and follow the User Guide to start your 3-day trial.' },
  { title: 'Activate your PC', text: 'Each computer is activated on your subscription. Activation steps are explained with the release.' },
  { title: 'Review, copy, continue', text: 'Open the toolbar, review passenger details and copy prepared entries into your GDS.' },
];

export default function GetStarted() {
  return (
    <L as="section" id="get-started" className="section">
      <L as="div" className="container">
        <L as="div" className="section-head center">
          <L as="p" className="eyebrow">Getting started</L>
          <L as="h2" className="title">Up and running <L as="span" className="grad">in three steps</L></L>
        </L>
        <L as="ol" className="steps steps--plain">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="step" delay={i * 90}>
              <L as="span" className="step-num">{i + 1}</L>
              <L as="h3">{s.title}</L>
              <L as="p">{s.text}</L>
            </Reveal>
          ))}
        </L>

        <L as="div" className="duo">
          <L as="div" className="card">
            <L as="span" className="itile"><Icon name="grid" /></L>
            <L as="h3" id="compatibility">Compatibility</L>
            <L as="p">Magic Toolbar is a Windows desktop application. The supplied requirements specify Windows 11, 64-bit. Review the installation guide before downloading.</L>
            {site.releaseVersion && <L as="p" className="fineprint">Current release: v{site.releaseVersion}</L>}
          </L>
          <L as="div" className="card">
            <L as="span" className="itile"><Icon name="sparkle" /></L>
            <L as="h3" id="plans">Plans</L>
            <L as="p">Choose a monthly subscription, save with the yearly plan, or contact us about lifetime pricing. Specialist products have their own separate terms.</L>
            <L as="p"><Link href="/pricing" className="text-link">View pricing and plans →</Link></L>
          </L>
        </L>
      </L>
    </L>
  );
}