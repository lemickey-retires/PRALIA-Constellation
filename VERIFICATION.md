# Verification

Verified on 8 September 2026 on Windows 11 x64.

- The standalone Windows executable starts its bundled runtime, serves the
  included files and exits cleanly when Enter is pressed in its launcher.
- A fresh browser origin loaded the captured Constellation / Orbital / Amethyst
  view at 0.05× universe speed. It displayed 3,520 nodes and 14,520 links,
  with no browser errors and zero visible-core overlaps at inspection.
- The bundled original 2D viewer also loaded without browser errors.
- The displayed graph JSON and all six Blender runtime assets are byte-identical
  to the source preview. The underlying full graph is compressed losslessly.
- All five stored 3D layouts preserve the complete set of 3,520 node identifiers,
  coordinates, pin states and saved camera positions.
- The seven rendering/physics modules shared with the tested preview are
  byte-identical. Its eight native physics checks and four layout checks are
  retained in `verification/`; this reuse does not assert another test run.
- ShaderGradient's 120 vendored source files match their recorded upstream hashes.
- The sharing changes add saved-view loading, view export and local launchers;
  they do not rescan the source project or change graph relationships.
- Directory listings, external Host headers and write requests are rejected by
  the local static server.
- Exported files, the uncompressed graph data and the Blender scenes were checked
  for private owner paths and recognised secret formats. No matches remained.
  Original project files, private Git history, agent homes and credentials are
  outside the publication allowlist.

Animation changes the scene after launch. View size, graphics hardware and browser
motion preferences can affect its appearance and speed. This was not tested on a
separate physical PC or every Windows security configuration.
