---
name: 2nd Brain knowledge universe
description: Real saved knowledge explored in a navigable 3D world of source-coloured stars and a gold event horizon.
colors:
  scene-ground: "#02050a"
  reading-ground: "#08111f"
  toolbar: "#0c1421"
  toolbar-hover: "#1c2c40"
  toolbar-selected: "#24415b"
  toolbar-border: "#2b3747"
  toolbar-selected-border: "#6094b3"
  control: "#142135"
  control-hover: "#223954"
  control-border: "#384b63"
  text: "#e4edf8"
  muted: "#acbfd5"
  source-support: "#bcc7d6"
  source-count: "#a9bbd0"
  focus-ice: "#afe3ff"
  placeholder: "#b6cbe1"
  notes-cyan: "#61cae3"
  memory-gold: "#e7ba6e"
  conversation-pink: "#e49bbb"
  session-periwinkle: "#9eabde"
  graph-mint: "#a5d4a8"
  mirror-slate: "#7688ac"
  agent-purple: "#b9a4eb"
  archive-taupe: "#b7aaa0"
typography:
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  source-label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  supporting:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "11px"
    fontWeight: 400
rounded:
  control: "6px"
  toolbar: "7px"
  source-caption: "3px"
  record-caption: "2px"
spacing:
  tight: "5px"
  field-inset: "7px"
  control-block: "8px"
  control-inline: "11px"
  section-inset: "12px"
  reading-inset: "24px"
components:
  toolbar-button:
    backgroundColor: "{colors.toolbar}"
    textColor: "{colors.text}"
    typography: "{typography.compact}"
    rounded: "{rounded.toolbar}"
    padding: "8px 11px"
  toolbar-button-hover:
    backgroundColor: "{colors.toolbar-hover}"
    textColor: "{colors.text}"
    rounded: "{rounded.toolbar}"
  toolbar-button-selected:
    backgroundColor: "{colors.toolbar-selected}"
    textColor: "{colors.text}"
    typography: "{typography.compact}"
    rounded: "{rounded.toolbar}"
    padding: "8px 11px"
  inspector-button:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
  source-search:
    backgroundColor: "#0d1625"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "{spacing.field-inset}"
    width: "100%"
  source-row:
    textColor: "#e2e9f3"
    typography: "{typography.compact}"
  source-caption:
    backgroundColor: "#07101bf2"
    typography: "{typography.source-label}"
    rounded: "{rounded.source-caption}"
    padding: "4px 7px"
  record-caption:
    backgroundColor: "#03080cf0"
    textColor: "#f5f5f3"
    typography: "{typography.compact}"
    rounded: "{rounded.record-caption}"
    padding: "3px 5px"
  search-result:
    backgroundColor: "#0a1422"
    textColor: "{colors.text}"
    typography: "{typography.compact}"
    rounded: "{rounded.control}"
    padding: "7px 5px"
  inspector:
    backgroundColor: "#0b1321"
    textColor: "{colors.text}"
    rounded: "10px"
    padding: "22px"
---

# Design System: 2nd Brain knowledge universe

## Overview

**Creative North Star: "Knowledge at the event horizon"**

Saved knowledge is a world to enter. Real records occupy a navigable 3D foreground, grouped by source in distinct colours. The large black hole and gold-white upper aura frame them; a complete horizontal amber ring carries layered curved filaments, darker gaps and occasional hot light through near-black open space. Fine ring-lit haze, small warm dust and sparse cool depth stars extend that space. The dark centre has no separate thin glowing inner arc; restrained curved detail remains in the surrounding halo. Quiet source controls let the world lead, while dark reading surfaces support inspection.

The scene carries the identity. Orbit, pan and zoom change the projection of records and environment together. The original six references establish the graph, grouping, light and terrain; the owner's approved large-scene screenshots pin the composition. The accepted space extension preserves the complete horizontal ring's shape, outer reach and gentle flow and modest secondary halo filaments. The subsequent approved visibility correction disables the separate inner photon contour in native Blender and the live preview. Native Blender procedural haze adds porous detail above and below the ring; the original upper aura remains. Event horizon shows open space without rocky terrain, boulders or cracks. The accepted fine translucent ground, opaque rocks and luminous cracks remain available through Scene and layout > Background > Planetary surface. The approved large core, camera behaviour, framing, interface colours, source colours and node animation remain. This is an artistic 3D interpretation, not a physical gravitational-lensing simulation.

