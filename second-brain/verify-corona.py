"""Verify optical asset integrity and unchanged graph/legacy assets.

Uses only the Python standard library. Optionally pass --baseline PATH to the
pre-edit repository ZIP for a byte-level regression check of protected files.
"""
import argparse
import gzip
import hashlib
import json
import struct
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--baseline', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent
assets = root / 'site' / 'assets'
digest = lambda data: hashlib.sha256(data).hexdigest()
spec = json.loads((assets / 'continuous-optics.json').read_text('utf8'))
packed = (assets / spec['halo']['file']).read_bytes()
assert digest(packed) == spec['halo']['sha256'], 'Optical field hash differs'
raw = gzip.decompress(packed)
width, height = spec['halo']['dimensions']
assert len(raw) == spec['halo']['bytes'] == width * height * 2
assert spec['halo']['innerRadius'] > 1, 'Emission must stay outside the core'
assert spec['photon']['enabled'] and not spec['referenceImageUsed']
assert len(spec['flares']) == 4, 'Unexpected number of blue disk wisps'
assert 1 < spec['diskRadialStretch'] < 3
halo=spec['halo']
assert 14 < 2*(halo['innerRadius']+halo['radialSpan']+halo['sideSpan']) < 14.1, 'Requested wider diameter changed'
assert 2 < 2*(halo['innerRadius']+halo['radialSpan']*halo['verticalSpread']) < 2.4, 'Requested close vertical clearance changed'
assert len(spec['colourDirection']['radialStops']) == 10
assert spec['oldHorizontalRingVisible'] is False
assert spec['outerAura']['radialStretch'] == 3
assert all(0 < f['auraRadius'] < .5 for f in spec['flares'])
assert spec['geometry']['cameraFacing'] is False and spec['geometry']['layers'] == 192
assert spec['geometry']['originalFieldPreserved'] is True
assert spec['geometry']['fullSurroundDegrees'] == 360 and spec['geometry']['closedSurfaces'] is True
assert spec['outerAura']['visible'] is False
for flare in spec['flares']:
    assert 1.1 < flare['radius'] < 2.74, 'Wisp lies outside the emitting disk'
    assert len(flare['size']) == 2 and all(0 < n < .3 for n in flare['size'])
angular_energy = [sum(raw[(y * width + x) * 2] for y in range(height)) for x in range(width)]
assert min(angular_energy) > 0, 'Missing angular sector in corona'
half_ratio = sum(angular_energy[:width // 2]) / sum(angular_energy[width // 2:])
assert .8 < half_ratio < 1.25, 'Unexpected upper/lower material imbalance'
seam_error = sum(abs(raw[y * width * 2] - raw[((y + 1) * width - 1) * 2]) for y in range(height)) / height
assert seam_error < 4, 'Discontinuity at the wrapped material seam'
glb = (assets / spec['file']).read_bytes()
magic, version, size = struct.unpack_from('<III', glb)
assert magic == 0x46546C67 and version == 2 and size == len(glb)
json_length, chunk_type = struct.unpack_from('<II', glb, 12)
assert chunk_type == 0x4E4F534A
geometry = json.loads(glb[20:20 + json_length])
assert any(n.get('name') == 'ContinuousCorona' for n in geometry['nodes'])
assert not any('uri' in b for b in geometry.get('buffers', [])), 'Non-local geometry dependency'
receipt = json.loads((root / 'view-build-receipt.json').read_text('utf8'))
assert digest((root / 'site/vendor/graph-3d.js').read_bytes()) == receipt['sha256']
assert digest((root / 'site/vendor/graph-physics-worker.js').read_bytes()) == receipt['workerSha256']
assert receipt['outputImports'] == [], 'Unexpected runtime import'
revision_path = root / 'CORONA-MANIFEST.json'
revision_count = 0
if revision_path.exists():
    revision = json.loads(revision_path.read_text('utf8'))
    for name, expected in revision['files'].items():
        assert digest((root / name).read_bytes()) == expected, f'Revision hash differs: {name}'
        revision_count += 1
graph = json.loads((root / 'site/graph-3d-data.json').read_text('utf8'))
assert len(graph['nodes']) == 1097 and len(graph['edges']) == 4101
assert graph['inventory']['counts']['agent'] == 24 and graph['inventory']['counts']['archive'] == 24
protected_count = 0
publication_mismatches = []
if args.baseline:
    with zipfile.ZipFile(args.baseline) as baseline:
        mutable = {'second-brain/horizon-environment.mjs', 'second-brain/native-horizon-volume.mjs',
                   'second-brain/site/vendor/graph-3d.js', 'second-brain/view-build-receipt.json',
                   'second-brain/README.md',
                   # Authorized idle scheduling changes; visual sources and
                   # the worker simulation remain protected byte for byte.
                   'second-brain/memory-3d.mjs'}
        for name in baseline.namelist():
            if name.endswith('/') or name in mutable:
                continue
            if name == '.gitattributes':
                # The commit adds only this LFS rule for the large editable scene.
                # Continue to enforce every original byte-handling rule.
                original = baseline.read(name)
                current = (root.parent / name).read_bytes()
                lfs_rule = b'second-brain/horizon-assets/continuous-horizon.blend filter=lfs diff=lfs merge=lfs -text\n'
                assert current in (original, original.rstrip(b'\n') + b'\n' + lfs_rule), 'Unexpected Git attribute change'
                if current == original:
                    protected_count += 1
                continue
            assert (root.parent / name).read_bytes() == baseline.read(name), f'Protected file changed: {name}'
            protected_count += 1
        original_manifest = json.loads(baseline.read('SOURCE-MANIFEST.json'))
        for name, record in original_manifest['files'].items():
            original = baseline.read(name)
            if len(original) != record['bytes'] or digest(original) != record['sha256']:
                publication_mismatches.append(name)
        # Report any pre-edit release-manifest discrepancies. The byte-level
        # check above separately proves these historical files were preserved.
print(json.dumps({'status': 'passed', 'nodes': len(graph['nodes']), 'links': len(graph['edges']),
                  'illuminated_angular_samples': len(angular_energy), 'lower_half_present': True,
                  'upper_lower_energy_ratio': round(half_ratio, 4), 'seam_mean_byte_error': round(seam_error, 4),
                  'local_bundle_verified': True, 'protected_baseline_files_identical': protected_count,
                  'revision_files_verified': revision_count,
                  'small_blue_disk_wisps': len(spec['flares']),
                  'preexisting_publication_manifest_mismatches': publication_mismatches}, indent=2))
