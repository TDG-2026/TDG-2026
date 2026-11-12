# Travel Desk Genie — meeting guide URL restoration

Date: 9 November 2026

## Root cause

The two article records existed in `data/resources.js`, but the project deliberately made them unreachable in two places:

1. `next.config.mjs` permanently redirected both locale paths to `/[locale]/resources`.
2. `data/resources.js` filtered both slugs out of the exported `resources` array. The resource detail route uses `dynamicParams = false` and builds static params from that array, so removing the redirect alone would still leave the pages unavailable.

The SEO validation script also explicitly required both resources to be absent.

## Changes made

- Removed the two permanent redirects while preserving the canonical host redirect.
- Restored both resource records to the route data so `generateStaticParams()` includes them.
- Added a release-status warning at the top of both articles and labelled them as pre-release guides in the resource library.
- Added `noindex,follow` metadata for both pages until the Windows meeting-audio feature is compiled, tested and approved.
- Kept the two guides out of the XML sitemap, `/llms.txt`, and `/llms-full.txt` while they remain unverified.
- Updated SEO validation to require the URLs to exist.
- Added `scripts/check-resource-routes.mjs` and wired it into `npm run check:seo` to prevent accidental reintroduction of the redirect/filter regression.

## Validation performed

Passed:
- `node scripts/check-resource-routes.mjs`
- `node scripts/check-seo.mjs`
- `node scripts/check-genie.mjs` (0 errors; draft-locale warnings remain)
- `NEXT_PUBLIC_SITE_URL=https://www.traveldeskgenie.com node scripts/release-check.mjs`
- `node --check` for the changed non-JSX JavaScript modules

Not performed:
- Next.js production build and browser test. Dependency installation was not available in this environment, so the production output is not verified.
- Production deployment. The live website will not change until this source is deployed.

## Release safety

The handoff document says the meeting-audio implementation was not yet compiled or tested. The pages therefore remain accessible for existing links but are explicitly marked as pre-release and excluded from indexing and AI discovery feeds. Remove the warning/noindex guard and add them to indexable resources only after the Windows app feature passes its release checklist.
