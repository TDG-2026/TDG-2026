# Travel Desk Genie — Social Identity, SEO and Store Trust Update

Date: 12 November 2026
Input: `Best seo Fix Error project.zip`
Scope: Official social profile integration, business contact consistency, Organization JSON-LD, and lightweight UX links.

## Changes made

- Added all five business-confirmed social profiles (LinkedIn, Facebook, Instagram, YouTube and X) to a single `socialProfiles` source in `data/site.js`.
- Generated Organization `sameAs` values from that same list to keep visible links and entity identity consistent.
- Added the five official profile links to the global footer and Contact page.
- Updated the primary business enquiry email to `inquiry@traveldeskgenie.com`.
- Added `traveldeskgenie@gmail.com` as a second general contact email.
- Updated Organization JSON-LD contact points to expose the primary enquiry address, general contact address and existing WhatsApp telephone.
- Added compact, responsive footer link styling only. No social widgets, feeds, embeds, analytics scripts, icon libraries or external JavaScript were introduced.
- Extended `scripts/check-seo.mjs` to validate the confirmed email addresses and consistency of the five social profile URLs.

## Microsoft Store protection

The Microsoft Store installation journey was intentionally left unchanged. These source files are byte-for-byte identical to the supplied ZIP:

- `app/[locale]/download/page.js`
- `components/Header.js`
- `components/GetStarted.js`

The existing official Microsoft Store product URL and product ID remain in `data/site.js`. The existing `SoftwareApplication` JSON-LD continues to use that URL for `downloadUrl`, `installUrl` and `sameAs`, and the product ID as its identifier. No ratings, reviews, certifications, awards, download counts or endorsement claims were invented.

This preserves the current “Get it from Microsoft Store” CTA wording, destination, appearance and behaviour.

## Performance and UX approach

- Social links are ordinary server-rendered anchors in existing server components/pages.
- No client-side social SDKs, third-party embeds, iframe widgets, tracking pixels or extra network requests were added.
- External links use `target="_blank"` with `rel="noopener noreferrer"`.
- Link labels remain visible and accessible to keyboard and assistive-technology users.

## Validation results

Passed:
- `node scripts/check-seo.mjs`
- `node scripts/release-check.mjs`
- `node scripts/check-resource-routes.mjs`
- `node scripts/check-genie.mjs`

Not completed:
- `npm ci` did not finish within the available execution window.
- Consequently, the Next.js production build and full JSX compilation were not verified. A subsequent build attempt stopped because the timed-out dependency installation left `next/dist/compiled/babel/parser` unavailable.
- No live deployment, Google Search Console inspection, Schema Markup Validator run, Lighthouse test or Core Web Vitals measurement was performed.

## Important SEO notes

Social profile links and `sameAs` can help search engines and answer systems associate official profiles with the organization, but they do not guarantee rankings, Knowledge Panels or AI citations. Keep the business name, website URL, logo and contact details consistent on the linked profiles. The LinkedIn URL was used exactly as supplied; consider changing it to a clean company-page URL if the business later creates or confirms one.

The Microsoft Store listing provides a useful trust and access route because the product schema identifies the official listing and product ID. Keep the Store publisher identity and website publisher identity consistent. Do not add review/rating schema unless real, eligible, verifiable review data is available.

## Deployment

1. Keep the production environment variables and secrets on the hosting platform; do not upload private `.env` files.
2. Install dependencies with Node.js 22 or newer using `npm ci`.
3. Run `npm run release`.
4. Deploy the updated source.
5. Check the footer and Contact page on desktop and mobile.
6. Validate homepage Organization JSON-LD with Schema Markup Validator.
7. Verify the official Microsoft Store CTA still opens the same listing.
8. Re-run Lighthouse/PageSpeed Insights and compare against the pre-deployment baseline.
