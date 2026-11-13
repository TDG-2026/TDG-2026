'use client';


import {L,useI18n} from '@/lib/i18n/client';
import {Image} from '@/lib/i18n/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mascot } from '@/data/site';
import styles from './ToolbarCore.module.css';

const tools = [
  { title: 'Passport Entries Generator· All GDS', short: 'Prepare passenger passport entries.', detail: 'Prepare passport entries for your GDS workflow, including Amadeus, Travelport and Sabre formats.', icon: 'DOCS' },
  { title: 'All GDS Entry Search Engine', short: 'Find the entry you need.', detail: 'Look up GDS entries while working at your travel desk.', icon: 'GDS' },
  { title: 'Visa Photo Fixer', short: 'Adjust photos for visa workflows.', detail: 'Crop and adjust visa photos. Check the final image against the destination’s official photo requirements.', icon: 'PIC' },
  { title: 'Instant F1–F12 Shortcuts', short: 'Your desk actions, one key away.', detail: 'Bring frequently used travel desk actions within reach through F1–F12 shortcuts.', icon: 'F1' },
  { title: 'Draft Msg Container Manager', short: 'Keep desk content organised.', detail: 'Organise the content you use at your travel desk in dedicated containers.', icon: 'BOX' },
  { title: 'Daily Task & Reminder Desk', short: 'Keep daily follow-ups in view.', detail: 'Keep daily tasks and reminders together so important follow-ups stay visible.', icon: 'TASK' },
  { title: 'Passenger Passports Data Storage', short: 'Keep family travel details together.', detail: 'Organise passenger families and their passport details in one place.', icon: 'PAX' },
  { title: 'Phone Directory', short: 'Keep useful contacts close.', detail: 'Find the phone contacts you need during your daily desk work.', icon: 'TEL' },
  { title: 'Snip to Logo & Screenshot', short: 'Capture what matters on screen.', detail: 'Capture a logo, a selected area or a screenshot for your desk workflow.', icon: 'SNIP' },
  { title: 'Magnifier', short: 'Take a closer look at small text.', detail: 'Magnify details on screen when you need a closer look.', icon: 'ZOOM' },
  { title: 'Any Language Translator', short: 'Understand text across languages.', detail: 'Use translation support to understand text in another language.', icon: 'A↔' },
  { title: 'Zoom Mute / Unmute Hotkey', short: 'Control received Zoom speaker sound.', detail: 'Mute or unmute Zoom with a hotkey while keeping your workflow moving.', icon: 'MIC' },
];

const HALF = tools.length / 2;
const INTERVAL = 2800;

export default function ToolbarCore() {
 const {t:tr}=useI18n();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const portalRef = useRef(null);
  const pathRef = useRef(null);
  const toolRefs = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(mq.matches);
    const onChange = (e) => setPaused(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (paused || hovering || !inView || !pageVisible) return undefined;
    const timer = setInterval(() => setSelected((s) => (s + 1) % tools.length), INTERVAL);
    return () => clearInterval(timer);
  }, [paused, hovering, inView, pageVisible]);

  // Beam from the edge of the genie circle to the highlighted product
  const drawBeam = useCallback(() => {
    const stage = stageRef.current;
    const portal = portalRef.current;
    const card = toolRefs.current[selected];
    const path = pathRef.current;
    if (!stage || !portal || !card || !path) return;
    const b = stage.getBoundingClientRect();
    const p = portal.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const isLeft = selected < HALF;
    const cx = p.left - b.left + p.width / 2;
    const cy = p.top - b.top + p.height / 2;
    const startX = isLeft ? cx - p.width / 2 : cx + p.width / 2;
    const endX = isLeft ? c.right - b.left : c.left - b.left;
    const endY = c.top - b.top + c.height / 2;
    const midX = (startX + endX) / 2;
    path.setAttribute('d', `M ${startX} ${cy} C ${midX} ${cy}, ${midX} ${endY}, ${endX} ${endY}`);
  }, [selected]);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(drawBeam);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); };
  }, [drawBeam, inView]);

  const renderTool = (tool, i) => (
    <L as="button"
      key={tool.title}
      ref={(el) => { toolRefs.current[i] = el; }}
      type="button"
      className={styles.tool}
      aria-pressed={selected === i}
      aria-label={tool.title}
      onPointerEnter={() => { setHovering(true); setSelected(i); }}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => { setHovering(true); setSelected(i); }}
      onBlur={() => setHovering(false)}
      onClick={() => setSelected(i)}
    >
      <L as="span" className={styles.icon} aria-hidden="true">{tool.icon}</L>
      <L as="span">
        <L as="strong">{tool.title}</L>
        <L as="small">{tool.short}</L>
      </L>
    </L>
  );

  const current = tools[selected];

  return (
  <L as="section" id="toolbar" ref={rootRef} className={`section section--dark ${paused || !inView || !pageVisible ? styles.paused : ''}`}>
    <L as="div" className="container">
      <L as="div" className="section-head center">
        <L as="p" className="eyebrow eyebrow--gold">Inside Magic Toolbar</L>
        <L as="h2" className="title">
          One toolbar. <L as="span" className="grad grad--gold">Twelve everyday tools.</L>
        </L>
        <L as="p" className="lead">
          Everything here is included with Magic Toolbar. These aren&apos;t separate purchases, just daily reservation jobs
          all the day, gathered in one place.
        </L>
        <L as="p" className="eyebrow eyebrow--gold">Time is Money-Travel Desk Genie Saves Both!</L>
      </L>
        <L as="div" className={styles.stage} ref={stageRef}>
          <svg className={styles.beams} aria-hidden="true">
            <path ref={pathRef} className={styles.beam} />
          </svg>

          <L as="div" className={`${styles.column} ${styles.left}`}>
            {tools.slice(0, HALF).map((t, i) => renderTool(t, i))}
          </L>

          <L as="div" className={styles.center}>
            <L as="div" className={styles.orbitWrap} aria-hidden="true">
              <L as="div" className={styles.orbit} />
              <L as="div" className={`${styles.orbit} ${styles.orbit2}`} />
              <L as="div" className={styles.portal} ref={portalRef}>
                <L as="div" className={styles.portalIn}>
                  <Image src={mascot.src} alt="" fill sizes="220px" className={styles.portalImg} />
                </L>
              </L>
            </L>
            <L as="div" className={styles.caption}>
              <L as="small">EXPLORE YOUR TOOLBAR</L>
              <L as="strong">{current.title}</L>
              <L as="p">{current.detail}</L>
            </L>
          </L>

          <L as="div" className={`${styles.column} ${styles.right}`}>
            {tools.slice(HALF).map((t, i) => renderTool(t, i + HALF))}
          </L>
        </L>

        <L as="div" className={styles.footer}>
          <L as="span"><L as="i" className={styles.dot} />12 everyday tools. One connected workspace.</L>
          <L as="button" type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused ? 'Play highlights' : 'Pause highlights'}
          </L>
        </L>
      </L>
    </L>
  );
}