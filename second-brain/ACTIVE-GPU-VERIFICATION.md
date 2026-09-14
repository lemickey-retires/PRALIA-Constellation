# Active aura rendering — 11 September 2026

## Outcome and boundaries

The same 192 closed surfaces, subdivisions, field texture, full render
resolution, colour stops, graph records and Blender sources are retained.
The existing 60 fps cap and 30-second idle hold remain. No deployment,
installation, data migration or settings reset was performed.

This pass removes repeated rendering work. It does **not** establish low
active GPU utilisation in the user's large preview, or guarantee 60 fps on
a NUC. The target NUC model and machine were not available for measurement.

## Changes

- Compute the view-ray optical field once per pixel at full render resolution
  and share it across the aura layers. RG32F keeps both used components at
  32-bit precision. The target resizes with the drawing buffer; camera,
  projection, object transform or animation-time changes invalidate it.
- Use one double-sided draw for additive light. Both faces remain visible;
  additive blending does not require separate back/front sorting passes.
- Evaluate fixed radial brightness profiles once per layer. Replace the
  equivalent wrapped-angle trigonometric expression with arithmetic for
  angles in the palette's existing range. Colour parameters are unchanged.
- Keep the original field calculation as a fallback when float render
  targets are unsupported or the camera is not perspective.

The extra optical target costs eight bytes per physical render pixel,
approximately 22.5 MiB at the observed 2,321 by 1,272 canvas size. It is not
a reduced-resolution texture or a prerecorded animation.

## Measured evidence

An independent fixture imports the retained pre-change module and the
current module. It compares linear HDR pixels across 11 camera cases,
including front/back/sides/poles, close and elevated views, and transforms
matching the application's large world scale and off-centre projection.
Each case checks three optimisation configurations against the original.

- All 33 comparisons passed explicit assertions. Maximum linear-channel
  difference was 0.001953125, below 1/255. No channel exceeded the additional
  tolerance of max(0.01, 1% of the reference channel). This is numerical
  equivalence within the tested tolerance, not byte-identical rendering.
- GPU timers at 1,280 by 720 measured 24 animated frames per configuration,
  after five warm-up frames. Disjoint timer results are rejected.

| Aura renderer | Median GPU time | 95th percentile |
| --- | ---: | ---: |
| Original | 11.772 ms | 12.247 ms |
| Original, one double-sided draw | 11.337 ms | 11.996 ms |
| Shared field and equivalent shader arithmetic, separate face draws | 10.394 ms | 13.002 ms |
| Final combined optimisation | 6.596 ms | 8.138 ms |

The final median is approximately 44% lower in this isolated aura test.
GPU clocks and other load affect individual runs; this is not a claim of
44% lower whole-app utilisation.

The actual preview, at approximately three million physical pixels, reported
49–52 active fps with the cache enabled. Five consecutive NVIDIA readings on
the local RTX 5070 reported 99% utilisation and approximately 250 W board
power. These are whole-GPU observations, not exclusively app-attributed
measurements. The scene is still below its 60 fps cap and can consume the
available GPU capacity. The cap limits demand only once frames are cheap
enough to reach it. Current whole-app utilisation therefore remains high.

## Validation and preservation

- The existing actual-GPU geometry, colour, dark-core, depth and camera tests
  pass all 27 checks. Both GPU fixtures report no shader compilation errors.
- The final preview was visually inspected at the user's retained camera.
- Idle scheduling tests pass for 30–240 Hz pacing, the timeout, held pointer
  interaction, and wake without accumulating idle time. The actual preview
  entered idle and keyboard wake resumed rendering with the cache enabled.
- The local build passes: 786,034 bytes with no external runtime imports.
- `git diff --check` passes.
- An independent comparison against the 97-file pre-active revision manifest
  finds 88 files unchanged and only the nine intended source, bundle and
  documentation updates. Blender sources, optical assets, simulation worker,
  idle scheduler, projection and continuous-material sources are unchanged.
- `verify-corona.py` verifies the current revision hashes, build receipt,
  1,057 graph records, 4,021 relationships and protected original files.

The local workspace contains `work/aura-active-check.mjs` and
`work/build-active-check.mjs` for the comparative GPU fixture,
`work/verify-active-preservation.py` for the scoped hash comparison, and
`work/pre-active-optimisation` for the retained pre-change source and bundle.
The regular GPU fixture remains `verify-enclosing-aura.mjs`.

Unsupported-device fallback and separate live window-resize/visibility
automation were reviewed in code but not exercised on a second device.
The original publication manifest's pre-existing README and third-party
notice discrepancies remain unchanged. A further large reduction while
preserving the current large-window appearance and 60 fps target would
require another rendering investigation; this pass does not claim that
outcome has been achieved.
