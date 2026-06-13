---
id: image-editing
name:
  en: "🖼️ Image editing"
  ru: "🖼️ Редактирование изображений"
description:
  "Study user images, interview from what is visible, then edit or generate — retouch, restyle, background, references."
---

# Skill: Image Editing

## Goal

Turn a vague visual wish into a precise, executable brief. Support **editing an existing photo**, **generating a new
image from one or more references**, and **hybrids** (subject + reference, composite, sequential steps).

Core loop: **collect images → study every supplied file → interview using only study-derived specifics → confirm →
execute**.

The interview must always be **grounded in what was actually seen** on the images. Generic option lists without ties to
inventory are forbidden.

## Use When

- User uploads image(s) to change, improve, or restyle.
- User wants background removed/replaced, retouch, color/light changes, stylization (anime, film, editorial, …).
- User provides **reference image(s)** and wants a **new** picture in that vein — with or without a subject photo to
  preserve.
- User wants style/layout/elements copied from reference onto their photo.
- User describes edits in free text or needs iteration on a previous result.

## Work Modes

Detect mode from the first message; confirm if ambiguous. Each mode changes which files to collect first and what study
emphasizes — not a rigid script.

- **Edit subject** — one primary photo to modify. References optional. Study subject first; study references if present.
- **Generate from reference(s)** — no subject photo (or subject is only described in words). User has mood boards, style
  samples, layout examples, character sheets, etc. Study **every reference** before asking what to create.
- **Subject + reference** — restyle or recombine: subject photo plus one or more references. Study subject, then each
  reference; interview what transfers and what stays locked on the subject.
- **Composite** — multiple inputs donate elements or scenes. Study each; interview roles, scale, lighting match.
- **Iterate** — user reacts to a result already in the session. Re-study the output image; narrow the next change.

## Session Order

**Strict sequence** — adapt starting step to Work Mode, but **never ask creative parameters before relevant images are
studied**.

### Edit subject (default)

1. **Collect the subject** — if missing, the first interaction requests only the photo to edit. No style, background, or
   look questions until it arrives.
2. **Study the subject** — full Image Study Protocol on the subject file.
3. **Collect references** — if the task needs them and they are not attached yet, request reference file(s) next; study
   each immediately after receipt.
4. **Interview** — parameters only after study. Every choice must name entities, regions, or issues found on the images
   (see Content-Aware Interviewing).
5. **Confirm and execute**.

### Generate from reference(s)

1. **Collect reference(s)** — if missing, first interaction requests reference image(s) only. Do not ask subject/scene
   details until at least one reference is in hand (unless the user already gave an exhaustive written brief).
2. **Study every reference** — extract style, palette, composition, motifs, medium, mood, era, texture, lighting; note
   what must **not** be copied literally (faces, logos, text).
3. **Interview** — what **new** image to create, using options phrased from reference study (“palette like the warm
   terracotta walls in ref 1”, not “warm colors”). Clarify subject/scene that references do not show.
4. **Confirm and execute** — generation brief embeds studied reference attributes; state which reference supplies which
   dimension.

### Subject + reference

1. Collect subject if missing → study subject.
2. Collect reference(s) if missing → study each reference.
3. Interview: preservation on subject vs transfer from reference(s).
4. Confirm and execute.

**Rules for all modes**

- If images were attached in the opening message, start at study, not parameter interview.
- Never combine “upload file” with style/look/background choices when that file is still missing.
- If the user attached images **and** left no ambiguity, study once, confirm briefly, execute — still do not skip study.
- Adding or swapping images after interview → re-study affected files before the next question batch.

## Coverage

Resolve into one operation or an ordered sequence when the user clearly needs it.

- **Instruction edit** — remove X, sunset sky, fix glare, add snow; map X to study inventory.
- **Enhancement / grade** — exposure, color, sharpness; cinematic / vintage / vivid; face skin level.
- **Background** — transparent cutout, plain studio, soft blur, darken, new scene.
- **Style transfer** — restyle subject using reference(s) or a named look without reference.
- **Reference-driven generation** — **new** image not present in any input; references supply style, layout, palette,
  character design, product look, or mood only.
- **Object / region** — add, remove, swap, repaint; preserve the rest per study.
- **Composite** — merge inputs with matched light, scale, shadows.

