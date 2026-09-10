# Glass workspace

A separate second interface for the 2nd Brain workspace. The full-window Blender still sits behind floating library, navigation, inspector and view controls. The original interface remains in `../workspace-ui/`.

Run `python workspace-glass/run-preview.py` from the repository root, then open http://127.0.0.1:51423/workspace-glass/.

This is a local UI prototype with invented sample records. It loads no graph engine, live agent data or 3D nodes. The display settings are saved preferences; they do not change the still image.

## Ownership

- `index.html` and `glass-workspace.css` own this edition's layout.
- `glass-workspace.js` imports the original workspace's shared behaviour, controls, persistence and GSAP motion.
- `glass-material.js` adapts actual Liquid Glass `Container` and `Button` classes behind accessible HTML controls.
- `vendor/liquid-glass/` preserves upstream source and its MIT licence, unchanged, from dashersw/liquid-glass-js revision `78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a`.

The reused source was found in the owner's existing Liquid Glass project. The adapter textures only the bundled universe image, never a screenshot of page content. It creates at most five WebGL surfaces, reuses them, and redraws after a settled layout or user action. There is no continuous glass animation. Solid mode and loss of WebGL retain readable controls. The upstream nested-button animation path is not used.

The original and second previews use separate local ports, so saved preview settings remain independent when launched separately. The Original UI link serves the original UI on this preview's origin and therefore shares this preview's browser settings.

See [design system](DESIGN.md) for the implemented visual rules. Review captures and run evidence live in the ignored `.impeccable/review/` folder.

## Material modes and colourways

The header offers Clear glass, Soft glass, Liquid glass, CSS frost and Solid. Clear, Soft and Liquid use the existing local playground's `lab-config.js` material recipes with the unchanged library shaders; the named presets are playground additions, not separate upstream components. Soft is the initial mode. Liquid increases refraction and centre warping; it does not start an animation loop. CSS frost uses browser backdrop blur; Solid draws no glass. The selected material persists in this browser.

Steel is the initial colourway trial for this update. All four colourways now tint panel surfaces, menus, controls and text roles as well as accents. Later colourway choices remain saved.
