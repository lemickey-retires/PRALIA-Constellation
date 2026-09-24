"""Author and sample the continuous corona in Blender; preserve the original scene.

Open a copy of native-horizon.blend, then run through the official Blender MCP.
Poly Haven's aerial_rocks_02 displacement must be imported, or available beside
this script in polyhaven/. It supplies irregular density, not a background image.
The browser keeps the baked material on the camera's sphere-tangent circle.
"""
import bpy
import gzip
import hashlib
import json
import math
import shutil
from pathlib import Path
import numpy as np

root = Path(__file__).resolve().parent
assets = root.parent / 'site' / 'assets'
scratch = root.parents[2] / 'work' / 'corona-bake'
scratch.mkdir(parents=True, exist_ok=True)
source = bpy.context.scene
assert bpy.context.mode == 'OBJECT', 'Use Object mode before building the corona.'
assert 'EventHorizon' in source.objects, 'Load the preserved horizon scene first.'
assert 'ContinuousCorona' not in source.objects, 'Inspect existing work before rerunning.'

texture_path = root / 'polyhaven' / 'aerial_rocks_02_disp_1k.jpg'
texture_path.parent.mkdir(exist_ok=True)
image = bpy.data.images.get('aerial_rocks_02_Displacement.jpg')
if image is not None and not texture_path.exists():
    shutil.copyfile(bpy.path.abspath(image.filepath), texture_path)
if image is None:
    image = bpy.data.images.load(str(texture_path), check_existing=True)
image.colorspace_settings.name = 'Non-Color'
image.filepath = str(texture_path)
image.pack()

mat = bpy.data.materials.new('Continuous corona — Poly Haven density and native flowing light')
mat.use_nodes = True
nodes, links = mat.node_tree.nodes, mat.node_tree.links
nodes.clear()

def put(socket, value):
    if isinstance(value, (int, float)):
        socket.default_value = value
    else:
        links.new(value, socket)

def op(kind, *values):
    node = nodes.new('ShaderNodeMath')
    node.operation = kind
    for socket, value in zip(node.inputs, values):
        put(socket, value)
    return node.outputs[0]

def vec(x, y, z):
    node = nodes.new('ShaderNodeCombineXYZ')
    for socket, value in zip(node.inputs, (x, y, z)):
        put(socket, value)
    return node.outputs[0]

def gauss(value, centre, width):
    return op('EXPONENT', op('MULTIPLY', -1, op('POWER', op('DIVIDE', op('SUBTRACT', value, centre), width), 2)))

uv = nodes.new('ShaderNodeTexCoord')
separate = nodes.new('ShaderNodeSeparateXYZ')
links.new(uv.outputs['UV'], separate.inputs[0])
u, radius = separate.outputs[0], separate.outputs[1]
angle = op('MULTIPLY', u, math.tau)
turn = op('ADD', angle, op('MULTIPLY', radius, .65))
flow = vec(op('MULTIPLY', op('COSINE', turn), 2),
           op('MULTIPLY', op('SINE', turn), 2), op('MULTIPLY', radius, 24))
coarse = nodes.new('ShaderNodeTexNoise')
coarse.inputs['Scale'].default_value = 2.2
coarse.inputs['Detail'].default_value = 4
coarse.inputs['Roughness'].default_value = .65
links.new(flow, coarse.inputs['Vector'])
fine = nodes.new('ShaderNodeTexNoise')
fine.inputs['Scale'].default_value = 6
fine.inputs['Detail'].default_value = 3
links.new(flow, fine.inputs['Vector'])
photo = nodes.new('ShaderNodeTexImage')
photo.name = 'Poly Haven — aerial_rocks_02 displacement'
photo.image = image
photo.extension = 'REPEAT'
links.new(vec(op('ADD', op('MULTIPLY', u, 4), op('MULTIPLY', radius, .35)),
              op('MULTIPLY', radius, 2.4), 0), photo.inputs['Vector'])
irregular = op('ADD', op('MULTIPLY', coarse.outputs['Fac'], .75), op('MULTIPLY', photo.outputs['Color'], .25))
warped = op('ADD', radius, op('MULTIPLY', op('SUBTRACT', irregular, .5), .045))
# Three overlapping, softly bounded emitting zones. No periodic line pattern.
profile = op('ADD', op('MULTIPLY', gauss(warped, .085, .047), .65),
             op('ADD', op('MULTIPLY', gauss(warped, .23, .086), .35),
                       op('MULTIPLY', gauss(warped, .43, .16), .12)))
