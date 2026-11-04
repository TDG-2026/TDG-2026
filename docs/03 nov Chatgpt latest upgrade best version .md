Travel Genie — Project Handover \& Next Session Guide



Last updated: 3 November 2026 (Asia/Karachi)



1\. Start here — sab se pehle



Use website1\_Mobile\_Responsive\_Fix.zip as the latest delivered source baseline. It includes the earlier desktop speed/error patch plus the mobile responsive follow-up. Do not restart from the original website1.zip unless deliberately rolling back.



Latest source: website1\_Mobile\_Responsive\_Fix.zip



User goal: website errors fix karna aur speed increase karna, especially desktop performance, while preserving SEO, AEO, GEO and SXO. Chatbot engine, replies, timing and business behavior must remain unchanged unless the user explicitly requests a specific change. The user later authorized mobile chatbot presentation fixes only.



Deployment status: updated source archives were delivered. No live deployment was performed in this session. The currently deployed site must be checked separately; do not assume it contains these changes.



Known preview URL: https://tdg-2026.vercel.app/en



2\. Version history



Archive



Purpose



Usage



website1.zip



Original user upload



Original reference / rollback



website1\_Performance\_Fixed.zip



First performance patch; included a chatbot CSS animation change



Superseded; do not use as current baseline



website1\_Desktop\_Speed\_Fixes.zip



Restored dedicated chatbot files; retained page optimizations



Superseded by mobile follow-up



website1\_Mobile\_Responsive\_Fix.zip



Desktop patch plus requested mobile page/chat presentation fixes



Latest delivered baseline



Keep this handover beside the extracted source. If the user has made subsequent changes, use their newer source and reconcile this document against it before editing.



3\. Stack and local setup



Next.js App Router; package.json specifies Next ^16.4.3, React/React DOM ^19.2.0.



Node.js requirement: >=22. Use package-lock.json with npm ci.



JavaScript/JSX, global CSS and CSS Modules; sharp is a development dependency.



Locale routes live under app/\[locale]. Current build covered 20 registered locales, not the 24 target locales mentioned in package description.



Next image optimization already supports AVIF/WebP. Hero preload/high priority and lower-page lazy loading existed before this work.



From the extracted website1 directory:



npm ci

npm run dev



Production checks:



npm run check

npm run test:i18n

npm run check:genie

npm run build

npm run check:rendered

npm run start



Run check after build completes; build clears/regenerates .next. Do not run both concurrently. The prebuild script refreshes translation source/status files, so review generated changes as well as handwritten changes.



Archives exclude node\_modules, .next, .git and private .env files. .env.example remains included. Retain the user's existing environment settings locally/on the host. Do not print secrets or copy private values into reports.



4\. Project map



Location



Responsibility



app/\[locale]/page.js



Home page composition and page schema



app/\[locale]/layout.js



Locale provider, shared header/footer/chat mounting, document metadata



app/globals.css



Global layout, responsive rules, text colours and shared animations



components/Hero.js



Hero text, actions, mascot, screenshot



components/FeatureStory.js



Passport explanation and screenshot close-up



components/Reveal.js



Scroll reveal behavior



components/ToolbarCore.js and .module.css



Tool selector, auto rotation, viewport tracking and connector animation



components/Footer.js



Footer headings, lists and internal links



components/GenieChat.js and .module.css



Chat UI and presentation



components/ChatLauncher.js



Existing chatbot loading and mounting behavior



lib/genie/ and data/genie/



Chat engine, knowledge, configuration and UI strings



lib/i18n/



Locale registry, catalogs, URL localization and shared translation helpers



messages/



Translation sources/catalogs



lib/seo.js and lib/i18n/metadata.js



Schema and localized metadata helpers



components/StructuredData.js



JSON-LD rendering



components/AnswerHub.js and Faq.js



Visible question/answer content



app/robots.js and app/sitemap.js



Crawling/indexing outputs



next.config.mjs



Image configuration, security/cache headers and redirects



scripts/



Existing build, release, localization and rendered-page checks



5\. Applied desktop/error fixes



Footer: moved About Travel Genie out of an h2 and into the Help \& resources list. Link and copy retained.



Contrast: darkened muted text, success text and the bright-blue gradient endpoint. Selected colour pairs were calculated; a complete rendered contrast pass has not been established.



Reveal: uses initial IntersectionObserver geometry instead of synchronous getBoundingClientRect calls during each reveal instance's hydration. Already-visible content stays visible.



Toolbar: starts out of view until observed; avoids offscreen timer work; schedules beam measurements through requestAnimationFrame; pauses beam/orbit animation offscreen and in hidden tabs.



Animations: replaced core-dot changing box shadow with a transform/opacity ring; replaced toolbar stroke-dashoffset animation with opacity variation.



Shared translator: empty-dictionary fast path avoids repeated normalization for English while preserving output/interpolation behavior.



Hero/close-up images: updated responsive sizes hints to better match the layout. Actual byte savings and LCP impact are not measured yet.



No dependency upgrade, broad client/server component rewrite, blanket script delay or new analytics was introduced.



6\. Latest mobile fix



The user supplied a screenshot with a narrow page at the left and a large blank region beside it, with the chatbot at the far right. Exact live root cause was not conclusively isolated. The patch addresses known intrinsic-width and chatbot viewport-containment risks.



Changes are in app/globals.css and components/GenieChat.module.css:



