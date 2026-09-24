"""Revolve the accepted curved light profile into a closed 360-degree body.

The former strips and flat fill are preserved as hidden references. This is
an art-directed emission sculpture, not a relativistic simulation.
"""
import bpy, math, json
import numpy as np
from pathlib import Path
root=Path(__file__).resolve().parent
scene=bpy.context.scene
assert scene.get('complete_white_surround') and not scene.get('enclosed_white_aura')
spec=json.loads((root.parent/'site/assets/continuous-optics.json').read_text())
rig=scene.objects['Continuous horizon disk orientation']
for obj in scene.objects:
    if obj.name.startswith(('Curved flowing-light layer ','White full-surround flow ')):
        obj.hide_render=True;obj.hide_viewport=True
        obj['purpose']='Preserved reference: former strip/flat-fill construction'
reference=scene.objects['Dark transparent outer aura — full annulus']
reference.hide_render=True;reference.hide_viewport=True
collection=bpy.data.collections.new('White aura — continuous curved 360 degree body')
scene.collection.children.link(collection)
mat=bpy.data.materials['Original flowing aura — depth-weighted material'].copy()
mat.name='Closed white aura — original flowing field and smooth surface emission'
nodes,links=mat.node_tree.nodes,mat.node_tree.links
def mathnode(op,*args):
    node=nodes.new('ShaderNodeMath');node.operation=op
    for socket,arg in zip(node.inputs,args):
        if isinstance(arg,(float,int)):socket.default_value=arg
        else:links.new(arg,socket)
    return node.outputs[0]
def vector(op,*args):
    node=nodes.new('ShaderNodeVectorMath');node.operation=op
    for socket,arg in zip(node.inputs,args):
        if hasattr(arg,'node'):links.new(arg,socket)
        else:socket.default_value=arg
    return node.outputs['Value' if op in ('DOT_PRODUCT','LENGTH','DISTANCE') else 'Vector']
geo=nodes.new('ShaderNodeNewGeometry')
facing=mathnode('ABSOLUTE',vector('DOT_PRODUCT',geo.outputs['Normal'],geo.outputs['Incoming']))
fade=nodes.new('ShaderNodeMapRange');fade.interpolation_type='SMOOTHSTEP';fade.clamp=True
links.new(facing,fade.inputs['Value']);fade.inputs['From Min'].default_value=0;fade.inputs['From Max'].default_value=.25
rim=mathnode('MULTIPLY',mathnode('POWER',mathnode('SUBTRACT',1,facing),3),fade.outputs[0])
attribute=nodes.new('ShaderNodeAttribute');attribute.attribute_name='light_weight'
weight=mathnode('MULTIPLY',rim,attribute.outputs['Fac'])
# For primary camera rays, extinguish emission inside the apparent unit core.
# The cross product gives the shortest distance from the ray to the origin.
impact=vector('LENGTH',vector('CROSS_PRODUCT',geo.outputs['Position'],geo.outputs['Incoming']))
outside=mathnode('GREATER_THAN',impact,1)
weight=mathnode('MULTIPLY',weight,outside)
gas=nodes['Emission.001'];strength=gas.inputs['Strength'].links[0].from_socket
links.new(mathnode('MULTIPLY',strength,weight),gas.inputs['Strength'])
transparent=nodes.new('ShaderNodeBsdfTransparent');surface=nodes.new('ShaderNodeAddShader')
links.new(transparent.outputs[0],surface.inputs[0]);links.new(gas.outputs[0],surface.inputs[1])
links.new(surface.outputs[0],nodes['Material Output'].inputs['Surface'])

layers,segments,bands=192,128,128
lat=np.repeat(np.linspace(-math.pi/2,math.pi/2,bands+1)[1:-1],segments)
az=np.tile(np.arange(segments)*math.tau/segments,bands-1)
lat=np.concatenate(([-math.pi/2],lat,[math.pi/2]));az=np.concatenate(([0],az,[0]))
count=len(lat);faces=[]
for col in range(segments):faces.append((0,1+(col+1)%segments,1+col))
for row in range(bands-2):
    for col in range(segments):
        a=1+row*segments+col;b=1+row*segments+(col+1)%segments
        faces.append((a,b,b+segments,a+segments))
