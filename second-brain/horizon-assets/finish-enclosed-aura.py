"""Use the unchanged baked field coherently through the closed light body.

Matches the runtime optical texture sampling. Geometry does not face or move
with the camera. Fine light structure has view-dependent optical sampling.
"""
import bpy, gzip, json, math
import numpy as np
from pathlib import Path
root=Path(__file__).resolve().parent;scene=bpy.context.scene
assert scene.get('enclosed_white_aura')
spec=json.loads((root.parent/'site/assets/continuous-optics.json').read_text())
w,h=spec['halo']['dimensions']
raw=np.frombuffer(gzip.decompress((root.parent/'site/assets'/spec['halo']['file']).read_bytes()),dtype=np.uint8).reshape(h,w,2)
pixels=np.ones((h,w,4),np.float32);pixels[:,:,:2]=raw.astype(np.float32)/255;pixels[:,:,2]=0
image=bpy.data.images.get('Original baked corona field — exact RG bytes') or bpy.data.images.new('Original baked corona field — exact RG bytes',width=w,height=h,float_buffer=True)
image.colorspace_settings.name='Non-Color';image.pixels.foreach_set(pixels.ravel());image.pack()
mat=bpy.data.materials.new('Layered ivory gold peach copper rose and blue aura');mat.use_nodes=True
n,l=mat.node_tree.nodes,mat.node_tree.links
def link(value,socket):
    if hasattr(value,'node'):l.new(value,socket)
    else:socket.default_value=value
def m(op,*args):
    node=n.new('ShaderNodeMath');node.operation=op
    for socket,arg in zip(node.inputs,args):link(arg,socket)
    return node.outputs[0]
def vec(op,*args):
    node=n.new('ShaderNodeVectorMath');node.operation=op
    # SCALE uses the dedicated scalar input, rather than its unused vector.
    sockets=[node.inputs[0],node.inputs['Scale']] if op=='SCALE' else list(node.inputs)
    for socket,arg in zip(sockets,args):link(arg,socket)
    return node.outputs['Value' if op in ('LENGTH','DOT_PRODUCT') else 'Vector']
def split(value):
    node=n.new('ShaderNodeSeparateXYZ');link(value,node.inputs[0]);return tuple(node.outputs)
def xyz(x,y,z=0):
    node=n.new('ShaderNodeCombineXYZ')
    for s,a in zip(node.inputs,(x,y,z)):link(a,s)
    return node.outputs[0]
def smooth(value,start,end):
    node=n.new('ShaderNodeMapRange');node.interpolation_type='SMOOTHSTEP';node.clamp=True
    for name,a in [('Value',value),('From Min',start),('From Max',end)]:link(a,node.inputs[name])
    return node.outputs[0]
def mix(a,b,t):return m('ADD',m('MULTIPLY',a,m('SUBTRACT',1,t)),m('MULTIPLY',b,t))
def transform(value,kind):
    node=n.new('ShaderNodeVectorTransform');node.vector_type=kind;node.convert_from='WORLD';node.convert_to='OBJECT';link(value,node.inputs[0]);return node.outputs[0]
