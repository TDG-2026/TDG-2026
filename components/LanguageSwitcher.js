'use client';
import {useState,useRef,useEffect,useMemo,useId} from 'react';
import {useI18n} from '@/lib/i18n/client';
import {locales,localePath,COOKIE,MAX_AGE,normalize} from '@/lib/i18n/config';
import {countryCodes,countryName,flag,languagesForCountry} from '@/lib/i18n/countries';

const LANGUAGE_FLAGS = {
  nl: '🇳🇱',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  it: '🇮🇹',
  es: '🇪🇸',
  ps: '🇦🇫',
  ar: '🇸🇦',
  ur: '🇵🇰',
};

export default function LanguageSwitcher(){const {locale,t}=useI18n();const uid=useId();const panelId=uid+'-panel',searchId=uid+'-search';const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[tab,setTab]=useState('languages'),[market,setMarket]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');const root=useRef(null),button=useRef(null),search=useRef(null);const current=locales.find(l=>l.code===locale)||locales[0];
useEffect(()=>{if(!open)return;search.current?.focus();const close=e=>{if(!root.current?.contains(e.target))setOpen(false);};const key=e=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}};document.addEventListener('pointerdown',close);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',key);};},[open]);
const countries=useMemo(()=>countryCodes.map(code=>({code,name:countryName(code,locale),english:countryName(code,'en')})).sort((a,b)=>a.name.localeCompare(b.name,locale)),[locale]);
async function choose(code){if(busy)return;setBusy(true);setError('');const target=localePath(location.pathname+location.search+location.hash,code);try{const response=await fetch(target,{method:'HEAD',credentials:'same-origin',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('unavailable');document.cookie=`${COOKIE}=${code}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;try{sessionStorage.setItem('tg-language-changed',code);}catch{}location.assign(target);}catch{setBusy(false);setError(t('Language could not be loaded. Please try again.'));}}
const q=normalize(query);const matches=l=>normalize(l.name+' '+l.english+' '+l.code).includes(q);const choices=locales.filter(l=>(!market||languagesForCountry(market).includes(l.code))&&matches(l));
return <div className="locale-control" ref={root}><noscript><a href={localePath('/languages',locale)}>{t('Choose website language')}</a></noscript><button ref={button} className="locale-trigger" aria-label={t('Choose website language')} aria-expanded={open} aria-controls={panelId} onClick={()=>setOpen(!open)}><span aria-hidden="true">{LANGUAGE_FLAGS[locale] || '🌐'}</span><span lang={locale}>{current.name}</span><span aria-hidden="true">⌄</span></button>{open&&<section id={panelId} className="locale-panel" aria-label={t('Choose website language')}><div className="locale-panel-head"><strong>{t('Choose website language')}</strong><button aria-label={t('Close')} onClick={()=>{setOpen(false);button.current?.focus();}}>×</button></div><label className="sr-only" htmlFor={searchId}>{t('Search languages or countries')}</label><input id={searchId} ref={search} type="search" value={query} placeholder={t('Search languages or countries')} onChange={e=>setQuery(e.target.value)}/><div className="locale-tabs"><button aria-pressed={tab==='languages'} onClick={()=>{setTab('languages');setMarket('');setQuery('');}}>{t('Languages')}</button><button aria-pressed={tab==='countries'} onClick={()=>{setTab('countries');setMarket('');setQuery('');}}>{t('Countries and regions')}</button></div>{market&&<div className="locale-market"><strong>{flag(market)} {countryName(market,locale)}</strong><p>{t('Available site languages for this market. All languages remain accessible.')}</p><button onClick={()=>{setMarket('');setTab('languages');setQuery('');}}>{t('Show all languages')}</button></div>}<div className="locale-options">{tab==='countries'&&!market?countries.filter(c=>normalize(c.name+' '+c.english+' '+c.code).includes(q)).map(c=><button key={c.code} onClick={()=>{setMarket(c.code);setQuery('');}}><span aria-hidden="true">{flag(c.code)}</span> {c.name}<span aria-hidden="true">›</span></button>):choices.map(l=><button key={l.code} disabled={busy} aria-pressed={l.code===locale} onClick={()=>choose(l.code)}><span aria-hidden="true">{LANGUAGE_FLAGS[l.code] || '🌐'}</span><span lang={l.code} dir={l.dir}>{l.name}</span><small>{l.english}</small>{l.code===locale&&<span aria-hidden="true">✓</span>}</button>)}</div>{((tab==='languages'||market)&&!choices.length||tab==='countries'&&!market&&!countries.some(c=>normalize(c.name+' '+c.english+' '+c.code).includes(q)))&&<p>{t('No matches found.')}</p>}<p className="locale-status" role="status">{busy?t('Loading language…'):error}</p></section>}</div>;}
