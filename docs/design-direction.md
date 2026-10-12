# Guess You — design direction and parked notes

## Approval workflow

This Codex chat and repository remain the main workspace. Use Figma in the
SCJOLLEY team to review editable layouts and font pairings before implementing
major visual changes. The current playable prototype stays available.

## User direction

- A personal mix of old-school italic serif and clear sans serif.
- Pencil-like handwritten input; Paloma is a visual reference, not an approved font.
- Only open-source fonts in the public website.
- Adobe Caslon Pro Italic is a visual reference; test Libre Caslon Text Italic.
- Pixelation and softly blurred type are exploratory; keep body and labels legible.
- Use only the existing AI cast portraits; no new faces or regeneration.

## References received

Three Guess Who-style board references: standing rectangular tiles in orderly
rows, on a white tray, with a bottom hinge and no keychain suspension.
Five selected-feeling references: paper inventory forms, photo corners/paperclip,
clear ID sleeves, confident printed labels, fine ruled lines, handwritten entries.
Selection_movement_ref.gif is supplied as a motion reference. The attached still
alone does not establish exact timing; inspect the animated file before implementing.
These external images are inspiration; do not use their people or brand names as
product artwork.

## Parked implementation notes — retain until addressed

1. Tiles should fold backward, away from the visitor, around the bottom hinge.
   Current prototype falls forward. Do not change the existing animation until
   motion approval; review an explicit video or the supplied GIF when relevant.
2. Remove the keychain holders/rings from the final tile design. Reflect this
   in the Figma proposal now; leave the working prototype unchanged for review.
3. Keep notes even when they belong to later phases. Classify as proposed,
   approved, implemented, or deferred rather than forgetting them.

## First proof scope

Editable homepage/font comparison, sample board with existing portraits,
selected-feeling paper/ID layout, and a small mobile view. This is a proposal for
approval, not final branding. No full design system, new gameplay, or code redesign.

## Figma proof status

File: https://www.figma.com/design/Pg9Z7Zu9yNzXKGNGyysf3u
Team: SCJOLLEY (selected by Sam).
Fonts available: Libre Caslon Text Italic, DM Sans, Caveat.
Six existing cast portraits were transferred for use in the proposal.
The Starter-plan MCP tool limit stopped composition before editable layouts
were created. The file is an in-progress asset staging file, not a finished proof.
No subscription was purchased. Sam chose a separate browser design proof at no
extra cost. Do not call this Figma file a completed design.

## Browser proof status

The proposal is in `design/proof.html`, served at
http://127.0.0.1:8001/design/proof.html. It compares clean and softened serif,
uses Libre Caslon Text Italic, DM Sans and Caveat with retained OFL licenses,
and shows six existing portraits, standing tiles and a selected-feeling form.
Desktop and mobile layouts and portrait selection were checked in the browser.
Awaiting creative approval; actual game sources remain unchanged. Backward
folding motion remains deferred for a dedicated interaction review.


Proof 02: Sam authorized a separate revision with blur-to-clear title motion,
backward tile folding, darker handwriting comparisons, removal of visible cast
names and revised thesis-informed copy. Kalam is shown in English/Portuguese
alongside Caveat. Blunt by dabnotu (1001fonts.com/blunt-font.html) is reference
only: listing says personal use, not commercial; no open license verified.
No actual game changes. Naming in Portuguese remains unapproved.


Proof 03: Sam authorized the next complete screen proposal. Caveat is the
default for short handwritten entries; situation/request inputs and the resulting
sentence use DM Sans. Font comparisons were removed from the main flow.
Folding and opening feelings now have separate controls; needs can be selected
and the sentence updates from editable situation/request fields. Six sample
feelings remain; full matching and bilingual integration belong to the actual
game implementation after creative approval. Original game unchanged.


## Journey proof 04 — October 12
Sam authorized a new journey proof using the existing project and portraits.
White base; bold printed typography; compact ?U mark; no handwriting, sleeve,
keychain, eyes motif, color picker, or tile-elimination mechanic. Pale family
colors accent buttons. Scroll rearranges opening portraits into a grid. Four
matching words appear first; See more adds four and reduces grid width.
Selection opens recognition/reflection, followed by optional Dive deeper with
three blank blocks (observation, need, request), separate examples, CNVC resources,
and a closing check-in. Keep my reflection explicitly copies locally.
Current proof is English-only, using derived source vocabulary/trigger mappings
and 152 existing photo paths. Explanations are proposed family-level editorial
copy; further word-specific content, translation, final motion tuning, direct
sharing, and book link remain for review. Video portraits and Apple Health V2.
Original playable game remains unchanged; previous proofs are in Git history.


## Proof 05 — October 12 refinements

Single-line Guess you title in locally licensed Manrope, one opening sentence, and 24 distinct opaque portraits below the title. Softer input and round-stroked arrows. Portraits use a display-only 4:5 crop; source images remain unchanged. A Tile depth toggle compares shallow raised edges with flat cards. Optional deeper reflection and closing sections have return controls.

Background review: design/background-review.html displays all 152 original portraits, ranked by corner-color distance from the set median as a screening aid, not an edit verdict. Backgrounds vary between white, gray and lavender, with differing shadows. User must review and choose a target before any image regeneration or Higgsfield credits are used. No portraits were edited.


### Review decision — flat tiles and portrait comments

User rejected the raised tile treatment; reverted to flat tiles and removed the comparison switch. Other proof refinements remain.

Portrait feedback pending correction approval:
- **Gloria / detached** (`gloria-detached-800.webp`): user reports missing drop shadow and background reading gray. Keep unchanged while the user reviews other portraits. No regeneration authorized.
