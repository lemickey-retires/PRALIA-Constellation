# PRALIA Constellation

An interactive, glowing 3D snapshot of the PRALIA code graph, with the original
2D viewer included. Everything needed to display the graph is bundled locally.

## Download and run

**Windows:** download **PRALIA-Constellation-v1.0.0-windows-x64.zip** from
[Releases](https://github.com/lemickey-retires/PRALIA-Constellation/releases/latest),
extract the entire ZIP, then double-click **PRALIA-Constellation.exe**.
Keep its launcher window open while using the graph. Press Enter in that window,
or close it, to stop the local viewer.

No installation, account, API key, Blender, Node or Python is required for the
Windows ZIP. It opens in your normal browser and works without internet access.
Use a current browser with WebGL enabled. The Windows launcher is unsigned.

**Source ZIP, macOS or Linux:** install Python 3.10 or later, open a terminal in
this folder, and run:

```sh
python3 run-preview.py --headless
```

On Windows, the equivalent is `py -3 run-preview.py --headless`, or
`start-windows.cmd`. Stop the terminal server with Ctrl+C. The Python route
uses only the standard library and does not install packages.

## The included snapshot

- All **3,520 community nodes** and **14,520 connections** from the shared view.
- All **165,539 extracted code elements** and **365,648 directed relationships**
  in the losslessly compressed `data/full-graph.json.gz`.
- The exact exported positions, pins, camera and appearance settings, captured
  on **8 September 2026 at 22:14 Australia/Brisbane**.
- **My layout** and all four generated arrangements, with their individual saves.
- The Blender-created sphere, crystal, orbital rings, glow and surrounding stars.
- The locally bundled ShaderGradient shaders, original 2D view and motion controls.

The refreshed viewer starts in a live **Constellation / Starlight** view with
the universe effect on. Constellation is deliberately one continuous field: it
does not turn route groups into visual blobs. Relationships remain available in
the links, selection details and unchanged graph data. Your saved **My layout**
and any existing colour-palette or pin-on-drop choice are retained separately.

The files are a frozen graph snapshot. Running this viewer does not scan your
computer or regenerate the graph. The full underlying graph is included as data,
without the original PRALIA application source, private Git history, agent homes,
credentials or personal conversations.

## Explore

Drag empty space to orbit and right-drag to pan. **Scroll over the graph to
spread nodes apart or bring them closer; hold Shift while scrolling to zoom the
camera.** Dragging a node activates solid collision physics for the drag and
drop. Every rendered node normally moves in the lightweight live field instead.
Search reveals the actual node metadata and its connections.

| Control | Choices |
| --- | --- |
| Layout | My layout, Constellation, Galaxy, Globe, Helix. A layout change gathers the stars through the centre, lets them squirm, then resolves the selected form. |
| Design | Starlight, Crystal, Orbital, Minimal |
| Colours | Celestial, Aurora, Ember, Amethyst, Silver |
| Universe | Cosmic nebula or Soft gradient, with six colour presets |
| Graph spread | Scroll to expand/contract the graph, or use the spread slider; Shift + scroll zooms the camera |
| Live field | Starts on for all 3,520 visible stars; preserves each named layout while animating an efficient sparse force network |
| Graph physics | Center, Repel, Link and Link-distance forces; node spacing, relation tether, and a cursor field that deflects nearby stars |
| Movement | 3D orbital flow, Float, Breathe, collision bounce during drag and optional camera orbit |

The optional universe shares the graph's 3D camera. Its clouds cover an
enclosing sphere; 1,800 surrounding stars occupy different depths. **Universe
speed** changes independently of graph motion; zero holds the shader still.
**Export view** downloads your current settings and arrangements as JSON.

## Source and verification

`graphify-out/` contains the ready-to-run viewer. `astral-background/` holds its
3D rendering and physics source; the original 2D viewer code is in
`graphify-out/graph.html`. The native Blender scenes and reproducible asset
scripts are in `blender-assets/`.

To rebuild the browser bundles, install Node.js, then run:

```sh
cd astral-background
npm ci
node build-share.mjs
```

The ShaderGradient source is pinned at
`974a230b1e6c3ec375fbe17a8ea1c89edbc48019`; its file hashes are checked before
each build. Normal use needs no build step.

Run `python verify-share.py` to verify every listed file hash, the snapshot and
the compressed full graph. Optional native checks are
`node verify-graph-physics.mjs`, `node verify-layouts.mjs` and
`node verify-visual-motion.mjs` in `astral-background/` after installing the
build dependencies.

## Repository access and notices

This repository is published for download. Download access does not grant
permission to push changes to the owner's repository. Only the owner has been
given write access. Copies already downloaded or publicly forked remain with
their recipients if this repository later becomes private.

The owner permits downloading and running this shared snapshot. No additional
licence is granted for original project material. Third-party components retain
their own licences and rights; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
and `licenses/`.
