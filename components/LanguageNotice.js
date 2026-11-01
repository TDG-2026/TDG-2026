'use client';
import {useEffect, useState} from 'react';
import {useI18n} from '@/lib/i18n/client';
export default function LanguageNotice() {
  const {locale, t, complete, published, machine} = useI18n();
  const [changed, setChanged] = useState(false);
  useEffect(() => { try { if (sessionStorage.getItem('tg-language-changed') === locale) { setChanged(true); sessionStorage.removeItem('tg-language-changed'); } } catch {} }, [locale]);
  return <>
    {!complete && locale !== 'en' && <aside className="translation-notice" role="note">{t('Translation is being prepared. Some content is currently shown in English.')}</aside>}
    {complete && !published && locale !== 'en' && <aside className="translation-notice" role="note">{t('Automatic translation preview. Language review is pending.')}</aside>}
    {machine && <aside className="translation-notice translation-notice--soft" role="note">{t('This page was translated automatically. Contact us if anything is unclear.')}</aside>}
    {changed && <div className="language-toast" role="status" aria-live="polite"><span>{t('Language changed successfully.')}</span><button aria-label={t('Dismiss')} onClick={() => setChanged(false)}>×</button></div>}
  </>;
}