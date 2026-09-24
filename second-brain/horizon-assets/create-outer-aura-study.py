"""Replace the old bright disk with a dark surrounding annulus in the study.

Run after finish-corona-study.py. Keep the bright aura's outline stable in the
study camera, matching the live viewer's projection at this centred view.
"""
import bpy
import math
import json
from pathlib import Path
from mathutils import Vector

root=Path(__file__).resolve().parent
scene=bpy.context.scene
assert not scene.get('outer_aura_revision'), 'Inspect before repeating this revision.'
spec=json.loads((root.parent/'site/assets/continuous-optics.json').read_text('utf-8-sig'))
rig=scene.objects['Continuous horizon disk orientation']
camera=scene.camera
forward=camera.location.normalized()
right=camera.matrix_world.to_3x3() @ Vector((math.cos(spec['halo']['tilt']),math.sin(spec['halo']['tilt']),0))
up=camera.matrix_world.to_3x3() @ Vector((-math.sin(spec['halo']['tilt']),math.cos(spec['halo']['tilt']),0))
tangent=math.sqrt(1-1/camera.location.length**2)

def smooth(a,b,v):
    t=min(1,max(0,(v-a)/(b-a)))
    return t*t*(3-2*t)

def aura_point(angle,r):
    c,s=math.cos(angle),math.sin(angle)
    side=abs(c)**6
    radius=spec['halo']['innerRadius']+r*spec['halo']['radialSpan']
    x=c*radius+math.copysign(spec['halo']['sideSpan'],c)*side*smooth(0,.30,r)
    y=s*radius*(1-.25*side*r)
    return (right*x+up*y)*tangent+forward/camera.location.length

corona=scene.objects['ContinuousCorona']
uvs={}
for loop in corona.data.loops:
    uvs[loop.vertex_index]=tuple(corona.data.uv_layers.active.data[loop.index].uv)
for index,vertex in enumerate(corona.data.vertices):
    u,r=uvs[index]
    vertex.co=aura_point(u*math.tau,r)
corona.data.update()
for name in ('Accretion Volume','Lensed Stream Volume','Ring Haze Volume','Corona Volume'):
    scene.objects[name].hide_render=True
    scene.objects[name].hide_viewport=True

source=scene.objects['Accretion Volume']
outer=source.copy()
outer.data=source.data.copy()
outer.name='Dark transparent outer aura — full annulus'
scene.collection.objects.link(outer)
outer.hide_render=False
outer.hide_viewport=False
outer.hide_set(False)
stretch=spec['outerAura']['radialStretch']
outer.scale=(stretch,stretch,2.2)
original=bpy.data.materials['Accretion — native flowing gas']
original.use_fake_user=True
mat=original.copy()
mat.name='Outer aura — muted amber gas and transparent edges'
outer.data.materials.clear()
outer.data.materials.append(mat)
nodes,links=mat.node_tree.nodes,mat.node_tree.links

def op(kind,*values):
    n=nodes.new('ShaderNodeMath')
    n.operation=kind
    for socket,value in zip(n.inputs,values):
        if isinstance(value,(int,float)):socket.default_value=value
        else:links.new(value,socket)
    return n.outputs[0]

geometry=next(n for n in nodes if n.type=='NEW_GEOMETRY')
targets=[link.to_socket for link in geometry.outputs['Position'].links]
rotate=nodes.new('ShaderNodeVectorRotate')
rotate.rotation_type='EULER_XYZ'
rotate.invert=True
rotate.inputs['Rotation'].default_value=rig.matrix_world.to_euler()
links.new(geometry.outputs['Position'],rotate.inputs['Vector'])
split=nodes.new('ShaderNodeSeparateXYZ')
links.new(rotate.outputs[0],split.inputs[0])
x,y,z=split.outputs
radius=op('MAXIMUM',.0001,op('SQRT',op('ADD',op('POWER',x,2),op('POWER',y,2))))
source_radius=op('ADD',1,op('DIVIDE',op('SUBTRACT',radius,1),stretch))
ratio=op('DIVIDE',source_radius,radius)
sample_x,sample_y=op('MULTIPLY',x,ratio),op('MULTIPLY',y,ratio)
sample_z=op('ADD',z,op('MULTIPLY',op('SUBTRACT',y,sample_y),.035))
mapped=nodes.new('ShaderNodeCombineXYZ')
mapped.name='Outer aura — complete radial field and original plane height'
for socket,value in zip(mapped.inputs,(sample_x,sample_y,sample_z)):links.new(value,socket)
for target in targets:links.new(mapped.outputs[0],target)

def fade(lo,hi,start,end):
    node=nodes.new('ShaderNodeMapRange')
    node.interpolation_type='SMOOTHSTEP'
    links.new(source_radius,node.inputs['Value'])
    for label,value in (('From Min',lo),('From Max',hi),('To Min',start),('To Max',end)):
        node.inputs[label].default_value=value
    return node.outputs[0]

envelope=op('MULTIPLY',fade(1.10,1.45,0,1),fade(1.95,2.75,1,0))
volume=next(n for n in nodes if n.type=='PRINCIPLED_VOLUME')
original_density=volume.inputs['Density'].links[0].from_socket
original_emission=volume.inputs['Emission Strength'].links[0].from_socket
links.new(op('MULTIPLY',original_density,op('MULTIPLY',envelope,.48)),volume.inputs['Density'])
links.new(op('MULTIPLY',original_emission,op('MULTIPLY',envelope,.48*.68*.65)),volume.inputs['Emission Strength'])
ramp=nodes['Color Ramp']
original_heat=ramp.inputs[0].links[0].from_socket
links.new(op('ADD',original_heat,.03),ramp.inputs[0])
for index,flare in enumerate(spec['flares']):
    obj=scene.objects['Blue disk wisp '+str(index+1)]
    centre=aura_point(flare['auraAngle'],flare['auraRadius'])
    width,height=flare['size']
    for vertex,(u,v) in zip(obj.data.vertices,((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))):
        vertex.co=centre+(right*u*width+up*v*height)*tangent
    obj.data.update()

scene['outer_aura_revision']='Old bright disk and stream hidden; stable white aura; complete dark outer annulus with front/back extent and transparent falloff'
bpy.context.view_layer.update()
bpy.ops.object.select_all(action='DESELECT')
corona.select_set(True)
bpy.context.view_layer.objects.active=corona
bpy.ops.export_scene.gltf(filepath=str(root.parent/'site/assets/continuous-corona.glb'),export_format='GLB',
    use_selection=True,export_yup=True,export_materials='NONE',export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'file':bpy.data.filepath,'outer_aura':outer.name,'old_bright_volumes_hidden':True}
