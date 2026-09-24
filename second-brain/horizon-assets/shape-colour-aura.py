"""Tighten the existing closed body while preserving topology and the core.

The pre-refinement blend is retained in the workspace recovery folder. The
reference camera reproduces the user's captured viewport; it does not move it.
"""
import bpy, math, json
import numpy as np
from pathlib import Path
from mathutils import Quaternion
root=Path(__file__).resolve().parent;scene=bpy.context.scene
assert scene.get('enclosed_white_aura') and not bpy.app.is_job_running('RENDER')
spec=json.loads((root.parent/'site/assets/continuous-optics.json').read_text())
halo=spec['halo'];layers,segments,bands=192,128,128
lat=np.repeat(np.linspace(-math.pi/2,math.pi/2,bands+1)[1:-1],segments)
az=np.tile(np.arange(segments)*math.tau/segments,bands-1)
lat=np.concatenate(([-math.pi/2],lat,[math.pi/2]));az=np.concatenate(([0],az,[0]))
c=np.maximum(0,np.cos(lat));s=np.sin(lat);side=c**6;count=len(lat)
radii=.004+.996*np.linspace(0,1,layers)**1.8
for i,r in enumerate(radii):
    obj=scene.objects['Closed flowing aura surface '+str(i+1)];mesh=obj.data
    assert len(mesh.vertices)==count and mesh.users==1
    dr=((radii[i+1] if i+1<layers else 1)-(radii[i-1] if i else 0))*.5
    t=np.clip(r/.30,0,1);radius=halo['innerRadius']+r*halo['radialSpan']
    rho=c*radius+halo['sideSpan']*side*t*t*(3-2*t)
    height=s*(halo['innerRadius']+r*halo['radialSpan']*halo['verticalSpread'])*(1-.25*side*r)
    positions=np.stack((rho*np.cos(az),-rho*np.sin(az),height),axis=1).astype(np.float32)
    mesh.vertices.foreach_set('co',positions.ravel())
    deriv=c*halo['radialSpan']+halo['sideSpan']*side*6*t*(1-t)/.30
    light=dr*np.divide(deriv,rho,out=np.full(count,halo['radialSpan']/radius),where=rho>1e-6)*halo['bodyLightGain']
    mesh.attributes['light_weight'].data.foreach_set('value',light.astype(np.float32));mesh.update()
view=spec['colourDirection']['referenceView'];name='User angle — layered aura colour study'
camera=scene.objects.get(name)
if camera is None:
    camera=bpy.data.objects.new(name,bpy.data.cameras.new(name));scene.collection.objects.link(camera)
camera.location=view['nativeEye'];camera.rotation_mode='QUATERNION';camera.rotation_quaternion=Quaternion(view['nativeRotation'])
camera.data.lens=view['lens'];scene.camera=camera
scene.render.resolution_x=1100;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene['aura_shape_refinement']='Vertical excess reduced 80 percent; full radial diameter extended about 25 percent'
bpy.context.view_layer.update()
material_script=root/'finish-enclosed-aura.py'
exec(compile(material_script.read_text(encoding='utf8'),str(material_script),'exec'),{'__file__':str(material_script)})
result={'surfaces_reshaped':layers,'reference_camera':camera.name,'core_changed':False,'vertical_spread':halo['verticalSpread'],'side_span':halo['sideSpan']}
