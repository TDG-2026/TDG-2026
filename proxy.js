import {NextResponse} from 'next/server.js';
import {splitPath, localePath, COOKIE} from './lib/i18n/config.js';
import {resolveLocale, trustedCountry} from './lib/i18n/resolve.js';
import {availableLocales} from './lib/i18n/available.js';

const ALIASES = {
  '/blog': '/resources', '/downloads': '/download',
  '/products/whatsapp-contact-extractor': '/products/whatsapp-contact-number-extractor',
  '/products/customer-observation-desk': '/products/whatsapp-customer-observation-desk',
  '/products/emirates-sales-report-automation': '/products/emirates-portal-sales-report-automation',
  '/products/travel-agency-account-system': '/platform/travel-agency-account-system',
  '/products/b2b-b2c-travel-portal': '/platform/b2b-b2c-travel-portal',
};

export function proxy(request) {
  const {pathname} = request.nextUrl;
  const {locale, path} = splitPath(pathname);
  if (locale) {
    const alias = ALIASES[path];
    if (alias || pathname.split('/')[1] !== locale) {
      const url = request.nextUrl.clone(); url.pathname = localePath(alias || pathname, locale);
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }
  if (!['GET', 'HEAD'].includes(request.method)) return NextResponse.next();
  const result = resolveLocale({
    cookie: request.cookies.get(COOKIE)?.value,
    acceptLanguage: request.headers.get('accept-language') || '',
    country: trustedCountry(request.headers),
    available: availableLocales,
  });
  const url = request.nextUrl.clone(); url.pathname = localePath(ALIASES[pathname] || pathname, result.locale);
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language, Cookie');
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
export const config = {matcher: ['/((?!api(?:/|$)|_next(?:/|$)|images(?:/|$)|.*\\.[^/]+$).*)']};