"""Apply the integrated, tapered glow revision to the separate native study.

Run after compose-continuous-study.py through the official Blender MCP. Original
materials are retained; only the dedicated continuous study is saved. The browser
adds dynamic camera alignment and flow to this editable native composition.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parent
scene = bpy.context.scene
corona = scene.objects['ContinuousCorona']
assert not corona.get('integrated_revision'), 'Inspect before applying this revision twice.'
assert Path(bpy.data.filepath).name == 'continuous-horizon.blend'
spec = json.loads((root.parent / 'site/assets/continuous-optics.json').read_text('utf-8-sig'))
rig = scene.objects['Continuous horizon disk orientation']
eye = scene.camera.location
forward = eye.normalized()
pole = rig.matrix_world.to_3x3() @ Vector((0, 0, 1))
right = pole.cross(forward).normalized()
up = forward.cross(right)
distance = eye.length
tangent = math.sqrt(1 - 1 / distance ** 2)

def smooth(a, b, v):
    t = min(1, max(0, (v-a)/(b-a)))
    return t*t*(3-2*t)

# Reconstruct from optical coordinates so mesh deformation is deterministic.
coords = {}
for loop in corona.data.loops:
    coords[loop.vertex_index] = tuple(corona.data.uv_layers.active.data[loop.index].uv)
for index, vertex in enumerate(corona.data.vertices):
    u, r = coords[index]
    a = u * math.tau
    c, s = math.cos(a), math.sin(a)
    side = abs(c) ** 6
    radius = spec['halo']['innerRadius'] + r * spec['halo']['radialSpan']
    x = c*radius + math.copysign(1.75, c)*side*smooth(0, .48, r)
    z = s*radius*(1-.25*side*r)
    vertex.co = (right*x+up*z)*tangent+forward/distance
corona.data.update()
corona['integrated_revision'] = 'Tapered side shoulders, shared gold emission, blue disk wisps'

original = corona.active_material
original.use_fake_user = True
mat = original.copy()
mat.name = 'Integrated corona — tapered continuous gold gas'
corona.data.materials[0] = mat
nodes, links = mat.node_tree.nodes, mat.node_tree.links

def op(kind, *values):
    node = nodes.new('ShaderNodeMath')
    node.operation = kind
    for socket, value in zip(node.inputs, values):
        if isinstance(value, (float, int)):
            socket.default_value = value
        else:
            links.new(value, socket)
    return node.outputs[0]

def gauss(v, centre, width):
    return op('EXPONENT', op('MULTIPLY', -1, op('POWER', op('DIVIDE', op('SUBTRACT', v, centre), width), 2)))

uv = next(n for n in nodes if n.type == 'TEX_COORD')
sep = nodes.new('ShaderNodeSeparateXYZ')
links.new(uv.outputs['UV'], sep.inputs[0])
r = sep.outputs[1]
density = nodes['Export Corona Density'].outputs[0]
body = op('ADD', op('MULTIPLY', gauss(r, .13, .115), .78), op('ADD',
    op('MULTIPLY', gauss(r, .31, .16), .20), op('MULTIPLY', gauss(r, .50, .22), .045)))
photon = op('ADD', op('MULTIPLY', gauss(r, .025, .016), .22), op('ADD',
    op('MULTIPLY', gauss(r, .12, .022), .12), op('MULTIPLY', gauss(r, .25, .032), .055)))
soft = op('MULTIPLY', .30, op('EXPONENT', op('MULTIPLY', r, -5.5)))
strength = op('ADD', op('MULTIPLY', spec['halo']['strength']*.36, op('ADD',
    op('MULTIPLY', body, op('ADD', .38, op('MULTIPLY', density, .8))),
    op('MULTIPLY', density, .16))), op('ADD', soft, photon))
fade = nodes.new('ShaderNodeMapRange')
fade.interpolation_type = 'SMOOTHSTEP'
links.new(r, fade.inputs['Value'])
fade.inputs['From Min'].default_value = .70
fade.inputs['From Max'].default_value = 1
fade.inputs['To Min'].default_value = 1
fade.inputs['To Max'].default_value = 0
strength = op('MULTIPLY', strength, fade.outputs[0])
colour = nodes.new('ShaderNodeValToRGB')
colour.name = 'Shared gold — hottest by core, ember at outer fade'
colour.color_ramp.elements[0].color = (1, .86, .63, 1)
colour.color_ramp.elements[1].color = (1, .20, .025, 1)
links.new(r, colour.inputs[0])
emission = nodes.new('ShaderNodeEmission')
emission.name = 'Unified gas and embedded photon glow'
links.new(colour.outputs[0], emission.inputs['Color'])
links.new(strength, emission.inputs['Strength'])
transparent = nodes.new('ShaderNodeBsdfTransparent')
add = nodes.new('ShaderNodeAddShader')
links.new(transparent.outputs[0], add.inputs[0])
links.new(emission.outputs[0], add.inputs[1])
output = next(n for n in nodes if n.type == 'OUTPUT_MATERIAL')
links.new(add.outputs[0], output.inputs['Surface'])

# Keep the existing procedural fields and strengthen their inner emission.
for name in ('Accretion Volume', 'Lensed Stream Volume'):
    obj = scene.objects[name]
    previous = obj.active_material
    previous.use_fake_user = True
    obj.data.materials[0] = previous.copy()
    nodes, links = obj.active_material.node_tree.nodes, obj.active_material.node_tree.links
    volume = next(n for n in nodes if n.type == 'PRINCIPLED_VOLUME')
    coordinate = nodes['Continuous horizon — inverse field orientation'].outputs[0]
    split = nodes.new('ShaderNodeSeparateXYZ')
    links.new(coordinate, split.inputs[0])
    radius = op('SQRT', op('ADD', op('POWER', split.outputs[0], 2), op('POWER', split.outputs[1], 2)))
    inner = op('EXPONENT', op('MULTIPLY', -2.1, op('MAXIMUM', 0, op('SUBTRACT', radius, 1.08))))
    old_emission = volume.inputs['Emission Strength'].links[0].from_socket
    links.new(op('MULTIPLY', old_emission, op('MULTIPLY', 1.25, op('ADD', 1, op('MULTIPLY', inner, 1.2)))), volume.inputs['Emission Strength'])
    falloff = nodes.new('ShaderNodeMapRange')
    falloff.interpolation_type = 'SMOOTHSTEP'
    links.new(radius, falloff.inputs['Value'])
    falloff.inputs['From Min'].default_value = 1.55
    falloff.inputs['From Max'].default_value = 2.74
    falloff.inputs['To Min'].default_value = 1
    falloff.inputs['To Max'].default_value = .22
    old_density = volume.inputs['Density'].links[0].from_socket
    links.new(op('MULTIPLY', old_density, falloff.outputs[0]), volume.inputs['Density'])

# Small editable emission planes: real disk positions, transparent soft edges.
flares = bpy.data.collections.new('Integrated horizon — blue gas wisps')
scene.collection.children.link(flares)
for index, flare in enumerate(spec['flares']):
    angle, radius = flare['angle'], flare['radius']
    x, y = math.cos(angle)*radius, -math.sin(angle)*radius
    centre = rig.matrix_world @ Vector((x, y, -.12-y*.035))
    fwd = (eye-centre).normalized()
    axis = pole.cross(fwd).normalized()
    vertical = fwd.cross(axis)
    width, height = flare['size']
    vertices = [centre + axis*(u*width) + vertical*(v*height)
                for u, v in ((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))]
    mesh = bpy.data.meshes.new('Blue gas wisp surface '+str(index+1))
    mesh.from_pydata(vertices, [], [(0,1,2,3)])
    uv_layer = mesh.uv_layers.new()
    for loop, value in zip(uv_layer.data, ((0,0),(1,0),(1,1),(0,1))):
        loop.uv = value
    obj = bpy.data.objects.new('Blue disk wisp '+str(index+1), mesh)
    flares.objects.link(obj)
    material = bpy.data.materials.new(obj.name+' — soft cyan emission')
    material.use_nodes = True
    obj.data.materials.append(material)
    nodes, links = material.node_tree.nodes, material.node_tree.links
    uv = nodes.new('ShaderNodeTexCoord')
    split = nodes.new('ShaderNodeSeparateXYZ')
    links.new(uv.outputs['UV'], split.inputs[0])
    mist = op('MULTIPLY', gauss(split.outputs[0], .5, .19), gauss(split.outputs[1], .57, .22))
    core = op('MULTIPLY', gauss(split.outputs[0], .5, .035), gauss(split.outputs[1], .5, .025))
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 15
    links.new(uv.outputs['UV'], noise.inputs['Vector'])
    energy = op('ADD', op('MULTIPLY', core, 3.5), op('MULTIPLY', mist, op('MULTIPLY', noise.outputs['Fac'], .7)))
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (.15,.50,1,1)
    links.new(energy, emission.inputs['Strength'])
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    add = nodes.new('ShaderNodeAddShader')
    links.new(transparent.outputs[0], add.inputs[0])
    links.new(emission.outputs[0], add.inputs[1])
    output = next(n for n in nodes if n.type == 'OUTPUT_MATERIAL')
    links.new(add.outputs[0], output.inputs['Surface'])

scene['integrated_corona_notes'] = 'Art-directed tapered shoulders; warm core, transparent outer falloff, four blue disk wisps. Browser clock and dynamic projection are runtime features.'
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(root / 'continuous-horizon.blend'))
result = {'saved':bpy.data.filepath, 'corona':corona.name, 'blue_wisps':len(flares.objects)}