**Key Characteristics:**

- A large dark core and golden upper aura behind source-coloured records, surrounded by an extended horizontal gas ring and restrained secondary halo filaments; no separate thin glowing arc traces the dark centre.
- Near-black open space with fine ring-lit haze, small warm dust and sparse depth stars; the accepted rocky environment remains an optional Planetary surface.
- Named source groups, selective adjacent record labels and an inspector opened on request.
- Compact dark controls retaining camera, motion, replay and evidence inspection, with connecting lines Off by default.
- One 3D canvas with source controls beneath it on narrow screens.

Recorded from the maintained viewer, native Blender material sources and accepted local visual refinements. Private screenshots and local review records are excluded from this public copy. See [README.md](README.md) and [VERIFICATION.md](VERIFICATION.md) for this demonstration version.

The [inner-contour verification receipt](inner-contour-verification.json) and [native visibility receipt](.impeccable/review/inner-contour/native-edit.json) record `PhotonSphere` hidden in the native render and viewport and disabled in the live manifest. The current editable native scene has SHA-256 `7f0b10f06c6b37f00005d76bcf8a2f8c877b104cc0b36422add3a15f73b621e6`. The [final live-state receipt](.impeccable/review/inner-contour/final-live-state.json) records the refreshed 1758 by 1427 user view with its saved camera preserved, animation active and a 35 fps snapshot. The correction receipt also records advancing physics and environment time. These are view-specific observations, not a general frame-rate guarantee.

The earlier [space verification receipt](space-haze-verification.json), [native construction receipt](horizon-assets/space-haze-receipt.json) and [field bake receipt](horizon-assets/space-haze-bake-receipt.json) document the preceding haze extension; their source hash predates the current visibility-only edit. They retain evidence for preserved disk and stream fields, the physics worker, mobile overflow and the Planetary surface switch. The [earlier interaction receipt](.impeccable/review/photon-halo/interaction.json) supplies pause/resume evidence; replay and inspection evidence remains in the [prior interaction receipt](.impeccable/review/native-horizon/interaction.json). A full interaction audit was not repeated for this visibility correction.

The [inner-contour detector output](.impeccable/review/inner-contour/detector.json) has no findings in its single degraded, changed-JavaScript/HTML pass. The [earlier CSS detector output](.impeccable/review/photon-halo/detector.json) retains palette, type and radius advisories against unchanged `site/second-brain.css`. That stylesheet includes earlier declarations overridden by later rules, so the advisories do not independently establish visible defects. This refinement does not expand the UI token system to absorb them. Earlier focused performance and pixel comparisons remain scoped below; this is not a full contrast, accessibility, device or frame-pacing audit. This handoff covers the private read-only preview; it changes no installed code, live profiles, agents, services, models or source data. Snapshot counts, private record names and current service status are not design constants.

## Colors

Warm gold light surrounds cool source colours, with near-black space and blue-black reading surfaces maintaining separation.

### Primary

- **Accretion light:** the original gold-white upper aura remains animated material output from [horizon-environment.mjs](horizon-environment.mjs). Horizontal gas moves from dark copper through amber to pale warm light, using Blender's native colour-ramp factor in [native-horizon-volume.mjs](native-horizon-volume.mjs). The secondary halo uses native optical geometry and fields through [native-horizon-optics.mjs](native-horizon-optics.mjs); the separate photon contour remains disabled. These are spatial material outputs, not flat CSS swatches. Preserve the upper aura's existing fine texture and subordinate halo detail, the clean dark centre, and the horizontal gas's curved filaments, dark gaps and occasional pale heat within a soft, translucent body.
- **Focus ice:** identifies keyboard focus and text selection. Toolbar selection has a blue surface and brighter border alongside its pressed state.

### Secondary

- **Notes cyan** identifies notes and guidance; **memory gold** identifies saved memory.
- **Conversation pink** identifies observations; **session periwinkle** identifies sessions.
- **Graph mint** identifies stored graph material; **mirror slate** keeps generated mirrors subordinate.
- **Agent purple** identifies profiles; **archive taupe** identifies archive and test material.