g=n.new('ShaderNodeNewGeometry');p=transform(g.outputs['Position'],'POINT');incoming=vec('NORMALIZE',transform(g.outputs['Incoming'],'VECTOR'))
closest=vec('SUBTRACT',p,vec('SCALE',incoming,vec('DOT_PRODUCT',p,incoming)))
cx,cy,cz=split(closest);distance=vec('LENGTH',closest);_,_,iz=split(incoming)
use_y=m('GREATER_THAN',m('ABSOLUTE',iz),.98)
pole=xyz(0,use_y,m('SUBTRACT',1,use_y))
right=vec('NORMALIZE',vec('CROSS_PRODUCT',pole,incoming));up=vec('CROSS_PRODUCT',incoming,right)
fu=m('DIVIDE',m('ARCTAN2',vec('DOT_PRODUCT',closest,up),vec('DOT_PRODUCT',closest,right)),math.tau)
rho=m('SQRT',m('ADD',m('MULTIPLY',cx,cx),m('MULTIPLY',cy,cy)))
latitude=m('ARCTAN2',cz,rho);shoulder=m('POWER',m('MAXIMUM',0,m('COSINE',latitude)),7)
vertical=mix(spec['halo']['verticalSpread'],1,m('POWER',m('COSINE',latitude),2))
def extent(r):return m('ADD',m('ADD',spec['halo']['innerRadius'],m('MULTIPLY',m('MULTIPLY',spec['halo']['radialSpan'],r),vertical)),m('MULTIPLY',m('MULTIPLY',spec['halo']['sideSpan'],shoulder),smooth(r,0,.30)))
lo,hi=0,1
for _ in range(7):
    mid=m('MULTIPLY',m('ADD',lo,hi),.5);less=m('LESS_THAN',extent(mid),distance)
    lo=mix(lo,mid,less);hi=mix(mid,hi,less)
el,eh=extent(lo),extent(hi)
fraction=m('MINIMUM',1,m('MAXIMUM',0,m('DIVIDE',m('SUBTRACT',distance,el),m('MAXIMUM',.00001,m('SUBTRACT',eh,el)))))
fr=mix(lo,hi,fraction)
uv=n.new('ShaderNodeTexCoord');u,r,_=split(uv.outputs['UV'])
def sample(coords):
    tex=n.new('ShaderNodeTexImage');tex.image=image;tex.interpolation='Linear';tex.extension='REPEAT';link(coords,tex.inputs['Vector'])
    return split(tex.outputs['Color'])[:2]
a,b=sample(xyz(fu,fr));c,d=sample(uv.outputs['UV']);density,heat_field=mix(c,a,.45),mix(d,b,.45)
def gauss(centre,width,strength):
    q=m('DIVIDE',m('SUBTRACT',r,centre),width)
    return m('MULTIPLY',strength,m('EXPONENT',m('MULTIPLY',-1,m('MULTIPLY',q,q))))
body=m('ADD',m('ADD',gauss(.07,.035,.48),gauss(.17,.070,.32)),m('ADD',gauss(.32,.10,.15),gauss(.50,.18,.04)))
soft=m('MULTIPLY',.30,m('EXPONENT',m('MULTIPLY',r,-5.5)))
taper=m('MULTIPLY',smooth(r,0,.004),m('SUBTRACT',1,smooth(r,.70,1)))
heat=m('MINIMUM',1,m('MAXIMUM',0,m('ADD',m('SUBTRACT',.94,m('MULTIPLY',fr,.80)),m('MULTIPLY',m('SUBTRACT',heat_field,.5),.12))))
def linear(hex_value):
    values=[int(hex_value[i:i+2],16)/255 for i in (1,3,5)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values)
def colourmix(a,b,t):
    node=n.new('ShaderNodeMixRGB');node.blend_type='MIX'
    link(t,node.inputs[0]);link(a,node.inputs[1]);link(b,node.inputs[2]);return node.outputs[0]
def rgba(value):return (*linear(value),1)
direction=spec['colourDirection'];stops=direction['radialStops'];colour=rgba(stops[0]['colour'])
for prior,stop in zip(stops,stops[1:]):colour=colourmix(colour,rgba(stop['colour']),smooth(fr,prior['at'],stop['at']))
px,py,pz=split(p);angle=m('ARCTAN2',m('MULTIPLY',py,-1),px)
def sector(centre,width):
    delta=m('SUBTRACT',angle,centre);wrapped=m('ARCTAN2',m('SINE',delta),m('COSINE',delta))
    return m('EXPONENT',m('MULTIPLY',-1,m('POWER',m('DIVIDE',wrapped,width),2)))
