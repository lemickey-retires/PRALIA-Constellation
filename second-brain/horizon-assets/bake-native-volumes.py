"""Bake Blender's native procedural density fields for the live 3D viewer.

Cycles evaluates the original shader nodes on a volume-slice atlas. The atlas is
converted into a 3D array: R=density/16, G=the native colour-ramp factor. It is not
a picture wrapped around geometry. No generated concept image is loaded.
"""
import bpy
import gzip
import hashlib
import json
import math
import sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import numpy as np

root=Path(__file__).resolve().parent
if '--reuse-scene' not in sys.argv:
    bpy.ops.wm.open_mainfile(filepath=str(root/'native-horizon.blend'))
elif Path(bpy.data.filepath).resolve()!=(root/'native-horizon.blend').resolve():
    raise RuntimeError('Load the native scene before the MCP bake.')
source_scene=bpy.context.scene
space_haze='--space-haze' in sys.argv
ground_tree=None if space_haze else BVHTree.FromObject(bpy.data.objects['HorizonTerrain'],bpy.context.evaluated_depsgraph_get())
out=root.parent/'site'/'assets'
bakes=root/'native-volume-bakes'
bakes.mkdir(exist_ok=True)
specs=[
    ('disk','Accretion Volume',(2048,768,24),4.6,.14,.035,.020),
    ('stream','Lensed Stream Volume',(768,768,24),5.2,.075,.035,.016),
]
if space_haze:
    specs=[('haze','Ring Haze Volume',(768,512,48),2.0,.115,.035,.13)]
density_scale=2 if space_haze else 16
manifest={'generator':'Blender Cycles evaluation of native procedural volume nodes',
          'blender':bpy.app.version_string,'source':'horizon-assets/native-horizon.blend',
          'sourceImageUsed':False,'channels':['density / '+str(density_scale),'native colour-ramp factor'],
          'sampling':'cylindrical 3D interpolation: radius, wrapped angle, plane height','volumes':[]}

