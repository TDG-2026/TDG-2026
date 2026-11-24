// lib/i18n/published.js
// The ONLY place that decides which languages are public.
// Add a code here only after a native speaker has reviewed 100% of that language.
export const PUBLISHED_LOCALES = ['en'];
export const isPublished = (code) => PUBLISHED_LOCALES.includes(code);