These mappings come from [second-brain-layout.mjs](second-brain-layout.mjs). The same source colour supplies node colour, checkbox accent and caption when Source colours is selected. Alternative scene palettes remain available.

The sidecar's tonal strips are generated colour previews, not additional shipped palette steps. Frontmatter colours remain the normative values.

### Neutral

- **Scene ground** supports the world; **reading ground** supports the mobile source panel and navigation treatment.
- **Toolbar** and **control** tones distinguish scene actions from inherited inspector actions. Hover, selected and border treatments remain explicit.
- **Text**, **muted**, **source support** and **source count** establish reading hierarchy. Search retains a distinct, fully opaque placeholder.
- Inherited connection panels retain amber unavailable and green connected states with written explanations. Those colours report check results, separately from record provenance.

**The Source Identity Rule.** Source colour identifies provenance, never confidence, truth or connection health; keep the written source name available.

## Typography

**Body and control font:** Arial, Helvetica, sans-serif. Compact utilitarian type supports inspection; source captions carry a modest weight increase. Counts and motion status use tabular numerals.

The inherited heading treatment remains visible: main and source titles are 24px on desktop, the main title reduces at compact and mobile breakpoints, and the inspector title is 19px. This system-font display choice is a carried limitation, not a display-font rule for future surfaces. Normative type roles above cover repeated reading and control treatments.

- **Body:** explanatory text and field content; the source introduction opens its line height to 1.6.
- **Compact:** scene actions, source rows, record captions and inspection results.
- **Source label:** projected group names; final mobile captions use 11px text.
- **Supporting:** source counts, footnotes and source paths; long paths wrap.

Inspector excerpts use line height 1.7. Mobile search and select fields use 16px text. These are contextual adjustments, not a new display scale.

**The Node Adjacency Rule.** A record label stays immediately beside its actual projected node or is suppressed when adjacent positions collide; never move it to unrelated empty space.

## Layout

The first desktop viewport is the 3D scene. A compact header spans the top; a 238px source list sits left, starting 107px down. A dark horizontal fade protects reading behind that list. Source search and scene choices use disclosures. The inspector starts hidden and opens from a record selection or its explicit control.

At widths up to 1000px, the source list narrows to 208px and the header tightens. Original 2D and Export view leave the compact toolbar. At 760px and below, the graph becomes the first block of a scrolling page (72dvh, minimum 480px), followed by the source panel with 24px padding. Source switches form two columns with 44px rows. The title has an opaque dark backing; scene controls wrap below it.

The inspector floats right on desktop (330px wide). On mobile it becomes a fixed, scrolling reading surface with 12px side margins. The navigation hint remains near the graph's foot; entrance status and skip sit above it. Tight gaps, modest insets and thin section rules organise controls without a card grid.

All source names remain available in the source list; projected captions use shorter names on mobile. Captions follow the camera, avoid the header and neighbours, and are culled outside the visible world. Record names have stricter adjacent-position rules and may disappear sooner.

**The Inspect on Request Rule.** Preserve an open first view of the world; show the reading inspector when a user asks for it or selects a record.

## Elevation & Depth

Depth comes from spatial geometry, camera movement, small solid cores, soft halos and optional fine links. Blender supplies the core assets, horizontal gas fields, secondary halo geometry and field, fine space haze and particle positions; its retained photon sphere is hidden in render and viewport. Browser materials retain the upper aura and keep that sphere disabled. The adjusted ground remains available in Planetary surface. Bloom belongs to the world. Controls use tonal layering and borders, with no CSS box-shadow vocabulary.

The original `event-horizon.glb` remains the core and upper-aura base. The viewer hides its disk and stream meshes, replaces its terrain, boulders and embers with [native-horizon-ground.glb](site/assets/native-horizon-ground.glb), and loads optical assets from [native-horizon-optics.glb](site/assets/native-horizon-optics.glb), enabling the secondary halo while hiding `PhotonSphere` when `nativeAssets.optics.spec.photon.enabled === false`. The two accepted gas fields remain active in both horizon environments. Event horizon adds the native haze and small particles while hiding the ground; Planetary surface restores the accepted ground and hides that additional space layer. The environment keeps its original position `(0, -850, -14500)` and uniform scale `6800`; the large core and original upper aura retain their live treatment. The existing depth-star field remains, with additional Blender-authored stars confined to the space layer. These are implementation and asset inventory facts, not design tokens or fixed counts for future environments.

