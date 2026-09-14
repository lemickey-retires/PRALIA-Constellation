"""Extend the separate integrated study for the requested immense proportions.

Run after integrate-corona-study.py. Remap native material coordinates outside
the unit core; preserve the original files and the current study's graph-free
composition. This changes an artistic disk extent, not gravitational physics.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parent
spec = json.loads((root.parent / 'site/assets/continuous-optics.json').read_text('utf-8-sig'))
scene = bpy.context.scene
assert not scene.get('wide_disk_revision'), 'Inspect before applying this revision twice.'
assert Path(bpy.data.filepath).name == 'continuous-horizon.blend'
stretch = spec['diskRadialStretch']
rig = scene.objects['Continuous horizon disk orientation']
eye = scene.camera.location
forward = eye.normalized()
pole = rig.matrix_world.to_3x3() @ Vector((0,0,1))
right = pole.cross(forward).normalized()
up = forward.cross(right)
tangent = math.sqrt(1 - 1 / eye.length**2)

def smooth(a, b, value):
    t = max(0, min(1, (value-a)/(b-a)))
    return t*t*(3-2*t)

corona = scene.objects['ContinuousCorona']
uvs = {}
for loop in corona.data.loops:
    uvs[loop.vertex_index] = tuple(corona.data.uv_layers.active.data[loop.index].uv)
for index, vertex in enumerate(corona.data.vertices):
    u, r = uvs[index]
    a = u*math.tau
    c, s = math.cos(a), math.sin(a)
    side = abs(c)**6
    radius = spec['halo']['innerRadius'] + r*spec['halo']['radialSpan']
    x = c*radius + math.copysign(spec['halo']['sideSpan'], c)*side*smooth(0,.30,r)
    z = s*radius*(1-.25*side*r)
    vertex.co = (right*x+up*z)*tangent + forward/eye.length
corona.data.update()

for name in ('Accretion Volume', 'Lensed Stream Volume'):
    obj = scene.objects[name]
    # Bounds may be conservative; the native density determines the visible edge.
    obj.scale.x *= stretch
    obj.scale.y *= stretch
    obj.scale.z *= 1.7
    tree = obj.active_material.node_tree
    nodes, links = tree.nodes, tree.links
    coordinate = nodes['Continuous horizon — inverse field orientation'].outputs[0]
    targets = [link.to_socket for link in coordinate.links]

    def op(kind, *values):
        node = nodes.new('ShaderNodeMath')
        node.operation = kind
        for socket, value in zip(node.inputs, values):
            if isinstance(value, (float,int)):
                socket.default_value = value
            else:
                links.new(value, socket)
        return node.outputs[0]

    split = nodes.new('ShaderNodeSeparateXYZ')
    links.new(coordinate, split.inputs[0])
    x, y, z = split.outputs
    radius = op('MAXIMUM', .0001, op('SQRT', op('ADD', op('POWER',x,2),op('POWER',y,2))))
    source_radius = op('ADD', 1, op('DIVIDE', op('SUBTRACT',radius,1), stretch))
    ratio = op('DIVIDE',source_radius,radius)
    source_x, source_y = op('MULTIPLY',x,ratio), op('MULTIPLY',y,ratio)
    source_z = op('ADD',z,op('MULTIPLY',op('SUBTRACT',y,source_y),.035))
    mapped = nodes.new('ShaderNodeCombineXYZ')
    mapped.name = 'Expanded disk — preserve core and plane height'
    for socket, value in zip(mapped.inputs,(source_x,source_y,source_z)):
        links.new(value,socket)
    for target in targets:
        links.new(mapped.outputs[0],target)
    obj['radial_stretch_outside_core'] = stretch

for index, flare in enumerate(spec['flares']):
    obj = scene.objects['Blue disk wisp '+str(index+1)]
    radius = 1+(flare['radius']-1)*stretch
    x, y = math.cos(flare['angle'])*radius, -math.sin(flare['angle'])*radius
    centre = rig.matrix_world @ Vector((x,y,-.12-y*.035))
    fwd = (eye-centre).normalized()
    axis = pole.cross(fwd).normalized()
    vertical = fwd.cross(axis)
    width, height = flare['size']
    for vertex,(u,v) in zip(obj.data.vertices,((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))):
        vertex.co = centre+axis*(u*width)+vertical*(v*height)
    obj.data.update()

scene['wide_disk_revision'] = 'Outer disk radius approximately five core radii; core size preserved'
scene['disk_radial_stretch'] = stretch
bpy.context.view_layer.update()
# Update the mesh export; the browser uses these UVs for dynamic alignment.
bpy.ops.object.select_all(action='DESELECT')
corona.select_set(True)
bpy.context.view_layer.objects.active = corona
bpy.ops.export_scene.gltf(filepath=str(root.parent/'site/assets/continuous-corona.glb'),
    export_format='GLB',use_selection=True,export_yup=True,
    export_materials='NONE',export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'saved':bpy.data.filepath,'disk_stretch':stretch,'side_span':spec['halo']['sideSpan']}
