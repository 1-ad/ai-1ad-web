# Shared GSAP CDN version

All 182 GSAP-loading creative pages use **GSAP 3.15.1** from cdnjs:

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

## Verification

- All 420 inline scripts parse, as do the modified external animation files.
- A repository scan finds only the cdnjs 3.15.1 URLs for GSAP dependencies,
  one core import per project, with plugins after the core.
- Runtime checks using the actual CDN build pass for delayed-call cancellation,
  legacy overwrite behavior, paused timeline scrubbing and curved-path endpoints.
- All 182 pages pass Chrome load/initial-animation checks, observing each for
  six seconds after load. The eight Imperva variants pass a 15-second retest
  after correcting their duration values. All report GSAP 3.15.1.
- Visual checks cover Seagate's later motion-path frames, Databricks' SplitText
  animation and the L'Oréal before/after slider. Dragging the slider updates
  its position without errors. Imperva's eight title functions also pass
  focused checks that every tween receives a finite numeric duration.
- All 16 existing icon regression tests pass.

References: [official package version](https://github.com/greensock/GSAP/blob/master/package.json),
[installation](https://gsap.com/docs/v3/Installation/),
[GSAP 3 migration guide](https://gsap.com/resources/3-migration/),
[MotionPathPlugin](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/).
