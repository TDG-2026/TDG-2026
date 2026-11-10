# Static localization dictionaries

The website uses its existing lightweight App Router dictionary layer. No hosted translation provider is called during build or page rendering.

## Source extraction

`npm run i18n:extract` (also run automatically by `npm run build` through `prebuild`) scans visitor-facing source copy and writes `messages/source.json`. Each source record has a stable key, text, SHA-256 source hash and source locations.

## Locale catalog format

Add a JSON file named `messages/<locale>.json` for a non-English locale. The top-level shape is:

```json
{
  "locale": "nl",
  "status": "draft",
  "messages": {
    "components.m0001": {
      "text": "A reviewed translation goes here.",
      "sourceHash": "COPY_THE_CURRENT_HASH_FROM_MESSAGES_SOURCE_JSON",
      "status": "reviewed",
      "review": {
        "by": "Native reviewer",
        "at": "2026-11-10T00:00:00.000Z",
        "sourceHash": "COPY_THE_CURRENT_HASH_FROM_MESSAGES_SOURCE_JSON"
      }
    }
  }
}
```

Use the exact current `sourceHash` from `messages/source.json`. A changed English source hash makes the old translation stale. Never mark machine-generated text as human-reviewed.

## Publication policy

A locale should only be marked `published` when its complete current message set has been translated and checked by a competent native-language reviewer. Until then, its pages display the translation-in-progress notice, remain `noindex`, and are excluded from sitemap and hreflang output.

The launch locale list is maintained in `lib/i18n/locales.registry.js`. Browser and region negotiation is configured in `lib/i18n/available.js`. Keep these lists aligned when adding or pausing locales.