[create-native-horizon.py](horizon-assets/create-native-horizon.py) defines procedural Blender density and colour in the editable [native scene](horizon-assets/native-horizon.blend), constructed through Blender MCP. Stretched and warped 3D noise forms branching ridges and layered curved filaments, interrupted by darker gaps and occasional hotter light. Sine and cosine join angular coordinates around the ring; repeated sine stripes do not define the material ridges. The annulus extends from local radius 1.045 to 2.75, expanding the previous outer radius of 2.20 while retaining its horizontal shape, inner curl and smooth density fades. These dimensions describe this asset, not a new system scale.

[bake-native-volumes.py](horizon-assets/bake-native-volumes.py) uses Cycles to evaluate shader positions on an atlas, then exports true 3D density and colour-factor arrays. The [field receipt](horizon-assets/native-volume-bake-receipt.json) and [live manifest](site/assets/native-volumes.json) describe disk dimensions of 2048 by 768 by 24 and stream dimensions of 768 by 768 by 24, sampled by radius, wrapped angle and height above the slightly tilted plane. The wider disk retains the previous radial sample spacing; the stream's compressed field hash is unchanged from the accepted ring. Density is normalised by 16 for storage and the manifest records `densityScale: 16`; the live material applies its existing appearance multiplier. Native terrain ray-casts supply softly feathered floor clearance. The live renderer reuses Three.js's volume vertex setup and interpolates between neighbouring cells in all three dimensions. Dense ray steps and a stable per-pixel sampling offset reduce banding without adding animated shimmer. The opaque core blocks gas behind it.

[create-space-haze.py](horizon-assets/create-space-haze.py) reuses the existing native node helpers to construct porous orbital wisps in the editable scene. Its 85-node material contains no image-texture nodes. Cycles evaluates it through the existing baker's `--reuse-scene --space-haze` path into a 768 by 512 by 48 cylindrical field: radius, wrapped angle and height. This separate haze field has no ground clipping. [native-horizon-volume.mjs](native-horizon-volume.mjs) loads the numeric field and exported native particles; [horizon-environment.mjs](horizon-environment.mjs) places them in the same camera-controlled world. The native particle mesh has 9,900 vertices representing 480 small dust points and 1,170 added depth stars; the live renderer uses those same exported positions, colours and relative sizes as efficient soft points. Warm dust follows a slow orbital drift; haze and dust share the existing environment clock and motion controls. The surrounding-stars setting governs the particle visibility. Keep this fine atmosphere subordinate to the accepted ring and source records. These counts and bake dimensions describe the current asset, not reusable visual tokens.

[bake-native-optics.py](horizon-assets/bake-native-optics.py) evaluates native halo nodes into a 1024 by 1024 numeric density and colour-factor field, recorded by the [optics receipt](horizon-assets/native-optics-bake-receipt.json) and [live optics manifest](site/assets/native-optics.json). Its secondary filaments follow a copy of the original halo geometry; they supplement the preserved upper aura. `PhotonSphere` remains retained native sphere geometry at local radius 1.018, but its separate inner contour is disabled. The canonical generator defaults `photon.enabled` to false; [native-optics.json](site/assets/native-optics.json) exports that flag and the browser honours it. The [native visibility receipt](.impeccable/review/inner-contour/native-edit.json) confirms the saved scene hides the object in render and viewport. Retained contour parameters are historical construction data, not instructions to restore the arc. The active halo shares the scene camera and its slow flow shares the existing environment clock. These construction settings are specific to this asset, not design tokens or scientific lensing parameters.

