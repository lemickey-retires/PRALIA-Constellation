"""Build and render the accepted large horizon using native Blender volumes.

The generated concept image is reference only. No Image Texture nodes are used.
Run from the preview root. Optional arguments after --: --preview or --final.
"""
import bpy
import json
import hashlib
import math
import sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

root = Path(__file__).resolve().parent
preview = root.parent
baseline = root / 'event-horizon.blend'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if '--reuse-baseline' in args:
    if Path(bpy.data.filepath).resolve()!=baseline.resolve():
        raise RuntimeError('Load the exact preserved base scene before the MCP build.')
else:
    bpy.ops.wm.open_mainfile(filepath=str(baseline))
scene = bpy.context.scene
scene.name = 'Second Brain — Native Volumetric Horizon'
for name in ['AccretionDisk','LensedCorona','LensedStream','HorizonEmbers']:
    bpy.data.objects[name].hide_render = True
    bpy.data.objects[name].hide_viewport = True

class Field:
    def __init__(self, name):
        self.mat = bpy.data.materials.new(name)
        self.mat.use_nodes = True
        self.tree = self.mat.node_tree
        self.tree.nodes.clear()
        self.nodes = self.tree.nodes
        self.links = self.tree.links
        tex = self.nodes.new('ShaderNodeNewGeometry')
        tex.label = 'True three-dimensional position'
        separate = self.nodes.new('ShaderNodeSeparateXYZ')
        self.links.new(tex.outputs['Position'],separate.inputs[0])
        self.position = tex.outputs['Position']
        self.x,self.y,self.z = separate.outputs
        self.row = 0
    def put(self, socket, value):
        if isinstance(value,(int,float)):
            socket.default_value = value
        else:
            self.links.new(value,socket)
    def op(self, operation, *values):
        node = self.nodes.new('ShaderNodeMath')
        node.operation = operation
        node.location = (-900+(self.row%8)*180,-int(self.row/8)*110)
        self.row += 1
        for index,value in enumerate(values):
            self.put(node.inputs[index],value)
        return node.outputs[0]
    def add(self,a,b): return self.op('ADD',a,b)
    def sub(self,a,b): return self.op('SUBTRACT',a,b)
    def mul(self,a,b): return self.op('MULTIPLY',a,b)
    def div(self,a,b): return self.op('DIVIDE',a,b)
    def power(self,a,b): return self.op('POWER',a,b)
    def gauss(self,v,width):
        return self.op('EXPONENT',self.mul(-1,self.power(self.div(v,width),2)))
    def clamp(self,v):
        return self.op('MINIMUM',1,self.op('MAXIMUM',0,v))
    def vector(self,x,y,z):
        node=self.nodes.new('ShaderNodeCombineXYZ')
        for socket,value in zip(node.inputs,(x,y,z)):self.put(socket,value)
        return node.outputs[0]
    def noise(self,vector,scale,detail=5,roughness=.65):
        node=self.nodes.new('ShaderNodeTexNoise')
        node.noise_dimensions='3D'
        node.inputs['Scale'].default_value=scale
        node.inputs['Detail'].default_value=detail
        node.inputs['Roughness'].default_value=roughness
        self.links.new(vector,node.inputs['Vector'])
        return node
    def texture(self,vector,scale):
        warp=self.noise(vector,2.4,3,.62)
        offset=self.nodes.new('ShaderNodeVectorMath')
        offset.operation='SUBTRACT'
        self.links.new(warp.outputs['Color'],offset.inputs[0])
        offset.inputs[1].default_value=(.5,.5,.5)
        amplitude=self.nodes.new('ShaderNodeVectorMath')
        amplitude.operation='SCALE'
        self.links.new(offset.outputs[0],amplitude.inputs[0])
        amplitude.inputs['Scale'].default_value=.31
        curled=self.nodes.new('ShaderNodeVectorMath')
        curled.operation='ADD'
        self.links.new(vector,curled.inputs[0])
        self.links.new(amplitude.outputs[0],curled.inputs[1])
        coarse=self.noise(curled.outputs[0],scale,5,.67)
        fine=self.noise(curled.outputs[0],scale*3.7,3,.58)
        mass=self.mul(self.power(self.clamp(self.mul(self.sub(coarse.outputs['Fac'],.39),3.3)),2.1),
                      self.add(.52,self.mul(fine.outputs['Fac'],.72)))
        return mass,coarse.outputs['Fac']
    def ring_texture(self,radius):
        # Anisotropic, warped native noise creates branching orbital currents.
        # Periodic angular coordinates join seamlessly without repeated stripes.
        angle=self.op('ARCTAN2',self.y,self.x)
        broad=self.noise(self.position,2.4,4,.64).outputs['Fac']
        bend=self.noise(self.position,7.5,3,.59).outputs['Fac']
        warped=self.add(radius,self.mul(self.sub(bend,.5),.052))
        theta=self.add(angle,self.mul(radius,1.3))
        flow=self.vector(self.mul(warped,17),
                         self.mul(self.op('COSINE',theta),1.35),
                         self.add(self.mul(self.op('SINE',theta),1.35),self.mul(self.z,.2)))
        folds=self.noise(flow,1,4,.66).outputs['Fac']
        fine=self.noise(flow,3.2,3,.57).outputs['Fac']
        body=self.gauss(self.sub(folds,.50),.115)
        filaments=self.gauss(self.sub(fine,.52),.034)
        filaments=self.mul(filaments,self.power(body,1.5))
        gaps=self.clamp(self.div(self.sub(broad,.29),.39))
        mass=self.mul(self.add(.012,self.add(self.mul(body,.17),self.mul(filaments,1.25))),gaps)
        hot=self.power(self.clamp(self.div(self.sub(bend,.50),.22)),2)
        heat=self.clamp(self.add(.28,self.add(self.mul(folds,.30),self.mul(self.mul(filaments,hot),.53))))
        return mass,heat,broad
    def volume(self,density,structure,heat,strength):
        output=self.nodes.new('ShaderNodeOutputMaterial')
        volume=self.nodes.new('ShaderNodeVolumePrincipled')
        volume.inputs['Density Attribute'].default_value=''
        volume.inputs['Color'].default_value=(.34,.18,.085,1)
        volume.inputs['Anisotropy'].default_value=.28
        self.links.new(density,volume.inputs['Density'])
        self.links.new(self.mul(density,strength),volume.inputs['Emission Strength'])
        colours=self.nodes.new('ShaderNodeValToRGB')
        ramp=colours.color_ramp
        ramp.elements.remove(ramp.elements[1])
        for pos,colour in [(0,(.095,.012,.002,1)),(.33,(.48,.075,.009,1)),
                           (.60,(1,.34,.045,1)),(.81,(1,.70,.25,1)),
                           (1,(1,.96,.79,1))]:
            item=ramp.elements[0] if pos==0 else ramp.elements.new(pos)
            item.position=pos;item.color=colour
        ramp.interpolation='EASE'
        self.links.new(self.clamp(self.add(self.mul(self.sub(structure,.16),1.18),self.mul(heat,.24))),colours.inputs[0])
        self.links.new(colours.outputs['Color'],volume.inputs['Emission Color'])
        self.links.new(volume.outputs['Volume'],output.inputs['Volume'])
        volume.location=(1100,100);output.location=(1370,100)
        colours.location=(820,-180)
        self.mat['construction']='Native 3D procedural density, scattering, absorption and emission. No image texture.'
        return self.mat

