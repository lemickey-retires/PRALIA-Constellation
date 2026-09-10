"""Build the reference-led event horizon in an isolated Blender process.

All surfaces are real geometry. Artistic lensing is represented by curved light
surfaces; the browser supplies animated, transparent emission materials.
"""
import bpy
import json
import math
import random
import hashlib
from pathlib import Path
from mathutils import Vector, noise

root = Path(__file__).resolve().parent
out = root.parent / 'site' / 'assets'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.name = 'Second Brain — Accretion and Horizon'

def coord(x, y, z):
    return (x, -z, y)

def material(name, colour, strength=1):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (*colour, 1)
    emission.inputs['Strength'].default_value = strength
    mat.node_tree.links.new(emission.outputs[0], output.inputs['Surface'])
    return mat

dark = material('Event horizon — dark core', (0, 0, 0))
gold = material('Accretion — filaments', (1, .45, .11), 4)
ice = material('Lensed light — hot white', (1, .82, .51), 6)
ground = material('Horizon terrain — midnight blue', (.013, .026, .048))

def surface(name, vertices, faces, uvs, mat, smooth=True):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([coord(*v) for v in vertices], [], faces)
    mesh.update()
    if uvs:
        layer = mesh.uv_layers.new(name='Horizon coordinates')
        for face in mesh.polygons:
            for loop_index in face.loop_indices:
                layer.data[loop_index].uv = uvs[mesh.loops[loop_index].vertex_index]
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    mesh.materials.append(mat)
    for face in mesh.polygons:
        face.use_smooth = smooth
    return obj

bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=1)
hole = bpy.context.object
hole.name = 'EventHorizon'
hole.data.materials.append(dark)
for poly in hole.data.polygons:
    poly.use_smooth = True

segments, bands = 320, 64
vertices, faces, uvs = [], [], []
for j in range(bands+1):
    t = j / bands
    radius = 1.05 + t * 3.4
    for i in range(segments+1):
        angle = i / segments * math.tau
        x, z = math.cos(angle)*radius, math.sin(angle)*radius*.45
        y = -.13 + z*.08 + .018*math.sin(angle*3+t*14)*t
        vertices.append((x,y,z));uvs.append((i/segments,t))
for j in range(bands):
    for i in range(segments):
        a=j*(segments+1)+i
        faces.append((a,a+1,a+segments+2,a+segments+1))
surface('AccretionDisk',vertices,faces,uvs,gold)

# A broad irregular upper arc models the apparent lensed disk behind the core.
vertices, faces, uvs = [], [], []
for j in range(33):
    t=j/32
    for i in range(segments+1):
        angle=i/segments*math.tau
        ripple=.0025*math.sin(angle*31)+.0012*math.sin(angle*79)
        radius=1.025+t*.55+ripple*t
        x,y=math.cos(angle)*radius,math.sin(angle)*radius
        z=.25+.15*math.sin(angle)-.24*t
        vertices.append((x,y,z));uvs.append((i/segments,t))
for j in range(32):
    for i in range(segments):
        a=j*(segments+1)+i
        faces.append((a,a+1,a+segments+2,a+segments+1))
surface('LensedCorona',vertices,faces,uvs,ice)

# Foreground light follows a shallow spatial curve across the dark core.
vertices, faces, uvs=[],[],[]
nx,ny=300,48
for j in range(ny+1):
    v=j/ny*2-1
    for i in range(nx+1):
        u=i/nx*2-1
        x=u*4.8
        y=-.04+.06*u*u+v*.08*(.8+.2*math.cos(u*2))
        y+=.005*math.sin(u*20+v*3)
        z=1.08+.34*(1-u*u)+v*.04
        vertices.append((x,y,z));uvs.append((i/nx,j/ny))
for j in range(ny):
    for i in range(nx):
        a=j*(nx+1)+i
        faces.append((a,a+1,a+nx+2,a+nx+1))
surface('LensedStream',vertices,faces,uvs,ice)

def terrain_height(x,z):
    # Relief at several scales, across a curved rather than level ground.
    ridge=noise.fractal(Vector((x*.9,z*1.1,2.7)),1.1,2.2,5)
    small=noise.noise(Vector((x*8,z*8,5.3)))
    height = -.35+.16*z-.003*x*x + ridge*.10+small*.008
    # A continuous raised shelf conceals the dark core's lower intersection
    # with the ground, including oblique views through the light stream.
    shelf = -.105 + ridge*.012 + small*.003
    coverage = math.exp(-(x/2.5)**8-((z-.75)/1.1)**8)
    return height + max(0, shelf-height)*coverage

vertices,faces,uvs=[],[],[]
nx,nz=240,168
for j in range(nz+1):
    # Carry the foreground beyond the camera, including its oblique orbit.
    z=-4.8+j/nz*9.3
    for i in range(nx+1):
        x=-12+i/nx*24
        vertices.append((x,terrain_height(x,z),z));uvs.append((i/nx,j/nz))
for j in range(nz):
    for i in range(nx):
        a=j*(nx+1)+i
        faces.append((a,a+1,a+nx+2,a+nx+1))
surface('HorizonTerrain',vertices,faces,uvs,ground)

rng=random.Random(9092026)
def joined_rocks(name,count,emissive=False):
    rocks=[]
    for i in range(count):
        x,z=rng.uniform(-6.5,6.5),rng.uniform(-2.5,1.8)
        r=rng.uniform(.003,.011) if emissive else rng.uniform(.018,.075)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1 if emissive else 2,radius=r,location=coord(x,terrain_height(x,z)+r*.42,z))
        obj=bpy.context.object
        obj.scale=(rng.uniform(.7,1.8),rng.uniform(.7,1.4),rng.uniform(.55,1.2))
        obj.data.materials.append(gold if emissive else ground)
        rocks.append(obj)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in rocks: obj.select_set(True)
    bpy.context.view_layer.objects.active=rocks[0]
    bpy.ops.object.join()
    rocks[0].name=name
joined_rocks('HorizonBoulders',74)
joined_rocks('HorizonEmbers',110,True)

scene.world.color=(.001,.002,.005)
scene['direction']='Upper lensed arc, turbulent foreground accretion, distant stars and dark sculpted horizon relief.'
scene['runtime_materials']='Animated transparent light and terrain shaders in horizon-environment.mjs.'
scene['lensing']='Artistic 3D geometry; not a general-relativistic simulation.'
bpy.ops.wm.save_as_mainfile(filepath=str(root/'event-horizon.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'event-horizon.glb'),export_format='GLB',export_yup=True)

positions=[]
for i in range(3200):
    y=rng.uniform(-1,1);angle=rng.uniform(0,math.tau)
    radius=rng.uniform(5000,12000) if i<400 else rng.uniform(17000,44000)
    xy=math.sqrt(1-y*y)
    positions.extend((radius*xy*math.cos(angle),radius*y,radius*xy*math.sin(angle)))
(out/'horizon-stars.json').write_text(json.dumps({'positions':positions}),encoding='utf8')
receipt={'blender':bpy.app.version_string,'scene':scene.name,'objects':[{'name':o.name,'vertices':len(o.data.vertices),'polygons':len(o.data.polygons)} for o in scene.objects if o.type=='MESH'],'stars':3200,'exports':['event-horizon.glb','horizon-stars.json'],'source':'event-horizon.blend','reference_use':'Original geometry based on all six owner-supplied references; none is used as a flat backdrop.'}
receipt['sha256']={name:hashlib.sha256((out/name).read_bytes()).hexdigest() for name in receipt['exports']}
(root/'blender-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf8')
print(json.dumps(receipt))
