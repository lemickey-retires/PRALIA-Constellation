---
name: 2nd Brain Glass Workspace
description: Floating glass tools over a still universe, for a local sample workspace.
colors:
  accent: "#d0d1ce"
  accent-hover: "#eeefeb"
  moss-accent: "#a9bba0"
  copper-accent: "#d4ae91"
  steel-accent: "#a4b8c7"
  canvas: "#010102"
  ink: "#f2f3ef"
  muted: "#d4d7d2"
  subtle: "#afb4ac"
  surface: "#121512"
  surface-2: "#20251f"
  surface-3: "#2b3029"
  line: "#ffffff14"
  line-strong: "#ffffff26"
typography:
  headline:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  control: "12px"
  pill: "22px"
  panel: "24px"
  circle: "50%"
spacing:
  small: "8px"
  medium: "12px"
  large: "20px"
  outer: "24px"
components:
  button-save:
    backgroundColor: "#c3d0b93b"
    textColor: "#eff7e8"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 17px"
  button-save-hover:
    backgroundColor: "#c3d0b95e"
  button-quiet:
    textColor: "#c7d3bd"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 13px"
  button-secondary:
    backgroundColor: "#26301f"
    rounded: "20px"
  field:
    backgroundColor: "#0d150a"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  panel:
    backgroundColor: "#151c12e8"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: 2nd Brain Glass Workspace

## Overview

**Creative North Star: "Floating tools over a still universe"**

Dark, green-neutral glass lets the existing golden universe still fill the window while compact tools float above it. The material belongs to the navigation rail, library, inspector and view dock; restrained type and clear selected states keep the controls readable.

This is a local sample-data UI preview. Its decorative refraction samples the bundled still, while native HTML retains interaction and accessibility. The original workspace UI and source component library remain separate and unchanged; this document describes the second version.

**Key Characteristics:**

- Full-viewport still with floating tools.
- Green-neutral translucency and soft rounded silhouettes.
- Compact Inter hierarchy and explicit selected states.
- Event-driven material updates and a solid fallback.

Built evidence: [glass styles](glass-workspace.css), [material adapter](glass-material.js), the inherited [workspace styles](../workspace-ui/workspace.css) and [shared product truth](../workspace-ui/PRODUCT.md). The [surface brief](.impeccable/surface-brief.md) defines this version's agreed scope. Product restrictions on the graph engine remain intact: these UI-only shader canvases do not load or simulate that engine.

## Colors

Green-neutral surfaces borrow warmth from the golden still beneath them. The material tint is stable while selectable accents identify control state.

### Primary

Graphite is the default accent. Moss, Copper and Steel are retained colourways, changing accent, hover, pressed and selection colours through the inherited workspace tokens. They do not recolour the fixed glass tint or replace the image.

### Neutral

Canvas keeps the underlying window dark. Ink, Muted and Subtle separate primary controls from explanatory text. Surface steps provide opaque control layers, and translucent Line tokens divide settings without boxing every row.

**The Legible Glass Rule.** Place a dark translucent veil between refraction and foreground controls; material never replaces text contrast.

## Typography

Inter with platform sans-serif fallbacks is the single interface family. There is no separate display face. The body base is inherited; actual control text concentrates in the label role, with smaller contextual notes.

The inspector headline uses the headline role; the view title uses the title role. Library titles increase weight to 600. Desktop identity is 18px at weight 600, reducing to 15px on mobile. Supporting notes commonly use 10–11px and remain secondary; those local sizes are not a new display scale.

**The Quiet Hierarchy Rule.** Use compact size and weight differences to organise controls; do not introduce a marketing display scale into the workspace.

## Layout

The scene fills a fixed 100dvh workspace with object-fit cover and opacity .78. Whole-window scrolling is suppressed; source lists and inspector contents manage their own overflow.

On desktop, the header sits 24px from the edges. The 58px navigation rail starts 110px down. The library is 254px wide, offset 98px from the left; the inspector is 280px wide and 24px from the right. Both end above the dock, with a 680px maximum height. The centred dock is 580px by 68px and sits 52px above the lower edge.

At 1100px, header context simplifies and side panels narrow. At 960px, panels become collapsible overlays with a scrim. At 600px, the rail moves to a 12px inset; one open panel occupies the space between a 76px left offset and a 12px right inset. The dock spans the lower window with 12px side margins and a 64px height. Controls condense to icons where necessary; accessible names remain. At 370px the wordmark text hides to preserve controls.

The recurring spacing vocabulary is small gaps, medium control spacing, generous panel padding and an outer margin. These are extracted recurring values, not a new CSS variable system.

