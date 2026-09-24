# Active aura rendering — updated 14 September 2026

## 14 September integrated-GPU follow-up

This follow-up supersedes the 11 September performance conclusion below. The
preview was measured in its real 2,064 by 1,270 in-app canvas on Intel Arc
Graphics (ANGLE/D3D11), not inferred from an isolated fixture.

The accepted 360-degree composition, 128 by 128 closed-surface silhouette,
colour stops, bloom, nodes, labels, camera behaviour, graph data and Blender
sources remain. The continuous radial light volume is now integrated with 16
wider samples instead of drawing all 192 narrow reference samples. Each sample
already carries its represented radial width in `aLightWeight`, so accumulated
light and opacity remain stable. This is an appearance-preserving numerical
integration change, not a claim of byte-identical pixels.

The shared optical cache remains full-frame in screen coverage, but uses a
linearly reconstructed half-resolution RG16F target. Its inputs are normalised,
so this retains substantially more precision than the original eight-bit field
while reducing intermediate bandwidth. Redundant updates of the one shared
corona material were removed. Final-frame MSAA was also removed because the
scene is rendered through the single-sample EffectComposer; the final operation
is a full-screen quad with no geometry edge for MSAA to improve.

Measured results in the live preview:

| Live Intel Arc case | Reported active rate |
| --- | ---: |
| Pre-follow-up local build, 112 samples and a 30 fps cap | 12 fps |
| 24 weighted samples, restored 60 fps cap | 43 fps |
| 16 weighted samples, normal continuous motion | 59 fps |
| 24 consecutive orbit inputs while the aura moved | 60 fps |
| Full 1,057-node staged entrance reveal | 60 fps at every sampled stage |
| Full 1,097-node instant reveal | 60 fps after `Show all now` |
| Wake with 1,062 overview links visible | 59 fps |

During the five-second pre-change profile, browser main-thread task time was
only 0.230 seconds. That confirmed the failure was GPU fill/transparent
overdraw, not Python, layout physics or DOM work. The earlier staged entrance
progressed from 95 to 395 to 887 to all 1,057 nodes and reached `ready` at 6.65
seconds. The current 1,097-node build accepted `Show all now`, reached `ready`
and reported 60 fps.
The preview then entered its intended idle hold after 30 seconds and woke on an
orbit input. The retained cap is 60 fps and the retained pixel ratio is 1.

The current local bundle builds with no external runtime imports. The running
preview was visually inspected before and after orbiting; the constellation,
surrounding glow, colour distribution, bloom and spatial composition remain
present. Performance varies with view coverage and other machine load, so these
measurements establish the observed Intel Arc run, not a universal guarantee.

## 11 September baseline (historical)

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
  1,097 graph records, 4,101 relationships and protected original files.

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
