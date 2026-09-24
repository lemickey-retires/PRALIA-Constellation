# 2nd Brain: Event horizon

## Local continuous-corona revision

The Event horizon background uses the accepted flowing corona field and curved
profile, revolved through 360 degrees into a complete body. Its front and back
have the same inner bulge and flared falloff as its sides. The former strip and
flat-fill meshes are hidden references. Three fine light shells supply the
bright inner contours. Geometry stays fixed as the camera moves. The graph's
behaviour and data and the Planetary surface preset remain unchanged.

The latest shape pass reduces vertical clearance outside the unit core by
about 80% and extends the complete radial diameter by about 25%. Ten radial
colour stops and four spatial colour regions add ivory, champagne, amber,
peach, copper, rose, blue and cyan. The cooler left-side highlights were
checked from the user's captured Blender viewing direction.

The editable addition is `horizon-assets/continuous-horizon.blend`; its native
construction scripts are `create-continuous-corona.py` and
`compose-continuous-study.py` in that directory. The original Blender scenes
and published `SOURCE-MANIFEST.json` are retained as baseline evidence.
The editable `continuous-horizon.blend` is stored with Git LFS. Install Git LFS
and run `git lfs pull` after cloning to retrieve that scene. The browser preview
uses the bundled optical assets and does not require the Blender file or LFS.
See `CORONA-VERIFICATION.md` for the revision checks and `CORONA-MANIFEST.json`
for the revised file hashes. Poly Haven texture provenance is recorded in
`licenses/POLY-HAVEN-NOTICE.md`. The references guide an artistic approximation
of lensing, rather than a general-relativistic simulation.

## Original publication description

A navigable 3D knowledge universe with a native Blender black hole, detailed
horizontal gas, gold halo, space haze and physical star nodes. This branch saves
the latest viewer as a separate version alongside the original constellation.

**All 1,097 records and 4,101 relationships here are invented demonstration
data.** No personal memories, conversations, agent homes, credentials or live
provider connections are included. The original local preview remains private.

## Run

From the repository root, with Python 3.10 or later:

```sh
python second-brain/run-preview.py
```

On Windows, use `py -3 second-brain/run-preview.py`. The launcher opens the
viewer at a loopback address. Stop it with Ctrl+C. Use `--no-browser` to open
the printed address yourself or `--port 51422` to choose another port.
No Node.js, Blender, package install, API key or network is needed to view it.
The existing root launcher and v1.0.0 release still open the earlier version.

## Controls

- Drag empty space to orbit, scroll to zoom and right-drag to pan.
- Drag a star to move it; use the inspector to release a pinned star.
- Links start **Off**. Choose Selected node, Overview or All as needed.
- Replay entrance reveals stars individually. Conflicting positions return to
  normal movement after a bounded settling period.
- Search, source filters and the inspector operate on the invented records.
- Backgrounds include Event horizon and the retained Planetary surface.
- Original 2D opens Graphify's generated view of the same demonstration data.
- After 30 seconds without interaction, the app holds the full-quality image
  and suspends animation and physics. Moving the pointer over the app, typing,
  scrolling or using a control wakes it. A manually paused scene stays paused.
- Active rendering is capped at 60 fps. Hidden tabs suspend rendering, and
  the animation clock resumes without jumping ahead when the view wakes.

The idle hold uses the browser's existing displayed canvas; it does not
reduce resolution, simplify the aura or replace the interactive scene with
a video. Active animation can still be GPU-intensive. See
`IDLE-VERIFICATION.md` for measured behaviour and limits.

The active aura renderer also shares its repeated optical calculation at full
resolution, uses one draw for both sides of its additive light surfaces, and
precomputes fixed layer brightness. All 192 surfaces and the colour design
remain. See `ACTIVE-GPU-VERIFICATION.md` for image comparisons and timings.
This reduces rendering work but does not guarantee low GPU utilisation or
60 fps in a large window on every device.

The Event horizon glow retains its flowing strands and tapered sides. The
existing material is distributed through curved, transparent layers in fixed
3D space, with a bright rim supplied by physical inner shells. The old bright
horizontal disk and stream remain hidden. The later orange annulus is also
hidden and retained only as a reference. The layered coloured gas surrounds the
core through a complete 360-degree ring with depth and transparent falloff.
Creating a new darker outer layer is deferred. Four small blue
sprite wisps have 3D anchors in the aura and share its pause/speed control.
The legacy separate inner contour remains disabled. Full rendering
resolution, native volume detail and original bloom are preserved. Performance
depends on the graphics hardware and window size; a stable 60 fps is not promised.

## Source and assets

The viewer modules are beside this README. `rendering/` contains the exact
support modules used by this version, so the older constellation is independent.
`site/` is the complete prebuilt browser app. `horizon-assets/` holds the
editable Blender scenes and procedural construction/baking scripts. Native
geometry and numerical volume fields supply the live scene; generated imagery
is reference material and a retained fallback texture, not a wrapped scene.

To rebuild the browser bundles:

```sh
cd astral-background
npm ci
cd ../second-brain
npm ci
npm run build
```

The build reuses the repository's pinned ShaderGradient source and installed
rendering dependencies, plus GSAP 3.15.0 declared here. All browser imports are
bundled locally. See `view-build-receipt.json` for output hashes and
`SOURCE-MANIFEST.json` for the publication file hashes.

See the repository's [third-party notices](../THIRD-PARTY-NOTICES.md) and this
folder's `licenses/` for the additional GSAP licence information. The Blender source files
describe the native material study; browser shaders animate the same UV field
on closed 3D emission surfaces. The earlier flat projection is retained for comparison and
recovery, and is not used for the active coloured aura. The revised editable study is
`horizon-assets/continuous-horizon.blend`; its construction scripts run in order:
`create-continuous-corona.py`, `compose-continuous-study.py`, then
`integrate-corona-study.py`, `widen-horizon-study.py`, then
`finish-corona-study.py`, `create-outer-aura-study.py`, `sculpt-aura-depth.py`,
then `complete-white-surround.py`, `enclose-white-aura.py` and
`finish-enclosed-aura.py`, followed by `shape-colour-aura.py` for the tighter
profile, layered palette and captured-view study camera.
The rejected soft-volume experiment is not part of this construction sequence.
The Poly Haven displacement source is packed in the
study and attributed in `licenses/POLY-HAVEN-NOTICE.md`. Rebuilding Blender
exports is optional for viewing. `CORONA-MANIFEST.json` and
`CORONA-VERIFICATION.md` record this local revision separately from the original
publication manifests.
