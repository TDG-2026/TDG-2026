# Mobile page and chatbot responsive fix

This patch builds on website1_Desktop_Speed_Fixes.zip. Only app/globals.css and components/GenieChat.module.css receive new application changes.

- Constrain mobile grid children and long code blocks so they do not force the page wider than the device.
- Keep small-screen callout text inside the page width.
- Anchor a 56px chatbot launcher inside the mobile viewport and respect screen safe areas.
- Place the chatbot teaser above the launcher on small screens and allow its text to wrap.
- Limit reminder cards to the viewport width.
- Fit the open chat panel to the dynamic mobile viewport, with safe-area padding.
- Use 16px chat/search input text to avoid automatic input-focus zoom on iOS.
- Retain chatbot messages, engine, timing, language behavior, data and replies. Desktop chatbot CSS remains governed by the original rules; responsive overrides apply only through 600px.

Build verification: npm run build. Browser viewport/open-chat results are in MOBILE_RESPONSIVE_QA.json when available. These are layout checks, not a new Lighthouse performance score or a full keyboard-on-real-device certification.

Deploy this source to the existing project with the existing environment settings. Local .env files are excluded; .env.example is retained.

Verified in headless Chromium at 320, 390, 520, 768, and 1440 CSS pixels: document width stayed within the viewport and the programmatically opened chat dialog stayed inside the viewport. No page JavaScript errors were reported. Real-device keyboard and touch testing remains recommended.
