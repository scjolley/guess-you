# Permanent Guess You workspace agreement

This repository and its current Codex chat are Sam's permanent Guess You workspace.
Act as creative collaborator, product strategist, and developer from planning
through implementation. Keep authorized completed work synchronized to
https://github.com/scjolley/guess-you and provide working local previews.
Handle routine technical work independently. Ask Sam for approval on major
creative decisions, including redesigns, visual direction, or changes to the
core game concept. Keep collaboration in this chat; do not send Sam to another
ChatGPT conversation. Preserve original Claude files, assets, and alternate
versions. Current scope: establish and review the existing prototype; no redesign
or new features until requested.


## Working principles

- Recommend the most efficient path first; check dependencies and shortcuts early.
- Reuse this project, files, tools, and conversation; avoid redundant work.
- Keep the active checkout as the source of truth and old versions as recovery history.
- Ask questions only when Sam's input is genuinely necessary.
- Complete authorized actions directly instead of asking Sam to shuttle prompts.
- Respect time and money; avoid unnecessary subscriptions, tool changes, or rebuilds.
- Explain actual limitations candidly; do not substitute ineffective workarounds.

Edit app.template.html and rebuild guess-you.html with scripts/build.py.
Run scripts/preview.py for the local preview. Private references and large
production history stay local. Original prototype source is versioned in
archive/original-prototype; local recovery inventories remain available.

The historical handoff below records older production state. Verify it against
current files before acting. The tools available in this session may differ from
those described in the handoff. Do not restart image jobs based on old counts.

---

# Guess You / Adivinha Você — project handoff

Handoff from a Claude Code session (Sep 29 – Oct 9, 2026) so the work can continue in Codex. Read this whole file before changing anything. The owner is Brazilian and writes in Portuguese and English; answer in the language she uses.

## 1. What this is

A Guess Who–style website about emotions, based on Nonviolent Communication (NVC / CNV).

**Flow:**
1. The visitor types "I feel ___" ("Eu me sinto ___").
2. Matching feeling tiles appear on a board. The visitor flips down the ones that aren't them and opens the one that is.
3. The opened feeling shows its needs and builds an NVC sentence: "When ___, I feel ___ because I need ___. Would you be willing to ___?"

**Languages and naming:**
- Bilingual: EN and PT.
- Name: **Guess You** in EN, **Adivinha Você** in PT.
- The logo, small logo, page `<title>`, home-button label and ID-badge header all switch with the language.

**Gendered Portuguese:**
- The visitor picks pronouns: ela / ele / elu (linguagem neutra) / sem escolher.
- Gender is also auto-detected from the typed word: "chata" → feminine, "chato" → masculine, "chate" → neutral.

**Audience:** adults, but suitable for everyone. The Resources sheet links to cnvc.org and to crisis lines: 188 CVV in Brazil, 988 in the US, findahelpline.com elsewhere.

## 2. Files

All paths are relative to this folder.

| Path | What it is |
|---|---|
| `app.template.html` | The site, as one HTML/CSS/JS file. Data placeholder: `const D = /*__DATA__*/null;` |
| `data.json` | All data (see §3) |
| `guess-you.html` | **Built** site: the template with data.json inlined. Never edit it by hand |
| `fotos/<Name_With_Underscores>/1-neutro.jpg, 2-<positive>.jpg, 3-<hard>.jpg` | The 228 character photos (76 people × 3), 1440 px tall. These are the **masters** |
| `personagens/<Name>.png` | Original 3-panel sheets per person (historical) |
| `cast_new.json`, `elenco.md` | Cast list: name, age, gender, origin, build, height, look, clothing. `elenco.md` also has the anti-stereotype guide |
| `emotion_assign_76.json` | `{name: {pos, neg}}`: each person's 2 feelings |
| `sheet_prompts.json` | The image prompt used per person |
| `guia-expressoes.md` | Expression study (FACS action units, Ekman, Keltner, Barrett, Tracy & Robins), with recipes per feeling family. Use it when writing image prompts |
| `Guess You - Sentimentos e Needs.xlsx` | Spreadsheet of feelings and needs with PT columns. **Outdated:** it has 94 words and lacks the 58 newest positives |
| `revisao/index.html` | Photo review page (see §6) |
| `revisao/people.json` | Review-page data: per person, images with key, kind, word, pt, fam |
| `revisao/img/`, `revisao/prev/` | 700 px review images and 380 px "before" thumbnails |
| `revisao/redo/` | Working folders from the redo rounds. `new3`–`new7` are generated images; `hf*` are Higgsfield inputs; `old*` are backups of replaced originals; `eyefix/` holds eye-fix tests. Scripts: `install.py`, `dl.py` |
| `tex/` | **Texture pass, in progress** (see §7) |
| `testes/` | Style tests (fish-eye, head-only, color variation) |

**Build the site:**

```bash
python3 -c "open('guess-you.html','w').write(open('app.template.html').read().replace('/*__DATA__*/null', open('data.json').read()))"
```

