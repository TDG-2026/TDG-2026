# Travel Desk Genie — SEO, AEO, GEO and SXO optimization

**Date:** 9 November 2026  
**Scope:** Supplied Next.js source archive and Lighthouse/SAGE findings  
**Status:** Source changes applied; production deployment and live browser validation remain outstanding.

## Work completed

### SEO and technical discoverability
- Standardized publisher identity as **Travel Desk Genie** and product brand as **Travel Genie** in organization and software-application structured data.
- Standardized the support email on the configured site identity so the footer, contact links, homepage account-support copy and JSON-LD use the same address.
- Corrected Open Graph image dimensions to the actual 512 × 512 mascot asset and set Twitter cards to `summary_large_image`.
- Removed a country-only PostalAddress from Organization JSON-LD; no physical address is asserted without locality-level details.
- Removed incomplete/unsupported `Question.text` from FAQPage structured data.
- Removed unsupported Speakable markup from general homepage and resource content.
- Removed subscription stock-availability assertions from SoftwareApplication Offer markup.
- Removed unverified meeting-audio claims from public product-feature copy and Genie answers. The two meeting-mute resource pages are excluded from the public resource list, static params, sitemap and AI-readable feeds; legacy URLs receive permanent redirects to the resource library.
- Removed unverified publication/modified dates from article metadata, visible date labels and structured data when the source record has no verified date.
- Kept draft translations noindex and excluded from published-language discovery until catalog publication checks pass.

### AEO and GEO
- Preserved visible question-and-answer content, concise answer paragraphs, ordered how-to steps and comparison tables.
- Aligned Organization, WebSite, WebPage and SoftwareApplication entity relationships around a stable publisher and product brand.
- Kept `/llms.txt` and `/llms-full.txt` generated from the public resource set, with the full reference date generated at request/build time.
- Kept robots rules open to search and AI retrieval crawlers while disallowing the private API route.
- Added a repeatable `npm run check:seo` validation and included it in `npm run check` / release checks.

### SXO, accessibility and performance
- Resized the Genie chat avatar from 512 × 512 to 96 × 96. File size reduced from 37,598 bytes to 2,718 bytes (about 92.8% smaller).
- Corrected contrast on the GDS format suffix labels by removing reduced opacity and inheriting the active button's foreground color.
- Replaced the animated status dot's box-shadow pulse with a transform/opacity pulse on a pseudo-element.
- Kept keyboard roving-tabindex behavior for tab controls; `tabindex="-1"` on inactive tabs is intentional and paired with arrow-key navigation, not a keyboard trap.
- Removed the `.env.local` file from the deliverable archive. Configure deployment secrets through the deployment platform and use `.env.example` as the variable-name reference.

## Validation performed

Passed in this environment:
- `NEXT_PUBLIC_SITE_URL=https://www.traveldeskgenie.com npm run check`
  - Release/source checks passed.
  - SEO/AEO source validation passed.
- `node scripts/check-answer-length.mjs`
- `node scripts/check-genie.mjs`
  - Zero errors; draft locale incompleteness is reported as warnings and must remain noindex.
- `node --check` on changed non-JSX JavaScript modules and `next.config.mjs`.
- Avatar output dimensions verified as 96 × 96; file size verified as 2,718 bytes.

## Not verified here

- `npm ci` timed out in this environment before Next.js and its full dependency tree were installed.
- Consequently, the Next.js production build, JSX parser pass, i18n integration tests and rendered-route audit could not be completed here.
- No production deployment was performed. Live response headers, redirects, canonical tags, sitemap, robots, llms files, structured data rendering, and deployed image delivery still require post-deployment checks.
- No PageSpeed Insights/CrUX run or fresh Lighthouse browser run was possible, so no new Core Web Vitals score or 100/100 third-party audit score is claimed.

## Production release checklist

1. Configure environment variables from `.env.example` in the deployment platform. Do not commit `.env.local` or API keys.
2. Run `npm ci` in CI/deployment and then `npm run release`.
3. Deploy to `https://www.traveldeskgenie.com` and verify HTTP → HTTPS and non-www → www redirects.
4. Verify `/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/llms-full.txt` on the live host.
5. Test the two retired meeting-mute URLs return the intended permanent redirects.
6. Run Google Rich Results Test and Schema Markup Validator on the homepage, product page and representative resource pages.
7. Run Lighthouse mobile and desktop; confirm contrast, image transfer size, render-blocking requests, unused JS, long tasks and animation diagnostics.
8. Submit the sitemap in Google Search Console and Bing Webmaster Tools; monitor indexing, crawl errors and real-user Core Web Vitals.
9. Keep all draft locales noindex until human translation review and locale completeness checks pass.

## Important limitation

A source-code audit cannot guarantee a 100/100 score, Google ranking, AI citation, or conversion result. Those outcomes depend on deployment, live rendering, real users, crawl/index decisions, competition, authority and ongoing measurement. This report distinguishes verified source changes from work that still requires the production environment.
