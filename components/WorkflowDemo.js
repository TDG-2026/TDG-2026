'use client';

import {L} from '@/lib/i18n/client';
import { useEffect, useState } from 'react';
import Icon from './Icon';

const tabs = [
  { id: 'docs', label: 'Passport → DOCS' },
  { id: 'ctcm', label: 'Mobile → CTCM' },
  { id: 'ctce', label: 'Email → CTCE' },
];

const systems = [
  { id: '1A', label: 'Amadeus' },
  { id: '1G', label: 'Travelport+' },
  { id: '1S', label: 'Sabre' },
];

const examples = {
  docs: {
    input: [['Surname', 'KHAN'], ['Given names', 'AHMED'], ['Passport', 'AB1234567'], ['Issuing / nationality', 'PAK / PAK'], ['Date of birth', '01JAN90'], ['Sex', 'M'], ['Expiry', '31DEC30']],
    output: {
      '1A': 'SRDOCS YY HK1-P-PAK-AB1234567-PAK-01JAN90-M-31DEC30-KHAN-AHMED/P1',
      '1G': 'SI.P1/SSRDOCSYYHK1/P/PAK/AB1234567/PAK/01JAN90/M/31DEC30/KHAN/AHMED',
      '1S': '3DOCS/P/PAK/AB1234567/PAK/01JAN90/M/31DEC30/KHAN/AHMED-1.1',
    },
  },
  ctcm: {
    input: [['Passenger', 'KHAN/AHMED (P1)'], ['Mobile', '+92 300 0000000'], ['Format', 'Country code + number, digits only']],
    output: {
      '1A': 'SR CTCM YY HK1-923000000000/P1',
      '1G': 'SI.P1/SSRCTCMYYHK1/923000000000',
      '1S': '3CTCM/923000000000-1.1',
    },
  },
  ctce: {
    input: [['Passenger', 'KHAN/AHMED (P1)'], ['Email', 'ahmed.khan@example.com'], ['Encoding', '@ written as //']],
    output: {
      '1A': 'SR CTCE YY HK1-AHMED.KHAN//EXAMPLE.COM/P1',
      '1G': 'SI.P1/SSRCTCEYYHK1/AHMED.KHAN//EXAMPLE.COM',
      '1S': '3CTCE/AHMED.KHAN//EXAMPLE.COM-1.1',
    },
  },
};

export default function WorkflowDemo() {
  const [tab, setTab] = useState('docs');
  const [gds, setGds] = useState('1A');
  const [copied, setCopied] = useState(false);
  const example = examples[tab];
  const output = example.output[gds];

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); } catch { /* clipboard unavailable */ }
  };

  return (
    <L as="section" className="section section--soft" aria-labelledby="demo-title">
      <L as="div" className="container">
        <L as="div" className="section-head center">
          <L as="p" className="eyebrow">Try the workflow</L>
          <L as="h2" id="demo-title" className="title">See the input. <L as="span" className="grad">See the entry.</L></L>
          <L as="p" className="lead">Switch between workflows and GDS formats to see how reviewed details become an entry ready to check and copy.</L>
        </L>

        <L as="div" className="demo">
          <L as="div" className="demo-controls">
            <L as="div" role="tablist" aria-label="Workflow" className="tabs">
              {tabs.map((t, i) => (
                <L as="button"
                  key={t.id} id={`tab-${t.id}`} role="tab" type="button" className="tab"
                  aria-selected={tab === t.id} aria-controls="demo-panel"
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)} onKeyDown={(e) => onTabKey(e, i)}
                >{t.label}</L>
              ))}
            </L>
            <L as="div" className="segmented" role="group" aria-label="GDS format">
              {systems.map((s) => (
                <L as="button" key={s.id} type="button" aria-pressed={gds === s.id} aria-label={`${s.label} GDS format (${s.id})`} onClick={() => setGds(s.id)}>
                  {s.label} <L as="small">{s.id}</L>
                </L>
              ))}
            </L>
          </L>

          <L as="div" id="demo-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="demo-body">
            <L as="div" className="panel">
              <L as="h3" className="h-sm" id="reviewed-details">Reviewed details</L>
              <dl className="kv">
                {example.input.map(([k, v]) => <L as="div" key={k}><L as="dt">{k}</L><L as="dd">{v}</L></L>)}
              </dl>
            </L>
            <L as="div" className="demo-arrow" aria-hidden="true"><Icon name="arrowRight" size={26} /></L>
            <L as="div" className="panel panel--code">
              <L as="div" className="code-head">
                <L as="h3" className="h-sm">Prepared entry · {systems.find((s) => s.id === gds).label}</L>
                <L as="button" type="button" className="btn btn--sm btn--light" onClick={copy}>
                  <Icon name={copied ? 'check' : 'copy'} size={16} />{copied ? 'Copied' : 'Copy'}
                </L>
              </L>
              <L as="code" className="code code--big">{output}</L>
              <L as="p" className="fineprint" aria-live="polite">
                {copied ? 'Entry copied to clipboard.' : 'Illustrative synthetic example. Verify against your GDS before use.'}
              </L>
            </L>
          </L>
        </L>
      </L>
    </L>
  );
}