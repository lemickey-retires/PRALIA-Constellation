"""Portable, read-only localhost launcher for the included constellation."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import sys
import threading
from urllib.request import urlopen
import webbrowser

ROOT = Path(sys.executable).resolve().parent if getattr(sys, 'frozen', False) else Path(__file__).resolve().parent
WEB = ROOT / 'graphify-out'
APP = 'PRALIA Constellation'
SNAPSHOT = '2026-09-08T12:14:40.730Z'

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript', '.mjs': 'text/javascript',
        '.json': 'application/json', '.glb': 'model/gltf-binary',
        '.wasm': 'application/wasm'}

    def log_message(self, *_):
        pass

    def list_directory(self, path):
        self.send_error(403, 'Directory listing is disabled.')
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def send_head(self):
        host = self.headers.get('Host', '').lower()
        if host not in (f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'):
            self.send_error(403, 'Use the local viewer address.')
            return None
        if not Path(self.translate_path(self.path)).resolve().is_relative_to(WEB.resolve()):
            self.send_error(403)
            return None
        if self.path.split('?', 1)[0] == '/':
            self.send_response(302)
            self.send_header('Location', '/graph-3d.html')
            self.end_headers()
            return None
        return super().send_head()

    def do_GET(self):
        if self.path == '/__pralia_health':
            payload=json.dumps({'app': APP, 'snapshot': SNAPSHOT}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

def existing(port):
    if not port:
        return False
    try:
        with urlopen(f'http://127.0.0.1:{port}/__pralia_health', timeout=.5) as reply:
            state=json.load(reply)
            return state == {'app': APP, 'snapshot': SNAPSHOT}
    except Exception:
        return False

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--headless', action='store_true', help='Keep the server in this terminal.')
    parser.add_argument('--no-browser', action='store_true', help='Do not open a browser automatically.')
    parser.add_argument('--port', type=int, default=51420)
    parser.add_argument('--ready-file', type=Path, help='Write the local address to a verification file.')
    args=parser.parse_args()
    if not (WEB/'graph-3d.html').is_file() or not (WEB/'shared-view.json').is_file():
        raise RuntimeError('Extract the complete ZIP first. Keep this launcher beside the graphify-out folder.')
    if not 0 <= args.port <= 65535:
        raise RuntimeError('The port must be between 0 and 65535.')
    if existing(args.port):
        url=f'http://127.0.0.1:{args.port}/graph-3d.html'
        if args.ready_file: args.ready_file.write_text(json.dumps({'url':url,'reused':True}))
        if not args.no_browser: webbrowser.open(url)
        return
    handler=partial(Handler, directory=str(WEB))
    try:
        server=ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    except OSError:
        server=ThreadingHTTPServer(('127.0.0.1', 0), handler)
    url=f'http://127.0.0.1:{server.server_port}/graph-3d.html'
    if args.ready_file: args.ready_file.write_text(json.dumps({'url':url,'reused':False}))
    worker=threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    if sys.stdout: print(url, flush=True)
    if not args.no_browser: webbrowser.open(url)
    try:
        if args.headless:
            while worker.is_alive(): worker.join(.5)
        else:
            print('\nPRALIA Constellation is running in your browser.\n'
                  'Keep this window open while you explore.\n'
                  'Press Enter here, or close this window, to stop the viewer.\n',flush=True)
            input()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()
        worker.join(timeout=2)

if __name__=='__main__':
    try:
        main()
    except Exception as error:
        if sys.stderr: print(str(error),file=sys.stderr)
        if '--headless' not in sys.argv:
            try: input('Press Enter to close.')
            except (EOFError,KeyboardInterrupt): pass
        raise SystemExit(1)