The generated [photon and halo reference](horizon-assets/photon-halo-reference.png), its [provenance](horizon-assets/photon-halo-reference.png.json) and the earlier `accretion-cloud.png` concept are visual references only. No generated-image pixels drive final material density, colour, opacity or displacement. The [construction receipt](horizon-assets/native-horizon-receipt.json) records zero image-texture nodes across the five native gas and optical materials. The historical [photon and halo material study](horizon-assets/native-photon-halo-preview.png) is 1200 by 800 with 32 Cycles samples and carries its [construction brief and provenance](horizon-assets/native-photon-halo-preview.png.json). It predates the level-ground and fine transparent stone refinement. The earlier [native-horizon study](horizon-assets/native-horizon-preview.png) is also historical. The historical [native space-haze study](horizon-assets/native-space-haze-preview.png) is 1200 by 800 with 32 Cycles samples and embedded origin metadata. It records the haze material before the visibility-only inner-contour fix and does not show the current active contour appearance; the inner-contour browser captures record the corrected live appearance. The live Event horizon combines the two retained horizontal volumes, the haze field and secondary halo detail with the retained original upper aura, leaving the separate inner photon contour disabled; the study's additional native corona does not replace that aura. Live materials approximate the native appearance without reproducing all Cycles scattering or global illumination.

The volume optimisation uses conservative bounds around non-empty native density to skip entirely empty sample indices, retaining sample spacing and phase in occupied regions. Bounded angular evaluation reduces repeated arithmetic, with the full angular calculation outside that bound. Full ray-step settings, density, material detail, bloom and output resolution remain. In the preceding photon/halo optimisation, before the later terrain and space refinements, the matched isolated view at 2068 by 2140 rendering pixels recorded median GPU time changing from 15.25ms to 12.79ms in the [before](.impeccable/review/photon-halo/extended-before-optimisation.json) and [after](.impeccable/review/photon-halo/extended-after-optimisation.json) receipts. The paused, fixed-camera [pixel comparison](.impeccable/review/photon-halo/optimisation-pixel-comparison.json) found at most one 8-bit level of channel difference in the gas foreground and identical upper-halo pixels. These are historical measurements of those views, not performance tokens or a guarantee for every device or camera position; the GPU benchmark and pixel comparison were not repeated for the later terrain or space refinements.

In optional Planetary surface, the live blue-black ground combines layered grain, fine mineral detail and sparse warm cracks. Native geometry reaches an exactly level height of -0.24 beyond forward distance 1.95, blending smoothly from 1.65; the native receipt reports zero height range in that distant region and zero geometry change in the preserved near region. Native fine noise (scale 270) feeds a small bump (distance 0.003) chained after the existing coarse bump, without displacement. A Transparent BSDF mix gives the ground 0.58 opacity; rocks retain their opaque stone material. The live shader adds fine grain at scale 430 and matching ground opacity while preserving crack-light energy. Irregular fades still soften lateral, near and distant boundaries; faded ground does not write an invisible depth barrier over the scene. These are asset-specific construction settings, not new spacing, colour or material tokens for other surfaces. The earlier terrain rear and front captures and current Planetary surface capture support this treatment in those views, not every possible camera angle.

**The Shared Space Rule.** Keep records and the horizon in the same camera-controlled 3D world; preserve orbit, pan, zoom and physical node interaction.

The framing refinement of 10 September 2026 increases the horizon's world scale from 6800 to 7600. Source sections uses a closer Fit graph camera (distance factor 0.64 instead of 0.72), with a slightly upward viewing angle to leave room beneath the foreground records. Projection shifts down by another 40 pixels on desktop and 16 pixels on narrow screens. These are scene-specific framing adjustments; materials, node coordinates, physical movement and native assets remain unchanged. Existing saved cameras still restore until the owner uses Fit graph. Current [desktop](.impeccable/review/framing-desktop.png) and [mobile](.impeccable/review/framing-mobile.png) captures show the complete graph in a paused isolated browser.

**The Quiet Crossing Rule.** Keep horizontal gas and fine haze translucent so the records crossing their light remain distinct.

**The Horizontal Material Rule.** Keep the complete gas ring and inner curl horizontal around the approved large core; preserve the upper aura, framing and node animation, with sparse fine haze around the ring in Event horizon.

**The Level Ground Rule.** In Planetary surface, keep the distant plane entirely level with no hill behind the records; preserve near stone relief and crack light while fine transparent ground recedes softly into space.