## Elevation & Depth

The actual MIT-licensed upstream Container renders refraction behind four structural surfaces: rail, library, inspector and view dock. The upstream Button renders behind the Save view action. A local adapter supplies the still texture and changes rendering to scheduled draws; it does not alter the read-only source library.

Dark overlays sit above the shader and below content. Panels use the denser overlay; rail and dock use a lighter one. Solid mode hides the material canvas. Unavailable or lost WebGL leaves the dark CSS surface readable.

The shared ambient surface shadow is `0 18px 50px #0005`. Menus use `0 18px 45px #0005`; dialogs use `0 24px 70px #0007`. These diffuse shadows distinguish overlapping tools from the image.

**The Still Texture Rule.** Refraction samples only the bundled still and redraws on scheduled interface changes; no continuous material render loop is part of this system.

Inherited control transitions use 150ms; reduced-motion preferences remove CSS transitions. The material refresh delay is 380ms to settle layout changes, not an animation duration.

## Shapes

Rounded panels contain softer rounded rows and fields. Save and quiet actions use pill corners, while navigation and compact icon buttons are circular. The desktop dock has a 34px radius and rail a 29px radius, tracking half their height or width; mobile adjusts those silhouettes to 32px and 26px. Fine translucent borders remain on fields, tabs and overlays.

## Components

**The Native Foreground Rule.** Keep semantic HTML controls above decorative, inert, aria-hidden material canvases.

- **Save action:** native button with the upstream decorative Button behind its text and icon. The tint strengthens on hover; keyboard focus remains the inherited accent outline.
- **Quiet and secondary actions:** rounded CSS controls with restrained hover fills. Dialog secondary buttons use a firmer border and green-neutral fill.
- **Fields and dropdowns:** dark filled controls with rounded corners. Focus uses the accent outline or border; open dropdowns strengthen the fill. Mobile select triggers reach 44px height.
- **Navigation rail:** circular icon controls with accessible names and a visible active fill; desktop and mobile retain 44px navigation targets.
- **Library rows:** compact saved-view and source rows, with selected fills and native source checkboxes. Source targets increase from 38px to 44px on mobile.
- **Inspector tabs:** a capsule track with a separate selected capsule; settings remain vertically scrollable when space is limited.
- **Status chips:** quiet rounded labels identify the static scene and source count; they communicate actual preview state.
- **Search, menus and dialogs:** more opaque floating surfaces protect reading and keyboard operation above the background. Native dialogs, focus treatment and explicit close actions are retained.

The sidecar component snippets illustrate the native CSS foreground and fallback material. Static snippets do not reproduce a running WebGL texture: actual refraction belongs to the locally bundled components and adapter.

## Do's and Don'ts

### Do:

- Do preserve visible sample-content and static-scene disclosures.
- Do keep the rail, search and bottom dock reachable when panels collapse.
- Do use the solid material mode and opaque fallback when refraction is unavailable.
- Do retain keyboard focus, selected states and native control semantics.

### Don't:

- Don't present the still or sample records as a live graph or connected app.
- Don't extend refraction to every small control; reserve it for the implemented structural surfaces and Save action.
- Don't add a continuously running scene or material animation.
- Don't modify the original UI or read-only source library to extend this version.

Not canonised: capture-specific framing, tiny incidental status-copy sizes, and the inherited grey pressed fills are not promoted into new reusable tokens. No material design defect was identified in the supplied finish review.

Review record: SHIP disposition supplied for desktop, user-1265, mobile and mobile-inspector captures. The [verification record](.impeccable/review/verification.json) reports local interaction checks, solid/WebGL fallback, keyboard operation and unchanged idle draw counts; it is evidence for this prototype, not publication or live integration.


## Material and palette extension — 10 September 2026

The material selector is a native labelled select offering Clear glass, Soft glass, Liquid glass, CSS frost and Solid. Soft is initial; the choice persists. The three shader recipes reuse the local playground settings. Liquid adds static centre warping and stronger edge refraction. CSS frost is explicitly a browser-blur comparison. Both frost and solid suspend shader drawing.

Colourways now map glass surface, foreground, secondary foreground, raised control and input roles through `--glass-rgb`, `--glass-text`, `--glass-muted`, `--glass-raised` and `--glass-control`. Steel uses 13 23 35, #e0eaf3, #b8c9da, #263748 and #101e2d respectively. Graphite is neutral, Moss botanical, Copper warm. Earlier green-specific examples describe the original edition; these new role mappings govern colourway changes. Initial trial: Steel with Soft glass.
