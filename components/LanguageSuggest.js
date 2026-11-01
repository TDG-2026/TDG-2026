'use client';
import {useEffect, useState} from 'react';
import {useI18n} from '@/lib/i18n/client';
import {localeInfo, localePath, COOKIE, MAX_AGE} from '@/lib/i18n/config';
import {resolveLocale} from '@/lib/i18n/resolve';
import {availableLocales} from '@/lib/i18n/available';

const setCookie = (code) => { document.cookie = `${COOKIE}=${code}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; };

export default function LanguageSuggest() {
  const {locale, t} = useI18n();
  const [target, setTarget] = useState(null);
  useEffect(() => {
    try { if (document.cookie.split('; ').some((c) => c.startsWith(COOKIE + '='))) return; } catch { return; }
    const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean);
    const header = langs.map((l, i) => `${l};q=${Math.max(0.1, 1 - i * 0.1).toFixed(1)}`).join(',');
    const r = resolveLocale({acceptLanguage: header, available: availableLocales});
    if (r.reason === 'browser' && r.locale !== locale) setTarget(r.locale);
  }, [locale]);
  if (!target) return null;
  const info = localeInfo(target);
  return (
    <div className="lang-suggest" role="region" aria-label={t('Language suggestion')}>
      <p>{t('View this page in {language}?', {language: info.english})}</p>
      <div className="lang-suggest-actions">
        <button className="btn btn--primary btn--sm" lang={target} dir={info.dir}
          onClick={() => { setCookie(target); location.assign(localePath(location.pathname + location.search + location.hash, target)); }}>{info.name}</button>
        <button className="btn btn--ghost btn--sm" onClick={() => { setCookie(locale); setTarget(null); }}>{t('Not now')}</button>
      </div>
    </div>
  );
}