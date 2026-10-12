"""Build the existing prototype; no framework or dependencies required."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
template = (ROOT / 'app.template.html').read_text()
data = (ROOT / 'data.json').read_text()
json.loads(data)
marker = '/*__DATA__*/null'
if template.count(marker) != 1:
    raise ValueError('Expected exactly one data placeholder')
(ROOT / 'guess-you.html').write_text(template.replace(marker, data))
print('Built guess-you.html')
