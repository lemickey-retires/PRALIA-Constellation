# Workspace UI preview

The Linear-inspired interface around the 2nd Brain universe, using Obsidian-style
source filters and exploration panels. This is a standalone UI preview with a
static universe image. It loads no graph data, nodes, Three.js, physics or workers.

From the repository root:

```sh
python workspace-ui/run-preview.py
```

On Windows: `py -3 workspace-ui/run-preview.py`. The server prints its local
address. Open it in a browser; stop the server with Ctrl+C. Use `--port 51423`
to choose another port. No installation or build is required.

## Explore the interface

- Collapse either sidebar or use Focus view to give the scene more space.
- Filter source categories and search the clearly labelled sample records.
- Select a search result to inspect its sample content and connections.
- Change view settings and save named views. These persist in this preview only.
- Press Ctrl/Cmd+K to search records and workspace actions. Escape closes overlays.
- Export workspace settings from the command menu for later integration.

The static image does not respond to graph or scene settings. A quiet status label
keeps that boundary visible. Controls update real UI state without starting the
3D renderer or connecting to PRALIA.

## Merge boundary

All implementation is inside this folder. The graphics files under
`second-brain/`, `astral-background/` and their Blender assets remain unchanged.
Merge source changes from both branches, then integrate the scene through
`scene-port.js`: mount it in `#scene-mount`, call `getState()` for the current
settings, and subscribe to `workspace:change` for later changes. The emitted
settings use existing keys such as links, layout, paused and background.
This is a UI contract, not a replacement rendering engine.

The original attached design analysis is preserved under references/. The actual
implemented design system is recorded in DESIGN.md after visual review.

## Verification

Checked on 10 September 2026 at desktop and phone sizes: source filtering,
keyboard focus, panel restoration, sample search and details, saved-view reload,
preset reload, duplicate-name feedback and settings export. No JavaScript errors
were observed. The preview requested its stylesheet, the UI JavaScript
modules and the static PNG; no canvas, graph data or renderer was loaded.
Visual finish review: ship. The automated style detector used its reduced regex
mode because optional parsers were unavailable; browser review supplied the
layout evidence. The system-font warning is covered by the supplied product UI
reference and Operate-mode allowance.

## Motion preview

UI interactions use locally bundled GSAP 3.15.0 and Flip. Try Focus view, the side
panel controls, View/Details tabs and Ctrl/Cmd+K. Buttons acknowledge hover and
press; dialogs and record search animate in and out. Custom dropdown panels retain keyboard selection and focus restoration. The existing Motion setting is for the future
scene; UI animation follows the system reduced-motion preference.

Desktop, phone and reduced-motion checks passed, including interrupted panel
transitions, tab switching, search-to-save-dialog handoff and Escape dismissal.
No active tweens remain after settling. Vendor provenance is in vendor/README.md.

The bounded style scan also reports pre-existing palette/type documentation
advisories; the motion pass preserves the established visual values. A local
650 ms panel-transition sample measured 16.6 ms median frame spacing and 17.2 ms
at the 95th percentile; this is a local check, not a cross-device benchmark.

## Custom controls and help

Buttons, text fields, search fields, checkboxes, switches and the label-size
slider share custom hover, pressed, focus and error treatments. Connections,
Layout and Background use custom popover menus with selected checkmarks and
option descriptions. Arrow keys, Home/End, typing to find an option, Enter,
Escape and Tab are supported. The original setting values remain the data source.

Hover or keyboard-focus icon controls for floating help; tap the information
buttons beside settings on touchscreens. Tooltips stay within the viewport and
can be hovered or dismissed with Escape. Browser title bubbles are removed.
Scene motion is labelled explicitly to distinguish it from interface motion.
Save-view validation uses an inline message and field styling.

Verified at desktop and phone sizes, including reduced motion: option selection,
Escape focus restoration, help placement, custom validation and saved-view reload.
No JavaScript errors or horizontal overflow were observed.
