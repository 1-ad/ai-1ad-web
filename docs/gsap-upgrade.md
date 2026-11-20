# Shared GSAP CDN version

All 194 GSAP-loading creative pages use **GSAP 3.15.1** from cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.1/gsap.min.js"></script>
```

The version was checked against the official npm package and cdnjs on
2026-11-20. Exact version URLs keep the creatives on the same tested release.
When upgrading again, update the core and every plugin together.

## Dependencies

- Core is loaded once, before plugins and animation code. CSSPlugin is part
  of the core, so the obsolete separate CSSPlugin downloads were removed.
- EasePack, CustomEase, MotionPathPlugin, MorphSVGPlugin, ScrambleTextPlugin,
  TextPlugin and SplitText use the same cdnjs version prefix. Each project
  loads the plugins it already needs, with explicit plugin registration.
- Replaced ten embedded vendor scripts and the two Crush dependency arrays.
  Removed 36 unused local copies of GSAP and its plugins, including the
  temporary Qualcomm GSAP 3.12.5 copy.
- The 12 newly imported HP banners also use this version. Six collaboration
  and manageability variants load SplitText from cdnjs and register the plugin
  object explicitly; their superseded local SplitText files were not imported.
  GSAP's npm release metadata and cdnjs both reported 3.15.1 when rechecked
  for this import on 2026-11-20.

## Compatibility

- Retained `overwrite: "auto"` for the 129 projects migrated from GSAP 1/2.
  Their existing TweenLite/TimelineLite calls and duration arguments remain
  supported by GSAP 3; animation timing and creative assets were retained.
- Replaced removed `TweenLite.killDelayedCallsTo()` calls with
  `gsap.killTweensOf(callback)` so hover/replay cleanup still cancels timers.
- L'Oréal Lash Paradise and Looker now read transforms through
  `gsap.getProperty()` instead of the removed private `_gsTransform` field.
- The five Seagate variants use MotionPathPlugin in place of BezierPlugin,
  with the same coordinate arrays and tween timings.
- Imperva's rounded text-animation durations are converted back to numbers;
  GSAP 3 no longer treats a numeric string as the legacy duration argument.
- Modified external animation scripts have versioned URLs so cached copies
  cannot run removed GSAP APIs against the new core.
- The Citrix 300 × 250 parallax timeline remains paused and manually scrubbed
  by angle; its numeric positions are unchanged, without the removed
  `useFrames` option.

## Review links

These local previews show the 28 variants that needed compatibility patches
beyond changing the GSAP imports. The development server must be running on
port 8765; these links review the local branch, not the published website.

| Campaign | Preview sizes | Patch |
| --- | --- | --- |
| L’Oréal Lash Paradise | [300×250](http://127.0.0.1:8765/preview/?c=portfolio/loreal/lashparadise/300x250) · [300×600](http://127.0.0.1:8765/preview/?c=portfolio/loreal/lashparadise/300x600) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/loreal/lashparadise/728x90) | Reveal-slider transform reads |
| Looker Dog Buddy | [160×600](http://127.0.0.1:8765/preview/?c=portfolio/looker/dogbuddy/160x600) · [300×250](http://127.0.0.1:8765/preview/?c=portfolio/looker/dogbuddy/300x250) · [300×600](http://127.0.0.1:8765/preview/?c=portfolio/looker/dogbuddy/300x600) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/looker/dogbuddy/728x90) · [970×250](http://127.0.0.1:8765/preview/?c=portfolio/looker/dogbuddy/970x250) | Animated graph transform reads |
| Dun & Bradstreet Credit Essentials | [160×600](http://127.0.0.1:8765/preview/?c=portfolio/dnb/gpe2/160x600) · [300×50](http://127.0.0.1:8765/preview/?c=portfolio/dnb/gpe2/300x50) · [300×250](http://127.0.0.1:8765/preview/?c=portfolio/dnb/gpe2/300x250) · [300×600](http://127.0.0.1:8765/preview/?c=portfolio/dnb/gpe2/300x600) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/dnb/gpe2/728x90) | Delayed callback cancellation |
| Citrix Parallax | [300×250](http://127.0.0.1:8765/preview/?c=portfolio/citrix/parallax/300x250) · [970×250](http://127.0.0.1:8765/preview/?c=portfolio/citrix/parallax/970x250) · [970×90-970×415](http://127.0.0.1:8765/preview/?c=portfolio/citrix/parallax/970x90-970x415) | Paused timeline and timer cleanup |
| Crush-A-Crush | [320×568](http://127.0.0.1:8765/preview/?c=portfolio/crush/crush-a-crush/320x568) | Timer cleanup and dependency loader |
| Seagate Digital Oz | [300×250](http://127.0.0.1:8765/preview/?c=portfolio/seagate/digitaloz/300x250) · [640×480](http://127.0.0.1:8765/preview/?c=portfolio/seagate/digitaloz/640x480) | Bezier-to-MotionPath migration |
| Seagate Holiday | [160×600](http://127.0.0.1:8765/preview/?c=portfolio/seagate/holiday/160x600) · [300×250](http://127.0.0.1:8765/preview/?c=portfolio/seagate/holiday/300x250) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/seagate/holiday/728x90) | Bezier-to-MotionPath migration |
| Imperva Security Analytics | [160×600](http://127.0.0.1:8765/preview/?c=portfolio/imperva/analytics/160x600) · [300×600](http://127.0.0.1:8765/preview/?c=portfolio/imperva/analytics/300x600) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/imperva/analytics/728x90) | Numeric text-animation durations |
| Imperva SecureSphere | [160×600](http://127.0.0.1:8765/preview/?c=portfolio/imperva/secure/160x600) · [300×600](http://127.0.0.1:8765/preview/?c=portfolio/imperva/secure/300x600) · [728×90](http://127.0.0.1:8765/preview/?c=portfolio/imperva/secure/728x90) | Numeric text-animation durations |

Additional plugin and dependency-loader upgrades can be reviewed in
[Databricks Zipline](http://127.0.0.1:8765/preview/?c=portfolio/databricks/zipline/300x250)
(SplitText),
[Jelmyto Kidney](http://127.0.0.1:8765/preview/?c=portfolio/jelmyto/kidney/300x250)
(MorphSVG),
[1-800 CONTACTS Tiered Promo](http://127.0.0.1:8765/preview/?c=portfolio/1800contacts/tieredpromo/300x250)
and [Want It All](http://127.0.0.1:8765/preview/?c=portfolio/1800contacts/wantitall/300x250)
(MorphSVG), and
[Find-Your-Crush](http://127.0.0.1:8765/preview/?c=portfolio/crush/find-your-crush/320x568)
(dynamic script loading).

## Verification

- All 420 inline scripts parse, as do the modified external animation files.
- A repository scan finds only the cdnjs 3.15.1 URLs for GSAP dependencies,
  one core import per project, with plugins after the core.
- Runtime checks using the actual CDN build pass for delayed-call cancellation,
  legacy overwrite behavior, paused timeline scrubbing and curved-path endpoints.
- The original 182 pages pass Chrome load/initial-animation checks, observing each for
  six seconds after load. The eight Imperva variants pass a 15-second retest
  after correcting their duration values. All report GSAP 3.15.1.
- All 12 imported HP banners also pass Chrome playback checks through their
  later animation frames, with no JavaScript errors. Each reports GSAP 3.15.1;
  all six SplitText variants report SplitText 3.15.1 and render split text.
- Visual checks cover Seagate's later motion-path frames, Databricks' SplitText
  animation and the L'Oréal before/after slider. Dragging the slider updates
  its position without errors. Imperva's eight title functions also pass
  focused checks that every tween receives a finite numeric duration.
- All 16 existing icon regression tests pass.

References: [official package version](https://github.com/greensock/GSAP/blob/master/package.json),
[installation](https://gsap.com/docs/v3/Installation/),
[GSAP 3 migration guide](https://gsap.com/resources/3-migration/),
[MotionPathPlugin](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/).