top=count-1;last=1+(bands-2)*segments
for col in range(segments):faces.append((last+col,last+(col+1)%segments,top))
faces=[tuple(reversed(face)) for face in faces]  # Outward normals in Blender's Z-up coordinates.
totals=np.array([len(face) for face in faces],dtype=np.int32)
starts=np.concatenate(([0],np.cumsum(totals[:-1]))).astype(np.int32)
loops=np.array([i for face in faces for i in face],dtype=np.int32)
c=np.maximum(0,np.cos(lat));s=np.sin(lat);side=c**6
radii=.004+.996*np.linspace(0,1,layers)**1.8
for i,r in enumerate(radii):
    dr=((radii[i+1] if i+1<layers else 1)-(radii[i-1] if i else 0))*.5
    t=np.clip(r/.30,0,1);radius=spec['halo']['innerRadius']+r*spec['halo']['radialSpan']
    rho=c*radius+spec['halo']['sideSpan']*side*t*t*(3-2*t)
    height=s*(spec['halo']['innerRadius']+r*spec['halo']['radialSpan']*spec['halo'].get('verticalSpread',1))*(1-.25*side*r)
    positions=np.stack((rho*np.cos(az),-rho*np.sin(az),height),axis=1).astype(np.float32)
    deriv=c*spec['halo']['radialSpan']+spec['halo']['sideSpan']*side*6*t*(1-t)/.30
    light=dr*np.divide(deriv,rho,out=np.full(count,spec['halo']['radialSpan']/radius),where=rho>1e-6)*spec['halo'].get('bodyLightGain',5)
    mesh=bpy.data.meshes.new('Closed curved emission surface '+str(i+1))
    mesh.vertices.add(count);mesh.vertices.foreach_set('co',positions.ravel())
    mesh.loops.add(len(loops));mesh.loops.foreach_set('vertex_index',loops)
    mesh.polygons.add(len(faces));mesh.polygons.foreach_set('loop_start',starts);mesh.polygons.foreach_set('loop_total',totals)
    mesh.polygons.foreach_set('use_smooth',np.ones(len(faces),dtype=np.bool_))
    uv=np.stack((az/math.tau+lat/math.tau*np.cos(az),np.full(count,r)),axis=1).astype(np.float32)
    mesh.uv_layers.new(name='Original flowing corona UV');mesh.uv_layers.active.data.foreach_set('uv',uv[loops].ravel())
    attr=mesh.attributes.new('light_weight','FLOAT','POINT');attr.data.foreach_set('value',light.astype(np.float32))
    mesh.update();mesh.materials.append(mat)
    obj=bpy.data.objects.new('Closed flowing aura surface '+str(i+1),mesh);collection.objects.link(obj);obj.parent=rig
    obj['radial_layer']=float(r);obj['closed_360_degree_surface']=True
for i,strength in enumerate((2.3,.60,.20),1):
    shell=scene.objects['Fine inner emission shell '+str(i)]
    for node in shell.data.materials[0].node_tree.nodes:
        if node.type=='EMISSION':node.inputs['Strength'].default_value=strength
scene.cycles.transparent_max_bounces=max(scene.cycles.transparent_max_bounces,512)
scene['enclosed_white_aura']='Accepted curved meridian revolved fully around the vertical axis; former strips and flat fill hidden'
bpy.context.view_layer.update()
# Select one complete body surface so the editor opens on actual 3D geometry.
for obj in bpy.context.selected_objects:obj.select_set(False)
active=collection.objects[-1];active.select_set(True);bpy.context.view_layer.objects.active=active
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'file':bpy.data.filepath,'closed_surfaces':layers,'vertices_per_surface':count,'orange_reference_hidden':reference.hide_render,'new_darker_layer_created':False}