Mobile grid tracks use minmax(0, 1fr); relevant children can shrink with min-width: 0.



Code blocks and small-screen callouts are constrained; answer-card minimum sizing adapts to the container.



Mobile overflow containment prevents decorative/content overflow from expanding the page's horizontal area.



Through 600px: 56px chatbot launcher stays inside viewport/safe areas; teaser moves above it and can wrap; reminder cards stay within viewport width.



Open mobile chat uses full dynamic viewport height, safe-area padding and constrained width.



Chat/search input text uses 16px to reduce iOS input-focus auto-zoom risk.



Chatbot engine, messages, knowledge, launcher JavaScript, timing and replies remain original. Only the requested responsive presentation is changed. Earlier handover notes claiming every chatbot file is byte-identical were superseded by this authorized CSS follow-up.



7\. Verification — what is established



Check



Recorded result



Scope/limit



npm run check



Passed



Existing specialist-product preview warning remains



npm run test



13 tests passed



Run before final mobile CSS-only patch; translation code unchanged afterward



npm run build



Passed



Also rerun after latest mobile CSS changes; 747 generated static pages



npm run check



740 localized pages passed



37 per locale across 20 locales; recorded before mobile CSS-only follow-up



Generated HTML list-parent check



742 HTML files, zero invalid list parents



Recorded before mobile CSS-only follow-up



Mobile/desktop geometry checks



Passed at 320, 390, 520, 768, 1440 CSS px; height 844px



Latest mobile source, headless Chromium



Page JavaScript errors



None during geometry runs



Not every interaction/path exercised



Open-chat geometry



Within viewport at tested widths



Opened programmatically; not a complete physical-touch test



Fresh Lighthouse performance



Not measured



No validated new score/TBT improvement



Browser tooling initially failed; a later portable Chromium setup enabled geometry checks. The older PERFORMANCE\_QA\_RESULTS.json browser-audit note refers to the earlier performance audit attempt, not the later geometry checks.



Latest geometry details: MOBILE\_RESPONSIVE\_QA.json inside the latest ZIP. Actual keyboard resizing, safe areas on physical devices, language sheet, teaser/nudge variants, all touch targets, focus/close behavior, landscape and chat replies still need broader manual regression coverage.



8\. Pending work — priority order



Confirm the user's current source and whether the latest archive has been deployed.



Capture full Lighthouse HTML/JSON for the production desktop page using a consistent profile. Retain at least three runs and compare medians; test mobile separately.



Use Performance trace, Coverage and bundle analysis to attribute long tasks, forced reflow, unused/legacy JavaScript and blocking resources before further code changes.



Confirm the actual LCP element and its discovery/load/render breakdown. Preserve hero priority; check selected image currentSrc rather than judging fallback src alone.



Run rendered accessibility checks and fix specific failing contrast elements. Verify keyboard focus and semantic navigation.



Test mobile chat on real Android/iOS, including keyboard open, portrait/landscape, long text, both positions if supported, and translated/RTL UI.



Recheck desktop visuals/interactions after mobile changes, including toolbar selection/pause, navigation, forms and image quality.



Deliver measured before/after results, remaining findings and a rollback archive. Update this handover after each accepted enhancement.



Original pasted reports had one run with TBT 600ms and performance 74, and another with TBT 90ms. Device/test labels were ambiguous. Do not present those as a controlled before/after improvement. Reported estimates included unused JS 23–24KiB, legacy JS 14KiB, image delivery 35–55KiB and render blocking 220ms. These audit items are not all verified resolved.



Existing localization issue: check reports missing UI keys for fa/ne/uz. Engine has an existing Farsi alias fallback that the validator does not recognize; Nepali/Uzbek entries are absent. Other chat answer catalogs remain drafts. Incomplete website locales remain noindex previews. Do not alter chatbot catalogs or disable checks merely to obtain a pass without explicit task scope.



9\. SEO / AEO / GEO / SXO working rules



Preserve titles/descriptions, canonical URLs, locale/hreflang behavior, robots/sitemap decisions, internal links, meaningful headings and image alt text.



Keep useful answer content visible and crawlable in server-rendered HTML; preserve truthful JSON-LD matching visible content.



Do not invent business claims, reviews, certifications, pricing, FAQs or schema properties to target rankings.



Improve readability, accessibility, responsive layout, interaction speed and task completion alongside loading metrics.



Do not remove required browser compatibility or delay essential controls to inflate Lighthouse scores.



Treat ranking/answer-engine inclusion as outcomes to monitor, not guarantees.



SEO/schema/answer/sitemap/robots source files were checked as preserved during the desktop patch. This is preservation evidence, not a comprehensive current SEO audit.



10\. Next-session prompt — copy and paste



Continue the Travel Genie Next.js project using the latest attached source and Travel\_Genie\_Project\_Handover.md. First inspect the current files and reconcile changes since the handover. Prioritize website errors and measured desktop speed improvements while preserving SEO, AEO, GEO, SXO, existing copy, routes and branding. Preserve chatbot engine, replies, timing and functionality; modify only specifically authorized responsive presentation. The latest known baseline is website1\_Mobile\_Responsive\_Fix.zip. A fresh Lighthouse performance comparison is still pending. Distinguish verified fixes from unmeasured opportunities. Run appropriate build, localization, rendered-page and responsive checks, retain existing environment settings, and provide an updated ZIP plus an updated handover with measured results and remaining work. Do not assume the current live deployment matches the latest ZIP.