## Content-Aware Interviewing

**Mandatory discipline** after study, before execution.

### Grounding rules

- **Every question option must be justified by study** — cite visible things: “the blue jacket on the person
  center-left”, “the cluttered shelf behind the sofa”, “the cool cast in the shadows”, “the brush texture in reference
  2”.
- **Forbidden** — generic menus disconnected from the image (“pick a style”, “what to edit?”) when study already
  produced inventory.
- **Show your work briefly** — one or two sentences of what you saw, then the form. User must see that questions follow
  from their pictures.
- **Tailor pattern blocks** — open only sections that match inventory (people block only if people found; product block
  only if product hero found; reference-generation block only if mode is generate-from-reference).
- **Default preservation** — “everything not explicitly listed for change stays as in the original subject image.”
- **Confirm ambiguous mappings** — if user said “the car” but study shows two cars, force a choice with positions/colors
  from study.

### How study feeds each question

- Inventory → named targets in single/multiple choice labels.
- People pass → per-person rows; retouch only if faces found.
- Text pass → text policy question only if legible text/UI/logos found.
- Background pass → cutout/blur/replace options weighted by edge difficulty (hair, glass, …).
- Light/color pass → offer fixes for **observed** problems, not a full grade menu, unless user asked for creative grade.
- Reference study → separate “what to borrow” vs “what to avoid” per reference file.

## Analytical Frame

Resolve open axes before execution. Skip axes fixed by user or obvious from study.

1. **Mode** — edit subject / generate from reference / subject + reference / composite / iterate.
2. **Task** — primary operation family (Coverage); secondary steps in order if needed.
3. **Inputs** — count and **role** of each image (subject, style ref, layout ref, mood ref, element donor).
4. **Change scope** — whole image / background only / listed objects / local region in words tied to inventory.
5. **Preservation** — identity, pose, composition, text, logos, objects that must not move.
6. **Reference transfer** — when references exist: per reference, what transfers (palette, brush, lighting, era,
   materials, layout rhythm) vs forbidden (face, watermark, exact copy).
7. **Look** — realistic vs stylized; named aesthetic; reference-driven vs parameter-only.
8. **Lighting & color** — keep, fix observed issues, or named recipe.
9. **Degree of change** — light touch-up / noticeable / heavy stylization; identity must remain recognizable unless user
   waives it.
10. **Output** — transparent/opaque background, aspect/size, delivery context (avatar, print, marketplace, social).

## Image Study Protocol

Mandatory whenever non-trivial images are in play.

### Principles

- See Session Order — no parameter interview before study of every file already collected.
- Several **narrow** passes per image, not one vague description.
- Re-study when files change or after iteration output drifts.
- Never invent details; confirm if uncertain.
- Output of study is **interview fuel** — lists of named entities, issues, and reference attributes.

### Passes (run per image; skip irrelevant passes)

- **Inventory** — who/what; counts; positions; dominant subject.
- **People** — faces, groups, occlusions, hands; who is editable vs frozen.
- **Text & symbols** — legible text, UI, logos, watermarks; language.
- **Background** — complexity, separation, distractions; cutout difficulty.
- **Light & color** — exposure, cast, noise, blur; problem areas vs acceptable.
- **Materials & objects** — product type, finishes, food, plants, vehicles; object-specific levers.
- **Composition** — crop, angle, focal point, empty space.
- **Risk zones** — hair, fur, glass, overlap, motion blur; edge-quality expectations.
- **Reference attributes** (reference files) — medium (photo, illustration, 3D, paint); palette; lighting mood;
  recurring motifs; composition pattern; era/genre; texture; **do-not-copy** list (faces, brands, literal layout).

### From study to interview

1. State briefly what you see on each studied file.
2. Ask only decisions study cannot infer; label options with study names.
3. Multiple subjects → force primary target before style questions.
4. Legible text user did not mention → text policy before edit.
5. Multiple references → ask per-reference what to borrow and what to ignore.

## Content-Aware Interview Patterns

Use when inventory matches; omit irrelevant blocks.

### People & portraits

- Which person(s) to affect — options list **each person from inventory**; others frozen.
- Face/skin, expression, hair, clothing — only for selected people.
- Background people: remove / blur / keep.

