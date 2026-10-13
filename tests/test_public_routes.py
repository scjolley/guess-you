"""Verify built navigation and assets resolve from the public routes."""
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parent.parent

class Links(HTMLParser):
    def __init__(self, document):
        super().__init__()
        self.urls = []
        self.feed(document)
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ('href', 'src'):
                self.urls.append(value)

class PublicRoutes(unittest.TestCase):
    def test_public_pages_and_legacy_links(self):
        with TemporaryDirectory() as directory:
            subprocess.run([sys.executable, str(ROOT / 'scripts/build_public.py'), directory], check=True, capture_output=True)
            build = Path(directory)
            for route in ('', 'about/', 'resources/'):
                document = (build / route / 'index.html').read_text()
                self.assertNotIn('http-equiv="refresh"', document)
                self.assertIn('href="https://guessyou.app/' + route + '"', document)
                for url in Links(document).urls:
                    parsed = urlsplit(url)
                    if parsed.scheme or not parsed.path:
                        continue
                    self.assertTrue(parsed.path.startswith('/'), url)
                    self.assertNotIn('/design/proof.html', url)
                    target = build / parsed.path.lstrip('/')
                    self.assertTrue(target.exists(), url)
                    if target.is_dir():
                        self.assertTrue((target / 'index.html').exists(), url)
            for name, target in [('proof', '/'), ('about', '/about/'), ('resources', '/resources/')]:
                legacy = (build / 'design' / (name + '.html')).read_text()
                self.assertNotIn('http-equiv="refresh"', legacy)
                self.assertNotIn('location.replace(', legacy)
                self.assertIn('history.replaceState(history.state,"","' + target + '"+location.search+location.hash)', legacy)
                self.assertIn('<main>', legacy)
                self.assertIn('href="/design/', legacy)
            home = (build / 'index.html').read_text()
            self.assertIn('src="/design/journey.js?', home)
            self.assertIn('tabindex="-1" autofocus', home)

if __name__ == '__main__':
    unittest.main()
