"""Verify the distributable's bytes and its unchanged graph/snapshot contents."""
import gzip
import hashlib
import json
import os
from pathlib import Path

root=Path(__file__).resolve().parent
if os.name=='nt' and not str(root).startswith(chr(92)*2+'?'+chr(92)):
    root=Path(chr(92)*2+'?'+chr(92)+str(root))
manifest=json.loads((root/'SOURCE-MANIFEST.json').read_text(encoding='utf-8'))
def digest(path):
    value=hashlib.sha256()
    with path.open('rb') as stream:
        for part in iter(lambda:stream.read(1024*1024),b''): value.update(part)
    return value.hexdigest()
for name,record in manifest['files'].items():
    path=root/name
    assert path.is_file(),f'Missing: {name}'
    assert path.stat().st_size==record['bytes'],f'Size differs: {name}'
    assert digest(path)==record['sha256'],f'Hash differs: {name}'
data=json.loads((root/'graphify-out'/'graph-3d-data.json').read_text(encoding='utf-8'))
assert len(data['nodes'])==3520 and len(data['edges'])==14520
snapshot=json.loads((root/'graphify-out'/'shared-view.json').read_text(encoding='utf-8'))
assert snapshot['nodes']==3520 and snapshot['format']=='pralia-constellation-snapshot'
ids={n['id'] for n in data['nodes']}
layouts={k:v for k,v in snapshot['storage'].items() if k.startswith('graphify-solid-3d-layout-v1')}
assert len(layouts)==5
for name,layout in layouts.items():
    assert {n['id'] for n in layout['nodes']}==ids,name
    assert len(layout['nodes'])==3520,name
    assert len(layout['camera']['position'])==3 and len(layout['camera']['target'])==3,name
full_hash=hashlib.sha256()
with gzip.open(root/'data'/'full-graph.json.gz','rb') as stream:
    for part in iter(lambda:stream.read(1024*1024),b''): full_hash.update(part)
assert full_hash.hexdigest()==manifest['data']['uncompressed_full_graph_sha256']
print(json.dumps({'verified_files':len(manifest['files']),'nodes':3520,'links':14520,
                  'saved_layouts':5,'full_graph_byte_identical':True,'captured_at':snapshot['capturedAt']}))
