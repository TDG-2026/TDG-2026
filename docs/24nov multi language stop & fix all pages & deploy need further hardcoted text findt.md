\# Travel Desk Genie — SEO Progress \& Next Steps



\_Last session: 24 Nov 2026. Last commit: "Before brand text swap" (committed and pushed).\_



\## Working rules

\- Send the files to change; get back \*\*complete, ready-to-paste files\*\* (no partial snippets).

\- Always run `npm run build` locally before committing and deploying.

\- Check live changes with `curl -sI <url>` after each deploy.



\---



\## ✅ Done



\### Languages (the 220 "not indexed" pages)

\- `lib/i18n/published.js` is the \*\*only switch\*\* for public languages: `PUBLISHED\_LOCALES = \['en']`.

\- `proxy.js`: unpublished locales redirect \*\*307 → same page in English\*\* (`/ur` → `/en`); browser/region detection only offers published locales.

\- `app/\[locale]/layout.js`: production builds only published locales (dev builds all, for preview).

\- `app/sitemap.js`: uses `PUBLISHED\_LOCALES`; `/languages` removed; released products are added automatically.

\- `lib/i18n/metadata.js`: noindex and hreflang driven by `published.js`; hreflang only when 2+ languages are published.

\- `LanguageSwitcher.js`: hidden while only English is published.

\- `LanguageSuggest.js`: suggests only published languages.

\- `/languages` page: noindexed; upcoming languages listed as plain text, no links.

\- "More than 80 languages" FAQ answer fixed in `data/answers.js`.

\- \*\*To publish a language later:\*\* native review to 100% → add its code to `PUBLISHED\_LOCALES` → build and deploy.



\### Verified live

\- `/ur` → 307 → `/en` ✔

\- `/ar/pricing` → 307 → `/en/pricing` ✔

\- `/en` → 200 ✔

\- Unknown URL → real 404 ✔

\- robots.txt and sitemap.xml correct (only `/en` URLs, no localhost, no `#` fragments) ✔



\### Waste pages

\- 8 "Details coming" products: already noindexed (`published: false`); \*\*removed from the footer\*\*. Footer shows released products only, plus "All products."

\- `/privacy` → \*\*308 permanent redirect\*\* → `/security-and-privacy` (alias in `proxy.js`); cookie banner and `site.legal` updated.

\- Two mute guides \*\*kept separate\*\* (different features); both still noindexed via `UNVERIFIED\_RESOURCE\_SLUGS` until the feature ships.

&#x20; - All-apps guide now leads with \*\*Microsoft Teams and Google Meet\*\*; Zoom guide owns "mute Zoom."

&#x20; - ⚠ Confirm that Ctrl+Alt+K really covers \*\*Slack and Webex\*\* before release.

\- `app/\[locale]/\[...rest]/page.js`: clean 404 metadata (no canonical).



\### Search titles

\- New `SEO\_TITLES` in `app/\[locale]/resources/\[slug]/page.js` that match real queries (DOCS, CTCE/CTCM, child/infant names, Amadeus/Galileo/Sabre command lists).



\### Brand (started)

\- Brand decided: \*\*Travel Desk Genie\*\* (`shortName: 'Travel Genie'` kept as an alternate name for search).

\- `data/site.js` and `lib/seo.js` updated (name, product = "Travel Desk Genie Magic Toolbar", schema alternate names).

\- Next.js upgraded to \*\*16.4.6\*\*.



\---



\## ⏭ Resume here tomorrow: brand text swap



\*\*Step 2 — run the replacement\*\* (skips site.js, chatbot files and locales.js on purpose):

```bash

grep -rl "Travel Genie" --include=\*.js --include=\*.mjs app components data lib \\

&#x20; | grep -v -e '^data/site.js$' -e '^lib/genie/' -e '^data/genie/' -e '^data/locales.js$' \\

&#x20; | xargs sed -i 's/Travel Genie/Travel Desk Genie/g'

```



\*\*Step 3 — review:\*\*

```bash

git diff --stat

grep -rn "Desk Genie Magic Toolbar is developed by Travel Desk Genie" app components data

```



\*\*Step 4 — paste the new `components/Footer.js`\*\* (logo "Travel Desk \*\*Genie\*\*", "Magic Toolbar is developed by Travel Desk Genie."). If you don't have it saved, ask for it again.



\*\*Step 5 — build and check:\*\*

```bash

npm run build

npm start        # check header, footer, browser-tab title, FAQ at localhost:3000/en

git add -A

git commit -m "Brand text: Travel Desk Genie"

```

Undo everything uncommitted if needed: `git checkout -- .`



\*\*Then send:\*\*

1\. `components/Header.js` (the logo is probably split, like the footer's)

2\. The output of:

&#x20;  ```bash

&#x20;  grep -rn "Travel Genie" lib/genie data/genie data/locales.js

&#x20;  grep -rn "Travel <" components app

&#x20;  ```

3\. The output of the Step 3 grep for awkward sentences.



Also confirm the product name matches the \*\*Microsoft Store listing\*\* exactly.



\---



\## 📋 Still to do after the brand swap

\- \[ ] \*\*LinkedIn:\*\* fix the custom URL ("Edit public profile \& URL" → `linkedin.com/in/traveldeskgenie`), or create a \*\*Company Page\*\*; then update `data/site.js`.

\- \[ ] \*\*Request indexing\*\* in Search Console (URL Inspection → Request indexing) for:

&#x20; - `/en/resources/passport-docs-ctcm-ctce-gds`

&#x20; - `/en/resources/ctcm-ctce-passenger-contacts` ← most important

&#x20; - `/en/resources/adult-child-infant-name-entry-gds`

&#x20; - `/en/resources/amadeus-commands-notes`

&#x20; - `/en/resources/travelport-galileo-commands-notes`

&#x20; - `/en/resources/sabre-commands-notes`

\- \[ ] Add `published` / `updated` dates to the guides in `data/resources.js` (most have none).

\- \[ ] When the meeting-mute feature ships: remove both slugs from `UNVERIFIED\_RESOURCE\_SLUGS`.

\- \[ ] When a product launches: fill in its details in `data/products.js` and set `published: true`.

\- \[ ] Optional: send `scripts/i18n-extract.mjs` so unused entries get cleaned out of `messages/\*.json` (the files keep growing).

\- \[ ] Authority: share the guides and the free GDS Search Engine in travel-agent groups; YouTube walkthroughs of the DOCS and infant entries. Never buy links or mentions.



\---



\## 📅 Search Console check-ins

\- \*\*\~15–22 Dec 2026:\*\* "Excluded by noindex" (was 211) should be shrinking; "Page with redirect" may rise temporarily. Both are normal. \*\*Don't\*\* click "Validate fix" or use the Removals tool.

\- \*\*\~22 Dec 2026:\*\* compare clicks and CTR on the 6 GDS guides with the baseline below.



\### Baseline (GSC, last 28 days to 22 Nov 2026)

\- Total: \*\*6 clicks / \~1,238 impressions\*\*

\- Indexed \*\*26\*\* · Not indexed \*\*220\*\* (211 noindex, 4 redirect, 4 discovered, 1 crawled)

\- passport-docs guide: 3 clicks / 346 impr / pos 8.3

\- name-entry guide: 1 / 342 / pos 8.6

\- sabre-commands: 0 / 168 / pos 19

\- amadeus-commands: 1 / 107 / pos 17.3

\- galileo-commands: 0 / 82 / pos 15.6

\- ctcm-ctce guide: not appearing yet

