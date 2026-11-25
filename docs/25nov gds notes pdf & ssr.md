\# Travel Desk Genie — SEO Progress \& Next Steps



\_Last session: 25 Nov 2026. Last commit: "GDS notes guides: PDF FAQ, updated dates, descriptions" (committed, pushed, deployed).\_



\## Working rules

\- Send the files to change; get back \*\*complete, ready-to-paste files\*\* (no partial snippets).

\- Nothing is implemented until you say \*\*"action"\*\*.

\- Always run `npm run build` locally before committing and deploying.

\- Check live changes with `curl -sI <url>` after each deploy.

\- `grep -c` counts \*lines\*, and Next.js HTML is mostly one line. To count occurrences, use `grep -o "TEXT" | wc -l`.



\---



\## ✅ Done on 25 Nov 2026



\### Why the GDS Search Engine wasn't ranking (diagnosis)

\- All commands loaded from Supabase in the browser, so Google saw only "Loading GDS entries…".

\- The page said "PDF pending verification" for the notes, which is a bad signal for "notes" searches.

\- The title and H1 lacked "notes" and "Travelport".

\- The resource guides already match "Amadeus/Sabre/Travelport notes", so the keywords are now split:

&#x20; - \*\*Guides\*\* target "\[GDS] notes" (one guide per GDS).

&#x20; - \*\*Search engine\*\* targets "GDS notes" and "GDS commands comparison".

\- The Toolbar promotion \*\*stays in the hero\*\* (decided). The search bar typing animation stays.



\### Commit 1: "GDS notes PDFs + server-rendered GDS entries"

\- \*\*New\*\* `data/gdsPdfs.js`: maps guide slug → PDF file, title and colour tone.

\- \*\*New\*\* `components/PdfDownloadCard.js` + `.module.css`:

&#x20; - variants: `card`, `stacked`, `compact`;

&#x20; - reads the real file size at build time.

\- \*\*New\*\* `lib/gds/getPublishedCommands.js`:

&#x20; - server-side Supabase fetch (published rows only), reusing `getSupabaseAdmin()`;

&#x20; - `groupByCategory()`.

\- `app/\[locale]/gds-search-engine/page.jsx`:

&#x20; - `revalidate = 3600`;

&#x20; - fetches commands on the server;

&#x20; - new title "GDS Notes \& Commands: Amadeus, Travelport \& Sabre Compared";

&#x20; - new description;

&#x20; - guide titles now say "Notes".

\- `components/gds/GdsSearch.jsx`:

&#x20; - `initialEntries` prop, so there's no "Loading…" on first view;

&#x20; - new H1 "All GDS Notes \& Commands Search Engine";

&#x20; - brand "Travel Desk Genie".

\- `components/gds/GdsSeoContent.jsx` + CSS:

&#x20; - collapsible "Complete GDS notes by category" tables (all entries in the HTML);

&#x20; - three real PDF download cards replace "pending";

&#x20; - FAQ updated, plus a new "Where can I find Amadeus, Sabre and Travelport notes?".

\- `app/\[locale]/resources/\[slug]/page.js`:

&#x20; - large PDF card after the intro on the 3 notes guides;

&#x20; - compact reminder after the content.

\- `app/sitemap.js`: 3 PDFs added (no locale).

\- PDFs live in `public/download/`:

&#x20; - `amadeus-commands-notes.pdf` (753 KB)

&#x20; - `travelport-galileo-commands-notes.pdf`

&#x20; - `sabre-commands-notes.pdf`

\- `proxy.js` needed \*\*no change\*\*. Its matcher already skips paths with file extensions.



\### Commit 2: "GDS notes guides: PDF FAQ, updated dates, descriptions"

\- `data/resources.js`, 3 notes guides:

&#x20; - `updated: '2026-11-25'`;

&#x20; - new FAQ "Can I download these … notes as a PDF?";

&#x20; - descriptions end with "Free PDF download."



\### Verified

\- Localhost:

&#x20; - `FXP` appears 9 times in the GDS page HTML;

&#x20; - "Loading GDS entries" appears 0 times;

&#x20; - 17 category blocks render.

\- `/download/amadeus-commands-notes.pdf` → 200, application/pdf ✔

\- Sitemap lists the 3 PDFs ✔

\- Deployed and working live ✔



\### Search Console (25 Nov)

\- Requested indexing for 7 URLs:

&#x20; - `/en/gds-search-engine`

&#x20; - the 3 notes guides

&#x20; - the 3 PDFs

\- Sitemap showed 23 discovered (read before the PDF deploy). It should show \*\*26\*\* after the next read.

&#x20; - Check with: `curl -s https://www.traveldeskgenie.com/sitemap.xml | grep -o "<loc>" | wc -l`

&#x20; - Resubmit `sitemap.xml` in Sitemaps to refresh "Last read".



\---



\## ⏭ Resume here tomorrow



\### 1. Search Console (optional, if quota allows; about 10 per day)

Request indexing for:

\- `/en/resources/ctcm-ctce-passenger-contacts`

\- `/en/resources/passport-docs-ctcm-ctce-gds`

\- `/en/resources/adult-child-infant-name-entry-gds`

\- `/en/resources`



Request each URL once only.



\### 2. Brand text swap (carried over from 24 Nov)

Files changed on 25 Nov already say "Travel Desk Genie". The sed won't double it.



\*\*Run the replacement\*\* (skips site.js, chatbot files and locales.js on purpose):

```bash

grep -rl "Travel Genie" --include=\*.js --include=\*.jsx --include=\*.mjs app components data lib \\

&#x20; | grep -v -e '^data/site.js$' -e '^lib/genie/' -e '^data/genie/' -e '^data/locales.js$' \\

&#x20; | xargs sed -i 's/Travel Genie/Travel Desk Genie/g'

```



