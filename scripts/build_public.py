"""Build the reviewed journey as a minimal static GitHub Pages artifact."""
from pathlib import Path
import argparse
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

    proof = (ROOT / 'design' / 'proof.html').read_text()
    proof = proof.replace('PROOF / 07', '')
    proof = proof.replace('About this proof', 'About Guess You')
    proof = re.sub(r'English journey proposal using existing portraits and vocabulary\..*?Unmatched search words \(up to 80 characters\) are saved only in this browser for vocabulary review\.',
        'Guess You is a space to find words for feelings and explore what matters. The portraits show fictional people created with AI. Your reflection stays in this page until you choose to save it, and is not stored after reload. Unmatched search words (up to 80 characters) are saved only in this browser to help you notice vocabulary gaps.', proof)
    proof = re.sub(r'<a href="vocabulary-review.html".*?</a><br>', '', proof)
    proof = re.sub(r'<a href="background-review.html".*?</a><br>', '', proof)
    proof = re.sub(r'<a href="http://127\.0\.0\.1:8000/".*?</a>', '', proof)
    (dest / 'design' / 'proof.html').write_text(proof)

    (dest / 'index.html').write_text(
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Guess You</title><meta http-equiv="refresh" content="0; url=design/proof.html">'
        '<link rel="canonical" href="design/proof.html"></head><body>'
        '<a href="design/proof.html">Open Guess You</a></body></html>')
    (dest / '.nojekyll').touch()
    print(f'Built {len(assets)} display portraits and {len(list(dest.rglob("*")))} site paths in {dest}')


if __name__ == '__main__':
    main()
