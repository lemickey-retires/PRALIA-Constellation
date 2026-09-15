# Interaction and performance follow-up — 14 September 2026

This report supersedes broad smoothness conclusions in earlier GPU notes. The
local preview now stays near the 60 Hz budget in the tested cursor, wheel and
orbit paths, but rare long frames remain and zero latency on every computer is
not claimed.

## What changed

- Wheel deltas accumulate into a time-based eased dolly. Complete-layout saving
  is debounced until scrolling finishes instead of running at every wheel end.
- Worker positions interpolate between snapshots. Late snapshots hold their
  physical endpoint rather than extrapolating through contacts.
- Hover uses analytical node spheres instead of instanced-triangle raycasts;
  camera drags skip hover work.
- Cursor physics is enabled by default. Its radius follows the camera's
  world-units-per-pixel scale, so close and distant views have a consistent
  on-screen response. At most 64 nearest nodes are promoted per pulse.
- All 1,097 nodes remain rendered and pickable. Hubs and a stable sample of leaf
  nodes move continuously; a cursor or dragged node temporarily promotes nearby
  leaves into Rapier and retires them after interaction. Dragged nodes alone use
  continuous collision detection.
- Inspector controls now expose group cohesion, node repulsion, cursor strength,
  cursor radius, link strength, link distance and overall node spacing. Shift
  release leaves a dragged node free; ordinary release follows the pin setting.
- The obsolete fullscreen camera offset was removed and saved framing migrates
  once to a true full-canvas fit. Re-centre (or the R key) cancels pending wheel
  motion and restores that centred fit without changing node positions.
- A normal left-drag now wakes up to 24 directly connected static leaves as well
  as nearby collision bodies. The released star stays free by default and keeps
  its physical momentum; enabling the pin option restores precise placement.
- Entrance-time interaction no longer forces the reveal to finish. Revealed
  colliders accept cursor force, individual spring dragging, repulsion and live
  relationship forces while GSAP continues scaling later nodes into the scene.
- Source captions appear progressively, are keyboard-identifiable group handles,
  and are now eight persistent physics parent nodes rather than labels computed
  from a visual centroid. Every record belongs to exactly one source parent and
  has its own direct elastic spring to that parent. Dragging a headline fixes its
  parent to the pointer, promotes all of its children to independent Rapier
  bodies, and leaves center, repulsion, link distance and collision forces live.
  Children therefore stretch, trail and change relative positions instead of
  chasing translated copies of their starting offsets. Mouse-up retains the
  parent briefly so the direct child springs complete a quick gesture before the
  resolved positions become the new home state.
- The eight source sections now have soft physical collision envelopes derived
  from their real node distributions. When a dragged envelope meets another,
  the contacted group wakes, its members share the deflection with a small
  boundary-facing bias, and the two clusters bounce without replacing per-node
  Rapier collisions. A soft scene-envelope rebound prevents an impact from
  flinging the contacted cluster indefinitely out of the fitted home view.
  Up to 24 external bridge neighbours also wake so relationship forces can
  transmit beyond the two source envelopes.
- Group collisions now use an analytic swept-sphere contact from the parent's
  previous physics position to its current pointer target. A fast headline drag
  therefore cannot tunnel through a whole source group between worker steps.
  The struck visible parent moves the complete sphere, while a distributed cap
  of 96 physical members supplies local deformation without waking all 486
  mirror bodies for one impact.
- The renderer projects every other visible source sphere onto the active
  headline's camera-facing drag plane and sends those proxy centres and apparent
  radii to the worker. Consequently, two spheres that visibly meet also collide
  when their authored centres occupy different depths. At time of impact the
  dragged parent is resolved back to the near contact surface and its normal
  velocity reflects; it can no longer teleport to the pointer on the far side.
  One full momentum exchange is allowed per pair per held gesture, while later
  pointer packets preserve the solid contact constraint without stacking kicks.
- Each visible record-to-parent spring is now also rendered as a faint spoke,
  so the headline is visibly connected to every child it governs. A bounded set
  of 128 gold activity packets continuously travels over real relationship
  edges and parent spokes to communicate messages, work and live activity
  without adding physics bodies or draw calls per packet.
- The default source formation is a three-dimensional sphere around each parent.
  Two additional inspector modes reshape the same live nodes into fluid bodies
  or double DNA helices. Changing mode does not duplicate data or geometry, and
  the persistent parent springs gradually restore the selected formation after
  a throw or collision.
- Source parents now have their own position, mass and velocity. Releasing a
  headline transfers the measured pointer velocity into the parent, child
  spring reaction can move it, group-envelope impacts change its velocity, and
  a damped home force eventually returns it to its authored source centre. A
  group gesture is deliberately transient: it no longer overwrites the saved
  layout with the half-settled drop state.
- Sphere mode now assigns every child a unique golden-angle 3D rest position
  around the parent. During the held drag the direct springs remain direction-
  free so children can trail independently; on release, positional formation
  forces progressively rebuild the sphere around the still-moving parent.
