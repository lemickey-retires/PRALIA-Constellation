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

The first visit opens the shared **Constellation / Orbital / Amethyst** view,
with **Universe / Cosmic nebula** at **0.05× speed**, matching the captured view.
Your subsequent changes stay in your own browser. Animation continues, so the
scene moves after opening; screen size, graphics hardware and reduced-motion
settings can affect rendering. The included graph data is unchanged.

The files are a frozen graph snapshot. Running this viewer does not scan your
computer or regenerate the graph. The full underlying graph is included as data,
without the original PRALIA application source, private Git history, agent homes,
credentials or personal conversations.

## Explore

Drag empty space to orbit, right-drag to pan, and scroll to zoom. Drag a node to
move it. Search reveals the actual node metadata and its connections.

| Control | Choices |
| --- | --- |
| Layout | My layout, Constellation, Galaxy, Globe, Helix |
| Design | Starlight, Crystal, Orbital, Minimal |
| Colours | Celestial, Aurora, Ember, Amethyst, Silver |
| Universe | Cosmic nebula or Soft gradient, with six colour presets |
| Movement | 3D orbital flow, Float, Breathe, gravity, bounce and camera orbit |

The universe shares the graph's 3D camera. Its clouds cover an enclosing sphere;
1,800 surrounding stars occupy different depths. **Universe speed** changes
independently of graph motion; zero holds the shader still.
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
the compressed full graph. Optional native physics checks are
`node verify-graph-physics.mjs` and `node verify-layouts.mjs` in
`astral-background/` after installing the build dependencies.

## Repository access and notices

This repository is published for download. Download access does not grant
permission to push changes to the owner's repository. Only the owner has been
given write access. Copies already downloaded or publicly forked remain with
their recipients if this repository later becomes private.

The owner permits downloading and running this shared snapshot. No additional
licence is granted for original project material. Third-party components retain
their own licences and rights; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
and `licenses/`.
