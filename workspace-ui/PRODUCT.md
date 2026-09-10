# 2nd Brain workspace

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner is refining the workspace interface on this computer while another
computer develops the 3D universe and nodes on a separate branch.

## Product Purpose

Make the surrounding search, sources, saved views, inspector and display controls
clear and useful. Provide a lightweight separate preview for reviewing the UI.

## Operating Context

This branch starts from codex/second-brain-horizon. The workspace preview is
independent of the 3D implementation and uses a pre-existing still image only.
The existing application uses HTML, CSS and JavaScript, retained for this preview.

## Capabilities and Constraints

- Do not load, modify or simulate the node graph, physics, WebGL or Blender scene.
- Use small invented sample records only to exercise workspace search and details.
- Keep source files under workspace-ui so graphics work can merge independently.
- Save UI settings only in this preview's own browser storage namespace.
- Real app integration remains future work; never report a live connection.

## Brand Commitments

The owner supplied a Linear design analysis and chose Obsidian Graph View as
the workspace UI reference. Preserve the product name 2nd Brain and the existing
3D universe's identity. The references govern the surrounding interface only.

## Evidence on Hand

The supplied Linear analysis is preserved under references/. The still image is
an existing native Blender render with no knowledge nodes or personal data.

## Product Principles

- The workspace supports the scene without competing for attention.
- Show common controls immediately and reveal detail on demand.
- Keep preview state truthful and independent of the graphics implementation.
- Prefer existing platform affordances and inexpensive interface interactions.
