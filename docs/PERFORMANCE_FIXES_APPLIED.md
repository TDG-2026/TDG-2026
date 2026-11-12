> Mobile follow-up: see MOBILE_RESPONSIVE_FIX.md and MOBILE_RESPONSIVE_QA.json. The newer user-requested responsive CSS patch supersedes the earlier statement that all chatbot files are unchanged.

# Travel Genie — Applied fixes and verification

Date: 3 November 2026
Input: website1.zip
Output: website1_Desktop_Speed_Fixes.zip

## Applied changes

| File | Change | Purpose |
|---|---|---|
| components/Footer.js | Moved About Travel Genie into the Help & resources list; kept its heading separate | Correct invalid list semantics while retaining the link and copy |
| app/globals.css | Darkened muted text and success text; darkened the bright-blue gradient endpoint | Improve contrast on light backgrounds while retaining the colour theme |
| app/globals.css | Replaced the core status dot's animated box shadow with a transform/opacity ring | Avoid continuously repainting a changing shadow |
| components/ToolbarCore.module.css | Replaced animated SVG stroke-dashoffset with opacity variation | Keep the connector effect without continuously changing dash geometry |
| components/Reveal.js | Uses initial IntersectionObserver geometry instead of synchronous bounding-box reads | Avoid layout measurements across every reveal instance during hydration; already-visible content stays visible |
| components/ToolbarCore.js | Starts viewport state as false; only measures beam geometry while visible; batches observer measurements in an animation frame | Avoid offscreen timer work and immediate geometry reads; pause beam/orbit animations offscreen and in hidden tabs; retain tool selection and pause behavior |
| lib/i18n/translate.js | Fast path for an empty dictionary, which is used by English | Skip repeated whitespace normalization for untranslated text while retaining variable interpolation |
| components/Hero.js | More accurate responsive image size hints for the mascot and screenshot | Allow the browser to select smaller image variants where appropriate |
| components/FeatureStory.js | Replaced oversized close-up image size hints with layout-based hints | Reduce unnecessary image candidate sizes |

Build-generated translation metadata and audit files may also be refreshed by the project's existing prebuild/check scripts. No new application dependency was added. Routes, copy, locale registry, forms, and API behavior have not intentionally changed. Existing hero preload/high priority and lower-page lazy loading are retained.

## Validation

- `npm run check`: passed; existing specialist-product preview warning remains.
- `npm run test:i18n`: 13 tests passed.
- `npm run build`: passed, including 747 generated static pages.
- `npm run check:rendered`: passed for 740 localized pages, 37 pages per locale across 20 locales.
- Additional generated-HTML list-parent check: see the packaged QA result file.
- Token contrast calculations: muted #566181 on #f3f0ff = 5.47:1; success #0c7541 on #e6f7ee = 5.20:1; gradient endpoint #2262c6 on white = 5.78:1. These calculations cover those colour pairs, not every rendered element or gradient combination.

## Existing issues and validation limits

`npm run check:genie` still fails because the existing validator reports missing UI keys for fa, ne, and uz. The engine already has a Farsi alias fallback, but the validator does not recognize that alias; Nepali and Uzbek UI entries are absent. Other draft chat locales also have untranslated answer catalogs. These are existing localization findings, not claimed as repaired by this performance patch. Incomplete website locales remain noindex previews under the existing configuration.

A fresh browser-based Lighthouse/axe audit and screenshots could not run here: Chromium was unavailable and its download returned invalid archives. No new performance score, TBT improvement, complete contrast pass, or visual/interaction pass is claimed.

The report's legacy-JavaScript, unused-JavaScript, render-blocking, dependency-chain, DOM-size, and actual LCP findings require attribution in a production trace. No blind polyfill removal, framework script deferral, DOM rewrite, or blanket preloading was applied. These audit items must be rechecked after deployment; they are not represented as fully resolved.

## Run and deploy

1. Extract this ZIP and use the website1 folder as the project root.
2. Keep the existing environment variables in your hosting settings. Local `.env.local` is intentionally not redistributed; retain your existing local copy if needed. `.env.example` is included.
3. Run `npm ci` and `npm run build` with the project's supported Node version (>=22).
4. Deploy to the existing Vercel project using its existing settings.
5. Run Lighthouse separately for mobile and desktop on the deployed URL. Use the same test conditions and compare at least three runs per mode.
6. Check navigation, language selection, forms, chatbot, toolbar selection/pause, image sharpness, keyboard focus, reduced motion, and absence of hydration errors.

This archive is a tested source patch, not a live deployment. Keep the original ZIP as a rollback copy. No private environment values are printed in this report.

## Scope correction and search experience safeguards

All dedicated chatbot components, launcher, engine, configuration, knowledge, and translation files are restored byte-for-byte from the uploaded ZIP. Chatbot appearance, timing, replies, and functionality are not part of this patch. Shared translation fast-path optimization preserves translation output and interpolation semantics.

Priority is desktop page speed and error correction. AEO/SEO/GEO/SXO safeguards: retain visible content, answer sections, titles/descriptions, canonical URLs, language metadata, schema/JSON-LD, crawlable server-rendered content, internal links, image alt text, and keyboard usability. No invented schema, keyword stuffing, hidden search-only text, or changes to business claims. Search/answer-engine ranking improvements are not guaranteed. Fresh desktop lab timing remains unverified pending a working browser audit.
