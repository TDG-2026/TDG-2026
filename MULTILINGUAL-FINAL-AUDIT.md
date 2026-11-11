# TravelDeskGenie multilingual final-pass audit

## Changes applied in this package

1. Updated `lib/i18n/client.js` so localized blocks translate nested JSX text nodes, not only immediate string children. This addresses English text nested inside ordinary elements within an `<L>` block.
2. Updated `lib/i18n/catalog.js` to correctly expose the machine-translation state from catalog entries. The UI can now show the automatic-translation notice when applicable instead of always reporting `machine: false`.
3. Preserved the existing nine-locale routing, flag assets, Microsoft Store integration, SEO architecture, product functionality, and all legacy translation catalogs.

## Translation coverage found in the uploaded project

The source dictionary contains 1,238 active messages.

| Locale | Existing current-hash translations | Coverage | Missing |
|---|---:|---:|---:|
| Dutch (`nl`) | 35 | 2.8% | 1,203 |
| German (`de`) | 1,196 | 96.6% | 42 |
| French (`fr`) | 1,196 | 96.6% | 42 |
| Italian (`it`) | 1,196 | 96.6% | 42 |
| Spanish (`es`) | 1,196 | 96.6% | 42 |
| Pashto (`ps`) | 0 | 0% | 1,238 |
| Arabic (`ar`) | 1,196 | 96.6% | 42 |
| Urdu (`ur`) | 1,196 | 96.6% | 42 |

The project does not contain enough source translations to truthfully claim full translation for Dutch or Pashto. Missing messages have not been fabricated or marked as reviewed. All non-English catalogs remain draft and must remain noindex until fully translated and reviewed.

## Verification performed here

- Verified every migrated translation entry against the current source key and SHA-256 hash using `tests/i18n-migration.test.mjs`: passed (3 tests).
- Verified all nine locale flag SVG assets are present.
- The full `tests/i18n.test.mjs` suite could not run in this environment because the ZIP does not include `node_modules` and the Next.js dependency is not installed.
- A production build and browser/device QA have not been claimed as completed.

## Required local verification

From the project directory:

```bash
npm ci
export NEXT_PUBLIC_SITE_URL="https://www.traveldeskgenie.com"
npm run test:i18n
npm run audit:i18n
npm run check
npm run build
npm run check:rendered
```

`npm run audit:i18n` is expected to report incomplete locales until the missing Dutch and Pashto translations and the remaining 42 strings in the other locales are supplied.

## Important publication rule

Do not change non-English catalog status to `published` just to remove the translation notice. Publication requires complete current-source coverage and matching native-review records. This protects search engines and visitors from misleading translated-page claims.
