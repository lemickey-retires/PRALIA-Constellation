# Third-party notices

This is a modified Graphify viewer with PRALIA constellation rendering, physics,
saved layouts, a 3D environment and portable launchers added on 8 September 2026.

| Component | Source | Licence |
| --- | --- | --- |
| Graphify 0.9.49 | https://github.com/Graphify-Labs/graphify | Apache-2.0; legacy MIT portions retained |
| vis-network 9.1.6 | https://github.com/visjs/vis-network | Apache-2.0 or MIT |
| Three.js 0.185.1 | https://github.com/mrdoob/three.js | MIT |
| Rapier 3D 0.20.0 | https://github.com/dimforge/rapier.js | Apache-2.0 |
| ShaderGradient 2.4.24 source | https://github.com/ruucm/shadergradient | MIT, as declared in package metadata |
| React and React Three Fiber | https://github.com/facebook/react and https://github.com/pmndrs/react-three-fiber | MIT |

Additional JavaScript package metadata and available licence/notice files are
in `licenses/npm-packages.json` and `licenses/npm/`. Licence banners embedded
in the distributed JavaScript and accompanying legal files are retained.
The original Graphify NOTICE, Apache licence and legacy MIT text are under
`licenses/graphify/`.

ShaderGradient's source files are unchanged. Its material factory and Default
Sphere / Cosmic Sphere shaders are used in a shared Three.js scene. Plane preset
colours and density are adapted to a surrounding sphere using the native Sunset
spherical deformation parameters. Its preset cameras and screen-grain layer are
not applied to the 3D scene. The original 2D preset rendering is retained.

Blender 5.2.1 was used to create the included geometry, glow and star positions.
Blender itself is not bundled. The Windows release bundles a Python runtime
and a PyInstaller launcher; their notices are included in the release.

The underlying graph was extracted from a PRALIA/Hermes development snapshot.
Hermes is from https://github.com/NousResearch/hermes-agent; its source licence
is preserved under `licenses/hermes/`. Graph labels describe source structure,
not an assessment of code quality or verified runtime behaviour.
