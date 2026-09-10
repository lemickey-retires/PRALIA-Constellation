"""Extend the accepted Blender horizon with ring-lit haze and sparse space depth.

Run through Blender MCP after loading native-horizon.blend. Reuses the native
Field/box construction helpers; preserves all accepted ring and terrain assets.
The terrain remains available as the optional Planetary surface environment.
"""
import ast
import bpy
import hashlib
import json
import math
import random
from pathlib import Path

root=Path(__file__).resolve().parent
preview=root.parent
if Path(bpy.data.filepath).resolve()!=(root/'native-horizon.blend').resolve():
    raise RuntimeError('Load the existing native horizon before this extension.')
scene=bpy.context.scene
# Reuse the canonical node construction helpers without rebuilding other assets.
tree=ast.parse((root/'create-native-horizon.py').read_text(encoding='utf-8-sig'))
helpers=ast.Module(body=[n for n in tree.body if isinstance(n,(ast.ClassDef,ast.FunctionDef)) and n.name in ('Field','box')],type_ignores=[])
exec(compile(helpers,'create-native-horizon.py','exec'),globals())

for name in ('Ring Haze Volume','Horizon Space Particles'):
    previous=bpy.data.objects.get(name)
    if previous:
        old_mesh=previous.data
        old_materials=list(old_mesh.materials)
        bpy.data.objects.remove(previous,do_unlink=True)
        if old_mesh.users==0:bpy.data.meshes.remove(old_mesh)
        for old_material in old_materials:
            if old_material.users==0:bpy.data.materials.remove(old_material)

# A porous, three-dimensional atmosphere follows the annulus. It has no surface.
f=Field('Ring haze — native fine orbital wisps')
radius=f.op('SQRT',f.add(f.power(f.x,2),f.power(f.y,2)))
angle=f.op('ARCTAN2',f.y,f.x)
broad=f.noise(f.position,2.7,4,.66).outputs['Fac']
curl=f.noise(f.position,8.2,4,.62).outputs['Fac']
height=f.add(f.add(f.z,.115),f.mul(f.y,.035))
warped_height=f.sub(height,f.mul(f.sub(curl,.5),.040))
radial=f.mul(f.clamp(f.div(f.sub(radius,1.075),.27)),f.clamp(f.div(f.sub(3.12,radius),.82)))
radial=f.mul(radial,f.gauss(f.sub(radius,1.95),.95))
layer=f.gauss(warped_height,f.add(.017,f.mul(broad,.025)))
flow=f.vector(f.mul(radius,9.5),f.mul(f.op('COSINE',angle),2.5),
              f.add(f.mul(f.op('SINE',angle),2.5),f.mul(height,16)))
fold=f.noise(flow,1,5,.64).outputs['Fac']
fine=f.noise(flow,3.4,3,.59).outputs['Fac']
wisps=f.gauss(f.sub(fine,.51),.073)
gaps=f.power(f.clamp(f.div(f.sub(broad,.37),.38)),1.7)
body=f.mul(f.gauss(f.sub(fold,.5),.14),f.add(.11,f.mul(wisps,.89)))
density=f.mul(.95,f.mul(radial,f.mul(layer,f.mul(gaps,body))))
heat=f.gauss(f.sub(radius,1.40),.8)
material=f.volume(density,f.add(.24,f.mul(fold,.38)),heat,2.0)
volume=box('Ring Haze Volume',(0,0,-.115),(3.16,3.16,.27),material)
volume['purpose']='Sparse native orbital haze above and below the existing ring; no rocky plane.'
volume['export_spec']=json.dumps({'id':'haze','dimensions':[768,512,48],
    'planeOffset':.115,'planeSlope':.035,'halfHeight':.13,
    'emissionStrength':2.0,'groundClip':False})

