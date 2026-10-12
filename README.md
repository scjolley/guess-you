# Guess You / Adivinha Você

This workspace continues the existing Claude Code prototype. It is connected to
https://github.com/scjolley/guess-you as the Git `origin` remote.

## Local preview

From this folder:

```sh
python3 scripts/build.py
python3 scripts/preview.py
```

Open http://127.0.0.1:8000. Stop the preview with Ctrl+C.
Edit `app.template.html`, then rebuild. Do not edit the generated
`guess-you.html` by hand. The game retains its existing layout and SVG faces.
No package installation is needed.

Requires Python 3.9 or newer. The preview listens only on this computer and
serves the playable page and WebP exports. It does not expose source archives or
private production folders. If port 8000 is busy, use
`python3 scripts/preview.py --port 8001` and open that port instead.

## Project structure

| Path | Purpose |
| --- | --- |
| `app.template.html` | Existing UI, styles, and game logic; edit this source. |
| `data.json` | 152 feelings, needs, translations, and matching vocabulary. |
| `guess-you.html` | Generated, playable prototype with data embedded. |
| `scripts/build.py` | Builds the HTML from the template and data. |
| `scripts/preview.py` | Starts the local browser preview. |
| `fotos/` | Preserved JPEG character masters, including an alternate. |
| `tex/site/` | 304 existing WebP feeling portraits, at two sizes. |
| `emotion_assign_76.json` | Maps 152 feelings to 76 characters. |
| `cast_new.json`, `elenco.md` | Cast metadata and direction. |
| `guia-expressoes.md`, `sheet_prompts.json` | Expression direction and historical prompts. |
| `Guess You - Sentimentos e Needs.xlsx` | Historical workbook; contains 94 feelings. |
| `archive/original-prototype/` | Unmodified Claude template, built HTML, and data. |
| `docs/missing-references.md` | The 12 missing, nonblocking iCloud references. |

The current game follows: type a feeling → flip down options → open a feeling →
choose needs → build an NVC sentence. English and Portuguese are supported.
The page still uses its original SVG faces; the recovered photographic exports
are preserved for later integration. No redesign or new game features were added.

## Recovery

The full available Claude session project was copied here without changing its
source. Available files from Human Team/Campanhas/GuessYou were then compared
and imported as the primary saved source. Differing session versions are preserved locally under
`recovery/claude-session`. See `RECOVERY.json` and `HUMAN_TEAM_IMPORT.json` for
inventories. Original prototype copies also remain in the workspace's
`work/original-prototype` folder.

The same three original prototype files are also versioned under
`archive/original-prototype/` so they remain recoverable from GitHub.

604 Human Team paths were iCloud placeholders at recovery time. Most have
recovered session counterparts; 12 have no local counterpart. Their paths are
recorded in `HUMAN_TEAM_IMPORT.json`. Download those originals from iCloud before
the next consolidation pass. This does not block the game preview.
The exact 12 paths are listed in [Missing references](docs/missing-references.md).
The full recovery inventories are retained locally and excluded from Git.

Large production history, private reference photos, review drafts, and alternate
versions are retained locally and excluded from Git. The template, game data,
cast metadata, JPEG masters, and existing `tex/site` WebP exports are included.
No photos were regenerated or replaced with new imagery.

## Initial fixes

- Explicitly honor the HTML `hidden` attribute so resource/face panels stay
  closed at launch and close correctly when dismissed.
- Link both language versions to the official combined inventory:
  https://www.cnvc.org/store/feelings-and-needs-inventory
- Add a doctype, language, character encoding, and mobile viewport around the
  existing document. Gameplay and design remain intact.

## Separate design approval proof

Run `python3 scripts/preview.py --port 8001` and open
http://127.0.0.1:8001/design/proof.html.

Proof 07 explores the October 12 journey: scroll introduction, four feeling
matches with See more, selected-feeling reflection, optional NVC prompts, and
a closing check-in. It uses existing portraits and vocabulary, with proposed
English copy. `design/journey.css` and `design/journey.js` hold presentation and
interactions; `design/journey-data.js` is derived from the original `data.json`
and existing image paths. Fonts and licenses are in `design/fonts/`.

Reflections live only in page memory. Keep my reflection is available at every
writing stage: copy, save a text file, open an email draft, or use device sharing
when supported. The deeper prompts also assemble a sentence that can be copied.
The original game is unchanged. This is a creative approval proof, not a public
release. Earlier designs remain recoverable in Git history.


The opening begins with the centered title clearing from blur, then rising as
the copy and six moving cards appear. Cards enter individually along the scroll path into complete rows:
64 distinct people on desktop and 70 on mobile, drawn from 76 available people.
Section labels are omitted; shared action circles are 44px and centered with their
labels. The deeper section leads directly to “How do you feel now?”.
Feeling results start at four and expand by four, without duplicate feelings.
`design/feeling-descriptions.js` contains tentative, word-specific editorial copy
for all 152 feelings.

`design/resources.html` opens separately and includes US support and NVC resources.
Set `PUBLIC_GUESS_YOU_URL` in `design/reflection-tools.js` when a public address is
live; until then exported reflections include the NVC link and never localhost.
No domain has been purchased.
`design/feeling-language.js` adds 253 editorial everyday phrases to existing
triggers; matches are possibilities, not diagnoses or fixed meanings.

### Portrait approvals and comments

Open `http://127.0.0.1:8001/design/background-review.html` using the preview
server above. Each portrait supports Pending, Approve, Request changes, and a
comment. Notes save to ignored `local-reviews/portrait-reviews.json` on this Mac;
Codex can read them directly. Browser storage is a fallback and the page includes
a JSON backup download. Notes are not pushed to GitHub. A static hosting service
will only support the browser fallback unless a review backend is added.

Review decisions do not trigger image generation. Shadow flags remain separate
from human approvals. Game reflections still stay only in page memory.

Validation: `node tests/journey-language.cjs`, `node tests/reflection-tools.cjs`, and
`PYTHONDONTWRITEBYTECODE=1 python3 tests/test_review_validation.py`.
