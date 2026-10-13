"""Build the reviewed journey as a minimal static GitHub Pages artifact."""
from pathlib import Path
import argparse
import html
import json
import re
import shutil

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_URL = 'https://guessyou.app/'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('destination', type=Path)
    parser.add_argument('--site-url', default=DEFAULT_URL)
    args = parser.parse_args()
    if not args.site_url.startswith('https://') or not args.site_url.endswith('/'):
        parser.error('--site-url must be an HTTPS URL ending with /')
    dest = args.destination.resolve()
    if dest == ROOT or ROOT.is_relative_to(dest) or dest.is_relative_to(ROOT):
        parser.error('Destination must be outside the source checkout')
    if dest.exists() and any(dest.iterdir()):
        parser.error('Destination must be empty')
    (dest / 'design').mkdir(parents=True, exist_ok=True)
    (dest / 'tex' / 'site').mkdir(parents=True, exist_ok=True)

    # The reviewed proof augments data.json with the approved image paths.
    data = json.loads((ROOT / 'design' / 'journey-data.js').read_text()[len('const D='):].rstrip().removesuffix(';'))
    assets = set()
    for feeling in data['feelings']:
        image = feeling['image']
        if not image:
            continue
        name = Path(image).name
        assets.add(name)
        assets.add(name.replace('-800.webp', '-400.webp'))
    for name in assets:
        shutil.copy2(ROOT / 'tex' / 'site' / name, dest / 'tex' / 'site' / name)

    for name in ('journey.css', 'journey.js', 'portrait-layout.js', 'portrait-loader.js', 'journey-data.js',
                 'feeling-language.js', 'feeling-descriptions.js',
                 'vocabulary-review.js', 'word-collection.js', 'resources.html', 'about.html'):
        shutil.copy2(ROOT / 'design' / name, dest / 'design' / name)
    shutil.copytree(ROOT / 'design' / 'fonts', dest / 'design' / 'fonts')

    reflection = (ROOT / 'design' / 'reflection-tools.js').read_text()
    expected = "const PUBLIC_GUESS_YOU_URL = '';"
    if reflection.count(expected) != 1:
        raise ValueError('Expected a single launch URL placeholder')
    reflection = reflection.replace(expected,
        'const PUBLIC_GUESS_YOU_URL = ' + json.dumps(args.site_url) + ';')
    (dest / 'design' / 'reflection-tools.js').write_text(reflection)

    def public_page(source, route):
        document = (ROOT / 'design' / source).read_text().replace('PROOF / 07', '')
        routes = {'proof.html': '/', 'about.html': '/about/', 'resources.html': '/resources/'}
        def public_url(match):
            attribute, value = match.groups()
            for old, new in routes.items():
                if value == old or value.startswith(old + '#') or value.startswith(old + '?'):
                    value = new + value[len(old):]
                    break
            else:
                if not value.startswith(('https:', 'http:', '/', '#', 'tel:', 'sms:', 'mailto:')):
                    value = '/design/' + value
            return f'{attribute}="{value}"'
        document = re.sub(r'(src|href)="([^"\s]+)"', public_url, document)
        canonical = html.escape(args.site_url + route, quote=True)
        return document.replace('</head>', f'<link rel="canonical" href="{canonical}"></head>')

    def legacy_page(source, target):
        # Serve the complete page at old URLs. Navigating back to / can loop
        # when a visitor still has the original homepage redirect cached.
        document = public_page(source, target.lstrip('/'))
        encoded = json.dumps(target)
        normalize_address = (f'<script>try{{history.replaceState(history.state,"",'
                             f'{encoded}+location.search+location.hash);}}catch{{}}</script>')
        return document.replace('</head>', normalize_address + '</head>')

    (dest / 'index.html').write_text(public_page('proof.html', ''))
    for name in ('about', 'resources'):
        (dest / name).mkdir()
        (dest / name / 'index.html').write_text(public_page(name + '.html', name + '/'))
    for old, target in [('proof', '/'), ('about', '/about/'), ('resources', '/resources/')]:
        (dest / 'design' / (old + '.html')).write_text(legacy_page(old + '.html', target))

    (dest / '.nojekyll').touch()
    print(f'Built {len(assets)} display portraits and {len(list(dest.rglob("*")))} site paths in {dest}')


if __name__ == '__main__':
    main()
