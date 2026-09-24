---
name: 2nd Brain workspace
description: A quiet, precise workspace around a dramatic universe.
colors:
  canvas: "#010102"
  surface: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  line: "#23252a"
  line-strong: "#34343a"
  ink: "#f7f8f8"
  muted: "#d0d6e0"
  subtle: "#8a8f98"
  accent: "#d0d1ce"
  accent-hover: "#eeefeb"
typography:
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 400
  title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 600
  label:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "11px"
    fontWeight: 500
rounded:
  compact: "4px"
  control: "6px"
  dialog: "12px"
spacing:
  tight: "6px"
  small: "8px"
  regular: "12px"
  roomy: "18px"
  dialog: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "6px 11px"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "6px 11px"
  button-quiet:
    textColor: "{colors.subtle}"
    rounded: "{rounded.control}"
    padding: "6px 11px"
  text-field:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "6px 9px"
  navigation-row:
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 9px"
    height: "35px"
  preview-tag:
    textColor: "{colors.subtle}"
    rounded: "{rounded.compact}"
    padding: "0 6px"
---

# Design System: 2nd Brain workspace

## Overview

**Creative North Star: "A quiet, precise workspace"**

The surrounding interface uses the owner's Linear palette and Obsidian-style workspace structure. Compact navigation, sources and an inspector support the central scene. Tonal surfaces, grey text and scarce the selected accent establish hierarchy.

This record describes the implemented HTML and CSS. System UI sans is intentional in this Operate surface. The dramatic still belongs to the scene; its warm colour does not become a second interface accent.

**Key Characteristics:**

- Near-black canvas and charcoal working surfaces.
- Compact sentence-case controls.
- The selected accent for action, selection and keyboard focus.
- Collapsible panels around a continuous central view.

## Colors

### Primary

The selected accent action (`accent`) identifies primary actions, the brand mark and checked switches. The selected accent emphasis (`accent-hover`) supplies keyboard outlines, caret and related-record hover. Despite its source name, it is not the primary button's hover fill.

### Neutral

Deep canvas (`canvas`) anchors the scene. Charcoal (`surface`) holds the header, panels and dialogs. Raised charcoal (`surface-2`) identifies fields and secondary buttons; interactive charcoal (`surface-3`) indicates hovered rows and quiet pressed controls. Hairline and strong hairline separate panels and outline fields. Bright ink, muted ink and subtle grey distinguish principal, working and supporting text.

**The Scarce Accent Rule.** Use the selected accent for meaningful interface state and action; keep large working surfaces neutral.

## Typography

The body and control stack starts with Inter and falls back to platform sans. No webfont is loaded. Recurring body text is 12px, panel titles 14px semibold, and section labels 11px medium. Buttons use 12px medium. The root baseline is 14px with 1.5 line-height; local metadata, search and dialog sizes do not form a modular display scale.

**The Working Type Rule.** Use sentence-case labels and compact headings; derive hierarchy from weight, spacing and tone before increasing size.

## Layout

The desktop shell fills the viewport: a 49px header sits above 244px navigation, flexible centre and 288px inspector columns. The central toolbar and inspector tab bar align at 57px. Panels scroll internally and can collapse to zero width.

At 1200px and below the side columns narrow to 220px and 260px. At 960px and below they become fixed overlays beneath the header. At 600px and below secondary header text disappears and controls condense; source rows reach 44px and settings fields 40px. This is not a claim that every mobile target reaches 44px. Small gaps organise controls; larger gaps separate settings groups.

## Elevation & Depth

There are no box shadows. Tonal layers, hairline borders and stacking order distinguish regions. Dialogs dim the page with a translucent near-black backdrop; mobile panels use a lighter scrim.

**The Tonal Depth Rule.** Establish depth with the existing surface ladder and hairline edges, retaining the flat workspace.

## Shapes

Controls and rows use compact rounded corners; shortcut hints and status tags are tighter. Dialogs use softer corners. Shell divisions remain rectangular. Switch tracks are capsules with circular thumbs. Stroke SVG icons provide consistent line weight.

## Components

### Buttons

