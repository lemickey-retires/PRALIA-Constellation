"""Serve the bundled demonstration locally; no agent services or credentials."""
import argparse
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import html
import json
import webbrowser

WEB = Path(__file__).resolve().parent / 'site'
DATA = json.loads((WEB / 'graph-3d-data.json').read_text('utf8'))
RECORDS = {node['id']: node for node in DATA['nodes']}

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.js':'text/javascript', '.mjs':'text/javascript', '.glb':'model/gltf-binary', '.wasm':'application/wasm'}

    def log_message(self, *_):
        pass

    def list_directory(self, path):
        self.send_error(403)
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        super().end_headers()

    def send_body(self, value, kind='application/json; charset=utf-8'):
        body = value.encode('utf8')
        self.send_response(200)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.headers.get('Host') not in {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}:
            self.send_error(403)
            return
        if not Path(self.translate_path(self.path)).resolve().is_relative_to(WEB):
            self.send_error(403)
            return
        parsed = urlparse(self.path)
        if parsed.path == '/api/connection':
            self.send_body(json.dumps({'connected':False,'checkedAt':datetime.now(timezone.utc).isoformat(),'checks':[{'status':'disabled in demonstration'}]}))
            return
        if parsed.path == '/source':
            node = RECORDS.get(parse_qs(parsed.query).get('node',[''])[0])
            if not node:
                self.send_error(404)
                return
            self.send_body('<!doctype html><html lang="en"><meta charset="utf-8"><title>Demonstration source</title><body><a href="/">3D universe</a><p>Invented demonstration data</p><h1>'+html.escape(node['label'])+'</h1><pre style="white-space:pre-wrap">'+html.escape(node['content'])+'</pre></body></html>', 'text/html; charset=utf-8')
            return
        super().do_GET()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=51421)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=str(WEB))) as server:
        url = f'http://127.0.0.1:{server.server_port}/'
        print(url, flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    main()
