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

All 178 distinct linked creative paths and existing preview query URLs are
retained. Preview indexing policy, creative assets, and analytics identifiers
are unchanged. This round does not deploy the branch or change server settings.

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
- Supply the three thumbnail files already missing from the original import:
  `site/img/aws_database.jpg`, `site/img/jm_video.jpg`, and
  `site/img/loreal_magicrootcoverup.jpg`.

Implementation references: [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
and [iframe loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#loading).
