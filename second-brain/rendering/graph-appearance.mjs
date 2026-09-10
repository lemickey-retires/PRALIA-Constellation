import {hash} from './graph-physics.mjs';
export const palettes={
  celestial:{title:'Celestial',hub:'#ffe08a',local:'#f1f7ff',nodes:['#7de3ff','#9baeff','#82bbdf','#b2bbf5'],line:'#9bbbd8'},
  aurora:{title:'Aurora',hub:'#f9f6bd',local:'#f2ffec',nodes:['#80efbb','#9de8e6','#8ccdc4','#c2edb1'],line:'#8ec5b7'},
  ember:{title:'Ember',hub:'#fff1ac',local:'#ffe4ce',nodes:['#ff9970','#ef737a','#dfab91','#edbf72'],line:'#d09b85'},
  amethyst:{title:'Amethyst',hub:'#f7dbff',local:'#f8f2ff',nodes:['#c393ed','#a4a9f7','#e1a3cd','#ab93db'],line:'#b4a0d3'},
  silver:{title:'Silver',hub:'#ffffff',local:'#e7eff9',nodes:['#a9b9cc','#d7e2eb','#bcced8','#e3e7ed'],line:'#8f9eb2'}
};
export const designs={
  starlight:{title:'Starlight',glow:1,links:.13,core:'sphere',rings:false},
  crystal:{title:'Crystal',glow:.35,links:.21,core:'crystal',rings:false},
  orbital:{title:'Orbital',glow:.65,links:.11,core:'sphere',rings:true},
  minimal:{title:'Minimal',glow:0,links:.075,core:'sphere',rings:false}
};
export function nodeColour(node,palette) {
  const p=palettes[palette]||palettes.celestial;
  return node.tier==='yellow'?p.hub:node.tier==='white'?p.local:p.nodes[Math.floor(hash(node.id)*p.nodes.length)];
}