def box(name,centre,halfsize,material):
    bpy.ops.mesh.primitive_cube_add(size=2,location=centre)
    obj=bpy.context.view_layer.objects.active;obj.name=name;obj.scale=halfsize
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.append(material)
    obj['purpose']='Bounding region for native volume; its surfaces are not shaded.'
    return obj

# The corona follows the previous large upper arc; no complete small ring.
f=Field('Corona — native turbulent gas')
r=f.op('SQRT',f.add(f.power(f.x,2),f.power(f.z,2)))
radial=f.gauss(f.sub(r,1.13),.185)
depth=f.gauss(f.add(f.y,.26),.13)
upper=f.clamp(f.div(f.add(f.z,.045),.22))
shape=f.mul(f.mul(radial,depth),upper)
structure,detail=f.texture(f.position,12.0)
heat=f.gauss(f.sub(r,1.035),.10)
density=f.mul(f.mul(shape,structure),3.0)
box('Corona Volume',(0,-.26,.80),(1.72,.47,.92),f.volume(density,detail,heat,4.8))

# A complete horizontal annulus surrounds the existing large core.
f=Field('Accretion — native flowing gas')
r=f.op('SQRT',f.add(f.power(f.x,2),f.power(f.y,2)))
structure,detail,broad=f.ring_texture(r)
inner=f.clamp(f.div(f.sub(r,1.045),.25))
inner=f.mul(f.power(inner,2),f.sub(3,f.mul(inner,2)))
outer=f.clamp(f.div(f.sub(2.75,r),.55))
outer=f.mul(f.power(outer,2),f.sub(3,f.mul(outer,2)))
height=f.add(f.add(f.z,.14),f.mul(f.y,.035))
slab=f.gauss(height,f.add(.0028,f.mul(broad,.0035)))
shape=f.mul(f.mul(inner,outer),slab)
inward=f.gauss(f.sub(r,1.22),.62)
density=f.mul(f.mul(shape,structure),11.4)
box('Accretion Volume',(0,0,-.14),(2.80,2.80,.18),f.volume(density,detail,inward,4.6))

