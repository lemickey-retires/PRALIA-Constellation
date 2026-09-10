"""Evaluate native halo nodes into numeric emission fields; no reference pixels."""
import bpy
import gzip
import hashlib
import json
import math
import sys
from pathlib import Path
import numpy as np

root=Path(__file__).resolve().parent
if '--reuse-scene' not in sys.argv:
    bpy.ops.wm.open_mainfile(filepath=str(root/'native-horizon.blend'))
elif Path(bpy.data.filepath).resolve()!=(root/'native-horizon.blend').resolve():
    raise RuntimeError('Load the native scene before the MCP optics bake.')
source=bpy.context.scene
spec=json.loads(source['optics_spec'])
width,height=spec['halo']['dimensions']
mat=bpy.data.objects['LensingHaloDetail'].data.materials[0].copy()
nodes,links=mat.node_tree.nodes,mat.node_tree.links
attribute=nodes.new('ShaderNodeAttribute');attribute.attribute_name='optical_coordinates'
params=nodes.new('ShaderNodeSeparateXYZ');links.new(attribute.outputs['Vector'],params.inputs[0])
def op(kind,a,b=None):
    n=nodes.new('ShaderNodeMath');n.operation=kind
    for socket,value in zip(n.inputs,(a,b)):
        if value is None:continue
        if isinstance(value,(float,int)):socket.default_value=value
        else:links.new(value,socket)
    return n.outputs[0]
angle=op('MULTIPLY',params.outputs[0],math.tau)
t=params.outputs[1]
ripple=op('ADD',op('MULTIPLY',op('SINE',op('MULTIPLY',angle,31)),.0025),
                     op('MULTIPLY',op('SINE',op('MULTIPLY',angle,79)),.0012))
radius=op('ADD',1.025,op('MULTIPLY',t,op('ADD',.55,ripple)))
x=op('MULTIPLY',op('COSINE',angle),radius)
y=op('SUBTRACT',op('MULTIPLY',t,.24),op('ADD',.25,op('MULTIPLY',op('SINE',angle),.15)))
z=op('MULTIPLY',op('SINE',angle),radius)
position=nodes.new('ShaderNodeCombineXYZ')
for socket,value in zip(position.inputs,(x,y,z)):links.new(value,socket)
geometry=next(n for n in nodes if n.type=='NEW_GEOMETRY')
for link in list(geometry.outputs['Position'].links):links.new(position.outputs[0],link.to_socket)
channels=nodes.new('ShaderNodeCombineXYZ')
links.new(nodes['Export Halo Density'].outputs[0],channels.inputs[0])
links.new(nodes['Export Halo Heat'].outputs[0],channels.inputs[1])
emission=nodes.new('ShaderNodeEmission');links.new(channels.outputs[0],emission.inputs['Color'])
output=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
for link in list(output.inputs['Surface'].links):links.remove(link)
links.new(emission.outputs[0],output.inputs['Surface'])
mesh=bpy.data.meshes.new('Native optical evaluation plane')
mesh.from_pydata([(0,0,0),(width,0,0),(width,height,0),(0,height,0)],[],[(0,1,2,3)])
attribute=mesh.attributes.new('optical_coordinates','FLOAT_VECTOR','POINT')
for item,value in zip(attribute.data,[(0,0,0),(1,0,0),(1,1,0),(0,1,0)]):item.vector=value
scene=bpy.data.scenes.new('Native halo evaluation')
plane=bpy.data.objects.new('Native halo samples',mesh);scene.collection.objects.link(plane);mesh.materials.append(mat)
camera=bpy.data.objects.new('Native halo sampling camera',bpy.data.cameras.new('Native halo sampling camera'))
scene.collection.objects.link(camera);scene.camera=camera
camera.location=(width/2,height/2,100);camera.data.type='ORTHO';camera.data.ortho_scale=width
camera.data.sensor_fit='HORIZONTAL';camera.data.clip_end=200
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=1
scene.cycles.use_denoising=False;scene.cycles.use_adaptive_sampling=False;scene.cycles.max_bounces=0
scene.render.resolution_x=width;scene.render.resolution_y=height;scene.render.resolution_percentage=100
scene.render.filter_size=.01;scene.render.use_compositing=False
scene.view_settings.view_transform='Raw';scene.view_settings.look='None'
scene.render.image_settings.file_format='OPEN_EXR';scene.render.image_settings.color_mode='RGB'
scene.render.image_settings.color_depth='32';scene.render.image_settings.exr_codec='ZIP'
path=root/'native-volume-bakes'/'halo-field.exr';scene.render.filepath=str(path)
bpy.context.window.scene=scene;bpy.ops.render.render(write_still=True)
image=bpy.data.images.load(str(path),check_existing=False)
values=np.empty(width*height*4,dtype=np.float32);image.pixels.foreach_get(values)
field=np.rint(np.clip(values.reshape(height,width,4)[:,:,:2],0,1)*255).astype(np.uint8)
data=gzip.compress(field.tobytes(),compresslevel=6,mtime=0)
out=root.parent/'site'/'assets';field_path=out/'native-halo-field.bin.gz';field_path.write_bytes(data)
spec['halo'].update({'file':field_path.name,'bytes':field.nbytes,'compressedBytes':len(data),
                    'sha256':hashlib.sha256(data).hexdigest(),'channels':['native emission density','native colour factor']})
spec['generator']='Blender Cycles evaluation of native halo material and native photon sphere geometry'
spec['source']='horizon-assets/native-horizon.blend'
(out/'native-optics.json').write_text(json.dumps(spec,indent=2),encoding='utf8')
(root/'native-optics-bake-receipt.json').write_text(json.dumps(spec,indent=2),encoding='utf8')
bpy.data.images.remove(image);bpy.context.window.scene=source
print('NATIVE_OPTICS_BAKE_COMPLETE '+json.dumps(spec),flush=True)
