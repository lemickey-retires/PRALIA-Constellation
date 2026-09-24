"""Serve only the lightweight workspace UI on a local address."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def list_directory(self, path):
        self.send_error(403)
        return None

    def do_GET(self):
        if self.headers.get('Host') not in {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}:
            self.send_error(403)
            return
        target = Path(self.translate_path(self.path)).resolve()
        if not target.is_relative_to(ROOT) or '.impeccable' in target.parts:
            self.send_error(403)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=51422)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port),partial(Handler,directory=str(ROOT))) as server:
        print(f'http://127.0.0.1:{server.server_port}/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    main()