# A warmer inner curl follows the same ring, including the far side.
f=Field('Lensed stream — native curled gas')
r=f.op('SQRT',f.add(f.power(f.x,2),f.power(f.y,2)))
structure,detail,broad=f.ring_texture(r)
radius=f.add(1.38,f.mul(f.sub(broad,.5),.16))
height=f.add(f.add(f.z,.075),f.mul(f.y,.035))
shape=f.mul(f.gauss(f.sub(r,radius),.145),f.gauss(height,.004))
density=f.mul(f.mul(shape,structure),7.8)
box('Lensed Stream Volume',(0,0,-.075),(1.95,1.95,.12),f.volume(density,detail,.85,5.2))

# Make room beneath the complete annulus. The same native mesh is exported
# to the viewer, with rocks and embers following its displacement.
terrain_object=bpy.data.objects['HorizonTerrain']
original_ground=BVHTree.FromObject(terrain_object,bpy.context.evaluated_depsgraph_get())
def ground_displacement(x,y,old_height):
    radius=math.hypot(x,y)
    weight=max(0,min(1,(3.20-radius)/.45))
    weight=weight*weight*(3-2*weight)
    target=-.14-.035*y-.085
    lowered=old_height+min(0,target-old_height)*weight
    # Rear-facing ground must be level, with no residual ridge or slope.
    # Preserve the near surface; flatten everything beyond this short blend.
    distant=max(0,min(1,(-y-1.65)/.30))
    distant=distant*distant*(3-2*distant)
    return lowered+(-.24-lowered)*distant-old_height
for name in ['HorizonBoulders','HorizonEmbers']:
    obj=bpy.data.objects[name]
    inverse=obj.matrix_world.inverted()
    for vertex in obj.data.vertices:
        point=obj.matrix_world@vertex.co
        hit=original_ground.ray_cast(Vector((point.x,point.y,5)),Vector((0,0,-1)),12)[0]
        if hit is not None:
            point.z+=ground_displacement(point.x,point.y,hit.z)
            vertex.co=inverse@point
    obj.data.update()
for vertex in terrain_object.data.vertices:
    vertex.co.z+=ground_displacement(vertex.co.x,vertex.co.y,vertex.co.z)
terrain_object.data.update()

