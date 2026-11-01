'use client';

import {L,useI18n} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import { useRef, useState } from 'react';
import Icon from './Icon';
import { tourScreens } from '@/data/screens';

export default function ProductTour() {
 const {t:tr}=useI18n();
  const [active, setActive] = useState(0);
  const dialogRef = useRef(null);
  const s = tourScreens[active];

  const onKey = (e, i) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const n = (i + step + tourScreens.length) % tourScreens.length;
    setActive(n);
    document.getElementById(`tour-tab-${tourScreens[n].id}`)?.focus();
  };

  const openFull = () => dialogRef.current?.showModal();
  const closeFull = () => dialogRef.current?.close();

  return (
    <L as="section" id="desk-tools" className="section" aria-labelledby="tour-title">
      <L as="div" className="container">
        <L as="div" className="section-head">
          <L as="p" className="eyebrow">Take the tour</L>
          <L as="h2" id="tour-title" className="title">Everything else in the toolbar, <L as="span" className="grad">as it really looks</L></L>
          <L as="p" className="lead">Real screens from Travel Genie Magic Toolbar. All included, with no separate purchases. Choose a tool to see it.</L>
        </L>

        <L as="div" className="tour">
          <L as="div" className="tour-tabs" role="tablist" aria-orientation="vertical" aria-label="Toolbar tools">
            {tourScreens.map((t, i) => (
              <L as="button"
                key={t.id} id={`tour-tab-${t.id}`} type="button" role="tab" className="tour-tab"
                aria-selected={active === i} aria-controls="tour-panel" tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}
              >
                <L as="span" className="itile itile--sm"><Icon name={t.icon} size={18} /></L>
                <L as="span">
                  <L as="strong">{t.title}</L>
                  <L as="span" className="tour-short">{t.short}</L>
                </L>
              </L>
            ))}
          </L>

          <L as="div" id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${s.id}`} className="tour-panel">
            <L as="button" type="button" className={`tour-shot${s.small ? ' tour-shot--small' : ''}`} onClick={openFull} aria-label={tr('View {tool} screenshot full size',{tool:tr(s.title)})}>
              <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 960px) 100vw, 820px" />
              <L as="span" className="zoom-hint"><Icon name="search" size={14} />View full size</L>
            </L>

            <L as="div" className="tour-body">
              <L as="div">
                <L as="h3" id={`tool-detail-${s.id}`}>{s.title}</L>
                <L as="ul" className="checklist">
                  {s.points.map((p) => <L as="li" key={p}><Icon name="check" />{p}</L>)}
                </L>
              </L>
              {s.note && <L as="p" className="note">{s.note}</L>}
            </L>
          </L>
        </L>
      </L>

      <L as="dialog" ref={dialogRef} className="lightbox" aria-label={tr('{tool} screenshot',{tool:tr(s.title)})} onClick={(e) => e.target === dialogRef.current && closeFull()}>
        <L as="button" type="button" className="icon-btn lightbox-close" onClick={closeFull} aria-label="Close full-size view">
          <Icon name="close" size={18} />
        </L>
        <figure>
          <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="96vw" />
          <L as="figcaption">{s.title}</L>
        </figure>
      </L>
    </L>
  );
}