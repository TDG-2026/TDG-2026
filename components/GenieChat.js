'use client';

import {useI18n} from '@/lib/i18n/client';
import {locales as siteLocales, localeInfo, localePath} from '@/lib/i18n/config';
import {availableLocales} from '@/lib/i18n/available';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenieChat.module.css';
import { genie } from '@/data/genie/config';
import { t, isLocale, detectLanguage, reply, buildAnswer, chipLabel, whatsappLink, MAIN_CHIPS } from '@/lib/genie/engine';

const CHAT_KEY = 'genie:chat:v2';
const NUDGED_KEY = 'genie:nudged';
const TEASER_KEY = 'genie:teaser:done';
const REOPEN_KEY = 'genie:reopen';
const LANG_COOKIE = 'tg-language';
const WELCOME_ACTIONS = ['pricing', 'demo', 'install', 'features', 'docs', 'support'];
let counter = 0;
const nid = () => `${Date.now().toString(36)}${(counter++).toString(36)}`;

// Lead tracking hook: window.addEventListener('genie:event', (e) => console.log(e.detail))
function emit(event, detail = {}) {
  try { window.dispatchEvent(new CustomEvent('genie:event', { detail: { event, ...detail } })); } catch { /* noop */ }
}

// Bot text arrives already translated by the engine; this only renders line breaks and **bold**.
function Rich({ text = '' }) {
  return String(text).split('\n').map((line, i) => (
    <span key={i} className={styles.line}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}
    </span>
  ));
}

function Avatar({ size }) {
  const [src, setSrc] = useState(genie.avatar.src);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={`${styles.avatar} ${styles.avatarFallback}`} style={{ width: size, height: size }} aria-hidden="true">G</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt="" width={size} height={size} className={styles.avatar} decoding="async"
      onError={() => (genie.avatar.fallbackSrc && src !== genie.avatar.fallbackSrc ? setSrc(genie.avatar.fallbackSrc) : setFailed(true))}
    />
  );
}

function CopyBtn({ value, label }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button" className={styles.copy} aria-label={label}
      onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard unavailable */ } }}
    >{done ? '✓' : 'Copy'}</button>
  );
}

const Svg = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const IconGlobe = () => <Svg size={16} d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>} />;
const IconReset = () => <Svg d={<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" /></>} />;
const IconClose = () => <Svg d={<path d="M6 6l12 12M18 6 6 18" />} />;
const IconSend = () => <Svg d={<path d="M4 12h14M13 6l6 6-6 6" />} />;
const IconWa = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3Z" />
  </svg>
);
const ACTION_ICONS = {
  pricing: <><path d="M20 12l-8 8-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  demo: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></>,
  install: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 19h16" /></>,
  features: <><path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z" /><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" /></>,
  docs: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6.5 16c.6-1.4 1.5-2 2.5-2s1.9.6 2.5 2M14 10h4M14 13h3" /></>,
  support: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></>,
};