# Supporting terrain uses a native physically shaded stone material.
stone=bpy.data.materials.new('Terrain — quiet blue-black stone')
stone.use_nodes=True
bsdf=stone.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value=(.010,.019,.028,1)
bsdf.inputs['Roughness'].default_value=.86
tex=stone.node_tree.nodes.new('ShaderNodeTexNoise')
tex.inputs['Scale'].default_value=47
tex.inputs['Detail'].default_value=4
bump=stone.node_tree.nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value=.24
bump.inputs['Distance'].default_value=.026
stone.node_tree.links.new(tex.outputs['Fac'],bump.inputs['Height'])
stone.node_tree.links.new(bump.outputs[0],bsdf.inputs['Normal'])
fine=stone.node_tree.nodes.new('ShaderNodeTexNoise')
fine.name='Fine mineral grain'
fine.inputs['Scale'].default_value=270
fine.inputs['Detail'].default_value=2
fine.inputs['Roughness'].default_value=.61
fine_bump=stone.node_tree.nodes.new('ShaderNodeBump')
fine_bump.name='Fine stone surface relief'
fine_bump.inputs['Strength'].default_value=.22
fine_bump.inputs['Distance'].default_value=.003
stone.node_tree.links.new(fine.outputs['Fac'],fine_bump.inputs['Height'])
stone.node_tree.links.new(bump.outputs[0],fine_bump.inputs['Normal'])
stone.node_tree.links.new(fine_bump.outputs[0],bsdf.inputs['Normal'])
for name in ['HorizonTerrain','HorizonBoulders']:
    obj=bpy.data.objects[name];obj.data.materials.clear();obj.data.materials.append(stone)
ground_stone=stone.copy()
ground_stone.name='Terrain — translucent fine stone'
tree=ground_stone.node_tree
transparent=tree.nodes.new('ShaderNodeBsdfTransparent')
mix=tree.nodes.new('ShaderNodeMixShader')
mix.name='Ground opacity 58 percent'
mix.inputs[0].default_value=.58
tree.links.new(transparent.outputs[0],mix.inputs[1])
tree.links.new(tree.nodes.get('Principled BSDF').outputs[0],mix.inputs[2])
tree.links.new(mix.outputs[0],tree.nodes.get('Material Output').inputs['Surface'])
bpy.data.objects['HorizonTerrain'].data.materials.clear()
bpy.data.objects['HorizonTerrain'].data.materials.append(ground_stone)

# Native optical geometry and materials. Image generation supplies reference
# only; neither these nodes nor the gas nodes have image inputs.
def light_surface(field,density,colour,strength):
    nodes,links=field.nodes,field.links
    output=nodes.new('ShaderNodeOutputMaterial')
    transparent=nodes.new('ShaderNodeBsdfTransparent')
    emission=nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value=(*colour,1)
    emission.inputs['Strength'].default_value=strength
    mix=nodes.new('ShaderNodeMixShader')
    links.new(density,mix.inputs[0]);links.new(transparent.outputs[0],mix.inputs[1])
    links.new(emission.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],output.inputs['Surface'])
    field.mat['construction']='Native optical geometry and procedural surface emission. No image texture.'
    return field.mat

photon_spec={'enabled':False,'radius':1.018,'rings':[[.9965,.00085,1.0],[.9883,.0011,.27],[.9845,.0009,.09]],
             'colour':[1.0,.77,.43],'strength':3.4,'planeOffset':.14,'planeSlope':.035}
f=Field('Photon ring — native nested optical contours')
geometry=next(n for n in f.nodes if n.type=='NEW_GEOMETRY')
dot=f.nodes.new('ShaderNodeVectorMath');dot.operation='DOT_PRODUCT'
f.links.new(geometry.outputs['Normal'],dot.inputs[0]);f.links.new(geometry.outputs['Incoming'],dot.inputs[1])
projected=f.op('SQRT',f.op('MAXIMUM',0,f.sub(1,f.power(dot.outputs['Value'],2))))
rim=0
for centre,width,weight in photon_spec['rings']:
    rim=f.add(rim,f.mul(f.gauss(f.sub(projected,centre),width),weight))
