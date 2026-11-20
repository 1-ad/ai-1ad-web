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
- A shared 60px gap above each of the four section icons. Removed stacked
  intro spacing that previously left 130px above the Client Projects tower.
- Consistent `https://www.1-ad.com/` homepage canonical, alternate, and social
  metadata URLs.
- Accessible titles for all 12 homepage iframes and native lazy loading for the
  eight creative demos. Visibility callbacks skip frames that have not loaded yet.
- Project titles and preview details come from each demo's `_info.xml`.
  Added metadata for the 172 gallery demos that were missing it, preserving
  the 77 existing XML files. The 12 new HP demos also include XML metadata.
  All 261 linked demos now use the original XML
  loader; the separate JavaScript campaign-title map has been removed.
- All 49 existing sitemap URLs converted to HTTPS, plus 22 new campaign previews
  and a sitemap declaration
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
- Optimized the four icons with an isolated runtime in `sections/shared.js`.
  Rendering uses animation frames with the original 42 ms update interval;
  completed timers are released, and hidden icons pause reliably on initial
  load, iframe load, scroll and resize. Non-icon demos retain `js/shared.js`.
- Moved the four animated section illustrations into the root `sections/`
  directory and updated the homepage, regression tests and documentation paths.
- Imported 14 client campaigns. Qualcomm Big Ideas, Built-In AI, Levitate
  and PC Revolution appear first; Multiply is temporarily hidden. The other
  imports are BlackBerry MTD, Box Bubbles and Cutting Costs, Databricks Zipline,
  Klaviyo Intro, FLEX Holiday Rear Handle, and Jelmyto AUA 2021, Kidney and
  Patient Profiles. The 53 banner sizes and 632 creative files were copied
  from the owner's portfolio folders.
- Added four HP campaigns together immediately after LEGO: Cadalyst —
  Generative Design, Care Pack Program, Hybrid Collaboration and Device
  Manageability. Copied 109 source files covering 12 banner sizes, added each
  demo's `_info.xml`, and composed four headers from the original backup PNGs.
  All 12 use GSAP 3.15.1 from cdnjs; collaboration and manageability also use
  the matching SplitText plugin in place of six superseded local copies.
- Restored five existing banner sets missing from the gallery: LEGO Level Up
  Your Ninja, LEGO Discover The Secrets, Citrix Workspace, AXE Carousel and
  L'Oréal Bambi Eye. Reused four existing headers unchanged and composed Bambi
  Eye's header from its original two backup PNGs. Also restored Citrix
  Intelligence's 300 × 600 and Johnston & Murphy Spring 2018's 200 × 200 links.
- Added superscript registration marks to the five Snapdragon product labels,
  three JELMYTO product labels and the BlackBerry brand label. Matching preview
  metadata uses the same spellings and marks in each demo's XML file.
- Grouped client panels by brand within the existing banner, preroll and mobile
  galleries. Each brand keeps its first position relative to other brands, and
  projects within a brand retain their previous order. Qualcomm remains first.
- Temporarily hid the SF SPCA, Qualcomm Multiply and Tria Beauty panels with inline
  `display:none`. Remove that style to restore them; their markup and preview
  files are preserved.
- All 194 GSAP-loading projects now use GSAP 3.15.1 and matching plugins
  from cdnjs. This replaces the temporary local Qualcomm library and older
  CDN/embedded copies. Compatibility adjustments and verification are recorded
  in [GSAP upgrade notes](gsap-upgrade.md).
- Created 19 matching 600 × 200 JPEG headers by arranging the original backup
  PNGs with angled cards, soft shadows and complementary backgrounds. Every
  supplied size appears in its campaign header. Rebuild these assets with
  `python3 scripts/build-portfolio-headers.py` (requires ImageMagick);
  header generation adds no runtime dependency.
- Icon visibility follows the displayed artwork: animation starts when any
  portion enters the viewport and pauses once it is completely outside, or
  when the browser tab is hidden. Cropped containers and fractional positions
  are included. The old 60-second cutoff no longer stops a visible icon.
- The four icon iframes load eagerly, preload and decode all 16 image assets,
  and build their particles and complete initial canvas frames on page load.
  Preparation and revealing the artwork no longer wait for a visibility-gated
  startup timer. Offscreen icons remain initialized and paused; the larger
  creative-demo iframes continue to load lazily.
- The aquarium caches its static displacement map and reuses pixel buffers;
  its steady-state canvas reads drop from four to one per frame. The rocket
  caches its ship element and avoids redundant transform writes. Particle
  calculations, image assets, canvas resolution and animation sequences remain
  unchanged.