**Check the JS after editing:** extract the `<script>` contents and run `node --check` on them.

## 3. Data model (`data.json`)

- **`families`:** 11 families, each `{id, label, pt, expr, color}`:

  | Family | Color |
  |---|---|
  | angry | #E8322B |
  | sad | #2F5BE0 |
  | afraid | #8A5CF6 |
  | tense | #FF7A1A |
  | disconnected | #9DAA9C |
  | tired | #A0704A |
  | confused | #11A39A |
  | vulnerable | #FF7EB3 |
  | joyful | #FFC632 |
  | peaceful | #3DBB5C |
  | faux | #1C1C1C |

- **`feelings`:** 152 entries `{id, family, needs[]}`.
  - 76 positive and 76 hard.
  - 19 of the hard ones are **faux feelings**, interpretations like "betrayed" or "ignored". They have `family: "faux"` and an `underlying[]` list of the real feelings beneath them. The UI explains them as "a thought, not a feeling".
- **`feelingsPt`:** PT forms as `"masculine|feminine"`, or a single word when it doesn't vary. Neutral forms are generated in JS (`neu()`): cansado → cansade, apático → apátique.
- **`needs`, `needCategories`, `needsPt`, `needCategoriesPt`:** the NVC needs inventory, grouped.
- **`triggers`:** slang → feelings, e.g. "pissed off" / "puto da vida" → irritated, frustrated, furious…
- **Credit (required):** the vocabulary is adapted from the CNVC Feelings and Needs inventories, cnvc.org. Keep that credit on the site.

## 4. Site: current state and design

- **Published prototype** (Claude artifact, private): https://claude.ai/artifact/HH7jhcHsNBNmefYnpEV439. Last updated Oct 2: EN/PT name switching and all 152 feelings.
- **Visual concept:**
  - white gallery board;
  - acrylic **keychain tiles** that flip down ("Not me");
  - a fading "mountain" of tiles on the home screen;
  - an **ID badge in a clear sleeve** for the opened feeling.
- **Fonts now:** Archivo (condensed) plus Reenie Beanie (handwriting). **The owner doesn't like them.**
- **Placeholder faces:** the tiles still show SVG cartoon faces. The real photos are **not in the site yet**.
- **Face modes (Faces sheet):**
  - "Many faces": a character per feeling;
  - "Build mine": a simple avatar maker;
  - "My photo": stays in localStorage, never uploaded.

### Next site work

1. **Fonts and logo.** The owner wants a new logo in a **digital cursive** font "like Flora". We couldn't identify "Flora", so ask her for a link.
   - Offered Google Fonts for the logo: Pinyon Script, Mrs Saint Delafield, Monsieur La Doulaise, Corinthia, Ballet, Ms Madi.
   - Offered text fonts: Instrument Sans, DM Sans, Space Grotesk.
   - **Not chosen yet.** Make both logo versions: Guess You and Adivinha Você.
2. **Real photos.** Replace the SVG faces with the real photos.
   - Map each feeling to the person who has it, using `emotion_assign_76.json`. Each person has exactly 1 positive and 1 hard feeling, and every one of the 152 feelings belongs to exactly one person.
   - Use the person's neutral photo where a neutral is needed.
   - Keep the faux-feeling handling.
3. **Web images.** Agreed spec:
   - masters stay untouched;
   - export crops of **810×1440**;
   - **WebP, quality 80**, in two widths: **400 px** (~30–40 KB) and **800 px** (~80–120 KB);
   - lazy loading;
   - lowercase ASCII names, e.g. `ubirata-appreciative-400.webp`.
