"""Extend the accepted white aura around all azimuths; hide the orange reference.

Run after sculpt-aura-depth.py. The future darker outer layer is not created.
"""
import bpy
import math
import numpy as np
from pathlib import Path
root=Path(__file__).resolve().parent
scene=bpy.context.scene
assert scene.get('sculpted_aura_depth') and not scene.get('complete_white_surround')
reference=scene.objects['Dark transparent outer aura — full annulus']
reference.hide_render=True;reference.hide_viewport=True
reference['purpose']='Reference only for a future darker outer layer'
rig=scene.objects['Continuous horizon disk orientation']
mat=bpy.data.materials['Original flowing aura — depth-weighted material'].copy()
mat.name='White full surround — original flowing gas without repeated rim bands'
rim=mat.node_tree.nodes['Brightest inner rim with three softer surrounding contours']
for link in list(rim.inputs['Strength'].links):mat.node_tree.links.remove(link)
rim.inputs['Strength'].default_value=0
collection=bpy.data.collections.new('White aura — full front back and side surround')
scene.collection.children.link(collection)
segments,bands,layers=256,64,25
weights=np.exp(-(np.linspace(-1,1,layers)*2.2)**2)
weights=weights/weights.sum()*.55
u,r=np.meshgrid(np.linspace(0,1,segments+1),np.linspace(0,1,bands+1))
u,r=u.ravel(),r.ravel()
radius=1.008+4.2*r
x,y=np.cos(u*math.tau)*radius,np.sin(u*math.tau)*radius
thickness=.025+.18*np.exp(-r*8)
base=np.arange(bands*(segments+1)).reshape(bands,segments+1)[:,:segments].ravel()
loops=np.stack((base,base+segments+1,base+segments+2,base+1),axis=1).astype(np.int32).ravel()
uv=np.stack((u,r),axis=1)[loops].astype(np.float32).ravel()
for i,layer in enumerate(np.linspace(-1,1,layers)):
    z=-.06-y*.035+layer*thickness
    positions=np.stack((x,y,z),axis=1).astype(np.float32)
    mesh=bpy.data.meshes.new('Complete white surround layer '+str(i+1))
    mesh.vertices.add(len(positions));mesh.vertices.foreach_set('co',positions.ravel())
    mesh.loops.add(len(loops));mesh.loops.foreach_set('vertex_index',loops)
    mesh.polygons.add(len(loops)//4)
    mesh.polygons.foreach_set('loop_start',np.arange(0,len(loops),4,dtype=np.int32))
    mesh.polygons.foreach_set('loop_total',np.full(len(loops)//4,4,dtype=np.int32))
    mesh.uv_layers.new(name='Original flowing corona UV')
    mesh.uv_layers.active.data.foreach_set('uv',uv);mesh.update()
    obj=bpy.data.objects.new('White full-surround flow '+str(i+1),mesh)
    collection.objects.link(obj);obj.parent=rig
    mesh.materials.append(mat);obj.color=(1,1,1,float(weights[i]))
    obj['description']='Same white aura material, complete 360-degree annulus with inner thickness and outer transparency'
scene['complete_white_surround']='White flowing ring extends through front/back/sides; orange reference hidden; future darker outer layer deferred'
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'file':bpy.data.filepath,'white_surround_layers':layers,'full_360_degrees':True,'orange_reference_hidden':reference.hide_render,'new_darker_outer_layer_created':False}
