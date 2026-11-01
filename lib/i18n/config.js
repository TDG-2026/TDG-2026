import {localeRegistry} from './locales.registry.js';
export const locales = localeRegistry;
export const codes = locales.map((l) => l.code);
export const DEFAULT_LOCALE = 'en';
export const COOKIE = 'tg-language';
export const MAX_AGE = 180 * 86400;
const lower = new Map(codes.map((c) => [c.toLowerCase(), c]));
export const canonicalLocale = (value) => (typeof value === 'string' ? lower.get(value.toLowerCase()) : undefined);
export const localeInfo = (value) => locales.find((l) => l.code === value) || locales[0];
export const isRtl = (code) => localeInfo(code).dir === 'rtl';
export function splitPath(path = '/') {
  const at = path.search(/[?#]/);
  const pathname = at < 0 ? path : path.slice(0, at);
  const suffix = at < 0 ? '' : path.slice(at);
  const bits = pathname.split('/');
  const locale = canonicalLocale(bits[1]);
  return {locale, path: (locale ? '/' + bits.slice(2).join('/') : pathname) || '/', suffix};
}
export function localePath(href, locale) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//') ||
      /^\/(api|_next|images|downloads?\/)(?:\/|$)/.test(href) || /\.[a-z0-9]{2,8}(?:[?#]|$)/i.test(href)) return href;
  const {path, suffix} = splitPath(href);
  return '/' + (canonicalLocale(locale) || 'en') + (path === '/' ? '' : path) + suffix;
}
export const normalize = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();