for key,obj_name,dims,strength,plane_offset,plane_slope,half_height in specs:
    original=bpy.data.objects[obj_name]
    corners=[original.matrix_world@Vector(c) for c in original.bound_box]
    lower=[min(p[i] for p in corners) for i in range(3)]
    upper=[max(p[i] for p in corners) for i in range(3)]
    # Radius, angle and height devote resolution to the visible filaments.
    # Cycles still evaluates the original nodes at true native XYZ positions.
    field_lower=[1.0 if key=='disk' else .90,0,-half_height]
    field_upper=[upper[0],math.tau,half_height]
    material=original.data.materials[0].copy()
    material.name=key+' native density evaluation'
    nodes=material.node_tree.nodes;links=material.node_tree.links
    geometry=next(n for n in nodes if n.type=='NEW_GEOMETRY')
    attribute=nodes.new('ShaderNodeAttribute');attribute.attribute_name='volume_position'
    params=nodes.new('ShaderNodeSeparateXYZ');links.new(attribute.outputs['Vector'],params.inputs[0])
    def operation(kind,a,b=None):
        node=nodes.new('ShaderNodeMath');node.operation=kind
        for socket,value in zip(node.inputs,(a,b)):
            if value is None:continue
            if isinstance(value,(float,int)):socket.default_value=value
            else:links.new(value,socket)
        return node.outputs[0]
    px=operation('MULTIPLY',params.outputs['X'],operation('COSINE',params.outputs['Y']))
    py=operation('MULTIPLY',params.outputs['X'],operation('SINE',params.outputs['Y']))
    pz=operation('SUBTRACT',operation('SUBTRACT',params.outputs['Z'],plane_offset),operation('MULTIPLY',py,plane_slope))
    native_position=nodes.new('ShaderNodeCombineXYZ')
    for socket,value in zip(native_position.inputs,(px,py,pz)):links.new(value,socket)
    for link in list(geometry.outputs['Position'].links):
        links.new(native_position.outputs[0],link.to_socket)
    volume=next(n for n in nodes if n.type=='PRINCIPLED_VOLUME')
    density=volume.inputs['Density'].links[0].from_socket
    ramp=next(n for n in nodes if n.type=='VALTORGB')
    factor=ramp.inputs[0].links[0].from_socket
    norm=nodes.new('ShaderNodeMath');norm.operation='MULTIPLY'
    norm.inputs[1].default_value=1/density_scale;links.new(density,norm.inputs[0])
    channels=nodes.new('ShaderNodeCombineXYZ')
    links.new(norm.outputs[0],channels.inputs[0]);links.new(factor,channels.inputs[1])
    emission=nodes.new('ShaderNodeEmission')
    links.new(channels.outputs[0],emission.inputs['Color'])
    output=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
    for socket in output.inputs:
        for link in list(socket.links):links.remove(link)
    links.new(emission.outputs[0],output.inputs['Surface'])

    nx,ny,nz=dims
    columns=8
    rows=math.ceil(nz/columns)
    width,height=nx*columns,ny*rows
    vertices=[];faces=[];sample_coords=[]
    for iz in range(nz):
        x0=(iz%columns)*nx;y0=(iz//columns)*ny
        base=len(vertices)
        vertices.extend([(x0,y0,0),(x0+nx,y0,0),(x0+nx,y0+ny,0),(x0,y0+ny,0)])
        faces.append((base,base+1,base+2,base+3))
        layer_height=-half_height+(iz+.5)/nz*half_height*2
        sample_coords.extend([(field_lower[0],0,layer_height),(field_upper[0],0,layer_height),
                              (field_upper[0],math.tau,layer_height),(field_lower[0],math.tau,layer_height)])
    mesh=bpy.data.meshes.new(key+' sampling atlas')
    mesh.from_pydata(vertices,[],faces);mesh.update()
    attribute=mesh.attributes.new('volume_position','FLOAT_VECTOR','POINT')
    for target,value in zip(attribute.data,sample_coords):target.vector=value
    scene=bpy.data.scenes.new(key+' shader evaluation')
    bpy.context.window.scene=scene
    plane=bpy.data.objects.new(key+' sample positions',mesh)
    scene.collection.objects.link(plane);mesh.materials.append(material)
    camera_data=bpy.data.cameras.new(key+' evaluation camera')
    camera=bpy.data.objects.new(key+' evaluation camera',camera_data)
    scene.collection.objects.link(camera);scene.camera=camera
    camera.location=(width/2,height/2,100)
    camera.data.type='ORTHO';camera.data.ortho_scale=width
    camera.data.sensor_fit='HORIZONTAL';camera.data.clip_end=200
    scene.render.engine='CYCLES'
    scene.cycles.device='CPU';scene.cycles.samples=1
    scene.cycles.use_denoising=False
    scene.cycles.use_adaptive_sampling=False
    scene.cycles.max_bounces=0
    scene.render.resolution_x=width;scene.render.resolution_y=height
    scene.render.resolution_percentage=100
    scene.render.filter_size=.01
    scene.render.film_transparent=False
    scene.render.use_compositing=False
    scene.view_settings.view_transform='Raw'
    scene.view_settings.look='None'
    scene.view_settings.exposure=0
    scene.render.image_settings.file_format='OPEN_EXR'
    scene.render.image_settings.color_mode='RGB'
    scene.render.image_settings.color_depth='32'
    scene.render.image_settings.exr_codec='ZIP'
    atlas_path=bakes/(key+'-field.exr')
    scene.render.filepath=str(atlas_path)
    print('BAKING_NATIVE_FIELD '+key+' '+str(dims),flush=True)
    bpy.ops.render.render(write_still=True)
    atlas=bpy.data.images.load(str(atlas_path),check_existing=False)
    pixels=np.empty(width*height*4,dtype=np.float32)
    atlas.pixels.foreach_get(pixels)
    pixels=pixels.reshape((height,width,4))
    field=np.empty((nz,ny,nx,2),dtype=np.uint8)
    # Native terrain clips the Blender render. Feather that same boundary into
    # the exported density so a live volume never exposes a sliced lower edge.
    terrain_height=np.full((ny,nx),-10,dtype=np.float32)
    radii=field_lower[0]+(np.arange(nx)+.5)/nx*(field_upper[0]-field_lower[0])
    angles=(np.arange(ny)+.5)/ny*math.tau
    native_y=np.sin(angles)[:,None]*radii[None,:]
    native_x=np.cos(angles)[:,None]*radii[None,:]
    if ground_tree is not None:
        for iy in range(ny):
            for ix in range(nx):
                hit=ground_tree.ray_cast(Vector((native_x[iy,ix],native_y[iy,ix],5)),Vector((0,0,-1)),12)[0]
                terrain_height[iy,ix]=hit.z if hit is not None else -10
    for iz in range(nz):
        x0=(iz%columns)*nx;y0=(iz//columns)*ny
        sample=pixels[y0:y0+ny,x0:x0+nx,:2].copy()
        layer_height=-half_height+(iz+.5)/nz*half_height*2
        z=layer_height-plane_offset-plane_slope*native_y
        fade=np.clip((z-terrain_height+.006)/.105,0,1)
        fade=fade*fade*(3-2*fade)
        sample[:,:,0]*=fade
        field[iz]=np.rint(np.clip(sample,0,1)*255).astype(np.uint8)
        field[iz,:,:,1][field[iz,:,:,0]==0]=0
    nonzero=int(np.count_nonzero(field[:,:,:,0]))
    if nonzero<100:raise RuntimeError(key+' field is unexpectedly empty')
    # Include one cell beyond nonzero centres for trilinear interpolation.
    ri=np.flatnonzero(np.any(field[:,:,:,0],axis=(0,1)))
    zi=np.flatnonzero(np.any(field[:,:,:,0],axis=(1,2)))
    def support(indices,axis,count):
        lo,hi=field_lower[axis],field_upper[axis];step=(hi-lo)/count
        return [max(lo,lo+(int(indices[0])-.5)*step),min(hi,lo+(int(indices[-1])+1.5)*step)]
    active_support={'radius':support(ri,0,nx),'height':support(zi,2,nz)}
    raw=field.tobytes()
    filename='native-'+key+'-volume.bin.gz'
    target=out/filename
    target.write_bytes(gzip.compress(raw,compresslevel=6,mtime=0))
    item={'id':key,'file':filename,'dimensions':dims,'boundsMin':lower,'boundsMax':upper,
          'fieldBoundsMin':field_lower,'fieldBoundsMax':field_upper,
          'coordinateSpace':'cylindrical: radius, angle, height above tilted plane',
          'planeOffset':plane_offset,'planeSlope':plane_slope,'halfHeight':half_height,
          'densityScale':density_scale,'emissionStrength':strength,'bytes':len(raw),
          'support':active_support,
          'compressedBytes':target.stat().st_size,'nonzeroDensityCells':nonzero,
          'groundClearance':'No ground clipping: open space' if space_haze else 'Native Blender terrain ray-cast; smooth 0.105-unit density fade',
          'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
    manifest['volumes'].append(item)
    print('BAKED_NATIVE_FIELD '+json.dumps(item),flush=True)
    bpy.data.images.remove(atlas)
    del pixels,field,raw
manifest_name='native-space-volumes.json' if space_haze else 'native-volumes.json'
receipt_name='space-haze-bake-receipt.json' if space_haze else 'native-volume-bake-receipt.json'
(out/manifest_name).write_text(json.dumps(manifest,indent=2),encoding='utf8')
(root/receipt_name).write_text(json.dumps(manifest,indent=2),encoding='utf8')
bpy.context.window.scene=source_scene
print('NATIVE_VOLUME_BAKE_COMPLETE',flush=True)