clearance=f.clamp(f.div(f.add(f.add(f.z,.14),f.mul(f.y,.035)),.025))
rim=f.mul(f.clamp(rim),clearance)
photon_material=light_surface(f,rim,photon_spec['colour'],photon_spec['strength'])
bpy.ops.mesh.primitive_uv_sphere_add(segments=256,ring_count=128,radius=photon_spec['radius'])
photon=bpy.context.view_layer.objects.active;photon.name='PhotonSphere'
photon.hide_render=not photon_spec['enabled']
photon.data.materials.append(photon_material)
for face in photon.data.polygons:face.use_smooth=True
photon['purpose']='Disabled inner contour: preserve the dark centre without a second glowing arc.'

halo=bpy.data.objects['LensedCorona'].copy();halo.data=halo.data.copy()
halo.name='LensingHaloDetail';scene.collection.objects.link(halo)
halo.hide_render=False;halo.hide_viewport=False
f=Field('Lensing halo — native curved secondary filaments')
radius=f.op('SQRT',f.add(f.power(f.x,2),f.power(f.z,2)))
across=f.clamp(f.div(f.sub(radius,1.025),.55))
angle=f.op('ARCTAN2',f.z,f.x)
turn=f.add(angle,f.mul(across,.65))
flow=f.vector(f.mul(across,28),f.mul(f.op('COSINE',turn),1.8),f.mul(f.op('SINE',turn),1.8))
fold=f.noise(flow,1.0,4,.65).outputs['Fac']
fine=f.noise(flow,3.4,3,.6).outputs['Fac']
strand=f.gauss(f.sub(fine,.51),.035)
body=f.gauss(f.sub(fold,.48),.13)
upper=f.clamp(f.div(f.add(f.op('SINE',angle),.03),.12))
inside=f.clamp(f.div(f.sub(across,.025),.06))
outside=f.clamp(f.div(f.sub(.78,across),.28))
strength=f.op('EXPONENT',f.mul(across,-3.2))
mass=f.mul(f.mul(f.mul(inside,outside),upper),f.mul(strength,f.mul(body,f.add(.08,f.mul(strand,.92)))))
mass.node.name='Export Halo Density'
heat=f.clamp(f.add(.38,f.add(f.mul(body,.28),f.mul(strand,.22))))
heat.node.name='Export Halo Heat'
halo.data.materials.clear();halo.data.materials.append(light_surface(f,mass,(1,.50,.13),2.1))
halo['purpose']='Fine native curved light on the accepted lensing geometry; original upper aura stays intact.'
scene['optics_spec']=json.dumps({'sourceImageUsed':False,'file':'native-horizon-optics.glb',
                               'photon':photon_spec,'halo':{'strength':2.1,'flowSpeed':.018,'dimensions':[1024,1024]}})
bpy.ops.object.select_all(action='DESELECT')
photon.select_set(True);halo.select_set(True)
optical_export=preview/'site'/'assets'/'native-horizon-optics.glb'
bpy.ops.export_scene.gltf(filepath=str(optical_export),export_format='GLB',export_yup=True,
                          use_selection=True,export_materials='NONE')

bpy.ops.object.select_all(action='DESELECT')
for name in ['HorizonTerrain','HorizonBoulders','HorizonEmbers']:
    obj=bpy.data.objects[name];obj.hide_viewport=False;obj.select_set(True)
ground_export=preview/'site'/'assets'/'native-horizon-ground.glb'
bpy.ops.export_scene.gltf(filepath=str(ground_export),export_format='GLB',
                          export_yup=True,use_selection=True,export_materials='NONE')

world=bpy.data.worlds.new('Quiet deep space')
world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.002,.004,.008,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.08
scene.world=world

