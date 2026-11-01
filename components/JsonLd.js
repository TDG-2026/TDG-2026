'use client';
import {useI18n} from '@/lib/i18n/client';
import {translatedObject} from '@/lib/i18n/translate';
import {localePath} from '@/lib/i18n/config';
import {site} from '@/data/site';
export default function JsonLd({data}){const {t,locale}=useI18n();const localized=translatedObject(data,t,url=>{try{const u=new URL(url,site.url);return u.origin===new URL(site.url).origin?u.origin+localePath(u.pathname+u.search+u.hash,locale):url;}catch{return url;}});if(localized.inLanguage)localized.inLanguage=locale;return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org',...localized}).replace(/</g,'\\u003c')}}/>;}