- The resting presentation now has a separate coherent formation layer. All
  1,097 rendered children use their source parent's golden-angle sphere and
  receive a coherent two-axis 3D tumble plus independent radial breathing,
  including leaves intentionally excluded from continuous Rapier simulation.
  Dragging temporarily blends that source back to raw ragdoll positions; release
  takes about three seconds to visually reform the sphere instead of snapping.
- The normal home-force pass no longer competes with source-parent formation
  forces. This removes the gradual idle deformation that previously turned a
  nominal sphere into a lopsided knot.
- Entrance completion now restores the bounded moving-body sample. It previously
  left all 1,097 bodies dynamic after the reveal, making a visually idle scene
  pay nearly the full interaction cost. The corrected live scene settled from
  7.35 ms just after reveal to approximately 3.95 ms worker physics while
  maintaining 60 FPS and animating every rendered child.
- Individual and group targets are clamped to a radial scene sphere rather than
  an axis-aligned cube. The spherical rebound acts on distance from the graph
  centre, so a group cannot disappear into a rectangular corner.
  OrbitControls also clamps its pan target to a generous fraction of the fitted
  graph bounds, preventing a saved home view from becoming permanently stranded.
- The physical spanning network now uses bounded force links instead of hundreds
  of solver joints. Four contact iterations replace twelve; collision and
  promotion fixtures still pass.
- The corona's shared optical cache stores view-dependent field coordinates, so
  texture animation does not rebuild the cache while the camera is still. Its
  linearly reconstructed field is 40 percent of the full canvas in each axis;
  geometry, horizon rims, nodes, links and the final canvas remain full resolution.
- Six non-uniform, radial-width-weighted aura samples sit directly on the four
  authored emission peaks. The accepted 128 by 128 surface silhouette, palette,
  field animation and weighted integrated energy remain. Fine emission shells
  retain their shaders and radii with a 128 by 64 smooth sphere tessellation.
- The build resolves one Three.js installation instead of bundling two. The
  approximately 1.05 MB duplicate build became approximately 792 KB.

## Historical reference investigation

Authenticated GitHub history, not only current branches, was inspected for
davidadrianparker/donna, donna_v3 and donna_v4. The working Donna graph was found
in donna_v3 history at apps/web/src/components/OrbStage.tsx, including commit
8c4fe8012eb4792044be9feb5239863ab68aa94f, "calm idle state, orb + graph as hero".
It used a golden-angle sphere, smooth pointer-led orbit, 0.12 target zoom easing,
and canvas-distance picking. It did not implement node repulsion.

The node-force reference came from PRALIA's
feat/constellation-formation-motion history: spatial-hash repulsion, bounded
physical links, cursor strength/radius, spacing and a large-graph moving subset.
The Orderflow reference was confirmed in
orderflow-2.0-pre-reset-backup/client/src/components/dashboard/ControlMapPanel.tsx
and local commits dd93047, cb4137e and 6c8c8b1. Orderflow's all-pairs loop was not
copied into this 1,097-node scene.

## Live acceptance evidence

Machine checked live: Intel Core Ultra 7 155H, Intel Arc Graphics driver
32.0.101.8860, 32 GB RAM, 5,120 by 1,440 desktop. The in-app canvas was about
2,064 by 1,270 at device pixel ratio 1.

- Before the final renderer and physics pass, live event-horizon GPU queries were
  commonly about 13 to 21 ms and cursor/worker samples ranged roughly 5 to 15 ms.
- An instrumented repeated-wheel run reached 60 FPS status, 16.8 ms p95 and
  approximately 3 ms worker physics. With diagnostics removed and the final
  six-layer, 40-percent aura cache, the close-wheel run reported 54 FPS status,
  17.6 ms p95, 33.7 ms p99, seven frames over 25 ms in five seconds, a 150.1 ms
  maximum outlier and approximately 3.32 ms worker physics.
- Final continuous-orbit run with the same accepted renderer: 59 FPS status,
  17.0 ms p95, 33.5 ms p99, ten frames over 25 ms in four seconds, a 50.8 ms
  maximum outlier and approximately 5.68 ms worker physics.
- Final full-scene cursor run reached 60 FPS and about 3.5 ms physics, but that
  particular sample contained scheduling outliers up to 100 ms. Results vary by
  camera view and concurrent workstation load.
- With group orbit, hub pull, repulsion and force links temporarily set to zero,
  moving the cursor beside selected full-app node Demo agent 003 displaced it
  32.19 world units. Original settings were restored immediately. This proves
  mouse-to-worker-to-visible-node motion in the 1,097-node app, not only a fixture.
- A second live UI acceptance drag selected Demo observation 157, moved it on
  the full canvas and settled as "Free to move and collide". The accepted build
  no longer opens the Inspector merely because a drag starts; a click still does.
- With the final entrance interaction enabled, a live two-second reveal sample
  reported 59 FPS with 388 of 1,097 nodes present. A cursor sweep across the
  spawning clusters remained in the revealing phase at 59 FPS, and a group-label
  drag kept the cinematic active into settling instead of skipping it.
- Dragging the Sessions group label visibly translated the complete blue cluster;
  the Re-centre control subsequently restored the balanced home composition.
