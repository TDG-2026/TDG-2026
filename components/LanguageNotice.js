'use client';

import {useEffect, useState} from 'react';
import {useI18n} from '@/lib/i18n/client';
import {localeInfo} from '@/lib/i18n/config';

export default function LanguageNotice() {
  const {locale, t, complete, published, machine} = useI18n();
  const [changed, setChanged] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('tg-language-changed') === locale) {
        setChanged(true);
        sessionStorage.removeItem('tg-language-changed');
      }
    } catch {
      // The toast is optional when session storage is unavailable.
    }

    try {
      const autoCookie = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith('tg-language-auto='));
      const autoLocale = autoCookie?.split('=').slice(1).join('=');

      if (autoLocale === locale) setAutoSelected(true);

      if (autoCookie) {
        document.cookie = 'tg-language-auto=; Max-Age=0; Path=/; SameSite=Lax';
      }
    } catch {
      // Language selection still works when cookies are unavailable.
    }
  }, [locale]);

  const toastText = changed
    ? t('Language changed successfully.')
    : autoSelected
      ? t('We selected {language} based on your browser or region.', {
          language: localeInfo(locale).name,
        })
      : '';

  return (
    <>
      {!complete && locale !== 'en' && (
        <aside className="translation-notice" role="note">
          {t('This language is not fully translated yet. Some or all page content may appear in English.')}
        </aside>
      )}
      {complete && !published && locale !== 'en' && (
        <aside className="translation-notice" role="note">
          {t('This language is awaiting review and is not included in search results yet.')}
        </aside>
      )}
      {machine && (
        <aside className="translation-notice translation-notice--soft" role="note">
          {t('This page was translated automatically. Contact us if anything is unclear.')}
        </aside>
      )}
      {toastText && (
        <div className="language-toast" role="status" aria-live="polite">
          <span>{toastText}</span>
          <button
            type="button"
            aria-label={t('Dismiss')}
            onClick={() => {
              setChanged(false);
              setAutoSelected(false);
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