All 178 distinct linked creative paths and existing preview query URLs are
retained. Preview indexing policy and creative demos are unchanged. This round
does not deploy the branch or change server settings.

## Editing project metadata

Edit `_info.xml` alongside the demo's `index.html`. The existing preview loader
uses `brand`, `product`, `creative` and `type` for the visible details and page
title. Keep these labels aligned with the corresponding homepage panel.
The CDATA fields support the existing HTML markup, including `<sup>®</sup>`.

`size` and `preview` select the dimensions and preview-page layout. `backup`
names the existing JPEG or PNG shown by the Static control; leave it empty
when no backup is supplied. A blank `clickTag` preserves the preview's existing
behavior of reading the demo's click destination. `text` is optional extracted
ad copy; the new records leave it empty instead of inventing a transcription.
Existing expansion and offset metadata remains in the original XML files.

## Verification

- JavaScript syntax checks passed. Whitespace checks are clean for the gallery,
  preview wrapper, XML metadata, sitemap, documentation and header generator;
  existing creative-file formatting is retained.
- Initial portfolio-import checks verified all 647 sample/header/library URLs
  and the original copied file contents. The subsequent GSAP migration removes
  superseded local vendor files; see the upgrade notes for current script checks.
- Chrome checks confirmed a working animated preview and descriptive title
  for each of the 14 new campaigns, plus the static/animated toggle. The
  Qualcomm previews now use the same cdnjs library as the other GSAP projects.
- HP import checks confirm all 125 sample, XML and header URLs return HTTP 200
  with the expected file contents. All 97 copied artwork assets are unchanged.
  The 15 inline scripts parse, and all 12 banners pass Chrome playback checks
  with GSAP 3.15.1 and no JavaScript errors, including the six SplitText variants.
  Standalone previews for all four HP campaigns show the XML details and pass
  the static/animated toggle checks.
- Homepage preview links retain all 178 original creative paths, add 65
  imported sizes and restore 18 previously unlisted sizes; all 261 creative
  entry files exist. Each linked demo has its own XML metadata for its title,
  brand, product, campaign, description, size and available static backup.
  New headers include every supplied size.
- The gallery audit accounts for all 265 portfolio entry pages. Every HTML5
  banner variant is represented in the gallery markup, including the temporarily
  hidden SF SPCA, Qualcomm Multiply and Tria Beauty panels. The four unlisted entries are
  video-only previews:
  `aimovig/time2018/540x432`, `aws/redshift/540x304`,
  `imperva/cybercriminals/540x304` and `imperva/secure/540x304` under `portfolio/`.
  They were not added to the banner gallery.
- Chrome checks confirm all five restored cards and their preview titles,
  plus the two restored size previews. All seven previews render without
  console errors. All 167 quoted local asset references in the restored
  variants resolve; the four reused header files remain byte-identical.
- The sitemap parses as XML and contains 71 distinct HTTPS URLs with existing
  creative targets.
- All 261 gallery metadata URLs return HTTP 200 with an XML content type and
  parse successfully. Every referenced preview layout and static backup exists.
  The 184 added records match the gallery labels; all 77 existing XML files are
  byte-identical to their pre-migration versions.
- Chrome checks cover XML details and titles, JPEG and PNG static previews,
  demos without backups, existing expandable dimensions and the generic
  fallback for a demo outside the gallery. Each gallery groups brands
  contiguously while preserving the first-seen brand order and project order.
- Browser layout checks passed at widths of 320, 390, 768, and 1440 pixels,
  without horizontal page overflow or clipped creative cards.
- Browser measurements confirm a 60px gap above each section icon, measured
  from the preceding paragraph or gallery edge.
- The work and contact links navigate to their sections. The contact fields fit
  the 320px layout. XML-backed titles and the generic fallback render correctly.
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
- All 16 icon regression tests pass. Local browser checks confirm aquarium and
  magic-hat motion, the tower's light sequence and the rocket's pointer response.
  Visibility checks cover partial entry, complete exit, re-entry, cropped icon
  containers and continuous animation beyond 60 seconds.
- A fresh browser origin confirms all four icons and all 16 images are loaded
  and initialized before scrolling to the lower sections. The initialization
  tests also check decoding order, complete particle sets in the initial frame,
  offscreen pausing and immediate resumption on first entry.

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

Icon performance references: [animation-frame scheduling](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame),
[viewport observation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API),
[image decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode),
and [eager iframe loading](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/loading).
