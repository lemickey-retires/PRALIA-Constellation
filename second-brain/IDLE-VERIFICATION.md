# Always-open GPU behaviour — 10 September 2026

This records the completed idle-scheduling pass. The later active-rendering
pass changes the shaders and bundle; its current results are in
`ACTIVE-GPU-VERIFICATION.md`. Build sizes and preservation counts below refer
to the idle pass at the time it was verified.

## Behaviour

The user approved holding the current image after 30 seconds without
interaction. The browser now stops the scene's animation-frame loop and
suspends the existing physics worker through its visibility setting. Its
composited canvas stays on screen at the original quality. This needs no
extra screenshot texture, stored image, lower resolution or reduced detail.

Pointer movement/entry, keyboard input, scrolling, controls and window focus
wake the view. Resize also wakes it so the canvas is redrawn at its new size.
Held pointer interactions and a layout transition keep it awake. Wake resets
the rendering clock, avoiding a large animation jump after a long idle. It
does not change the user's saved pause choice. Active drawing is capped at
60 fps, with elapsed-time auto-orbit. Hidden tabs cancel the frame loop.

No materials, geometry, visual assets, Blender files, graph records, worker
simulation code, storage format, auth or external services changed. No deploy.

## Observed results

- Before: about 74 rendered fps and 94% 3D-engine utilisation for the ChatGPT
  browser process (PID 11440), measured using Windows GPU performance counters.
- After, active: the app reports 60 fps. One matching process measurement
  showed 73% 3D-engine utilisation. Active rendering remains expensive.
- After 30 seconds idle: 0 rendered fps and 0% reported 3D-engine utilisation
  on the same process. Frame count 1,787, callback count 5,335 and environment
  time 1.500 remained unchanged across subsequent independent observations.
- The held image was visually inspected and remained fully displayed.
- Keyboard wake returned to active rendering at 60 fps without adding the
  idle interval to the animation clock.
- Manual pause remained in effect across a separate idle/wake cycle:
  aria-pressed stayed false and environment time stayed 2.400. All/Off
  link controls produced 4,021/0 drawn links. Playback was restored afterwards.
- Node tests pass for frame pacing at 30, 60, 75, 120, 144 and 240 Hz;
  the 30-second timeout; held interaction; and immediate wake without a burst.
- The local build passes (782,006 bytes, no external runtime imports),
  and git diff --check passes. Browser logs contain no warnings or errors.
- verify-corona.py checks the current assets, bundle receipt and revision
  hashes. Its protected baseline now excludes memory-3d.mjs because the user
  authorised this scheduling change: 279 other original files are unchanged.
  The pre-idle revision manifest separately checks unchanged visual sources.

## Limits and recovery

GPU percentages are local integer snapshots, not a guarantee for every device
or other GPU workload. The idle image intentionally stops moving until the
next interaction. The active 60 fps cap does not guarantee that weaker
hardware can achieve 60 fps at the preserved visual quality.

Hidden-tab and resize wake paths were reviewed in code; a separate browser
visibility/resize automation test was not performed. No NUC benchmark was
possible without the target machine. The original publication manifest's
pre-existing README.md and THIRD-PARTY-NOTICES.md discrepancies remain intact.

The prior entry module, bundle, receipt, README, validator and revision manifest
are retained in work/pre-idle-cache under the workspace. No user data or
settings were reset.
