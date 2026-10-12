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

The proposed typography and layout live in `design/proof.html`, separate from the
working game. It uses six existing cast portraits and self-hosted open-source
fonts; their licenses are in `design/fonts/`. This proposal has not been approved
or applied to the game.

Run `python3 scripts/preview.py --port 8001` and open
http://127.0.0.1:8001/design/proof.html. Review the blur-to-clear Caslon title and Caveat entries, fold tiles backward,
open a feeling, select a need, and edit the situation/request to build a sentence.
The Guess button only previews the board; this page is an appearance proof.
