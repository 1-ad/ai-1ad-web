# Basic SEO updates

The original website is preserved on `codex/original-baseline` at
`cc9a46a27404e21eed95fadc2ee024a602b1bab7`, the `main` commit used to start this
round. `codex/basic-seo-updates` contains the basic homepage and technical
recommendations from the original “Update Website SEO” review.

## Included

- A service-focused homepage title, description, H1, section headings, and
  links to client work and the contact section.
- Introductory copy focused on development, animation, special effects, and
  ongoing client relationships, with selective bolding for easier scanning.
  Client projects remain before the animation experiments.
- A device-width viewport and responsive sizing fixes, including the contact
  form and fixed-size creative cards at a 320px viewport.
- Consistent `https://www.1-ad.com/` homepage canonical, alternate, and social
  metadata URLs.
- Native lazy loading and accessible titles for all 12 homepage iframes.
  Visibility callbacks skip frames that have not loaded yet.
- Descriptive preview titles using existing XML metadata or the 60 campaign
  labels in `site/preview-titles.js`. Keep those labels aligned with the
  homepage when adding or renaming campaigns.
- All 49 existing sitemap URLs converted to HTTPS, plus a sitemap declaration
  in `robots.txt`. The homepage records the latest copy update as `2026-11-20`;
  unverified historical modification dates on previews are omitted.
- Updated the homepage, résumé, and legacy preview page to Google's current
  tag loader for the existing GA4 measurement ID `G-24L76YR0Q4`. This ID was
  verified in the old tag's public connected-destination configuration.
  The homepage retains the existing Google Ads destination `AW-798094696`
  through its supported compatibility configuration.
- Replaced legacy `ga()` calls with GA4 `creative_demo_play` and `generate_lead`
  events. The lead event and existing Ads conversion now fire only after the
  contact endpoint reports success; contact field contents are not included.
- Restored the three missing campaign thumbnails from the original project's
  `source/site/img/` folder and updated site footer dates to `2018–2026`.
- Optimized the four icons with an isolated runtime in `icons/shared.js`.
  Rendering uses animation frames with the original 42 ms update interval;
  completed timers are released, and hidden icons pause reliably on initial
  load, iframe load, scroll and resize. Non-icon demos retain `js/shared.js`.
- Icon visibility follows the displayed artwork: animation starts when any
  portion enters the viewport and pauses once it is completely outside, or
  when the browser tab is hidden. Cropped containers and fractional positions
  are included. The old 60-second cutoff no longer stops a visible icon.
- The aquarium caches its static displacement map and reuses pixel buffers;
  its steady-state canvas reads drop from four to one per frame. The rocket
  caches its ship element and avoids redundant transform writes. Particle
  calculations, image assets, canvas resolution and animation sequences remain
  unchanged.

All 178 distinct linked creative paths and existing preview query URLs are
retained. Preview indexing policy and creative demos are unchanged. This round
does not deploy the branch or change server settings.

## Verification

- JavaScript syntax and Git whitespace checks passed.
- Homepage preview links match the baseline, and all 178 creative entry files
  exist. Each linked campaign has a descriptive fallback title.
- The sitemap parses as XML and contains 49 distinct HTTPS URLs with existing
  creative targets.
- Browser layout checks passed at widths of 320, 390, 768, and 1440 pixels,
  without horizontal page overflow or clipped creative cards.
- The work and contact links navigate to their sections. The contact fields fit
  the 320px layout. XML-backed and fallback preview titles render correctly.
- A callback check confirms unloaded lazy frames do not prevent loaded demos
  from receiving scroll and visibility updates.
- Analytics checks confirm that successful contact responses emit one GA4 lead
  and one Ads conversion, while failed responses and invalid submissions emit
  neither. Demo controls and contact success feedback work without tracking.
- All homepage thumbnail references resolve, and the restored JPEG files match
  their originals byte for byte.
- `node --test tests/icon-performance.test.cjs` checks pixel equality against
  the original displacement filter, rocket motion, frame cadence at 60/120/144 Hz,
  timer cleanup, startup/hover/visibility behavior and iframe visibility updates.
  Original filter and rocket code in `tests/fixtures/` are regression references
  from commit `bfe191d`, not production scripts.
- All 13 icon regression tests pass. Local browser checks confirm aquarium and
  magic-hat motion, the tower's light sequence and the rocket's pointer response.
  Visibility checks cover partial entry, complete exit, re-entry, cropped icon
  containers and continuous animation beyond 60 seconds.

## Follow-up work

- Add the three service pages and evidence-backed case studies proposed in the
  SEO review. Confirm project roles, permissions, and results before writing
  case-study claims.
- At the hosting layer, redirect `https://1-ad.com/` to
  `https://www.1-ad.com/`, preserving paths and query strings. On 2026-11-19,
  both HTTP variants redirected to HTTPS `www`, but HTTPS without `www`
  returned 200 directly. No server configuration was changed in this branch.
- Verify PHP contact delivery in the PHP-enabled environment described in the
  baseline README. PHP and its private mail dependencies are not available in
  the local static preview; no contact delivery was tested.
- Review Search Console data, preview indexing policy, and successful enquiry
  tracking before making broader indexing or analytics changes.
- Verify GA4 reporting in Realtime after deployment and mark `generate_lead` as
  a key event in Analytics if enquiries should appear in key-event reporting.
  No Google account settings were changed by this branch.

Implementation references: [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[iframe loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#loading),
[current Google tag installation](https://developers.google.com/tag-platform/gtagjs),
and [GA4 lead events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead).

Icon performance references: [animation-frame scheduling](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
and [viewport observation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
