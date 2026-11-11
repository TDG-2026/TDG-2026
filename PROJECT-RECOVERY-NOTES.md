# Travel Genie project recovery notes

## Implemented in this recovery package

- Removed the website's Azure Translator and LibreTranslate translation pipeline, credentials/configuration examples, and obsolete translation automation scripts.
- The production prebuild now extracts the English source dictionary only. It does not call a hosted translation provider or block the build on untranslated locales.
- Configured the requested nine locale routes: English, Nederlands, Deutsch, Français, Italiano, Español, Pashto, Arabic and Urdu.
- Preserved the existing lightweight dictionary-based localization layer to avoid adding a runtime dependency or increasing the client bundle.
- Configured browser-language and trusted Vercel-country negotiation, saved manual language preference, locale flags, RTL metadata for Pashto/Arabic/Urdu, and a one-time language-selection toast.
- Legacy locale prefixes from the previous 20-language configuration redirect to their English equivalent.
- Non-English pages without complete reviewed message catalogs remain `noindex` and are omitted from sitemap/hreflang output. This protects search quality rather than publishing English fallback pages as if they were translated.
- Updated all primary Travel Genie Magic Toolbar download CTAs to the official Microsoft Store web listing.
- Updated the localized download page, installation guide, Genie download action, SoftwareApplication structured data, release validation and AI-readable text to use the same Store URL.
- Kept existing SEO metadata conventions, canonical generation, structured data, robots rules, sitemap logic, resource content and page components intact.

## Microsoft Store product identity supplied by the owner

- Public Store URL: https://apps.microsoft.com/detail/9P1J21G2Z9LZ
- Store ID: `9P1J21G2Z9LZ`
- Package identity: `TravelDeskGenie.TravelDeskGenieMagicToolbar`
- Publisher: `CN=DDA7212B-4BA1-4103-B71A-1C0181ADAE56`
- Publisher display name: `TravelDeskGenie`
- Package Family Name: `TravelDeskGenie.TravelDeskGenieMagicToolbar_xgxsxv47msdvj`
- Package SID: `S-1-15-2-1349712100-1737729418-3497698718-2906510768-554864537-1432616439-148889152`

The website links to the public HTTPS listing. It does not attempt a silent install and does not rely solely on the Windows Store custom protocol.

## Important translation limitation in the supplied ZIP

The uploaded archive did not contain `messages/source.json` or any of the per-locale `messages/<locale>.json` translation catalogs. The source extractor recreates `messages/source.json` during `prebuild`, but the eight non-English full-site dictionaries cannot be reconstructed from this archive. The supplied `data/locales.js` contains translated overview metadata, and `data/genie/i18n.js` contains localized Genie interface strings; neither is a complete translation of all website copy.

Therefore, this package configures all nine locale routes and browser/region selection, but it does **not** fabricate full-page translations. Until complete dictionaries are added and reviewed, non-English pages show a clear translation-in-progress notice and remain out of search indexes. The language routes can be populated later with reviewed static dictionaries without bringing Azure back.

## Why the existing localization layer was retained

The supplied project already has a lightweight App Router-compatible dictionary, locale routing, country negotiation, RTL and SEO integration. The archive did not include complete locale dictionaries, and a package registry install was not available in the build environment. Replacing the working localization layer with `next-intl` without installing and locking its dependency or migrating the missing dictionaries would make the project less reproducible. This recovery keeps the existing small-footprint implementation rather than adding an unverified dependency. A later `next-intl` migration can be done when the full dictionaries and package installation are available.

## Vercel environment cleanup

After deploying this package, remove these obsolete website translation variables from Vercel Project Settings → Environment Variables if present:

- `TRANSLATION_PROVIDER`
- `AZURE_TRANSLATOR_KEY`
- `AZURE_TRANSLATOR_REGION`
- `AZURE_TRANSLATOR_ENDPOINT`
- `LIBRETRANSLATE_URL`
- `LIBRETRANSLATE_API_KEY`
- `I18N_INDEX_MACHINE`
- `I18N_AVAILABLE_MIN`

`NEXT_PUBLIC_SITE_URL` remains required for canonical URLs. Vercel country detection is automatic; `GEO_PROVIDER` is only needed when a different trusted edge supplies the country header.

## Local verification

Use Node.js 22 or newer:

```bash
npm ci
npm run test:i18n
npm run check
npm run build
```

This ZIP was edited in an offline environment without `node_modules`; dependency installation, the full Next.js build and browser/device checks could not be executed here. Run the commands above locally or in Vercel before production deployment.


## Follow-up: legacy translation migration

The legacy catalogs were recoverable through their original SHA-256 `sourceHash` values. They have now been mapped to the current source keys by exact hash identity. See `MULTILINGUAL-REPAIR-REPORT.md` for locale-by-locale coverage and verification.

- German, French, Italian, Spanish, Arabic and Urdu: 1,196/1,238 messages migrated each (96.6%).
- Dutch: 35/1,238 (2.8%).
- Pashto: 0/1,238 (no legacy translations supplied).
- Original catalogs are preserved in `messages/legacy/`.
- All migrated strings remain machine-translated and every non-English catalog remains draft/noindex.
- Run `npm run migrate:i18n` to repeat the deterministic migration, `npm run audit:i18n` to inspect coverage, and `npm run test:i18n` to run locale and migration safety tests.

The six larger catalogs passed exact-hash mapping with no ambiguous hashes and no placeholder-token mismatches. This is a migration of existing AI-drafted content, not a claim of native review or production translation readiness.