**The Optical Hierarchy Rule.** Keep the dark centre free of a separate thin glowing inner arc and keep PhotonSphere disabled; preserve the broad main ring, original upper aura, restrained secondary halo detail and source-coloured records as distinct layers.

**The Aligned Halo Rule.** Keep the outer halo aligned with the spherical core's projected edge throughout camera orbit; retain its native curved filament texture, soft transparency and slow flow while the horizontal gas ring stays in its existing plane.

New visitors start with Event horizon, Source sections, Source colours and Links Off. Scene and layout > Background > Planetary surface restores the accepted rocky environment. Saved choices remain effective; earlier backgrounds, layouts, star designs and movement choices remain available.

The inherited entrance reveals nodes individually with physical arrival and link growth when links are enabled. Replay restarts arrival and the environment clock; pause freezes motion; Show all now completes arrival. Paused startup or reduced motion shows the full graph immediately. Reduced motion also suppresses automatic drift and orbit. Preserve those controls and their existing evidence; motion is not required to inspect records. Normal entrance keeps its reveal and completion behaviour; if conflicting targets prevent settling, physical movement resumes eight seconds after the reveal duration.

## Shapes

Scene controls use gently rounded rectangles; inspector controls retain their slightly smaller curve. Captions use nearly square dark backings. The inspector has a larger corner treatment and a fine border. Native checkboxes express source selection with both colour and a written label.

The default world combines a large dark core, curved upper corona, extended horizontal gas ring, fine porous haze and sparse spatial points. The dark core has no separate thin glowing inner contour; restrained halo filaments follow the core's camera-facing silhouette outside it. Layered gas filaments have soft inner, outer and terrain-contact boundaries; the volume bounding boxes are sampling regions, not visible surfaces. Event horizon has no rocky ground, boulders or cracks. Optional Planetary surface retains dark fine translucent ground and opaque rocks; its foreground relief and entirely level distant plane merge into space through soft near and distant fades without a rear hill silhouette. Subordinate nodes keep clusters legible; generated mirrors use especially small cores except for their existing connected hub. Relationship lines start hidden. Selected node, Overview and All expose actual relationships on request, while inspection retains access to complete captured relationships.

## Components

### Native horizontal gas

Two native fields replace the original disk and stream line materials within the existing horizon transform. The extended warm annulus preserves the accepted ring shape and inner curl around the large core, with visible curved filaments, darker gaps and intermittent hotter light. The gas responds to the same camera as the records and stays translucent at crossings. Differential angular flow moves the inner curls slightly faster than the outer material; the existing environment clock, speed, pause, replay and reduced-motion controls govern that gentle motion. The original upper aura remains a separate retained material.

### Native halo detail and disabled inner contour

The native halo field adds modest curved filaments with soft transparency and slow clock-controlled flow. The live halo projects its radial bands onto the spherical core's camera-facing outline, preserving the native texture coordinates and filament detail as the camera orbits. Its additive light uses depth testing within the same world as the records. The retained PhotonSphere object is hidden in native render and viewport and disabled in the live optics specification; do not re-enable it or replace it with another thin inner arc. Preserve the clean dark centre, broad main ring, upper aura and accepted horizontal gas shape.

### Native ring-lit haze and depth points

Fine porous wisps extend above and below the preserved horizontal ring without forming a rocky plane or a thick cloud wall. Small warm dust and sparse cool stars add spatial depth; their native positions remain much smaller and quieter than the coloured record nodes. The live haze uses the Cycles-evaluated three-dimensional field, not an image wrapped around geometry. Event horizon enables this additional space layer and hides terrain, boulders and cracks. Planetary surface switches to the retained rocky layer. Camera, node behaviour and the accepted core, upper aura, ring and optical detail remain shared.

### Optional Planetary surface

Selected through Scene and layout > Background > Planetary surface, native layered stone keeps its coarse surface and adds fine mineral bump detail without displacement. The live material supplies corresponding layered grain and preserves warm crack light through the increased transparency. The distant plane stays entirely level beyond its smooth transition; preserved foreground relief and opaque rocks maintain depth. This terrain treatment accompanies the accepted ring and optics without changing their geometry, volumes or motion controls.

