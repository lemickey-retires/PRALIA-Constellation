# Workspace UI preview

This folder owns the standalone interface prototype on
codex/second-brain-workspace-ui. Read PRODUCT.md for the agreed scope,
references/linear-design-analysis.md for the supplied visual reference and
README.md for running and integration guidance.

index.html, workspace.css and workspace.js own the UI. workspace-motion.js owns
bounded GSAP transitions; vendor/ contains the pinned library and provenance. scene-port.js owns the
small interface through which a future renderer can receive settings. assets/
contains only the static scene image and its provenance. No graph engine loads.

Do not edit ../second-brain/ or ../astral-background/ for this work. Those files
remain the graphics branch's responsibility. Store browser evidence under the
ignored .impeccable/review/ folder, not among shipping assets.