def radial_gauss(centre,width):return m('EXPONENT',m('MULTIPLY',-1,m('POWER',m('DIVIDE',m('SUBTRACT',fr,centre),width),2)))
gold=m('MULTIPLY',sector(.15,.60),m('MULTIPLY',smooth(fr,.025,.065),m('SUBTRACT',1,smooth(fr,.18,.30))))
rose=m('MULTIPLY',sector(-1.20,.72),smooth(fr,.06,.20))
blue=m('MULTIPLY',sector(2.22,.25),radial_gauss(.10,.075));cyan=m('MULTIPLY',sector(2.72,.19),radial_gauss(.17,.08))
colour=colourmix(colour,rgba(direction['gold']),m('MULTIPLY',gold,.42))
colour=colourmix(colour,rgba(direction['rose']),m('MULTIPLY',rose,.62))
colour=colourmix(colour,rgba(direction['blue']),m('MINIMUM',.94,m('MULTIPLY',blue,m('ADD',.70,m('MULTIPLY',density,.8)))))
colour=colourmix(colour,rgba(direction['cyan']),m('MINIMUM',.94,m('MULTIPLY',cyan,m('ADD',.65,m('MULTIPLY',density,.8)))))
ribbons=m('MULTIPLY',m('MULTIPLY',m('POWER',m('ADD',.5,m('MULTIPLY',.5,m('SINE',m('ADD',m('MULTIPLY',fr,310),m('MULTIPLY',density,5))))),12),.18),m('SUBTRACT',1,smooth(fr,.12,.32)))
colour=colourmix(colour,rgba(stops[0]['colour']),ribbons)
colour=vec('SCALE',colour,m('ADD',1,m('ADD',m('MULTIPLY',blue,1.2),m('MULTIPLY',cyan,1.8))))
energy=m('ADD',m('MULTIPLY',body,m('ADD',.38,m('MULTIPLY',density,.80))),m('MULTIPLY',m('MULTIPLY',density,.16),m('EXPONENT',m('MULTIPLY',r,-6))))
energy=m('ADD',m('MULTIPLY',energy,spec['halo']['strength']*.36),soft)
asymmetry=m('ADD',.76,m('MULTIPLY',.24,m('COSINE',m('SUBTRACT',m('MULTIPLY',u,math.tau),.45))))
facing=m('ABSOLUTE',vec('DOT_PRODUCT',g.outputs['Normal'],g.outputs['Incoming']))
rim=m('MULTIPLY',m('POWER',m('MAXIMUM',0,m('SUBTRACT',1,facing)),3),smooth(facing,0,.25))
attribute=n.new('ShaderNodeAttribute');attribute.attribute_name='light_weight'
energy=m('MULTIPLY',m('MULTIPLY',m('MULTIPLY',energy,taper),asymmetry),m('MULTIPLY',rim,attribute.outputs['Fac']))
energy=m('MULTIPLY',energy,m('GREATER_THAN',distance,1))
emission=n.new('ShaderNodeEmission');link(colour,emission.inputs['Color']);link(energy,emission.inputs['Strength'])
transparent=n.new('ShaderNodeBsdfTransparent');add=n.new('ShaderNodeAddShader')
link(transparent.outputs[0],add.inputs[0]);link(emission.outputs[0],add.inputs[1]);link(add.outputs[0],n.get('Material Output').inputs['Surface'])
for obj in scene.objects:
    if obj.name.startswith('Closed flowing aura surface '):obj.data.materials[0]=mat
for i,hex_value in enumerate(direction['innerShellColours'],1):
    shell=scene.objects['Fine inner emission shell '+str(i)]
    for node in shell.data.materials[0].node_tree.nodes:
        if node.type=='EMISSION':node.inputs['Color'].default_value=rgba(hex_value)
scene['enclosed_field_finished']='Original RG field with ten radial colour stops and four spatial colour regions'
bpy.ops.wm.save_as_mainfile(filepath=str(root/'continuous-horizon.blend'))
result={'file':bpy.data.filepath,'packed_field_dimensions':[w,h],'new_darker_layer_created':False,'material':mat.name}
