"""Build the live constellation's mesh and glow in an isolated Blender scene."""
import bpy
import json
from pathlib import Path

root = Path(__file__).resolve().parent
output = root.parent / "graphify-out" / "assets"
output.mkdir(exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = scene.render.resolution_y = 512
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = False
scene.world.color = (0, 0, 0)
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1)
scene.view_settings.view_transform = "Standard"

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1)
star = bpy.context.object
star.name = "Constellation star core"
for face in star.data.polygons:
    face.use_smooth = True
material = bpy.data.materials.new("White stellar emission")
material.use_nodes = True
bsdf = material.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (1, 1, 1, 1)
bsdf.inputs["Emission Color"].default_value = (1, 1, 1, 1)
bsdf.inputs["Emission Strength"].default_value = 8
bsdf.inputs["Roughness"].default_value = .35
star.data.materials.append(material)
bpy.ops.export_scene.gltf(filepath=str(output / "star-core.glb"),
                         export_format="GLB", use_selection=True)

bpy.ops.object.camera_add(location=(0, 0, 8))
camera = bpy.context.object
camera.name = "Glow bake camera"
camera.data.type = "ORTHO"
camera.data.ortho_scale = 16
scene.camera = camera

# Native Blender compositor: the browser loads this rendered light, rather
# than re-running a full-screen bloom calculation for all 3,520 stars.
tree = bpy.data.node_groups.new("Stellar bloom", "CompositorNodeTree")
tree.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
scene.compositing_node_group = tree
layers = tree.nodes.new("CompositorNodeRLayers")
glare = tree.nodes.new("CompositorNodeGlare")
glare.inputs["Type"].default_value = "Fog Glow"
glare.inputs["Quality"].default_value = "High"
glare.inputs["Threshold"].default_value = 1
glare.inputs["Strength"].default_value = 6.5
glare.inputs["Size"].default_value = .6
out = tree.nodes.new("NodeGroupOutput")
tree.links.new(layers.outputs["Image"], glare.inputs["Image"])
# Bake native glow luminance into real transparency. The white RGB channel
# is tinted per star at runtime; no black render background reaches the page.
luminance = tree.nodes.new("CompositorNodeRGBToBW")
alpha = tree.nodes.new("CompositorNodeSetAlpha")
alpha.inputs["Image"].default_value = (1, 1, 1, 1)
tree.links.new(glare.outputs["Glare"], luminance.inputs["Image"])
tree.links.new(luminance.outputs["Val"], alpha.inputs["Alpha"])
tree.links.new(alpha.outputs["Image"], out.inputs["Image"])
scene.render.filepath = str(output / "star-glow.png")
bpy.ops.wm.save_as_mainfile(filepath=str(root / "constellation-star-kit.blend"))
bpy.ops.render.render(write_still=True)
receipt = {"blender": bpy.app.version_string, "mesh": "star-core.glb",
           "glow": "star-glow.png", "meshVertices": len(star.data.vertices),
           "meshFaces": len(star.data.polygons), "glowPixels": [512, 512],
           "glowOrthoScale": 16, "compositor": "Native Fog Glow with luminance alpha",
           "source": "constellation-star-kit.blend",
           "scope": "Factory-startup background scene; no existing user scene opened."}
(root / "blender-receipt.json").write_text(json.dumps(receipt, indent=2), encoding="utf-8")
print(json.dumps(receipt))