- The corrected Generated mirrors stress test held all 486 members in independent
  dynamics at 61 FPS, approximately 4.06 ms worker physics and zero measured
  penetrations. A fast Saved memory drag moved its headline by exactly the
  pointer's 120 by 36 pixel delta while held; nodes trailed physically and the
  label eased back to their centroid on release.
- A subsequent exact-hit-box pull moved the persistent Generated mirrors parent
  by the cursor's 136-pixel horizontal delta. Its 486 direct children visibly
  stretched and followed independently while the parent label remained attached
  to the worker-owned parent position; the live view reported 60 FPS. The
  deterministic suite separately verifies that every source member has a direct
  parent spring, non-uniform member displacement, bounded follow-through, and
  source-envelope deflection rather than cross-group pass-through.
- The final centred live build reported 1,097 parent spokes, 128 active packets
  and 60 FPS in default Sphere mode. The same running worker accepted and
  reported DNA, Fluid and restored Sphere in sequence, confirming the three
  formation choices are active runtime modes rather than static inspector text.
- At the centred wide view, the labelled Demo mirror 015 travelled 11.89 screen
  pixels in two seconds without pointer input. At the closer wheel view it moved
  10.70 pixels in one second, demonstrating visible passive movement at both
  scales while Generated mirrors, Conversations, Sessions and Knowledge graph
  retained round 3D silhouettes around their parents.
- In the autonomous-parent acceptance run, Generated mirrors was thrown from
  approximately (885, 754) toward (1100, 700). After release its headline was
  at (979, 712), then moved without pointer input to (964, 719) after 1.2 seconds
  and (929, 738) after 6.2 seconds while the surrounding 486-node field rebuilt
  around it. The live status remained 60 FPS throughout this sampled path.
- In the final exact centre-to-centre Agents into Notes & guidance acceptance,
  Notes moved from (738.3, 191.6) to (910.1, 160.3), a 174.7-pixel displacement.
  Agents remained on the incoming side of Notes instead of crossing through it.
  The running view reported 57 FPS, 3.09 ms worker physics and zero penetrations.
- In the final exact centre-to-centre Conversations into Generated mirrors
  acceptance, Generated mirrors moved from (948.2, 787.8) to (842.0, 853.8), a
  125-pixel displacement. Conversations remained on the incoming side and the
  displaced mirror sphere subsequently nudged Sessions. The running view
  reported 60 FPS, 8.07 ms worker physics and zero penetrations.
- The corrected held-left acceptance separates camera zoom from field density.
  Holding the left mouse button and scrolling expanded spacing from 1.000 to
  1.310 at 60 FPS; the inverse gesture restored 1.000. The page URL remained the
  constellation through both releases, and a release-click guard prevents the
  scale gesture from selecting or opening a star beneath the pointer. Ordinary
  scrolling remains camera zoom.
- Sphere rendering now retains 34 percent of each bounded physical displacement,
  making local star repulsion visible while preserving the authored spherical
  silhouette. Collision proxy radii follow the same live spacing multiplier.
  Group tumble hashes and trigonometric transforms are cached per source per
  frame instead of being recalculated independently for all 1,097 nodes. The
  running acceptance view continued to report 60 FPS through these tests.
- Every one of the 1,097 atlas children resolves to a source parent and the live
  renderer reported 1,097 direct parent spokes. The Overview relationship mesh
  selects 1,421 of 4,101 real dataset edges: 1,414 same-group references and
  seven cross-group bridges. Local cycles are capped at three selected edges per
  endpoint, producing a web-like shell without the full all-links hairball.
- Parent home acceleration was reduced from .32 to .035 and per-step momentum
  retention increased from .972 to .995. In the live Generated mirrors throw,
  the parent continued 752.2 screen pixels after release; after 5.2 seconds it
  remained 337.5 pixels from its starting position while the view reported 59
  FPS. The deterministic 30-second fixture separately proves eventual gentle
  recovery and spherical child re-formation rather than permanent drift.
- Deterministic fixtures cross one source parent fully through another between
  60 Hz steps and assert forward transfer, impact-side non-penetration and
  reflected drag velocity. A second fixture separates the spheres by 180 world
  units in depth and proves the camera-plane proxy still creates visible contact.
- The demonstration inventory now contains 24 Agent records and 24 Archive &
  tests records. The complete checked dataset is 1,097 nodes and 4,101 valid
  edges; routes cover every node and degrees were recomputed from those edges.
- The live screenshot retains the golden enclosing aura, black core, flowing
  field, coloured clusters, glows, labels and links. A rejected split-layer
  experiment produced dark halo artifacts and was removed.
- Automated tests pass for interpolation, stale hold, swept group collisions, dragged
  neighbours, free-release momentum, large-graph cursor promotion/retirement,
  spherical bounds, DNA re-formation, repulsion, spacing, link strength and link distance. Render scheduling covers
  30 to 240 Hz and 600 frames with sub-millisecond callback jitter.

The remaining 33 to 150 ms outliers prevent an honest absolute "no lag ever"
claim. Sustained cursor, wheel and orbit work now stay near the 60 Hz budget on
this machine, while the appearance and complete data set remain present.

Changes are local only. No commit, push, pull request or deployment was performed.