4. **Publishing.**
   - Either turn on public sharing for the artifact, or host it (Netlify, Vercel or GitHub Pages) on a domain such as guessyou.com.br.
   - Add an About page with:
     - an AI disclosure: "the people are fictional, made with AI";
     - a note that representation of people with disabilities is being built with disabled people;
     - the CNVC credit.
   - No analytics or data collection, so no cookie banner or LGPD (Brazil's data-protection law) work.
5. Update the spreadsheet to all 152 words.

## 5. Image rules (hard constraints from the owner)

**Look:**
- Photographic, direct on-camera flash, pure white background.
- Tight bust crop: the face is big, nothing below the chest. **Never show the body.**
- Real skin texture.

**Camera:**
- A **fixed front camera at eye level**, same distance and framing as that person's neutral photo, whatever angle the reference shows.
- No low or high angles, no dutch tilt, no fish-eye (it caricatures).
- The person may lean a little closer or further, but stays in frame.

**Expressions:**
- Big, theatrical, felt "like a toddler feels them", but never cartoonish.
- **The face carries the emotion; hands only support it** (about 30% of the signal at most).
- Show hands only when they are the point of the expression. Never copy hands that belong to someone else in a reference photo.

**Eyes:**
- Eye rolls must keep the pupils and irises visible.
- Never "edit out" red, crying eyes: the model erases the irises. Regenerate from the neutral instead, and state the natural iris color.

**Hair:** natural and still (studio, no fan). No hair blowing in the wind.

**Tops:**
- One **solid** top, no patterns or logos. The color shows the feeling family; the neutral photo uses warm light grey.
- Shades vary within a family (not every yellow identical), but must stay in family: blue never drifts to teal, yellow never to peach.

**Bodies and weight:**
- Weight follows Brazil's proportions, roughly 18 obese / 26 overweight / 32 slim-average, described naturally and never fetishized.
- Don't slim people. Nano Banana tends to slim people on its own; Seedream respects body size.

**Cast:**
- Equal split across racial groups, with mixed-race people included.
- Ages 17–82.
- Trans and nonbinary people included.
- Strict anti-stereotype rules for styling and for which feelings each person gets. **Indigenous people wear modern, dignified clothes**, no "ethnic costume".

**Deferred to "phase 2", to be done with the people themselves:** disabilities, vitiligo, alopecia. Glasses, freckles, acne, acne patches and braces are fine.

**People the owner protects:** Marcus and Imani are never changed. Brenda changed only at the owner's request (plus-size, swapped weights with Priya).

**Reference photos from the owner:**
- Many are photos of real people.
- Don't upload them to generators. Describe the expression in the prompt so no real identity bleeds into a character.
- Use the character's own neutral or existing photo as the identity reference.

**Prompt structure** (from `guia-expressoes.md`):

```
FACE (must read clearly even if the hands were hidden): BROWS … ; EYES … ; MOUTH … ; JAW/NECK … .
HEAD & GAZE: … . CAMERA: fixed front, eye level, same framing as the neutral.
HANDS (optional, supporting only): … .
```

## 6. Review workflow

- **Review page** (Claude artifact): https://claude.ai/artifact/2VxfMREq9UHAEYBbsg6HRv. Source: `revisao/index.html`.
- **What she does there:** marks each photo **Ok** or **Refazer** (redo) and writes notes.
- **Saving:**
  - Marks save to the artifact's database: collection `reviews`, doc id = image key such as `Marta__3-furious`, fields `{status: ok|redo|none|new, note, at}`.
  - `new` = redone, waiting for her to check. The "Refeitas" tab shows these, with a "Ver antes" (see before) button.
  - If the server can't connect, the page falls back to localStorage and a "Copiar notas" (copy notes) button.
- **From Codex:** that database can only be read from a Claude session, so in Codex ask her to paste her notes, or move the review to something Codex can read (e.g. a JSON file or a simple hosted form).
- **Redo rounds (Oct 1–8):** about 180 photos were regenerated from her notes and refs. As of Oct 8 she said **"everyone is good to go"**, with Kenji "judged" and Hugo "delighted" (no hands) as the last fixes.
- **Small leftovers:**
  - Luiza's neutral is marked redo with no note;
  - Ji-woo "disrespected" may read as "hurt".
  - Ask her about both.

## 7. Texture pass: in progress, check before touching

- **Goal:** a final photorealism pass over all photos.
- **Model:** **Nano Banana Pro on Higgsfield at 2K.** It beat Seedream in an A/B test on Andrés.
- **Prompt:** `tex/prompt.txt`. It covers skin pores on all visible skin including hands, individual hair strands and follicles, fabric weave, and keeping 100% of identity, expression, **body size and weight**, colors and composition.
- **Files:**
  - `tex/src/`: inputs, uploaded to Higgsfield;
  - `tex/ids.json`, `tex/keys.json`: photo → Higgsfield media id;
  - `tex/jobs.txt`: submitted job ids (67 when this was written);
  - `tex/results.txt`: result URLs;
  - `tex/out/`: downloads;
  - scripts: `put.py` (upload), `batch.py` (build request JSON), `rec.py` (record jobs), `dl.py` (download, with a DNS fallback).
- **Status on Oct 9:** all 225 uploads confirmed, and jobs were being submitted 12 at a time **by another Claude session that may still be running**. Don't resubmit jobs blindly; check `jobs.txt` and `results.txt` first.
- **Before replacing any master:**
  1. Check every result for **identity drift and weight drift** (Nano slims people) and redo any that changed. Brenda's 3 photos must be re-run with the final prompt.
  2. Back up the originals.
- **Then:** build the WebP web set (§4.3) from the masters.
- **Credits on Oct 9:** Higgsfield about 540; the full run costs about 2 per photo, about 450. Magnific: about 45 left (the account is ending).

## 8. Tools used (not available in Codex)

- **Image generation:** Higgsfield (`seedream_v5_pro` for expressions, Nano Banana Pro for texture) and Magnific (`seedream-5-pro`) through Claude's MCP connectors. In Codex you'd use the Higgsfield/Magnific web apps or APIs directly.
- **Local processing:** Python 3 with Pillow and numpy:
  - cutting sheets into 3 panels by finding the white gutters;
  - HSV hue shifts for in-family top colors. These work for yellow, green, blue, violet, red and orange; pink and brown leak into the skin.
- **Hosting:** the site and the review page are Claude artifacts. To leave Claude, host `guess-you.html` and the images anywhere static.
