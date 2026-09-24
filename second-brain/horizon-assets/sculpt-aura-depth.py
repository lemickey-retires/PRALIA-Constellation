"""Give the accepted flowing aura fixed 3D depth, retaining its UV material.

Run on the saved pre-volume study after create-outer-aura-study.py. Unlike the
rejected volume study, this extends the existing surface appearance in depth.
"""
import bpy
import math
import json
import numpy as np
from pathlib import Path

root=Path(__file__).resolve().parent
scene=bpy.context.scene
assert not scene.get('sculpted_aura_depth'), 'Inspect before repeating the depth authoring step.'
assert 'White aura — native 3D gas volume' not in scene.objects, 'Restore the accepted study before adding depth.'
spec=json.loads((root.parent/'site/assets/continuous-optics.json').read_text('utf8'))
original=scene.objects['ContinuousCorona']
original.hide_render=True
original.hide_viewport=True
mat=original.active_material.copy()
mat.name='Original flowing aura — depth-weighted material'
nodes,links=mat.node_tree.nodes,mat.node_tree.links
out=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
source=out.inputs['Surface'].links[0].from_socket
info=nodes.new('ShaderNodeObjectInfo')
info.name='Normalised depth-layer opacity'
transparent=nodes.new('ShaderNodeBsdfTransparent')
mix=nodes.new('ShaderNodeMixShader')
links.new(info.outputs['Alpha'],mix.inputs[0])
links.new(transparent.outputs[0],mix.inputs[1])
links.new(source,mix.inputs[2])
links.new(mix.outputs[0],out.inputs['Surface'])
collection=bpy.data.collections.new('Sculpted aura — original style with physical depth')
scene.collection.children.link(collection)

segments,bands,layers=512,32,33
u,r=np.meshgrid(np.linspace(0,1,segments+1),np.linspace(0,1,bands+1))
u,r=u.ravel(),r.ravel()
angle=u*math.tau
c,s=np.cos(angle),np.sin(angle)
side=np.abs(c)**6
def smooth(a,b,v):
    t=np.clip((v-a)/(b-a),0,1)
    return t*t*(3-2*t)
