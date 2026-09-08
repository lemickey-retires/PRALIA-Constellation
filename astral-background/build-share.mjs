import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const upstream=resolve('upstream-shadergradient');
const source=resolve(upstream,'packages/shadergradient/src');
const manifest=JSON.parse(await readFile(resolve(upstream,'source-manifest.json'),'utf8'));
for(const [path,sha] of Object.entries(manifest.files)) {
  const bytes=await readFile(resolve(upstream,path));
  if(createHash('sha256').update(bytes).digest('hex')!==sha)
    throw new Error('ShaderGradient source has changed: '+path);
}
const common={bundle:true,minify:true,format:'iife',target:['chrome110'],
  legalComments:'external',metafile:true,define:{'process.env.NODE_ENV':'"production"'},
  jsx:'automatic',tsconfigRaw:{compilerOptions:{jsx:'react-jsx'}},
  alias:{'@shadergradient/react':resolve(source,'index.ts'),'@':source},
  loader:{'.glsl':'text','.vert':'text','.frag':'text','.vs':'text','.fs':'text'}};
const entries={'graph-3d.mjs':'graph-3d.js','graph-physics-worker.mjs':'graph-physics-worker.js',
               'src.jsx':'astral-background.js'};
const receipt={shadergradientCommit:manifest.commit,upstreamFilesVerified:Object.keys(manifest.files).length,outputs:{}};
for(const [entry,name] of Object.entries(entries)) {
  const path='../graphify-out/vendor/'+name;
  const result=await build({...common,entryPoints:[entry],outfile:path});
  const bytes=await readFile(path);
  receipt.outputs[name]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
  if(Object.values(result.metafile.outputs).some(o=>o.imports.length))
    throw new Error('The shared bundles must not have external imports.');
}
await writeFile('build-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
