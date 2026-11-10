import {NextResponse} from 'next/server.js';
import {splitPath, localePath, COOKIE} from './lib/i18n/config.js';
import {resolveLocale, trustedCountry} from './lib/i18n/resolve.js';
import {availableLocales} from './lib/i18n/available.js';

const LEGACY_LOCALES = new Set([
  'fa', 'hi', 'bn', 'ne', 'tr', 'ru', 'pt-BR', 'id', 'vi', 'th',
  'zh-Hans', 'ms', 'uz',
]);

const ALIASES = {
  '/blog': '/resources',
  '/downloads': '/download',
  '/products/whatsapp-contact-extractor': '/products/whatsapp-contact-number-extractor',
  '/products/customer-observation-desk': '/products/whatsapp-customer-observation-desk',
  '/products/emirates-sales-report-automation': '/products/emirates-portal-sales-report-automation',
  '/products/travel-agency-account-system': '/platform/travel-agency-account-system',
  '/products/b2b-b2c-travel-portal': '/platform/b2b-b2c-travel-portal',
};

export function proxy(request) {
  const {pathname} = request.nextUrl;
  const firstSegment = pathname.split('/')[1];

  // Consolidate retired locale prefixes to English rather than nesting them
  // under a newly negotiated locale (for example /fa/contact -> /en/contact).
  if (LEGACY_LOCALES.has(firstSegment)) {
    const legacyPath = '/' + pathname.split('/').slice(2).join('/');
    const url = request.nextUrl.clone();
    url.pathname = localePath(legacyPath || '/', 'en');
    return NextResponse.redirect(url, 308);
  }

  const {locale, path} = splitPath(pathname);

  if (locale) {
    const alias = ALIASES[path];
    if (alias || pathname.split('/')[1] !== locale) {
      const url = request.nextUrl.clone();
      url.pathname = localePath(alias || pathname, locale);
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

  const url = request.nextUrl.clone();
  url.pathname = localePath(ALIASES[pathname] || pathname, result.locale);
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Vary', 'Accept-Language, Cookie');
  response.headers.set('Cache-Control', 'private, no-store');

  // Show a one-time, dismissible notice when the first visit is routed by
  // browser language or trusted edge country. A saved user choice wins.
  if (result.locale !== 'en' && ['browser', 'region'].includes(result.reason)) {
    response.cookies.set('tg-language-auto', result.locale, {
      path: '/',
      maxAge: 120,
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api(?:/|$)|_next(?:/|$)|images(?:/|$)|.*\\.[^/]+$).*)'],
};