Primary, secondary and quiet actions share compact padding, medium weight and a 33px minimum height. Primary actions use the selected accent and white, with local hover (#707ce2) and pressed (#515cc0) fills. Secondary actions use a strong border; quiet actions gain interactive charcoal on hover or pressed state. State transitions last 150ms.

Keyboard focus uses a 2px the selected accent-emphasis outline offset by 3px. Icon-only controls retain accessible names.

### Inputs / Fields

Stacked fields use raised charcoal, strong borders and control corners. Their desktop minimum height is 34px. Search fields sit directly in the containing surface. Preserve visible focus and the the selected accent caret.

### Navigation

Compact rows combine stroke icons with working labels. Active navigation uses a local selected fill and the selected accent icon; hover uses interactive charcoal. Saved-view deletion appears on hover or keyboard focus and stays visible on smaller screens. Tabs use bright text and a thin underline for selection.

### Chips

Preview and sample labels are compact outlined tags that clarify content status.

### Containers and view controls

Panels use charcoal and a single dividing edge. Search results use rounded rows in a bordered overlay. Dialogs use the shared surface, strong border and restrained padding. No decorative card grid is present.

Switches change from grey to the selected accent and translate their white checked thumb. Disclosures rotate a chevron. Reduced-motion preferences replace spatial GSAP movement with brief opacity feedback. Focus view collapses the surrounding panels. The static preview image has no engine or nodes; saved settings do not imply a running scene.

## Do's and Don'ts

### Do:

- **Do** keep large working surfaces neutral and reserve the selected accent for action and state.
- **Do** retain keyboard focus and accessible names on icon controls.
- **Do** use compact sentence-case labels and internally scrolling panels.
- **Do** distinguish preview content from connected application state.

### Don't:

- **Don't** turn warm scene imagery into a second interface accent.
- **Don't** import the reference's marketing display scale into this workspace.
- **Don't** add decorative shadows or atmospheric gradients to controls.
- **Don't** represent saved preview settings as proof of a working graph engine.

## UI motion

GSAP 3.15.0 and Flip are bundled locally. Panel layout changes use a 320 ms
power3.inOut transition. Tab selection and overlay entrances settle in 200–240 ms;
exits take 140 ms. Buttons compress to 96% on press and return in 180 ms. Hover
feedback gently enlarges the icon, keeping button labels and layout stable.
Search results use a bounded 12 ms stagger across at most eight rows.

Motion runs only in response to interaction. Reduced-motion uses 60–80 ms opacity
feedback and immediate panel layout changes. Hidden documents settle animations;
no repeating tweens, animated scene or permanent animation loop is introduced.
Native dialog focus and Escape behaviour remain intact through animated exits.

## Custom controls and floating help

Inputs and dropdown triggers use the interactive charcoal surface and a 1 px
strong border. Hover increases border contrast; focus uses the selected accent. Menus are
viewport-aware popovers with compact title/description pairs, a selected tick
and a distinct keyboard highlight. Text fields use matching caret, selection,
autofill, clear-icon and inline error states. Checkboxes and sliders retain their
native input semantics with custom visual parts.

Floating tooltips use the same charcoal and border vocabulary, an outlined info
icon, a short explanation and optional shortcut badge. They appear on hover or
keyboard focus; dedicated setting help buttons also support tapping. Explanations
must remain concise and clarify actual behaviour. Avoid browser title bubbles.
Tooltip and menu entrances use the existing 160 ms GSAP ease; reduced motion
uses a 60 ms fade. Existing scene assets and rendering responsibilities are unchanged.

## Colourways

The header selector compares Graphite (default), Moss, Copper and Steel. Each
remaps action, hover, pressed, focus, selection and supporting accent roles.
The charcoal workspace surfaces stay neutral. Filled accents use dark text and
marks; the former purple accent is retired. Preferences persist per browser,
independently of saved scene settings.

| Colourway | Action | Hover / focus | Pressed |
| --- | --- | --- | --- |
| Graphite | #d0d1ce | #eeefeb | #b0b3ac |
| Moss | #a9bba0 | #c4d3bc | #91a587 |
| Copper | #d4ae91 | #e9c6ac | #b99174 |
| Steel | #a4b8c7 | #c1d1dc | #8aa0b1 |

Action text is #101311. Default action-button contrast measured 9.13:1–12.19:1
across these colourways. Colourway names and swatches make selection explicit.