# Small native octahedra are editable/renderable in Blender. The same positions,
# colours and relative sizes become efficient point sprites in the live viewer.
rng=random.Random(10910)
positions=[];colours=[];sizes=[];families=[]
for index in range(1650):
    dust=index<480
    if dust:
        theta=rng.uniform(0,math.tau)
        radius=rng.uniform(1.18,3.12)
        x=radius*math.cos(theta);y=radius*math.sin(theta)
        z=-.115-.035*y+rng.gauss(0,.038)
        colour=(1.0,.63+rng.random()*.20,.32+rng.random()*.18)
        size=rng.uniform(.65,1.15)
    else:
        theta=rng.uniform(0,math.tau)
        elevation=rng.uniform(-1,1)
        radius=rng.uniform(3.6,10.5)
        circle=math.sqrt(1-elevation*elevation)
        x=radius*circle*math.cos(theta);y=radius*circle*math.sin(theta);z=radius*elevation
        tint=rng.random()
        colour=(.59+.25*tint,.72+.18*tint,1.)
        size=rng.uniform(.65,1.5)
    positions.extend((x,z,-y)) # Blender to glTF/live axis convention.
    colours.extend(colour);sizes.append(size);families.append(0 if dust else 1)
vertices=[];faces=[]
octa=[(1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1)]
triangles=[(0,2,4),(2,1,4),(1,3,4),(3,0,4),(2,0,5),(1,2,5),(3,1,5),(0,3,5)]
for i,size in enumerate(sizes):
    x,z,ny=positions[i*3:i*3+3];y=-ny
    radius=.0011*size if families[i]==0 else .0020*size
    start=len(vertices)
    vertices.extend((x+a*radius,y+b*radius,z+c*radius) for a,b,c in octa)
    faces.extend(tuple(start+j for j in face) for face in triangles)
mesh=bpy.data.meshes.new('Native sparse dust and deep stars')
mesh.from_pydata(vertices,[],faces);mesh.update()
stars=bpy.data.objects.new('Horizon Space Particles',mesh);scene.collection.objects.link(stars)
for name,colour,strength in [('Ring-lit dust',(1,.70,.39,1),1.7),('Deep cool stars',(.69,.82,1,1),2.2)]:
    mat=bpy.data.materials.new(name);mat.use_nodes=True
    mat.node_tree.nodes.clear()
    emission=mat.node_tree.nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value=colour;emission.inputs['Strength'].default_value=strength
    output=mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emission.outputs[0],output.inputs['Surface'])
    mesh.materials.append(mat)
for polygon in mesh.polygons:polygon.material_index=families[polygon.index//8]
stars['purpose']='480 ring-lit dust points and 1170 sparse depth stars; native positions drive the live viewer.'
for name in ('HorizonTerrain','HorizonBoulders','HorizonEmbers'):
    obj=bpy.data.objects[name];obj.hide_render=True;obj.hide_set(True)
    obj['environment']='Planetary surface only; preserved optional variant.'
scene['environment']='Event horizon — open space, ring haze and sparse stars'
scene['space_extension_script']='create-space-haze.py'
scene['composition']='Accepted large horizon, photon sphere and flowing annulus; porous native haze and sparse depth stars replace the ground in the space environment.'
asset=preview/'site/assets/native-space-particles.json'
asset.write_text(json.dumps({'generator':'Blender MCP native mesh positions','sourceImageUsed':False,
    'positions':positions,'colours':colours,'sizes':sizes,'families':families},separators=(',',':')),encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(root/'native-horizon.blend'))
receipt={'blender':bpy.app.version_string,'transport':'Blender MCP','source':'native-horizon.blend',
    'sourceSha256':hashlib.sha256((root/'native-horizon.blend').read_bytes()).hexdigest(),
    'sourceImageUsed':False,'hazeMaterial':material.name,'materialNodes':len(material.node_tree.nodes),
    'imageTextureNodes':sum(n.type=='TEX_IMAGE' for n in material.node_tree.nodes),
    'volume':json.loads(volume['export_spec']),'particles':{'dust':480,'stars':1170,
    'nativeVertices':len(vertices),'file':asset.name,'sha256':hashlib.sha256(asset.read_bytes()).hexdigest()},
    'terrain':'Preserved and hidden in native space scene; selectable as Planetary surface in browser.',
    'preserved':'Existing ring, stream, halo, core, photon sphere and original camera.'}
(root/'space-haze-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf8')
print(json.dumps(receipt),flush=True)
