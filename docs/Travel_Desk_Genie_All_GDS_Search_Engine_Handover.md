# Travel Desk Genie --- All GDS Search Engine

## Project Handover & Restart Brief

**Document purpose:** Preserve the complete requirements, decisions,
architecture recommendations, assets, content, and next steps for
continuing the Travel Desk Genie All GDS Search Engine project in a
future ChatGPT session.

**Project status:** Discovery and planning. Implementation has **not**
been authorized or started.

**Website:** https://www.traveldeskgenie.com\
**Current working project directory (user's machine):** `D:\tdgmain`\
**Website stack known from prior project handover:** Next.js App Router,
Next.js 16.4.3, React 19.2, JavaScript/JSX, deployed through Vercel.
Confirm the current local source before editing because the user has
made later changes.

------------------------------------------------------------------------

# 1. Critical working instructions

1.  The user explicitly asked the assistant to **listen, study, and
    collect requirements** until they say to implement. Do not modify
    files, generate code, create a ZIP, alter routes, change the live
    website, or start database setup until the user explicitly
    authorizes implementation.
2.  Do not ask unnecessary questions. Use professional judgment for
    implementation decisions once authorized, but do not invent business
    facts, GDS commands, credentials, legal information, product
    capabilities, or security claims.
3.  The user wants a complete, professional, fast, responsive
    search-engine page that fits the existing Travel Desk Genie website.
4.  Preserve existing website functionality, SEO infrastructure,
    localization, navigation, footer, chatbot, Microsoft Store
    integration, and existing product pages unless the user explicitly
    authorizes a change.
5.  Do not change the Microsoft Store download destination or existing
    app-installation integration.
6.  The desktop keyboard shortcut `Ctrl + Shift + G` belongs **only to
    the Windows desktop Magic Toolbar**. Do not advertise it or
    introduce it as a website shortcut.
7.  The user has corrected the slogan. Always use the exact wording:
    **"Time is money. Travel Desk Genie saves both."** Do not use
    "Travel Genie saves both" or any other shortened variant.
8.  The page title and positioning are fixed:
    -   **Page name:** Travel Desk Genie All GDS Search Engine
    -   **Supporting line:** Instant GDS Commands Discovery with All GDS
        Comparison
9.  User wants the work to be future-proof for expansion from the
    current 298 entries to 5,000+ entries. Design for growth from the
    beginning.
10. Continue to distinguish the public website search engine from the
    Windows desktop toolbar. The website must not claim to execute live
    GDS commands or guarantee that every stored command is valid for
    every host, airline, market, or situation.

------------------------------------------------------------------------

# 2. Project goal

Create a dedicated website page called **Travel Desk Genie All GDS
Search Engine**.

Its purpose is to let travel agents and other relevant visitors
instantly discover stored GDS command/reference entries and compare the
corresponding formats across:

-   Travelport
-   Amadeus
-   Sabre

The main user journey:

1.  Visitor reaches the page.
2.  A prominent search bar is immediately visible.
3.  The Genie mascot/icon is integrated into the search experience.
4.  Visitor searches by task, category, topic, keyword, or command.
5.  Relevant results appear quickly.
6.  Each result shows the available Travelport, Amadeus, and Sabre
    values side by side.
7.  Each individual command has its own copy control.
8.  The user receives clear confirmation after copying.
9.  The user can refine the search or browse/filter categories.

This is a **GDS reference/search and comparison library**, not an
internet-wide search engine, a live GDS terminal, or a command execution
service.

------------------------------------------------------------------------

# 3. Fixed branding and page content

## 3.1 Page identity

**Primary heading/name:** Travel Desk Genie All GDS Search Engine

**Supporting line:** Instant GDS Commands Discovery with All GDS
Comparison

**Brand slogan:** Time is money. Travel Desk Genie saves both.

## 3.2 Main visual concept

The user supplied a screenshot of the desktop Decode interface. The page
should use the existing visual asset:

`tdgmain\public\images\screens\decode.webp`

This image is already used somewhere in the website. Reuse the existing
asset; do not create a duplicate or replace it with a generated image
unless the user later asks.

The supplied Decode screenshot shows the three GDS columns: -
Travelport - Amadeus - Sabre

It includes Decode rows for City, Airline, Country, Car company, Hotel
company, Help, and an aircraft-type example.

The user also supplied a separate Genie mascot image (a blue-and-gold
magical genie character). Use the existing website asset if its exact
path is confirmed from the source project. Do not assume a filename or
path that has not been checked.

## 3.3 Visual style references supplied

The user provided screenshots of: 1. A compact floating desktop search
bar with the Genie icon and placeholder similar to:
`Search GDS entries... e.g. encode, decode city, amadeus hotel` 2. A GDS
Entries Manager table with columns: Category, Topic, Travelport,
Amadeus, Sabre, Search keywords. 3. A Decode result display with three
colour-coded GDS columns. 4. A large Genie mascot image.

The web page should adapt the product's recognisable three-column
comparison style: - Travelport: blue - Amadeus: green - Sabre:
peach/orange

The page should be polished, readable, responsive, accessible, and
consistent with the current website design system. Avoid heavy animation
and unnecessary visual clutter.

------------------------------------------------------------------------

# 4. Search engine functionality

## 4.1 Always-visible search

The search bar should be prominent and remain readily accessible while
visitors scroll (for example, sticky positioning where it works well
with the existing header). Do not obstruct navigation or mobile screens.

The Genie icon should appear within or beside the search input.

Suggested placeholder:
`Search GDS entries... e.g. encode, decode city, amadeus hotel`

Do not display the desktop keyboard shortcut on the website.

## 4.2 Search matching

Search should support: - Category - Topic - Search keywords - Travelport
command/reference - Amadeus command/reference - Sabre
command/reference - Optional description field if included in the data
model

Recommended matching behaviour: - Normalize case and whitespace. - Match
multiple search terms sensibly. - Support common natural-language
queries such as "decode city", "encode airline", or "amadeus hotel". -
Return useful relevant matches without inventing commands. - Provide a
clear empty state and a way to clear the query. - Avoid claiming
fuzzy/semantic search unless actually implemented and tested.

The desktop application's documented matching rule is that every typed
word must appear in Category, Topic, Keywords, or command text. This is
useful product context, but the web implementation can be designed
independently and must be accurately documented according to its actual
behaviour.

## 4.3 Result display

Each result should clearly identify: - Category - Topic - Travelport
value, if present - Amadeus value, if present - Sabre value, if
present - Optional description/help text - Search keywords only where
useful

Show the three systems side by side on desktop. On smaller screens, use
a clear responsive layout without forcing tiny columns or horizontal
overflow.

Use distinct system colours consistently: - Travelport --- blue -
Amadeus --- green - Sabre --- peach/orange

## 4.4 Copy controls

Each individual GDS command/reference must have its own copy button.

Expected behaviour: - Copy only the selected command. - Show a visible
"Copied" or check confirmation. - Use accessible labels and keyboard
support. - Do not copy empty values. - Do not claim that copying sends
or executes the command in a GDS.

## 4.5 Browsing and filtering

Recommended: - Category filters. - Search result count. - Clear
search/filter control. - Sensible sorting or grouping. - Pagination or
virtualization if it becomes useful at larger data volumes.

Do not render thousands of result rows at once.

------------------------------------------------------------------------

# 5. Current data and CSV

The user supplied:

`GDS_Entries_Updated_2026-11-12.csv`

The prior review identified: - 298 entries - Six current columns: 1.
Category 2. Topic 3. Travelport 4. Amadeus 5. Sabre 6. Search keywords

The CSV includes varied travel-agent/GDS topics, including Encode,
Decode, PNR fields and remarks, hotels, cars, ticketing/stored fares,
pricing, queues, profiles/quality control, seats/PNR retrieval,
refunds/ticket voids, Timatic, and other operational reference entries.

Important data-quality notes: - Some GDS columns are legitimately
empty. - Do not fill missing values with invented commands. - Some
entries may contain example email addresses or external URLs. Review
them before public publication to ensure no personal or confidential
data is exposed. - Validate CSV encoding, headers, row shape, duplicate
records, malformed values, and formula-injection risks during import. -
Preserve exact command punctuation and special characters. Do not let
spreadsheet import/export silently alter command strings.

The original CSV should remain available as a source/import/export
format. The user wants a more robust long-term system than relying on a
CSV file as the live production data store.

------------------------------------------------------------------------

# 6. Long-term data architecture recommendation

The assistant recommended moving beyond a CSV-only production source and
using:

**PostgreSQL through Supabase**, integrated with the existing
Next.js/Vercel application.

This is a recommendation, not yet implemented or approved as a final
vendor decision. Before implementation, inspect the current deployment,
data needs, budget, existing providers, and environment setup. Do not
create a Supabase project or credentials without authorization.

## 6.1 Why a database is recommended

-   Central source of truth.
-   Reliable structured records.
-   Indexed lookup for category, topic, and command fields.
-   Search support.
-   Protected admin operations.
-   Controlled imports and exports.
-   Backup and recovery options.
-   Easier growth beyond 5,000 entries.
-   Avoids rebuilding the search architecture when the dataset grows.

The current 298-entry CSV should be importable into the database after
validation. CSV and JSON should remain supported for interchange and
backup.

## 6.2 Suggested data model

Suggested GDS entry fields:

  Field           Purpose
  --------------- ----------------------------------------
  `id`            Stable unique identifier
  `category`      Entry category
  `topic`         Specific task/topic
  `travelport`    Travelport command/reference; nullable
  `amadeus`       Amadeus command/reference; nullable
  `sabre`         Sabre command/reference; nullable
  `keywords`      Searchable keyword list/text
  `description`   Optional explanation
  `status`        Draft/published/archived, if required
  `created_at`    Creation timestamp
  `updated_at`    Last update timestamp
  `created_by`    Admin identity/reference, if needed
  `updated_by`    Admin identity/reference, if needed

Possible additional fields should be added only when a real requirement
exists. Keep the schema maintainable rather than overengineering it.

## 6.3 Search strategy

Recommended initial strategy: - PostgreSQL indexes for category/topic
and searchable command data. - PostgreSQL full-text search or a
carefully designed indexed search query. - Debounced client input. -
Server-side result limiting and pagination. - Cache public search
results where appropriate. - Controlled cache invalidation when admins
update entries. - Do not download the entire database to the browser on
initial page load.

A separate search service is not necessary for 5,000 records unless real
measurements later show that PostgreSQL is insufficient. Do not add
Elasticsearch, Algolia, Meilisearch, or another external service without
evidence that it is needed.

------------------------------------------------------------------------

# 7. Protected administration system

The user wants the ability to add and remove entries, and the assistant
recommended a secure management dashboard.

Suggested capabilities:

1.  Admin authentication.
2.  Add a GDS entry.
3.  Edit an existing entry.
4.  Delete/archive an entry with confirmation.
5.  Search/filter existing entries.
6.  Bulk import CSV.
7.  Bulk import JSON.
8.  Export CSV.
9.  Export JSON.
10. Import preview before applying changes.
11. Duplicate detection.
12. Validation and error reporting.
13. Backup before destructive Replace operations.
14. Change history/audit log.
15. Restore/rollback strategy where feasible.

Security requirements: - Public visitors must never receive admin
credentials or service-role keys. - Enforce authorization on the server
for every create/update/delete/import action. - Do not rely on hiding
admin UI controls as security. - Use least-privilege database access and
row-level security where appropriate. - Validate and sanitize imported
data. - Protect against CSV/spreadsheet formula injection in exported
files. - Rate-limit or otherwise protect sensitive endpoints where
appropriate. - Keep secrets in environment variables, never in source
control or client-side code.

The public search endpoint should expose only published, approved
entries and only the fields required for search/display.

------------------------------------------------------------------------

# 8. Import/export and data integrity

CSV and JSON should both be supported.

Recommended import process: 1. Upload file. 2. Parse and validate file.
3. Show a preview and counts. 4. Identify missing/invalid fields. 5.
Identify likely duplicates. 6. Let admin choose safe merge or replace
behaviour. 7. Create backup before destructive changes. 8. Apply changes
transactionally where possible. 9. Show an import report with inserted,
updated, skipped, and rejected counts.

Recommended duplicate key: - Start with normalized `category + topic`,
but inspect real data before enforcing uniqueness. Do not merge two
records solely because their names look similar if they represent
different tasks.

Preserve command text exactly. CSV export should handle commas, quotes,
line breaks, UTF-8, and spreadsheet formula-injection safety.

------------------------------------------------------------------------

# 9. Microsoft Store and desktop application boundary

The desktop application is **Travel Genie Magic Toolbar**. Its existing
Microsoft Store destination must not be changed.

Known Store product ID: `9P1J21G2Z9LZ`

Existing Store URL: `https://apps.microsoft.com/detail/9P1J21G2Z9LZ`

The website search engine is a separate web experience. Do not imply
that: - the website search page is the Windows app; - website search
results are live GDS host responses; - copying a reference executes a
command; - website admin changes automatically synchronize to a user's
desktop installation unless a real sync architecture is implemented and
verified.

The user explicitly said not to change anything in "Get it from
Microsoft Store".

## 9.1 Desktop shortcut

`Ctrl + Shift + G` is exclusively the Windows desktop Magic Toolbar
shortcut.

It must: - Remain in the desktop application. - Not be introduced as a
website shortcut. - Not be advertised on the new website search page. -
Not be implemented as a browser keyboard shortcut.

------------------------------------------------------------------------

# 10. Existing desktop application reference

Project handover documentation describes the Windows GDS Smart Search
feature:

-   Floating search bar opened/hidden with `Ctrl + Shift + G`.
-   Searches Category, Topic, Keywords and command fields.
-   Results grouped by Category.
-   Travelport blue, Amadeus green, Sabre peach.
-   Individual command boxes copy on click and show confirmation.
-   Empty search clears results.
-   Manager supports add/edit/delete, filtering, defaults, import and
    export.
-   Data is stored locally in `Encode.json`.
-   CSV/JSON import/export is supported.
-   Replace-all import creates a timestamped backup.
-   Saving is atomic through temporary-file replacement.
-   The desktop app is a local reference library, not live GDS
    execution.

These details are source-project context for understanding the product.
The website implementation must be independently built and tested; do
not claim the web version has desktop features unless implemented.

------------------------------------------------------------------------

# 11. SEO, AEO, GEO and SXO

The page should fit the existing website's SEO and localization
architecture.

## 11.1 SEO

Plan: - Unique title and meta description. - Canonical URL consistent
with the site's locale URL conventions. - Indexable, useful page
content. - Clear H1/H2/H3 hierarchy. - Descriptive internal links to
relevant Travel Desk Genie pages. - Descriptive image alt text. -
Optimized image delivery and dimensions. - Avoid duplicate content with
the existing Magic Toolbar product page. - Include the page in sitemap
only when it is public, complete, and intended for indexing. - Keep
draft/private admin routes out of the sitemap and search index.

Potential English route, subject to existing routing conventions:
`/en/gds-search-engine`

Do not create a conflicting route before checking the existing source
and route registry.

## 11.2 AEO (Answer Engine Optimization)

Provide clear, concise answers to genuine questions, for example: - What
is a GDS entry search engine? - How can travel agents compare
Travelport, Amadeus and Sabre commands? - Can I copy an individual GDS
command? - Which GDS systems are included? - Does this tool execute
commands in a live GDS? - How are GDS reference entries maintained?

Use accurate FAQ content. Do not add FAQ schema for questions/answers
that are not visible on the page or are not genuinely supported.

## 11.3 GEO (Generative Engine Optimization)

Make the page easy for search engines and AI systems to understand: -
Explicitly identify Travel Desk Genie and the page's purpose. - Define
Travelport, Amadeus and Sabre as the supported comparison columns. -
Explain what the tool does and does not do. - Use consistent
business/product naming. - Provide helpful contextual content rather
than keyword stuffing. - Keep structured data aligned with visible
facts.

Do not promise AI citations, rankings, or answer-engine inclusion.

## 11.4 SXO (Search Experience Optimization)

Prioritize: - Search bar visible immediately. - Fast results. - Clear
system comparison. - One-click copy with feedback. - Useful filters and
categories. - Mobile-friendly display. - Accessible keyboard and
screen-reader behaviour. - Useful no-results and error states. - No
intrusive popups. - No unnecessary loading or layout shifts.

## 11.5 Keyword clustering

The user will provide keywords later. Once received: - Group by search
intent. - Identify primary and secondary terms. - Map terms to page
sections. - Identify FAQ/question terms. - Avoid cannibalizing existing
product/resource pages. - Do not invent search volume or ranking
difficulty. - Distinguish user-supplied keywords from researched
metrics.

Potential initial intent clusters (not verified keyword-volume data): -
GDS entry search - GDS command lookup - Travelport commands/reference -
Amadeus commands/reference - Sabre commands/reference - GDS comparison -
Encode and decode GDS entries - Travel agent productivity tools

------------------------------------------------------------------------

# 12. Performance and reliability requirements

The user explicitly wants the new page/search engine not to slow down
the main website.

Requirements: - Do not load all 5,000+ records in the homepage or
initial page HTML. - Keep the initial page bundle small. - Load search
results only when needed. - Debounce user input. - Use server-side query
limits. - Use indexed search. - Paginate or virtualize long result
lists. - Reuse existing optimized images. - Avoid large third-party
search libraries unless justified. - Lazy-load non-critical
below-the-fold visuals. - Prevent layout shift. - Keep mobile
interaction responsive. - Preserve existing site header, footer, chatbot
and navigation performance.

Measure performance before and after implementation using the same
environment and test conditions. Do not claim a speed improvement
without measurement.

------------------------------------------------------------------------

# 13. Current website/project context

From the user's recent terminal output, the local project successfully
passed:

`npm run release`

That command ran: - release checks - SEO checks - resource-route
checks - i18n tests - Genie catalog checks - Next.js production build -
rendered-page checks

The terminal output reported: - SEO/AEO source validation passed. - 13
public resources checked. - 333 localized pages passed rendered
verification (37 per locale across 9 locales). - English Genie catalog
production-ready; other locale catalogs remained draft and noindex. -
Next.js build completed.

This is the user's reported result from their local machine, not
independent verification by the assistant. The user also fixed a syntax
error in `data/screens.js` and reran the release successfully.

The user previously configured `NEXT_PUBLIC_SITE_URL` in their hosting
environment. Do not change environment variables without inspecting the
current project and asking/receiving authorization where needed.

## 13.1 Image SEO work already performed by user

The user worked on image alt text and image metadata for an 11-image
audit. Several images received alt descriptions, including: - Travel
Genie mascot holding a globe with an airplane. - Magic Toolbar preparing
passport details for Amadeus, Sabre and Travelport. - Travelport
passenger NAME, DOCS, CTCM and CTCE fields in Magic Toolbar. - Passport
photo checker with face alignment and image validation guides.

Some image title fields were still reported missing in the screenshot.
Do not assume the entire image audit is complete.

## 13.2 Structured data work

The user tested the Magic Toolbar page with Google's Rich Results Test.

A prior result showed: - `SoftwareApplication` detected. - A
non-critical optional `aggregateRating` warning. - Later live URL test
showed three valid items detected and a successful crawl.

Do not invent aggregate ratings or reviews to silence an optional
warning. Only add aggregate rating if genuine, verifiable rating data
exists and the markup complies with Google's requirements.

The supplied product facts for the Magic Toolbar were: - Name: Travel
Genie Magic Toolbar - Brand: Travel Genie - Type: SoftwareApplication -
Application category: BusinessApplication - Application subcategory:
Travel agency productivity software - Operating system: Windows 11
(64-bit) - Description: A Windows workspace for travel agents to prepare
DOCS, CTCM and CTCE entries and use everyday desk tools. - URL:
`https://www.traveldeskgenie.com/en/products/magic-toolbar` - Product
ID: `9P1J21G2Z9LZ` - Microsoft Store URL:
`https://apps.microsoft.com/detail/9P1J21G2Z9LZ`

The user provided image/screenshot URLs in the earlier structured-data
details: - `https://www.traveldeskgenie.com/images/genie-mascot.webp` -
`https://www.traveldeskgenie.com/images/screens/passport-gds.webp`

These are product-page structured-data facts, not automatically the new
GDS Search Engine page's screenshot metadata. Inspect the source before
reuse.

------------------------------------------------------------------------

# 14. Page content outline (provisional)

This is a planning outline, not approved final copy.

1.  Hero:
    -   Travel Desk Genie All GDS Search Engine
    -   Instant GDS Commands Discovery with All GDS Comparison
    -   Exact slogan: "Time is money. Travel Desk Genie saves both."
    -   Search field with Genie icon
2.  Search results:
    -   Travelport, Amadeus, Sabre comparison
    -   Independent copy controls
3.  GDS reference categories:
    -   Encode
    -   Decode
    -   PNR
    -   Ticketing
    -   Pricing
    -   Hotels
    -   Cars
    -   Queues
    -   Seats
    -   Refunds/voids
    -   Timatic
    -   Other validated CSV categories
4.  Decode visual section using: `public/images/screens/decode.webp`
5.  How the search engine works:
    -   Search
    -   Compare
    -   Copy
6.  GDS notes download area (see section 15).
7.  Microsoft Store/desktop application cross-link, preserving the
    existing Store destination.
8.  FAQ with truthful answers.
9.  Relevant internal links.

The user may provide more requirements and keywords before
implementation. Do not treat this outline as a final design approval.

------------------------------------------------------------------------

# 15. Three GDS notes PDF downloads

The user intends to place three PDF files in the website's public folder
and wants attractive, clearly labelled download buttons.

User supplied filenames: - `amadeus-notes.pdf` -
`travelport-notes.pdf` - `sabre-notes.pdf`

User described the folder as: `tdgmain\public\downlaod`

**Important:** The folder spelling supplied is `downlaod` (not the
conventional `download`). Do not silently correct it. When
implementation begins, inspect whether the user created that exact
folder. If not, confirm the preferred folder or make a clear
recommendation before changing paths. If the exact supplied path is
used, the public URLs would ordinarily be: -
`/downlaod/amadeus-notes.pdf` - `/downlaod/travelport-notes.pdf` -
`/downlaod/sabre-notes.pdf`

The PDFs themselves are not yet supplied in the current project brief.
Do not create placeholder PDF files or link to files that do not exist.
Before release, verify that each target file exists and returns
successfully.

The user wants attractive download buttons/cards for each GDS note.

------------------------------------------------------------------------

# 16. Important exclusions and non-goals

Do not: - Introduce `Ctrl + Shift + G` on the website. - Modify the
Windows desktop app unless separately requested. - Change Microsoft
Store links or installation behaviour. - Replace the existing Decode
screenshot with an AI-generated alternative. - Invent GDS command
values. - Expose example personal data from CSV publicly without
review. - Claim live GDS execution. - Claim universal syntax
correctness. - Build a full travel booking engine. - Add a heavyweight
external search engine without measured need. - Add fabricated
ratings/reviews. - Publish incomplete/draft localized translations as
fully reviewed. - Modify unrelated pages or the existing Security &
Privacy page. - Deploy to production without the user's authorization.

------------------------------------------------------------------------

# 17. Implementation sequence after explicit authorization

When the user says to implement, follow this order:

## Phase A --- Inspect and protect current source

1.  Obtain the latest complete `tdgmain` ZIP or inspect the latest
    user-provided source.
2.  Confirm it includes the latest successful local changes.
3.  Inspect routes, components, design tokens, localization, API
    conventions, environment setup, SEO files, and package scripts.
4.  Identify the existing `decode.webp` and Genie mascot asset paths.
5.  Confirm the existing Microsoft Store integration and preserve it.
6.  Create a safe working copy/rollback point.
7.  Do not include private `.env` files or secrets in the deliverable
    ZIP.

## Phase B --- Finalize data architecture

1.  Confirm the database provider and plan. Supabase/PostgreSQL is the
    recommended default, not an already-existing connection.
2.  Define schema and migrations.
3.  Define secure admin roles and policies.
4.  Validate the supplied 298-row CSV.
5.  Review possible personal/confidential sample data.
6.  Import the records without changing command text.
7.  Test import/export round trips.
8.  Add backups and audit history.

## Phase C --- Build search API and frontend

1.  Create secure public search endpoint.
2.  Add query normalization, search indexing, and pagination.
3.  Build responsive search interface.
4.  Add GDS comparison cards/columns.
5.  Add individual copy buttons and confirmation.
6.  Add filters, loading, empty, error, and no-results states.
7.  Use Genie mascot and existing Decode screenshot.
8.  Add notes download cards only after PDFs exist.
9.  Keep the desktop hotkey out of website UI.
10. Ensure public search cannot access admin actions.

## Phase D --- Admin dashboard

1.  Secure authentication.
2.  Add/edit/delete/archive entries.
3.  Search and filter records.
4.  CSV/JSON import preview and validation.
5.  CSV/JSON export.
6.  Duplicate checks.
7.  Backups and rollback.
8.  Audit/change history.
9.  Verify server-side authorization.

## Phase E --- SEO/AEO/GEO/SXO

1.  Finalize user-provided keyword clusters.
2.  Map search intent to headings and content.
3.  Add title, description, canonical and internal links.
4.  Add useful FAQ content.
5.  Add appropriate structured data only when justified.
6.  Add accurate image alt text.
7.  Confirm locale behaviour and indexability.
8.  Verify sitemap and robots rules.
9.  Avoid cannibalization with the existing Magic Toolbar page.

## Phase F --- QA and delivery

1.  Test CSV import and export.
2.  Test missing GDS values.
3.  Test command copy controls.
4.  Test search by topic, keyword, category and command.
5.  Test duplicate detection and admin permissions.
6.  Test 5,000+ synthetic test records for performance; label them as
    test data and never publish them.
7.  Test desktop, tablet and mobile.
8.  Test accessibility and keyboard behaviour.
9.  Run all existing release checks and tests.
10. Compare performance before and after.
11. Deliver a complete updated ZIP and an updated handover `.md`.
12. Provide exact deployment instructions. Do not deploy unless
    authorized.

------------------------------------------------------------------------

# 18. Current status checklist

  -----------------------------------------------------------------------
  Item                                Status
  ----------------------------------- -----------------------------------
  New page name                       Confirmed

  Supporting line                     Confirmed

  Exact slogan                        Confirmed

  Three GDS comparison                Confirmed

  Genie icon/search concept           Confirmed

  Decode screenshot path              Supplied

  Current CSV                         Supplied; 298 entries reviewed

  Future scale 5,000+                 Confirmed

  Copy individual commands            Required

  Add/edit/delete entries             Required

  Import/export                       Required

  Desktop shortcut only               Confirmed

  Do not show shortcut on website     Confirmed

  Microsoft Store destination         Preserve unchanged

  Three PDF filenames                 Supplied

  PDF folder spelling                 `public/downlaod` supplied; verify
                                      before implementation

  SEO/AEO/GEO/SXO                     Required

  Database recommendation             Supabase/PostgreSQL recommended;
                                      not yet provisioned

  Keyword cluster                     Awaiting user's keywords

  Latest source ZIP                   Must be supplied/confirmed before
                                      implementation

  Implementation                      **Not started; wait for explicit
                                      authorization**

  Production deployment               Not authorized
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 19. Exact restart prompt for a future session

Copy and paste the following prompt when continuing this project:

> Continue the Travel Desk Genie All GDS Search Engine project using
> this handover document as the source of truth.
>
> First, read the full handover and confirm the requirements, especially
> the fixed page name, exact slogan, 298-entry CSV, future 5,000+ entry
> target, three-system comparison, individual copy controls, protected
> admin dashboard, CSV/JSON import/export, and the rule that
> `Ctrl + Shift + G` belongs only to the Windows desktop toolbar and
> must not appear as a website shortcut.
>
> The recommended long-term architecture is Supabase/PostgreSQL, but
> inspect the latest source and existing environment before choosing or
> configuring anything. Do not assume a database has already been
> provisioned.
>
> Preserve the existing website, SEO/localization infrastructure,
> chatbot, footer, routes, Microsoft Store destination, and unrelated
> pages. Reuse `public/images/screens/decode.webp`. The exact slogan is
> "Time is money. Travel Desk Genie saves both."
>
> The three planned PDF files are `amadeus-notes.pdf`,
> `travelport-notes.pdf`, and `sabre-notes.pdf`; the user supplied the
> folder spelling `public/downlaod`, which must be checked.
>
> The user previously instructed the assistant to study requirements
> without taking action. Therefore, do not start implementation unless
> the user explicitly authorizes it. If authorization is given, use the
> latest complete `tdgmain` source ZIP or newer local source, inspect it
> first, protect existing changes, implement in phases, test the full
> release, and provide a complete updated ZIP plus a revised handover.
>
> Do not invent commands, data, reviews, ratings, credentials, legal
> facts, or product capabilities. Treat the website search as a
> reference lookup/comparison tool, not live GDS execution.

------------------------------------------------------------------------

**End of handover document.**