### Scene actions

Scene buttons share a 1px border and 38px minimum height. Hover lightens the surface; pressed actions use the selected surface and border. Inspector actions retain the base control palette. Keyboard focus uses a 2px focus-ice outline offset by 3px. Disabled controls retain their shape at 0.55 opacity.

### Connecting lines

The compact Links control is a native select beside the scene actions, with Off, Selected node, Overview and All choices. Off hides every relationship line, including selected-node highlights, while leaving node selection and source inspection available. Selected node shows the selected record's relationships; Overview adds the existing selective relationship set; All exposes the captured relationships, respecting visible nodes and entrance progress. Subsequent choices persist with scene settings. Its dark surface, hover and keyboard-focus treatment match scene actions.

**The Links on Request Rule.** Start connecting lines Off and preserve the owner's subsequent choice; keep node selection and source inspection usable when every line is hidden.

### Source switches and navigation disclosures

Each source row combines a native checkbox, written name and aligned count. Rows are 36px tall on desktop and 44px on mobile. Find a record and Scene and layout use native disclosure triangles and fine section dividers, expanding into the existing controls.

### Search and results

Search and scene selects use dark fields, inherited control borders and full available width, with a 35px minimum height. Results wrap long names in a bounded scroll area; mobile results occupy one column. Their explicit dark resting surface overrides the inherited generic result hover background; keyboard focus remains visible.

### Projected captions

Source captions pair tinted names with dark backings. Record captions use pale text and an even darker backing; names come from existing records. Both cap width at 220px and truncate. Source captions place first; adjacent record captions are added only when space remains. Mobile limits record captions further while retaining source identification.

### Inspector and evidence containers

Selected-record details, source links, excerpts and named connections share one reading surface. Close returns focus to the inspector control. Snapshot and connection information sits in a disclosure; native evidence and appearance disclosures remain. Connection containers report unavailable or connected through words and colour; they are status containers, not generic decorative cards.

### Empty selection and entrance status

No visible records produces a dark message with Show all sources, restoring source switches and record scope. Entrance status describes reveal, settling or pause and keeps Show all now available while needed. These are operational states, not new records.

## Do's and Don'ts

### Do:

- Do keep source names and colours consistent across the world, switches and captions.
- Do preserve actual 3D camera movement, physical nodes, the large dark core and upper aura, with fine haze and sparse depth stars in Event horizon.
- Do keep this scene's native gas in a complete horizontal ring and inner curl, with visible layered detail, gentle flow and soft inner, outer and terrain-contact edges.
- Do keep the separate inner photon contour disabled while preserving the broad main ring, original upper aura and restrained secondary halo detail.
- Do retain the accepted rocky environment through Scene and layout > Background > Planetary surface, with entirely level distant ground, fine translucent stone, preserved foreground relief, opaque rocks and luminous cracks.
- Do keep the outer halo aligned with the core's projected edge through camera orbit, preserving native filament detail and the horizontal gas ring.
- Do start connecting lines Off, retain subsequent choices and keep selection and inspection available in every Links mode.
- Do keep record labels adjacent to their nodes, suppressing collisions instead of detaching names.
- Do retain all source names on mobile, dark title backing and the source panel below the graph.
- Do preserve existing background, layout, motion, replay, search and evidence controls.
- Do use only existing records and relationships, keeping complete inspection behind the selective overview.

### Don't:

- Don't replace this world with a flat brain map or a pasted reference photograph.
- Don't shrink the accepted large horizon into a compact circular portal or wrap the generated concept image around geometry.
- Don't reintroduce the rejected thin glowing inner arc, including by re-enabling PhotonSphere or substituting another inner contour.
- Don't let the foreground light stream or added haze overwhelm the records crossing it.
- Don't show rocky terrain, boulders or glowing cracks in the default Event horizon.
- Don't treat decorative star positions, private record names or snapshot counts as permanent tokens.
- Don't turn source colours into confidence scores or infer live connection success from a loaded scene.
- Don't promote the inherited system-font display choice into a rule for future surfaces.
- Don't describe the live gas as a complete Cycles lighting simulation or use its material-study corona to replace the approved live upper aura.
