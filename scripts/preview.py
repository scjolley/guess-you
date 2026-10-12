"""Serve only the public prototype and photo exports on this computer."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse

ROOT = Path(__file__).resolve().parent.parent

class Preview(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/':
            self.path = '/guess-you.html'
        elif path != '/guess-you.html':
            file = (ROOT / path.lstrip('/')).resolve()
            if not file.is_relative_to(ROOT / 'tex/site') or not file.is_file():
                self.send_error(404)
                return
        super().do_GET()

    def do_HEAD(self):
        if urlsplit(self.path).path == '/':
            self.path = '/guess-you.html'
        if urlsplit(self.path).path != '/guess-you.html':
            self.send_error(404)
            return
        super().do_HEAD()

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8000)
args = parser.parse_args()
print(f'Guess You preview: http://127.0.0.1:{args.port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), Preview).serve_forever()
