"""Create reusable variants in a new Blender scene, preserving the star scene."""
import bpy
import json
import math
import random
from pathlib import Path

root = Path(__file__).resolve().parent
out = root.parent / "graphify-out" / "assets"
scene = bpy.data.scenes.new("Constellation variants")
bpy.context.window.scene = scene

def export_selected(obj, name):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(filepath=str(out / name), export_format="GLB", use_selection=True)

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1)
crystal = bpy.context.object
crystal.name = "Crystal core"
export_selected(crystal, "crystal-core.glb")
crystal.location.x = -4

bpy.ops.mesh.primitive_torus_add(major_radius=1.8, minor_radius=.045,
                               major_segments=64, minor_segments=6)
ring = bpy.context.object
ring.name = "Orbital ring"
export_selected(ring, "orbital-ring.glb")
ring.location.x = 4

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1)
shell = bpy.context.object
shell.name = "Surrounding universe shell"
for polygon in shell.data.polygons:
    polygon.use_smooth = True
export_selected(shell, "universe-shell.glb")
shell.hide_set(True)

# Actual world-space stars, kept away from the graph's working space.
rng = random.Random(731)
positions = []
for _ in range(1800):
    z = rng.uniform(-1, 1)
    angle = rng.uniform(0, math.tau)
    radius = rng.uniform(1800, 8000)
    xy = math.sqrt(1-z*z)
    positions.extend([radius*xy*math.cos(angle), radius*z, radius*xy*math.sin(angle)])
(out / "universe-stars.json").write_text(json.dumps({"positions": positions}), encoding="utf-8")
mesh = bpy.data.meshes.new("Surrounding star positions")
mesh.from_pydata([positions[i:i+3] for i in range(0, len(positions), 3)], [], [])
field = bpy.data.objects.new("World-space starfield", mesh)
scene.collection.objects.link(field)
field.hide_set(True)

scene.world = bpy.data.worlds.new("Variant studio")
scene.world.color = (.025, .035, .055)
for area in bpy.context.screen.areas:
    if area.type == "VIEW_3D":
        area.spaces.active.region_3d.view_distance = 15
        area.spaces.active.shading.type = "SOLID"
bpy.ops.wm.save_as_mainfile(filepath=str(root / "constellation-variants.blend"))
receipt = {"blender": bpy.app.version_string,
    "scene": "Constellation variants", "preserved_previous_scene": True,
    "assets": ["crystal-core.glb", "orbital-ring.glb", "universe-shell.glb", "universe-stars.json"],
    "crystal_faces": len(crystal.data.polygons), "shell_faces": len(shell.data.polygons),
    "surrounding_stars": 1800, "star_distance_range": [1800, 8000]}
(root / "variants-receipt.json").write_text(json.dumps(receipt, indent=2), encoding="utf-8")
print(json.dumps(receipt))