bpy.ops.object.camera_add(location=(.00517,-2.37173,.13348))
camera=bpy.context.view_layer.objects.active;camera.name='Original large horizon camera'
target=Vector((.00517,0,.13348))
camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.sensor_fit='VERTICAL';camera.data.sensor_height=24
camera.data.lens=24/(2*math.tan(math.radians(24)))
camera.data.clip_start=.002;camera.data.clip_end=100
scene.camera=camera

scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=32
scene.cycles.use_denoising=True
scene.cycles.adaptive_threshold=.04
scene.cycles.max_bounces=4
scene.cycles.volume_bounces=1
scene.cycles.transparent_max_bounces=8
scene.cycles.volume_biased=True
scene.cycles.volume_step_rate=.5
scene.cycles.volume_max_steps=1024
scene.render.resolution_x=1200
scene.render.resolution_y=800
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGB'
scene.render.image_settings.color_depth='16'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=-.5

group=bpy.data.node_groups.new('Native optical glow','CompositorNodeTree')
group.interface.new_socket(name='Image',in_out='OUTPUT',socket_type='NodeSocketColor')
scene.compositing_node_group=group
layers=group.nodes.new('CompositorNodeRLayers')
glare=group.nodes.new('CompositorNodeGlare')
glare.inputs['Type'].default_value='Fog Glow'
glare.inputs['Quality'].default_value='High'
glare.inputs['Threshold'].default_value=1.2
glare.inputs['Strength'].default_value=.20
glare.inputs['Size'].default_value=.30
out=group.nodes.new('NodeGroupOutput')
group.links.new(layers.outputs['Image'],glare.inputs['Image'])
group.links.new(glare.outputs['Image'],out.inputs['Image'])
scene.render.use_compositing=True

scene['source_image_role']='Visual reference only. No raster drives material colour, density, opacity or displacement.'
scene['composition']='Original large core and upper arc with a detailed horizontal annulus and inner curl. Original camera relationship retained.'
scene['lensing']='Artistic native volume placement; not a relativistic light-path simulation.'
scene['build_script']='create-native-horizon.py'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if '--final' in args:
    scene.cycles.samples=64
    scene.cycles.adaptive_threshold=.015
    scene.render.resolution_x=1920
    scene.render.resolution_y=1280
    scene.cycles.volume_step_rate=.25

scene.render.filepath=str(root/('native-photon-halo-final.png' if '--final' in args else 'native-photon-halo-preview.png'))
bpy.ops.wm.save_as_mainfile(filepath=str(root/'native-horizon.blend'))
materials=[m for m in bpy.data.materials if m.get('construction')]
receipt={'blender':bpy.app.version_string,'renderer':scene.render.engine,
         'device':scene.cycles.device,'samples':scene.cycles.samples,
         'resolution':[scene.render.resolution_x,scene.render.resolution_y],
         'sourceImageUsedAsTexture':False,
         'volumeMaterials':[{'name':m.name,'nodes':len(m.node_tree.nodes),'imageNodes':sum(n.type=='TEX_IMAGE' for n in m.node_tree.nodes)} for m in materials],
         'source':'native-horizon.blend','render':Path(scene.render.filepath).name,
         'terrainExport':'site/assets/native-horizon-ground.glb',
         'terrainSha256':hashlib.sha256(ground_export.read_bytes()).hexdigest(),
         'opticalExport':'site/assets/native-horizon-optics.glb',
         'opticalSha256':hashlib.sha256(optical_export.read_bytes()).hexdigest(),
         'optics':json.loads(scene['optics_spec']),
         'composition':'Large horizon preserved; extended horizontal annulus and inner curl, nested photon contours and secondary halo filaments, native procedural materials.'}
(root/'native-horizon-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf8')
print('NATIVE_SCENE_READY '+json.dumps(receipt),flush=True)
if '--build-only' not in args:
    bpy.ops.render.render(write_still=True)
    print('NATIVE_RENDER_COMPLETE '+scene.render.filepath,flush=True)
