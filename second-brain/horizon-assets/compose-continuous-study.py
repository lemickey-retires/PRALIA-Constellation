"""Frame the separate editable Blender study after create-continuous-corona.py.

The real-time viewer supplies dynamic tangent alignment, bloom and volume flow.
This native study keeps those materials and the imported texture editable.
"""
import bpy
import math
from pathlib import Path
from mathutils import Matrix

root = Path(__file__).resolve().parent
scene = bpy.context.scene
assert 'ContinuousCorona' in scene.objects, 'Build the continuous corona first.'
assert 'Continuous horizon disk orientation' not in scene.objects, 'Inspect before rerunning.'
rig = bpy.data.objects.new('Continuous horizon disk orientation', None)
scene.collection.objects.link(rig)
for name in ('Accretion Volume', 'Lensed Stream Volume', 'Corona Volume',
             'Ring Haze Volume', 'Horizon Space Particles'):
    obj = scene.objects.get(name)
    if obj:
        obj.parent = rig
rig.matrix_world = Matrix.Rotation(.20, 4, 'X') @ Matrix.Rotation(-.25, 4, 'Y')
rig['purpose'] = 'One coherent tilt for the disk, inner gas and surrounding haze.'
# Existing native fields read world-space Position. Transform the coordinates
# with their volume bounds, or parenting alone leaves the emitting disk level.
for obj in rig.children:
    if obj.type != 'MESH' or 'Volume' not in obj.name:
        continue
    for slot in obj.material_slots:
        slot.material = slot.material.copy()
        tree = slot.material.node_tree
        for geometry in [n for n in tree.nodes if n.type == 'NEW_GEOMETRY']:
            targets = [link.to_socket for link in geometry.outputs['Position'].links]
            transform = tree.nodes.new('ShaderNodeVectorRotate')
            transform.name = 'Continuous horizon — inverse field orientation'
            transform.rotation_type = 'EULER_XYZ'
            transform.invert = True
            transform.inputs['Rotation'].default_value = rig.matrix_world.to_euler()
            tree.links.new(geometry.outputs['Position'], transform.inputs['Vector'])
            for target in targets:
                tree.links.new(transform.outputs['Vector'], target)

camera = bpy.data.objects.new('Continuous horizon study camera', bpy.data.cameras.new('Continuous horizon study camera'))
scene.collection.objects.link(camera)
distance = 4.2
camera.location = (0, -distance, 0)
camera.rotation_euler = (math.pi / 2, 0, 0)
camera.data.lens = 28
camera.data.clip_start = .01
camera.data.clip_end = 100
scene.camera = camera
corona = scene.objects['ContinuousCorona']
tangent = math.sqrt(1 - 1 / distance ** 2)
for vertex in corona.data.vertices:
    vertex.co.x *= tangent
    vertex.co.z *= tangent
    vertex.co.y = -1 / distance

mat = corona.data.materials[0]
nodes, links = mat.node_tree.nodes, mat.node_tree.links
uv = next(n for n in nodes if n.type == 'TEX_COORD')
sep = nodes.new('ShaderNodeSeparateXYZ')
links.new(uv.outputs['UV'], sep.inputs[0])

def op(kind, *values):
    node = nodes.new('ShaderNodeMath')
    node.operation = kind
    for socket, value in zip(node.inputs, values):
        if isinstance(value, (float, int)):
            socket.default_value = value
        else:
            links.new(value, socket)
    return node.outputs[0]

strength = 0
for centre, width, energy in ((.009, .0028, 2.8), (.031, .004, .55), (.059, .006, .20)):
    d = op('DIVIDE', op('SUBTRACT', sep.outputs[1], centre), width)
    strength = op('ADD', strength, op('MULTIPLY', op('EXPONENT', op('MULTIPLY', -1, op('POWER', d, 2))), energy))
photon = nodes.new('ShaderNodeEmission')
photon.name = 'Three nested photon contours'
photon.inputs['Color'].default_value = (1, .88, .66, 1)
links.new(strength, photon.inputs['Strength'])
output = next(n for n in nodes if n.type == 'OUTPUT_MATERIAL')
surface = output.inputs['Surface'].links[0].from_socket
add = nodes.new('ShaderNodeAddShader')
links.new(surface, add.inputs[0])
links.new(photon.outputs[0], add.inputs[1])
links.new(add.outputs[0], output.inputs['Surface'])
scene.render.resolution_x = 1440
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(root.parents[2] / 'outputs' / 'continuous-horizon-blender.png')
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(root / 'continuous-horizon.blend'))
result = {'scene': scene.name, 'camera': camera.name, 'saved': bpy.data.filepath}