\*\*Review:\*\*

```bash

git diff --stat

grep -rn "Desk Genie Magic Toolbar is developed by Travel Desk Genie" app components data

```

\- Check the `SEO\_TITLES` in `app/\[locale]/resources/\[slug]/page.js`. "| Travel Genie" becomes "| Travel Desk Genie", so keep titles under about 60 characters.

\- "By Travel Genie" on guide pages becomes "By Travel Desk Genie".



\*\*Paste the new `components/Footer.js`.\*\* If you don't have it saved, ask for it again.



\*\*Build, check, commit:\*\*

```bash

npm run build

npm start        # check header, footer, tab title, FAQ, GDS page, guides

git add -A

git commit -m "Brand text: Travel Desk Genie"

```

Undo everything uncommitted if needed: `git checkout -- .`



\*\*Then send:\*\*

1\. `components/Header.js`

2\. The output of:

&#x20;  ```bash

&#x20;  grep -rn "Travel Genie" lib/genie data/genie data/locales.js

&#x20;  grep -rn "Travel <" components app

&#x20;  ```

3\. Any awkward sentences from the review grep.



Also confirm the product name matches the \*\*Microsoft Store listing\*\* exactly.



\### 3. Supabase data cleanup (table editor, `gds\_commands`)

\- \[ ] Remove "car rental" from the keywords of rows \*\*27, 51, 52, 84\*\* ("carrier" contains "car").

\- \[ ] Row \*\*15\*\*: fix the typo "csutomer". Check the Travelport email entry `MT.jim@gmail.com | EM`.

\- \[ ] Review the other categories (17 live) for similar keyword mistakes.



\### 4. Phase 2: category pages

\- Routes like `/en/gds-search-engine/pricing` and `/flights`: a Travelport/Amadeus/Sabre table per category, built from Supabase.

\- Only categories with about \*\*5+ rows\*\* get a page, to avoid thin pages.

\- Each gets its own title and description, for example "GDS Pricing Commands: Amadeus vs Galileo vs Sabre".

\- Add them to the sitemap automatically. Link from the category blocks on the main GDS page.

\- Files needed:

&#x20; - current `page.jsx`

&#x20; - `GdsSeoContent.jsx`

&#x20; - `lib/gds/getPublishedCommands.js`

&#x20; - `app/sitemap.js`

&#x20; - the list of category names, with row counts, from Supabase



\---



\## 📋 Still to do

\- \[ ] Find the remaining hardcoded text across all pages before publishing other languages.

\- \[ ] \*\*LinkedIn:\*\* fix the custom URL (`linkedin.com/in/traveldeskgenie`) or create a Company Page, then update `data/site.js`.

\- \[ ] Add `published` dates to the guides in `data/resources.js` (most have none).

\- \[ ] When the meeting-mute feature ships, remove both slugs from `UNVERIFIED\_RESOURCE\_SLUGS`.

&#x20; - ⚠ Confirm Ctrl+Alt+K really covers Slack and Webex before release.

\- \[ ] When a product launches, fill in its details in `data/products.js` and set `published: true`.

\- \[ ] Optional: send `scripts/i18n-extract.mjs` to clean old entries from `messages/\*.json`. The 3 notes guide descriptions changed on 25 Nov.

\- \[ ] \*\*Authority (most important now):\*\*

&#x20; - share the 3 PDFs and the GDS Search Engine in travel-agent Facebook and WhatsApp groups and on LinkedIn;

&#x20; - make a YouTube video "Free Amadeus, Galileo \& Sabre notes PDF + all-GDS command search" that links to the page;

&#x20; - YouTube walkthroughs of the DOCS and infant entries;

&#x20; - never buy links or mentions.

\- \[ ] Make sure `SUPABASE\_URL` and `SUPABASE\_SECRET\_KEY` stay set on hosting. Without them, the GDS page falls back to browser loading and loses the SEO benefit.



\---



\## 📅 Search Console check-ins

\- \*\*\~28–30 Nov 2026:\*\*

&#x20; - Inspect `/en/gds-search-engine`. The crawl date should be after 25 Nov.

&#x20; - "View crawled page" → HTML → search for `FXP` to confirm Google sees the commands.

&#x20; - Check whether the PDFs are indexed. "Discovered – currently not indexed" at first is normal.

\- \*\*\~15–22 Dec 2026:\*\*

&#x20; - "Excluded by noindex" (was 211) should be shrinking.

&#x20; - "Page with redirect" may rise temporarily. Both are normal.

&#x20; - \*\*Don't\*\* click "Validate fix" or use the Removals tool.

\- \*\*\~22 Dec 2026:\*\*

&#x20; - Compare clicks and CTR on the 6 GDS guides, the GDS Search Engine and the PDFs with the baseline below.

&#x20; - Check the queries "amadeus notes", "sabre notes", "travelport notes", "gds notes" in Performance → Queries.



\### Baseline (GSC, last 28 days to 22 Nov 2026)

\- Total: \*\*6 clicks / \~1,238 impressions\*\*

\- Indexed \*\*26\*\* · Not indexed \*\*220\*\* (211 noindex, 4 redirect, 4 discovered, 1 crawled)

\- passport-docs guide: 3 clicks / 346 impr / pos 8.3

\- name-entry guide: 1 / 342 / pos 8.6

\- sabre-commands: 0 / 168 / pos 19

\- amadeus-commands: 1 / 107 / pos 17.3

\- galileo-commands: 0 / 82 / pos 15.6

\- ctcm-ctce guide: not appearing yet. \*\*Update 25 Nov:\*\* you report it ranking around position 7.

\- gds-search-engine: not ranking for "notes" queries (before the 25 Nov changes)

