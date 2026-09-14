"""Finish the wide study with a bright layered rim and physical disk joins.

Run after widen-horizon-study.py. The runtime repeats this view-dependent
construction for the live camera. This file preserves an editable static study.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parent
spec = json.loads((root.parent/'site/assets/continuous-optics.json').read_text('utf-8-sig'))
scene = bpy.context.scene
assert scene.get('wide_disk_revision') and not scene.get('finished_corona_revision')
rig = scene.objects['Continuous horizon disk orientation']
eye = scene.camera.location
forward = eye.normalized()
normal = (rig.matrix_world.to_3x3() @ Vector((0,.035,1))).normalized()
right = normal.cross(forward).normalized()
up = forward.cross(right)
disk_side = right.cross(normal).normalized()
centre = rig.matrix_world @ Vector((0,0,-.14))
tangent = math.sqrt(1-1/eye.length**2)

def smooth(a,b,v):
    t=max(0,min(1,(v-a)/(b-a)))
    return t*t*(3-2*t)

edge_view=1-smooth(.65,.97,abs(forward.dot(normal)))
corona=scene.objects['ContinuousCorona']
uvs={}
for loop in corona.data.loops:
    uvs[loop.vertex_index]=tuple(corona.data.uv_layers.active.data[loop.index].uv)
for index,vertex in enumerate(corona.data.vertices):
    u,r=uvs[index]
    c,s=math.cos(u*math.tau),math.sin(u*math.tau)
    side=abs(c)**6
    radius=spec['halo']['innerRadius']+r*spec['halo']['radialSpan']
    extra=spec['halo']['sideSpan']*side*smooth(0,.30,r)
    x=c*radius+math.copysign(extra,c)
    y=s*radius*(1-.25*side*r)
    optical=(right*x+up*y)*tangent+forward/eye.length
    physical=(right*c-disk_side*s)*(radius+extra)+centre
    circular=(right*c+up*s)*radius*tangent+forward/eye.length
    vertex.co=circular.lerp(optical.lerp(physical,side*smooth(.015,.24,r)),edge_view)
corona.data.update()

old=corona.active_material
old.use_fake_user=True
mat=old.copy()
mat.name='Finished horizon — white-gold rim and layered flowing gas'
corona.data.materials[0]=mat
nodes,links=mat.node_tree.nodes,mat.node_tree.links

def op(kind,*values):
    node=nodes.new('ShaderNodeMath')
    node.operation=kind
    for socket,value in zip(node.inputs,values):
        if isinstance(value,(float,int)):
            socket.default_value=value
        else:
            links.new(value,socket)
    return node.outputs[0]

def gauss(v,centre,width):
    return op('EXPONENT',op('MULTIPLY',-1,op('POWER',op('DIVIDE',op('SUBTRACT',v,centre),width),2)))

uv=next(n for n in nodes if n.type=='TEX_COORD')
sep=nodes.new('ShaderNodeSeparateXYZ')
links.new(uv.outputs['UV'],sep.inputs[0])
r=sep.outputs[1]
density=nodes['Export Corona Density'].outputs[0]
body=0
for centre,width,energy in ((.07,.035,.48),(.17,.070,.32),(.32,.10,.15),(.50,.18,.04)):
    body=op('ADD',body,op('MULTIPLY',gauss(r,centre,width),energy))
photon=0
for centre,width,energy in ((.012,.0055,2.3),(.050,.009,.60),(.10,.015,.25),(.22,.020,.10)):
    photon=op('ADD',photon,op('MULTIPLY',gauss(r,centre,width),energy))
soft=op('MULTIPLY',.30,op('EXPONENT',op('MULTIPLY',r,-5.5)))
strength=op('ADD',soft,op('MULTIPLY',spec['halo']['strength']*.36,op('ADD',
    op('MULTIPLY',body,op('ADD',.38,op('MULTIPLY',density,.8))),op('MULTIPLY',density,.16))))
fade=nodes.new('ShaderNodeMapRange')
fade.interpolation_type='SMOOTHSTEP'
links.new(r,fade.inputs['Value'])
fade.inputs['From Min'].default_value=.70
fade.inputs['From Max'].default_value=1
fade.inputs['To Min'].default_value=1
fade.inputs['To Max'].default_value=0
colour=nodes.new('ShaderNodeValToRGB')
colour.name='Layered white gold through amber to transparent ember'
colour.color_ramp.elements[0].color=(1,.86,.63,1)
colour.color_ramp.elements[1].color=(1,.20,.025,1)
links.new(r,colour.inputs[0])
gas=nodes.new('ShaderNodeEmission')
links.new(colour.outputs[0],gas.inputs['Color'])
links.new(op('MULTIPLY',strength,fade.outputs[0]),gas.inputs['Strength'])
rim=nodes.new('ShaderNodeEmission')
rim.name='Brightest inner rim with three softer surrounding contours'
rim.inputs['Color'].default_value=(1,.93,.80,1)
links.new(op('MULTIPLY',photon,fade.outputs[0]),rim.inputs['Strength'])
transparent=nodes.new('ShaderNodeBsdfTransparent')
add=nodes.new('ShaderNodeAddShader')
links.new(gas.outputs[0],add.inputs[0])
links.new(rim.outputs[0],add.inputs[1])
surface=nodes.new('ShaderNodeAddShader')
links.new(transparent.outputs[0],surface.inputs[0])
links.new(add.outputs[0],surface.inputs[1])
output=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
links.new(surface.outputs[0],output.inputs['Surface'])

# The original separate upper corona remains recoverable, hidden in this study.
scene.objects['Corona Volume'].hide_render=True
scene.objects['Corona Volume'].hide_viewport=True
for name in ('Accretion Volume','Lensed Stream Volume'):
    tree=scene.objects[name].active_material.node_tree
    nodes,links=tree.nodes,tree.links
    ramp=nodes['Color Ramp']
    original_factor=ramp.inputs[0].links[0].from_socket
    links.new(op('ADD',original_factor,.15),ramp.inputs[0])

scene['finished_corona_revision']='Brightest integrated rim; layered amber glow; physical disk attachment at the side extensions'
scene.render.resolution_x=1200
scene.render.resolution_y=834
scene.cycles.samples=16
bpy.context.view_layer.update()
bpy.ops.object.select_all(action='DESELECT')
corona.select_set(True)
bpy.context.view_layer.objects.active=corona
bpy.ops.export_scene.gltf(filepath=str(root.parent/'site/assets/continuous-corona.glb'),
    export_format='GLB',use_selection=True,export_yup=True,export_materials='NONE',export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'saved':bpy.data.filepath,'finished':scene['finished_corona_revision']}