filament = op('POWER', op('MINIMUM', 1, op('MULTIPLY', fine.outputs['Fac'], 1.65)), 3)
density = op('MULTIPLY', profile, op('ADD', .28, op('MULTIPLY', filament, .72)))
heat = op('MINIMUM', 1, op('ADD', .35, op('ADD', op('MULTIPLY', irregular, .35), op('MULTIPLY', filament, .3))))
density.node.name = 'Export Corona Density'
heat.node.name = 'Export Corona Heat'
colour = nodes.new('ShaderNodeValToRGB')
colour.color_ramp.elements[0].color = (1, .13, .014, 1)
colour.color_ramp.elements[1].color = (1, .84, .56, 1)
links.new(heat, colour.inputs[0])
emission = nodes.new('ShaderNodeEmission')
links.new(colour.outputs[0], emission.inputs['Color'])
emission.inputs['Strength'].default_value = 4.2
transparent = nodes.new('ShaderNodeBsdfTransparent')
mix = nodes.new('ShaderNodeMixShader')
links.new(density, mix.inputs[0])
links.new(transparent.outputs[0], mix.inputs[1])
links.new(emission.outputs[0], mix.inputs[2])
output = nodes.new('ShaderNodeOutputMaterial')
links.new(mix.outputs[0], output.inputs['Surface'])
for i, node in enumerate(nodes):
    node.location = ((i % 10) * 210, -(i // 10) * 190)
mat['source'] = 'https://polyhaven.com/a/aerial_rocks_02; CC0; displacement used as density modulation'

segments, bands = 512, 32
vertices, faces, coords = [], [], []
for j in range(bands + 1):
    r = 1.003 + j / bands * .82
    for i in range(segments + 1):
        a = i / segments * math.tau
        vertices.append((r * math.cos(a), -.40, r * math.sin(a)))
        coords.append((i / segments, j / bands))
for j in range(bands):
    for i in range(segments):
        a = j * (segments + 1) + i
        faces.append((a, a + 1, a + segments + 2, a + segments + 1))
mesh = bpy.data.meshes.new('Continuous corona — seam joined optical surface')
mesh.from_pydata(vertices, [], faces)
mesh.update()
layer = mesh.uv_layers.new(name='Optical coordinates')
for polygon in mesh.polygons:
    for loop in polygon.loop_indices:
        layer.data[loop].uv = coords[mesh.loops[loop].vertex_index]
corona = bpy.data.objects.new('ContinuousCorona', mesh)
source.collection.objects.link(corona)
mesh.materials.append(mat)
corona['purpose'] = 'Full 360 degree lensed light; runtime tangent alignment with analytic photon edge'
for name in ('LensedCorona', 'LensingHaloDetail'):
    source.objects[name].hide_render = True
    source.objects[name].hide_viewport = True
bpy.ops.object.select_all(action='DESELECT')
corona.select_set(True)
bpy.context.view_layer.objects.active = corona
bpy.ops.export_scene.gltf(filepath=str(assets / 'continuous-corona.glb'), export_format='GLB',
                          use_selection=True, export_yup=True, export_materials='NONE', export_animations=False)

# Render the same native material as two numerical channels, using a UV plane.
sample_mat = mat.copy()
sample_mat.name = 'Continuous corona — numerical density and heat'
sn, sl = sample_mat.node_tree.nodes, sample_mat.node_tree.links
channels = sn.new('ShaderNodeCombineXYZ')
sl.new(sn['Export Corona Density'].outputs[0], channels.inputs[0])
sl.new(sn['Export Corona Heat'].outputs[0], channels.inputs[1])
emit = sn.new('ShaderNodeEmission')
sl.new(channels.outputs[0], emit.inputs['Color'])
sl.new(emit.outputs[0], next(n for n in sn if n.type == 'OUTPUT_MATERIAL').inputs['Surface'])
width, height = 2048, 512
sample_scene = bpy.data.scenes.new('Continuous corona — field evaluation')
plane_mesh = bpy.data.meshes.new('Continuous corona sampling plane')
plane_mesh.from_pydata([(0, 0, 0), (width, 0, 0), (width, height, 0), (0, height, 0)], [], [(0, 1, 2, 3)])
uv_layer = plane_mesh.uv_layers.new()
for item, value in zip(uv_layer.data, [(0, 0), (1, 0), (1, 1), (0, 1)]):
    item.uv = value
plane = bpy.data.objects.new('Continuous corona sample plane', plane_mesh)
sample_scene.collection.objects.link(plane)
plane_mesh.materials.append(sample_mat)
camera = bpy.data.objects.new('Continuous corona sample camera', bpy.data.cameras.new('Continuous corona sample camera'))
sample_scene.collection.objects.link(camera)
sample_scene.camera = camera
camera.location = (width / 2, height / 2, 100)
camera.data.type = 'ORTHO'
camera.data.ortho_scale = width
camera.data.sensor_fit = 'HORIZONTAL'
camera.data.clip_end = 200
sample_scene.render.engine = 'CYCLES'
sample_scene.cycles.device = 'CPU'
sample_scene.cycles.samples = 1
sample_scene.cycles.use_denoising = False
sample_scene.cycles.use_adaptive_sampling = False
sample_scene.cycles.max_bounces = 0
sample_scene.render.resolution_x = width
sample_scene.render.resolution_y = height
sample_scene.render.resolution_percentage = 100
sample_scene.render.filter_size = .01
sample_scene.render.use_compositing = False
sample_scene.view_settings.view_transform = 'Raw'
sample_scene.view_settings.look = 'None'
sample_scene.render.image_settings.file_format = 'OPEN_EXR'
sample_scene.render.image_settings.color_mode = 'RGB'
sample_scene.render.image_settings.color_depth = '32'
sample_scene.render.filepath = str(scratch / 'corona-field.exr')
bpy.context.window.scene = sample_scene
try:
    bpy.ops.render.render(write_still=True)
    rendered = bpy.data.images.load(sample_scene.render.filepath, check_existing=False)
    pixels = np.empty(width * height * 4, dtype=np.float32)
    rendered.pixels.foreach_get(pixels)
    field = np.rint(np.clip(pixels.reshape(height, width, 4)[:, :, :2], 0, 1) * 255).astype(np.uint8)
    assert np.count_nonzero(field[:, :, 0]) > width * height // 4, 'Empty optical field'
    data = gzip.compress(field.tobytes(), compresslevel=6, mtime=0)
    (assets / 'continuous-corona-field.bin.gz').write_bytes(data)
finally:
    bpy.context.window.scene = source

spec = {
    'sourceImageUsed': True,
    'referenceImageUsed': False,
    'densityTextureSource': 'Poly Haven aerial_rocks_02 displacement, CC0; transformed in native Blender nodes',
    'file': 'continuous-corona.glb',
    'photon': {'enabled': True, 'implementation': 'Antialiased analytic contours in the corona shader, outside the opaque silhouette'},
    'halo': {'strength': 4.2, 'flowSpeed': .009, 'dimensions': [width, height],
             'innerRadius': 1.003, 'radialSpan': .82,
             'file': 'continuous-corona-field.bin.gz', 'bytes': field.nbytes, 'compressedBytes': len(data),
             'sha256': hashlib.sha256(data).hexdigest(), 'channels': ['native emission density', 'native heat']},
    'generator': 'Blender Cycles evaluation of continuous corona material through official Blender MCP',
    'source': 'horizon-assets/continuous-horizon.blend',
    'lensing': 'Art-directed apparent lensing; not a general-relativistic simulation'
}
(assets / 'continuous-optics.json').write_text(json.dumps(spec, indent=2) + '\n', encoding='utf8')
source['continuous_optics_spec'] = json.dumps(spec)
source['runtime_orientation'] = 'Event horizon: rotation X 0.20, Z 0.25 radians; planetary orientation unchanged'
source['reference'] = 'User supplied black-hole references; no reference image pixels used in output'
# Preserve all imported source maps within the editable scene.
for imported in bpy.data.images:
    if 'aerial_rocks_02' in imported.name and imported.has_data:
        imported.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(root / 'continuous-horizon.blend'))
result = {'scene': source.name, 'file': bpy.data.filepath, 'field': spec['halo'], 'asset': str(texture_path)}
