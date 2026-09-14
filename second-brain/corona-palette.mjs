import * as THREE from 'three';

export function colourUniforms(spec){
 const direction=spec.colourDirection;
 return {
  uPalette:{value:direction.radialStops.map(stop=>new THREE.Color(stop.colour))},
  uStops:{value:direction.radialStops.map(stop=>stop.at)},
  uRose:{value:new THREE.Color(direction.rose)},uGold:{value:new THREE.Color(direction.gold)},
  uBlue:{value:new THREE.Color(direction.blue)},uCyan:{value:new THREE.Color(direction.cyan)},
 };
}
export const paletteGLSL=`
uniform vec3 uPalette[10];uniform float uStops[10];
uniform vec3 uRose;uniform vec3 uGold;uniform vec3 uBlue;uniform vec3 uCyan;
vec3 radialColour(float r){
 vec3 result=uPalette[0];
 for(int i=1;i<10;i++)result=mix(result,uPalette[i],smoothstep(uStops[i-1],uStops[i],r));
 return result;
}
// Both angles are within one turn. The unsigned shortest arc is equivalent
// to the squared atan(sin(delta),cos(delta)), without twelve trig calls per
// fragment across the four colour regions.
float sector(float angle,float centre,float width){float d=abs(angle-centre);d=min(d,6.28318530718-d)/width;return exp(-d*d);}
vec3 layeredColour(float r,vec2 field,vec3 point){
 float azimuth=atan(point.z,point.x);
 float rightGold=sector(azimuth,.15,.60)*smoothstep(.025,.065,r)*(1.-smoothstep(.18,.30,r));
 float rearRose=sector(azimuth,-1.20,.72)*smoothstep(.06,.20,r);
 float leftBlue=sector(azimuth,2.22,.25)*exp(-pow((r-.10)/.075,2.));
 float leftCyan=sector(azimuth,2.72,.19)*exp(-pow((r-.17)/.08,2.));
 vec3 colour=radialColour(r);
 colour=mix(colour,uGold,rightGold*.42);
 colour=mix(colour,uRose,rearRose*.62);
 colour=mix(colour,uBlue,clamp(leftBlue*(.70+field.r*.8),0.,.94));
 colour=mix(colour,uCyan,clamp(leftCyan*(.65+field.r*.8),0.,.94));
 float ribbons=pow(.5+.5*sin(r*310.+field.r*5.),12.)*.18*(1.-smoothstep(.12,.32,r));
 colour=mix(colour,uPalette[0],ribbons);
 return colour*(1.+leftBlue*1.2+leftCyan*1.8);
}`;
