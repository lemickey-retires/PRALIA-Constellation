# 2nd Brain: Event horizon

A navigable 3D knowledge universe with a native Blender black hole, detailed
horizontal gas, gold halo, space haze and physical star nodes. This branch saves
the latest viewer as a separate version alongside the original constellation.

**All 1,057 records and 4,021 relationships here are invented demonstration
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

The outer halo follows the spherical core's apparent edge as the camera moves.
The separate unwanted thin inner contour remains disabled. Full rendering
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
describe the native material study; browser shaders own live halo alignment and
the disabled inner contour. Rebuilding Blender exports is optional for viewing.
