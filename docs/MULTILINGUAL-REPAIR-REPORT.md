# Translation-key recovery and migration report

## Recovery method

The archive did not include `.git` history, but the legacy locale catalog entries retained `sourceHash` values. Those are SHA-256 hashes of the exact English source text. I built a unique index of the current 1,238 source messages by hash and migrated only entries whose legacy `sourceHash` matched exactly one current source message.

This is safer than mapping by old translation key or approximate text similarity.

## Results

| Locale | Migrated | Current source total | Coverage | Missing |
|---|---:|---:|---:|---:|
| Dutch (`nl`) | 35 | 1,238 | 2.8% | 1,203 |
| German (`de`) | 1,196 | 1,238 | 96.6% | 42 |
| French (`fr`) | 1,196 | 1,238 | 96.6% | 42 |
| Italian (`it`) | 1,196 | 1,238 | 96.6% | 42 |
| Spanish (`es`) | 1,196 | 1,238 | 96.6% | 42 |
| Pashto (`ps`) | 0 | 1,238 | 0% | 1,238 |
| Arabic (`ar`) | 1,196 | 1,238 | 96.6% | 42 |
| Urdu (`ur`) | 1,196 | 1,238 | 96.6% | 42 |

For the six large legacy catalogs, each of the 1,196 matching hashes mapped to one unique current key. No duplicate-hash conflicts were found. All migrated entries were non-empty and passed placeholder-token parity checks.

## What changed

- Original locale catalogs were preserved unchanged in `messages/legacy/`.
- Current `messages/<locale>.json` files were regenerated using current source keys.
- Every migrated entry carries the exact current `sourceHash`.
- Every migrated entry is marked `machine-translated`, not human-reviewed.
- Each migrated entry records its original key in `migration.legacyKey`.
- All eight non-English catalog roots remain `status: draft`.
- `messages/migration-report.json` records migration counts.
- `scripts/migrate-legacy-translations.mjs` makes the operation reproducible.
- `npm run migrate:i18n` reruns the migration from preserved legacy catalogs.
- `npm run audit:i18n` reports current source coverage.
- `tests/i18n-migration.test.mjs` checks key/hash integrity, draft status and preservation of the legacy originals.
- `npm run test:i18n` now includes the migration safety tests.

## Important limitations

- Pashto has no recoverable legacy translations in the supplied ZIP.
- Dutch has only 35 recoverable entries.
- The other six languages are missing 42 of the current 1,238 source strings.
- Existing legacy metadata identified the translations as AI-drafted/not human-reviewed. The migration preserves that distinction. No locale has been marked published.
- Do not remove `noindex` protection or add these locales to sitemap/hreflang as production translations until all strings are complete and a competent native reviewer has reviewed them.

## Verification completed

- Migration script syntax check passed.
- Audit script syntax check passed.
- Migration safety tests: 3 passed, 0 failed.
- Hash matching: no collisions or ambiguous mappings.
- Placeholder parity: no mismatches among migrated entries.
- Full Next.js build, complete release pipeline and browser/device QA were not run in this environment.

## Next steps

1. Review the migrated language UI and content locally.
2. Translate the 42 missing strings in each of the six 96.6%-complete languages.
3. Complete Dutch and Pashto dictionaries.
4. Have each locale reviewed by a qualified native-language reviewer.
5. Only then create valid review records and mark a locale published.
6. Run `npm run release` and verify rendered pages before production deployment.