### Groups

- Per-person scope: change / keep / remove — **one row per visible person**, not “everyone”.

### Products & objects

- Hero vs props from inventory; label/logo policy if text found.
- Material, shadow, reflection, marketplace framing.

### Scenes & landscapes

- Sky, season, weather — offer changes relevant to **visible** sky/ground/architecture.

### Animals, food, documents/UI

- Apply only when study found these categories.

### Background-only

- Options depend on edge risk from study (simple product vs hair vs glass).

### Freeform instruction

- Map user words to inventory entities; confirm unchanged areas.

## Reference-Driven Generation

When mode is **generate from reference(s)** and there is no subject photo (or subject is verbal only):

- Study extracts **transferable dimensions** from each reference — not a literal copy of the reference image.
- Interview builds the **new scene/subject** references do not show: who/what, action, framing, empty vs busy
  background.
- Separate questions:
  - What to take from reference 1, 2, … (palette, line quality, lighting, props style, …).
  - What must **not** appear (specific faces, logos, text from refs).
  - How closely to match each dimension (loose inspiration vs close match).
- Final brief describes the **new** image first, then binds each dimension to a studied reference attribute.
- If user later adds a subject photo, switch to **subject + reference** mode and re-run subject study.

When references plus subject both exist:

- Subject supplies **identity, pose, layout** unless user says otherwise.
- References supply **look dimensions** user selects in interview.
- Never let reference override face/product identity unless explicitly requested.

## Question Building Rules

- Structured selection first; open text only for gaps study and references cannot fill.
- Batch independent axes; split when answers depend on prior choices (per-person after headcount known).
- Always offer **keep as in original** on subject attributes when editing.
- Degree of change in plain language: light touch-up / noticeable / heavy stylization.
- Look options filtered by task and study (e.g. do not offer face retouch if no faces).
- Final summary before execution: mode, inputs and roles, preservation, per-reference transfer, look, background,
  degree.

## Multi-Image Mechanics

- Assign a **role** to every file; repeat roles in the final brief.
- State **order** of images when sequence matters and why.
- Reference transfer: identity and layout on subject; references supply agreed dimensions only.
- Composite: shared lighting direction, scale, contact shadows.
- Multiple references: no blended ambiguity — attribute → source reference mapping in the brief.

## Execution Gate

Do not execute until:

- Required images for the mode are collected (or user iterates on in-session result).
- Every supplied image has been studied for this task.
- Open axes resolved or explicitly “keep original”.
- User confirmed summary (or gave a complete upfront spec).

### Final brief shape

One self-contained instruction without chat history:

- **Mode & operation** — edit / generate / composite; steps in order if several.
- **Inputs** — role of each image; attribute → reference mapping if applicable.
- **Hard preservation** — bullet list on subject / must-not-copy from refs.
- **Hard changes** — study-derived names and regions.
- **New content** (generation) — scene/subject description references did not provide.
- **Look, light, color, background, degree** — when applicable.
- **Negatives** — no watermarks, no new readable logos, no extra limbs, no identity swap unless requested, …

After execution, offer iteration options tied to likely drift (edges, face, color, seams, reference mismatch).

## Iteration

- Compare to preservation list and intent.
- Re-study output before the next partial fix.
- Full re-interview only if direction changes or new images appear.

## Quality Checklist

- Every interview option tied to something seen in study.
- Mode matches inputs (generate vs edit vs hybrid).
- Reference dimensions explicitly mapped; identity protected on subject edits.
- Text/logo policy set when study found text.
- Final brief self-contained and imperative.

## Common Failure Modes And Prevention

- **Generic questions ignoring the photo** — study first; ban detached option menus.
- **Parameters before files** — collect and study images before style/look/background.
- **Wrong person/object** — force choice using inventory positions/descriptions.
- **Reference copied literally** — separate borrow vs avoid; describe new content for generation mode.
- **Reference steals identity on subject edit** — preservation bullets on face/product before transfer questions.
- **Text/logo damage** — text policy when study finds legible text.
- **Over-editing** — default preserve everything not listed; confirm degree.
- **Bad cutouts** — edge expectations from risk zones.
- **Iteration drift** — re-study output; restate preservation each pass.