export default function GenieChat({ initialOpen = false }) {
  const website = useI18n();
  const tr = website.t;
  const loc = localeInfo(website.locale);
  // Genie speaks the page language once that language is translated; otherwise English.
  const code = isLocale(website.locale) ? website.locale : 'en';
  const s = t(code, tr);

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState('');
  const [nudge, setNudge] = useState(null);   // { n } while a reminder is visible
  const [unread, setUnread] = useState(0);
  const [teaser, setTeaser] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);
  const reduced = useRef(false);
  const nudgesStopped = useRef(false);
  const switchOffered = useRef(new Set());

  // Only languages the website has translated are offered, so visitors never land on half-English pages.
  const languages = useMemo(() => siteLocales.filter((l) => l.code === 'en' || availableLocales.includes(l.code)), []);
  const filteredLanguages = langQuery.trim()
    ? languages.filter((l) => `${l.name} ${l.english} ${l.code}`.toLowerCase().includes(langQuery.trim().toLowerCase()))
    : languages;

  // Mount after the page is idle (keeps LCP/INP clean), restore this session's chat.
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { const m = JSON.parse(sessionStorage.getItem(`${CHAT_KEY}:${website.locale}`) || 'null'); if (Array.isArray(m)) setMessages(m); } catch { /* ignore */ }
    try { setTeaser(!localStorage.getItem(TEASER_KEY)); } catch { setTeaser(true); }
    let reopen = false;
    try { reopen = sessionStorage.getItem(REOPEN_KEY) === '1'; sessionStorage.removeItem(REOPEN_KEY); } catch { /* ignore */ }
    const start = () => { setReady(true); if (reopen) setOpen(true); };
    const useIdle = typeof window.requestIdleCallback === 'function';
    const handle = useIdle ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200);
    const list = timers.current;
    return () => {
      if (useIdle) window.cancelIdleCallback(handle); else clearTimeout(handle);
      list.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // "Book a demo" reminders: first after firstDelayMs, each visible visibleMs, gapMs apart, `count` times per session.
  useEffect(() => {
    const cfg = genie.nudges;
    if (!ready || !cfg?.enabled) return undefined;
    try { if (sessionStorage.getItem(NUDGED_KEY)) return undefined; } catch { /* ignore */ }

    let shown = 0;
    let timer;
    let onVisible = null;
    const schedule = (ms) => { timer = setTimeout(show, ms); };
    function show() {
      if (nudgesStopped.current) return;
      if (document.hidden) { // wait until the visitor returns to the tab
        onVisible = () => {
          if (document.hidden) return;
          document.removeEventListener('visibilitychange', onVisible);
          onVisible = null;
          schedule(1500);
        };
        document.addEventListener('visibilitychange', onVisible);
        return;
      }
      shown += 1;
      setNudge({ n: shown });
      setUnread(1);
      emit('nudge_shown', { n: shown });
      try { sessionStorage.setItem(NUDGED_KEY, '1'); } catch { /* ignore */ }
      timer = setTimeout(() => {
        setNudge(null);
        if (shown < cfg.count && !nudgesStopped.current) schedule(cfg.gapMs);
      }, cfg.visibleMs);
    }
    schedule(cfg.firstDelayMs);
    return () => {
      clearTimeout(timer);
      if (onVisible) document.removeEventListener('visibilitychange', onVisible);
    };
  }, [ready]);

  useEffect(() => { if (ready) try { sessionStorage.setItem(`${CHAT_KEY}:${website.locale}`, JSON.stringify(messages.slice(-genie.maxStoredMessages))); } catch { /* ignore */ } }, [messages, ready, website.locale]);
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages, typing, open]);

  const seed = useCallback(() => {
    const list = [
      { id: nid(), role: 'bot', seed: true, text: s.greeting, lang: code },
      { id: nid(), role: 'bot', seed: true, kind: 'note', text: s.privacy, lang: code },
    ];
    if (website.locale !== 'en' && code === 'en') list.push({ id: nid(), role: 'bot', seed: true, kind: 'note', text: s.enNotice, lang: 'en' });
    return list;
  }, [s.greeting, s.privacy, s.enNotice, code, website.locale]);

  useEffect(() => { if (open) setMessages((m) => (m.length ? m : seed())); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile: the chat is full-screen, so stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 520px)').matches) return undefined;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { html.style.overflow = prev; };
  }, [open]);

  const stopNudges = () => { nudgesStopped.current = true; setNudge(null); };
  const dismissTeaser = () => { setTeaser(false); try { localStorage.setItem(TEASER_KEY, '1'); } catch { /* ignore */ } };

  const closeChat = useCallback(() => {
    setOpen(false);
    setLangOpen(false);
    setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const openChat = () => {
    stopNudges();
    dismissTeaser();
    setUnread(0);
    setOpen(true);
    setMessages((m) => (m.length ? m : seed()));
    emit('open', { locale: code });
    // Focus the input on desktop only; on phones the keyboard would cover the quick questions.
    if (window.matchMedia('(pointer: fine)').matches) setTimeout(() => inputRef.current?.focus(), 60);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (langOpen) setLangOpen(false); else closeChat();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, langOpen, closeChat]);

  const botSay = useCallback((ans, question, extra = {}) => {
    setTyping(true);
    const delay = reduced.current ? 0 : Math.min(200 + String(ans.text || '').length * 1.5, 600);
    timers.current.push(setTimeout(() => {
      setMessages((m) => {
        const turns = m.filter((x) => x.role === 'user').length;
        const wa = ans.wa || (turns >= 3 ? 'Follow-up from website chat' : null);
        return [...m, { id: nid(), role: 'bot', text: ans.text, lang: ans.lang, chips: ans.chips, code: ans.code, codeNote: ans.codeNote, wa, question, ...extra }];
      });
      setTyping(false);
    }, delay));
  }, []);

  const ask = (raw) => {
    const text = raw.trim().slice(0, 500);
    if (!text || typing) return;
    setMessages((m) => [...m, { id: nid(), role: 'user', text }]);
    setInput('');
    const ans = reply(text, code, tr);
    emit('question', { intent: ans.intent, locale: code });
    // Visitor typed in another translated language: answer, and offer to switch the site to it.
    const detected = detectLanguage(text, code);
    const switchTo = detected && detected !== code && detected !== 'en' && availableLocales.includes(detected) && !switchOffered.current.has(detected) ? detected : null;
    if (switchTo) switchOffered.current.add(switchTo);
    botSay(ans, text, switchTo ? { switchTo } : {});
  };

  const pickChip = (id) => {
    if (typing) return;
    setMessages((m) => [...m, { id: nid(), role: 'user', text: chipLabel(id, code, tr) }]);
    emit('chip', { intent: id, locale: code });
    botSay(buildAnswer(id, code, null, tr), null);
  };

  const openDemo = () => {
    emit('nudge_click', { n: nudge?.n });
    openChat();
    pickChip('demo');
  };

  const changeLanguage = (next) => {
    if (next === website.locale) { setLangOpen(false); return; }
    emit('locale', { locale: next });
    try { document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`; } catch { /* ignore */ }
    try { sessionStorage.setItem(REOPEN_KEY, '1'); } catch { /* ignore */ }
    window.location.assign(localePath(window.location.pathname + window.location.search + window.location.hash, next));
  };

  const waHref = (topic, question) => whatsappLink({ topic, question, locale: loc, page: window.location.pathname });

  if (!ready) return null;
  const welcome = messages.length > 0 && messages.every((m) => m.seed);
  const last = messages[messages.length - 1];
  const showFollowUps = !typing && last && last.role === 'bot' && !last.seed && last.chips?.length;

  return (
    <div className={`${styles.root} ${genie.position === 'left' ? styles.left : ''} ${open ? styles.isOpen : ''}`}>
      {nudge && !open && (
        <div key={nudge.n} className={styles.nudge} role="status" aria-live="polite" lang={loc.code} dir={loc.dir}>
          <span className={styles.nudgeAvatar}><Avatar size={38} /></span>
          <div className={styles.nudgeBody}>
            <strong>{tr('Book a live demo')}</strong>
            <span>{tr('See how Magic Toolbar speeds up your GDS desk work.')}</span>
            <button type="button" className={styles.nudgeCta} onClick={openDemo}>{tr('Click here')} <span aria-hidden="true">→</span></button>
          </div>
          <button type="button" className={styles.nudgeClose} aria-label={s.close} onClick={() => { stopNudges(); emit('nudge_dismiss', { n: nudge.n }); }}>×</button>
          <i className={styles.nudgeBar} style={{ animationDuration: `${genie.nudges.visibleMs}ms` }} aria-hidden="true" />
        </div>
      )}

      {open && (
        <section className={styles.panel} role="dialog" aria-label={genie.name} lang={loc.code} dir={loc.dir}>
          <header className={styles.head}>
            <Avatar size={40} />
            <div className={styles.headText}>
              <strong dir="auto">{genie.name}</strong>
              <span><i className={styles.online} aria-hidden="true" />{s.subtitle}</span>
            </div>
            <button type="button" className={styles.langBtn} aria-label={tr('Choose language')} aria-expanded={langOpen} onClick={() => { setLangOpen((v) => !v); setLangQuery(''); }}>
              <IconGlobe /><span translate="no">{website.locale.split('-')[0].toUpperCase()}</span>
            </button>
            <button type="button" className={styles.iconBtn} aria-label={s.newChat} title={s.newChat} onClick={() => setMessages(seed())}><IconReset /></button>
            <button type="button" className={styles.iconBtn} aria-label={s.close} title={s.close} onClick={closeChat}><IconClose /></button>
          </header>

          {langOpen && (
            <div className={styles.sheet} role="dialog" aria-label={tr('Choose language')}>
              <div className={styles.sheetHead}>
                <strong>{tr('Choose language')}</strong>
                <button type="button" className={styles.sheetClose} aria-label={s.close} onClick={() => setLangOpen(false)}><IconClose /></button>
              </div>
              {languages.length > 8 && (
                <input
                  className={styles.sheetSearch} type="search" value={langQuery} onChange={(e) => setLangQuery(e.target.value)}
                  placeholder={tr('Search languages')} aria-label={tr('Search languages')} dir="auto" autoComplete="off"
                />
              )}
              <ul className={styles.langList}>
                {filteredLanguages.map((l) => {
                  const active = l.code === website.locale;
                  return (
                    <li key={l.code}>
                      <button type="button" className={`${styles.langItem} ${active ? styles.langActive : ''}`} aria-current={active ? 'true' : undefined} onClick={() => changeLanguage(l.code)}>
                        <span className={styles.langNative} lang={l.code} dir={l.dir} translate="no">{l.name}</span>
                        <span className={styles.langEnglish} translate="no">{l.english}</span>
                        {active && <span className={styles.check} aria-hidden="true">✓</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {languages.length <= 1 && <div className={styles.sheetNote}>{tr('More languages are coming soon.')}</div>}
            </div>
          )}

          <div className={styles.log} ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((m) => (
              <div key={m.id} className={`${styles.row} ${m.role === 'user' ? styles.rowUser : ''}`}>
                <div
                  className={`${styles.bubble} ${m.role === 'user' ? styles.user : styles.bot} ${m.kind === 'note' ? styles.note : ''}`}
                  lang={m.role === 'user' ? undefined : (m.lang || code)} dir="auto" translate={m.role === 'user' ? 'no' : undefined}
                >
                  <Rich text={m.text} />
                  {m.code && (
                    <div className={styles.codeList}>
                      {m.code.map((c) => (
                        <div key={c.label} className={styles.codeItem}>
                          <span>{c.label}</span>
                          <code dir="ltr" translate="no">{c.value}</code>
                          <CopyBtn value={c.value} label={`Copy ${c.label}`} />
                        </div>
                      ))}
                      {m.codeNote && <small>{m.codeNote}</small>}
                    </div>
                  )}
                </div>
                {m.switchTo && (
                  <button type="button" className={styles.switchBtn} onClick={() => changeLanguage(m.switchTo)}>
                    <IconGlobe />{tr('Continue in {language}', { language: localeInfo(m.switchTo).name })}
                  </button>
                )}
                {m.wa && (
                  <a className={styles.wa} href={waHref(m.wa, m.question)} target="_blank" rel="noopener noreferrer" onClick={() => emit('whatsapp', { topic: m.wa, locale: code })}>
                    <IconWa />{s.whatsapp}
                  </a>
                )}
                {showFollowUps && m.id === last.id && (
                  <div className={styles.chips}>
                    {m.chips.map((id) => <button key={id} type="button" className={styles.chip} onClick={() => pickChip(id)}>{chipLabel(id, code, tr)}</button>)}
                  </div>
                )}
              </div>
            ))}

            {welcome && (
              <div className={styles.welcome}>
                <span className={styles.welcomeLabel}>{tr('Quick questions')}</span>
                <div className={styles.actions}>
                  {WELCOME_ACTIONS.map((id) => (
                    <button key={id} type="button" data-id={id} className={styles.action} onClick={() => pickChip(id)} disabled={typing}>
                      <span className={styles.actionIcon}><Svg d={ACTION_ICONS[id]} size={18} /></span>
                      <span className={styles.actionText}>{chipLabel(id, code, tr)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {typing && (
              <div className={styles.row}>
                <div className={`${styles.bubble} ${styles.bot} ${styles.typing}`} aria-hidden="true"><i /><i /><i /></div>
              </div>
            )}
          </div>

          {!welcome && (
            <div className={styles.quickbar} role="toolbar" aria-label={tr('Quick questions')}>
              {MAIN_CHIPS.map((id) => (
                <button key={id} type="button" className={styles.quick} onClick={() => pickChip(id)} disabled={typing}>{chipLabel(id, code, tr)}</button>
              ))}
            </div>
          )}

          <form className={styles.compose} onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <input
              ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={s.placeholder}
              aria-label={s.placeholder} maxLength={500} dir="auto" enterKeyHint="send" autoComplete="off"
            />
            <button type="submit" className={styles.send} aria-label={s.send} disabled={!input.trim() || typing}><IconSend /></button>
          </form>
          <a className={styles.waBar} href={waHref('General enquiry', null)} target="_blank" rel="noopener noreferrer" onClick={() => emit('whatsapp', { topic: 'General enquiry', locale: code })}>
            <IconWa />{s.whatsapp}
          </a>
        </section>
      )}

      <div className={`${styles.launcherWrap} ${nudge ? styles.alert : ''}`}>
        {teaser && !open && !nudge && (
          <div className={styles.teaser} lang={loc.code} dir={loc.dir}>
            <button type="button" className={styles.teaserText} onClick={openChat}>
              <span className={styles.teaserDot} aria-hidden="true" />
              <strong>{tr('Ask Genie')}</strong>
            </button>
            <button type="button" className={styles.teaserDemo} onClick={openDemo}>
              <Svg size={14} d={<path d="M8 5.5l10 6.5-10 6.5z" />} />
              <span>{tr('Book a live demo')}</span>
            </button>
            <button type="button" className={styles.teaserClose} aria-label={s.close} onClick={dismissTeaser}>×</button>
          </div>
        )}
        {!open && (
          <>
            <span className={styles.aura} aria-hidden="true" />
            <span className={styles.ring} aria-hidden="true" />
            <span className={`${styles.ring} ${styles.ring2}`} aria-hidden="true" />
            <span className={styles.smoke} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </>
        )}
        <button
          ref={launcherRef} type="button" className={styles.launcher} aria-expanded={open}
          aria-label={open ? s.close : `${s.open}: ${genie.name}`} onClick={open ? closeChat : openChat}
        >
          <Avatar size={58} />
          <span className={styles.badge} aria-hidden="true">24/7</span>
        </button>
        {unread > 0 && !open && <span className={styles.unread} aria-hidden="true">{unread}</span>}
      </div>
    </div>
  );
}