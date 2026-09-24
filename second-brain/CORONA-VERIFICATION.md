# Tightened shape and layered colour — 10 September 2026

This records the visual revision before the subsequent idle scheduling update.
See IDLE-VERIFICATION.md for the current bundle and GPU measurements. That
update preserves these visual assets and changes the renderer's scheduling.

## Result

The full 360-degree body remains closed through its front and back. Its outer
diameter increases from 11.246 to 14.046 scene units (about 25%). Its total
vertical extent decreases from 3.646 to 2.334 units. This removes about 80% of
the clearance outside the unchanged radius-1 core; it does not flatten the
core or move emission inside it. The body still uses 192 closed surfaces and
three fine inner light shells, with fixed geometry as the camera moves.

Ten radial colour stops provide ivory, champagne, amber, copper, peach,
dusty rose and dark warm falloff. Separate spatial regions add stronger gold
on the right, rose towards the rear, and blue/cyan on the front-left. The
three inner shells also have separate ivory, pale-gold and copper colours.
The editable native scene has a study camera matching the user's captured
Blender position, direction and 50 mm lens. Their 3D viewport was preserved.

The original 2048 by 512 RG field remains byte-identical. Local UV sampling
and optical sampling shared along each view ray preserve its flowing texture.
Optical sampling and brightness depend on the view; geometry and colour
regions remain fixed. This is an artistic interpretation of the supplied
reference, not a fluid or relativistic simulation or a pixel-identical copy.
Four small blue sprite wisps remain in the scene.

The old orange annulus and former strips/flat fill remain hidden references.
A separate darker outer layer remains deferred. The black hole, graph data,
physics, controls, storage, user scoping and Planetary preset are preserved.
No deployment, credentials, external account writes or new download.

## Verification

- Local app build passed: 780,229 bytes; all imports bundled locally.
- Actual WebGL rendering passed from front, back, left, right, above, below
  and an elevated angle. All four quadrants contain emission in every view,
  and every core centre reads RGB 0,0,0.
- Pixel readback from a close view and the captured user direction contains
  distinct ivory, gold, copper, rose and blue populations: 397, 6,877, 5,295,
  1,610 and 485 qualifying pixels respectively. These overlapping hue tests
  confirm rendered colour variety, not precise colour matching to a source.
- Inner, middle and outer runtime meshes have no open boundaries after UV
  seam welding. Native Blender independently reports zero boundary and
  non-manifold edges, with positive signed volumes on the same three layers.
- The outer runtime extent is 14.046 by 2.334 by 14.046 units. Native geometry
  matches after converting Blender's Z-up coordinates to the browser's Y-up.
  The native core radius remains approximately 1 and its scale is 1,1,1.
- All 192 runtime vertex buffers remain unchanged across camera movement.
  Looking away leaves no fixed-screen aura, a foreground blue plane retains
  its RGB 0,0,255 value, and the actual shaders compile without errors.
- Live All/Off controls render 4,021/0 links. Pause held the environment clock
  at 3.785 across link changes; animation was restored afterwards. The prior
  preset-switch check still applies because preset logic was not changed.
- The 1100 by 640 native Cycles render completed and was visually inspected
  from the captured user view. GPU rendering was used for this check; the
  prior CPU scene setting and compute preference were restored afterwards.
- Asset integrity, build receipt, revision hashes and all 280 protected
  baseline files are checked by verify-corona.py. The graph retains its
  1,057 invented records and 4,021 links. Python syntax and git diff checks pass.

## Limits and recovery

The native and browser render pipelines differ in colour and transparency.
Some individual layered contours remain visible, especially in the native
render. No broad GPU, mobile or all-camera performance guarantee is made.

The pre-refinement editable scene and source files are retained in the
workspace's work/pre-shaped-colours folder. Earlier snapshots and hidden
construction references remain available. verify-enclosing-aura.mjs tests
the active construction; older projection/strip tests are historical.

The original publication manifest retains its pre-existing README.md and
THIRD-PARTY-NOTICES.md discrepancies, which are also present in the untouched
archive. CORONA-MANIFEST.json records this local revision separately.