radius=spec['halo']['innerRadius']+r*spec['halo']['radialSpan']
x=c*radius+np.sign(c)*spec['halo']['sideSpan']*side*smooth(0,.30,r)
y=s*radius*(1-.25*side*r)
d=4.2
td,tr=1/d,math.sqrt(1-1/(d*d))
base=np.arange(bands*(segments+1)).reshape(bands,segments+1)[:,:segments].ravel()
loops=np.stack((base,base+segments+1,base+segments+2,base+1),axis=1).astype(np.int32).ravel()
loop_uv=np.stack((u,r),axis=1)[loops].astype(np.float32).ravel()
weights=np.exp(-(np.linspace(-1,1,layers)*1.7)**2)
weights/=weights.sum()
weights*=.52
weights[(layers-1)//2]+=.48
tilt=spec['halo']['tilt']
for i,depth in enumerate(np.linspace(-1,1,layers)):
    z=td+depth*(.24+.38*r+.65*side*smooth(.04,.8,r))
    scale=tr*(d-z)/(d-td)
    px,py=x*scale,y*scale
    # Runtime XYZ maps to native Blender (X, -Z, Y). Apply the same fixed tilt.
    co=np.stack((px*math.cos(tilt)-py*math.sin(tilt),-z,px*math.sin(tilt)+py*math.cos(tilt)),axis=1).astype(np.float32)
    mesh=bpy.data.meshes.new('Flowing aura layer '+str(i+1))
    mesh.vertices.add(len(co));mesh.vertices.foreach_set('co',co.ravel())
    mesh.loops.add(len(loops));mesh.loops.foreach_set('vertex_index',loops)
    mesh.polygons.add(len(loops)//4)
    mesh.polygons.foreach_set('loop_start',np.arange(0,len(loops),4,dtype=np.int32))
    mesh.polygons.foreach_set('loop_total',np.full(len(loops)//4,4,dtype=np.int32))
    mesh.uv_layers.new(name='Original flowing corona UV')
    mesh.uv_layers.active.data.foreach_set('uv',loop_uv)
    mesh.update()
    obj=bpy.data.objects.new('Curved flowing-light layer '+str(i+1),mesh)
    collection.objects.link(obj);mesh.materials.append(mat)
    obj.color=(1,1,1,float(weights[i]))
    obj['depth_layer']=float(depth)
    obj['style']='Original accepted corona UV and material; fixed spatial geometry'

for index,(radius,strength) in enumerate(((1.016,.65),(1.048,.20),(1.087,.08))):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=256,ring_count=128,radius=radius)
    shell=bpy.context.object;shell.name='Fine inner emission shell '+str(index+1)
    for polygon in shell.data.polygons:polygon.use_smooth=True
    shell_mat=bpy.data.materials.new(shell.name+' material');shell_mat.use_nodes=True
    sn,sl=shell_mat.node_tree.nodes,shell_mat.node_tree.links;sn.clear()
    geom=sn.new('ShaderNodeNewGeometry')
    dot=sn.new('ShaderNodeVectorMath');dot.operation='DOT_PRODUCT'
    sl.new(geom.outputs['Normal'],dot.inputs[0]);sl.new(geom.outputs['Incoming'],dot.inputs[1])
    absolute=sn.new('ShaderNodeMath');absolute.operation='ABSOLUTE';sl.new(dot.outputs['Value'],absolute.inputs[0])
    sub=sn.new('ShaderNodeMath');sub.operation='SUBTRACT';sub.inputs[0].default_value=1;sl.new(absolute.outputs[0],sub.inputs[1])
    power=sn.new('ShaderNodeMath');power.operation='POWER';power.inputs[1].default_value=8;sl.new(sub.outputs[0],power.inputs[0])
    emission=sn.new('ShaderNodeEmission');emission.inputs['Color'].default_value=(1,.93,.80,1);emission.inputs['Strength'].default_value=strength
    clear=sn.new('ShaderNodeBsdfTransparent')
    blend=sn.new('ShaderNodeMixShader');sl.new(power.outputs[0],blend.inputs[0]);sl.new(clear.outputs[0],blend.inputs[1]);sl.new(emission.outputs[0],blend.inputs[2])
    output=sn.new('ShaderNodeOutputMaterial');sl.new(blend.outputs[0],output.inputs['Surface'])
    shell.data.materials.append(shell_mat)

def point(a,r,depth):
    c,s=math.cos(a),math.sin(a);side=abs(c)**6
    radius=spec['halo']['innerRadius']+r*spec['halo']['radialSpan']
    x=c*radius+math.copysign(spec['halo']['sideSpan'],c)*side*float(smooth(0,.30,r))
    y=s*radius*(1-.25*side*r)
    z=td+depth*(.24+.38*r+.65*side*float(smooth(.04,.8,r)))
    x*=tr*(d-z)/(d-td);y*=tr*(d-z)/(d-td)
    return np.array((x*math.cos(tilt)-y*math.sin(tilt),-z,x*math.sin(tilt)+y*math.cos(tilt)))
for i,flare in enumerate(spec['flares']):
    obj=scene.objects['Blue disk wisp '+str(i+1)]
    centre=point(flare['auraAngle'],flare['auraRadius'],.65)
    width,height=flare['size']
    for vertex,(a,b) in zip(obj.data.vertices,((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))):
        vertex.co=centre+np.array((a*width,0,b*height))
    obj.data.update()

scene.cycles.transparent_max_bounces=max(64,scene.cycles.transparent_max_bounces)
scene['sculpted_aura_depth']='Original flowing material on 33 fixed curved layers, with 3 physical inner light shells; no camera-facing white aura'
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'file':bpy.data.filepath,'curved_layers':layers,'inner_light_shells':3,'original_material_preserved':True,'flat_reference_hidden':original.hide_render,'volume_replacement_used':False}
