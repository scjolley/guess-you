"""Serve the prototype, design proofs, and photo exports on this computer."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse
import json
import os
from threading import Lock
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent

REVIEW_PATH = ROOT / 'local-reviews' / 'portrait-reviews.json'
REVIEW_LOCK = Lock()

def read_reviews():
    if not REVIEW_PATH.exists():
        return {}
    return json.loads(REVIEW_PATH.read_text())

def validate_review(payload):
    if not isinstance(payload, dict):
        raise ValueError('Expected a review object.')
    name, status, note = payload.get('file'), payload.get('status'), payload.get('note')
    if not isinstance(name, str) or name != Path(name).name or not name.endswith('-800.webp') or not (ROOT / 'tex/site' / name).is_file():
        raise ValueError('Unknown portrait.')
    if status not in ('pending', 'approved', 'changes') or not isinstance(note, str) or len(note) > 4000:
        raise ValueError('Invalid status or note.')
    return name, {'status': status, 'note': note, 'updatedAt': datetime.now(timezone.utc).isoformat()}

class Preview(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def json_response(self, code, payload):
        encoded = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def local_request(self):
        expected = f'127.0.0.1:{self.server.server_port}'
        return self.headers.get('Host') == expected and self.headers.get('Origin') in (None, 'http://' + expected)

    def do_POST(self):
        if urlsplit(self.path).path != '/api/portrait-reviews' or not self.local_request():
            self.send_error(403)
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 20000 or self.headers.get('Content-Type') != 'application/json':
                raise ValueError('Invalid request.')
            name, review = validate_review(json.loads(self.rfile.read(length)))
            with REVIEW_LOCK:
                reviews = read_reviews()
                reviews[name] = review
                REVIEW_PATH.parent.mkdir(exist_ok=True)
                temporary = REVIEW_PATH.with_suffix('.tmp')
                temporary.write_text(json.dumps(reviews, indent=2))
                os.replace(temporary, REVIEW_PATH)
            self.json_response(200, review)
        except (ValueError, TypeError):
            self.json_response(400, {'error': 'Invalid review; not saved.'})
        except OSError:
            self.json_response(500, {'error': 'Could not save the review on this computer.'})

    def do_GET(self):
        if urlsplit(self.path).path == '/api/portrait-reviews':
            if not self.local_request():
                self.send_error(403)
                return
            try:
                self.json_response(200, read_reviews())
            except (OSError, ValueError):
                self.json_response(500, {'error': 'Could not read saved reviews.'})
            return
        path = unquote(urlsplit(self.path).path)
        if path == '/':
            self.path = '/guess-you.html'
        elif path != '/guess-you.html':
            file = (ROOT / path.lstrip('/')).resolve()
            permitted = any(file.is_relative_to(ROOT / folder) for folder in ('tex/site', 'design'))
            if not permitted or not file.is_file():
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

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    print(f'Guess You preview: http://127.0.0.1:{args.port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Preview).serve_forever()

if __name__ == '__main__':
    main()
