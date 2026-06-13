---
id: icon-generation
name:
  en: "🧩 Icon generation"
  ru: "🧩 Генерация иконок"
description: "Helping users create clear, high-quality icons for apps, products, and interfaces."
---

# Skill: Icon Generation

## Goal

Produce a polished icon concept and a generation-ready visual prompt by resolving three semantic axes: metaphor, graphic
style, and final specification.

## Use When

- User asks for an app icon, service icon, pictogram, symbol mark, or icon set seed.
- User needs one strong icon direction before full logo exploration.

## Analytical Frame

Three axes must be fully resolved before generation:

1. **Metaphor** — what the icon means and what it is composed of.
2. **Style** — the graphic language (flat, line, illustrative, isometric, 3D, photorealistic, pixel, hand-drawn, …).
3. **Specification** — concrete shapes, materials/finishes, composition, and constraints.

Resolve every axis. The number of clarification rounds is not fixed — pick the minimum that fully resolves the three
axes given what the user already provided.

## Metaphor Anchors

For any chosen metaphor, internally extract:

- **Decomposition** — the visible parts that make up the symbol. Worked examples:
  - key → bow / shaft / bit;
  - book → cover / pages / spine;
  - lightbulb → glass bulb / filament / metal cap;
  - cloud → body / shadow;
  - shield → frame / face / emblem;
  - rocket → nose / body / fins / flame.
- **Archetypal materials** — materials commonly associated with the object. Examples:
  - key → brass, gold, polished steel, antique silver;
  - book → leather, paper, cardboard, cloth;
  - bulb → glass, tungsten, brushed metal;
  - shield → steel, bronze, wood, enamel;
  - rocket → painted steel, polished aluminum, ceramic tip.
- **Dominant silhouette and canonical orientation** — the outline that must remain readable at the smallest target size.
- **Secondary cue rule** — at most one supporting symbol; never mix two equal metaphors.
- **Cultural and brand collisions** — known logos and culturally loaded shapes to avoid.

Briefly confirm the decomposition with the user before asking per-component questions.

## Style Anchors

Each render style implies a different set of properties to resolve:

- **Flat / Glyph** — 1–2 colors, no materials, surface = flat fill, silhouette is the priority.
- **Line** — stroke weight, corner radius, open vs. closed forms, no materials.
- **Illustrative** — gradients and soft shading, optional texture, surface treatment per component.
- **Isometric** — three axes, light/mid/dark face per component, consistent depth cues.
- **3D** — lighting setup, ambient occlusion, **materials per component are mandatory**, surface finish.
- **Photorealistic** — lighting setup, **materials per component are mandatory**, finish per material, weathering and
  age, environment reflection hints.
- **Pixel** — grid size, palette size, no anti-aliasing, sub-pixel hinting rules.
- **Hand-drawn** — medium (ink, pencil, watercolor, marker), texture, line imperfection.

## Specification Anchors

Always resolve:

- Metaphor decomposition (from the Metaphor axis).
- Render style + detail level (minimal / moderate / detailed).
- Color strategy (monochrome / duotone / brand palette / full color).
- Background (transparent / flat color / soft gradient / scene).
- Smallest target render size (16 / 24 / 32 / 64+ px).
- Negative cues and forbidden references.

Conditionally resolve:

- **Materials per component** — required when render style is `photorealistic` or `3D`. Pull options from the metaphor's
  archetypal materials, scoped by style.
- **Surface treatment per component** — recommended for `illustrative`, `isometric`, `hand-drawn` (flat fill / soft
  gradient / hatch / outline only).
- **Lighting setup and finish per material** — required for `photorealistic` and `3D`.

## Step Planning

Pick the minimum number of `AskTool` rounds that fully resolves the three axes:

- Group axes into one round when answers are independent.
- Open a separate round only when later questions depend on earlier ones (per-component materials depend on metaphor
  decomposition + style choice).
- Skip questions for any axis already resolved by the user's initial message.
- Always confirm the metaphor decomposition with the user before per-component questions.

Typical patterns:

- **1 round** — rare; only when all three axes are pre-specified. Ask one consolidated confirmation form.
- **2 rounds** — common: round 1 covers metaphor + style (independent); round 2 covers per-component specification.
- **3 rounds** — when the metaphor needs decomposition feedback first, then style, then per-component spec.

## Question Building Rules

Map each axis to structured form fields. Use open text only where variability blocks options.

- **Metaphor** — `single_choice` of curated metaphors fitting the user's domain + `Other metaphor` → `text_input`.
- **Render style** — `single_choice` from the Style Anchors list.
- **Detail / color strategy / background / smallest size** — `single_choice` each.
- **Decomposition confirmation** — `multiple_choice` over the agent's proposed parts; allow add/remove via `Other` →
  `text_input`.
- **Per-component shape** — `single_choice` per component, options derived from the metaphor's typical variants.
- **Per-component material** (photorealistic / 3D) — `single_choice` per component from archetypal materials of the
  metaphor, scoped by style; always include `Other` → `text_input`.
- **Per-component surface treatment** (illustrative / isometric / hand-drawn) — `single_choice` per component.
- **Lighting and finish** (photorealistic / 3D) — `single_choice`.
- **Forbidden references** — optional `text_input`.

## Generation Gate

- Do not call the image tool until all mandatory specifications are resolved and the user has confirmed the final
  summary.
- Final prompt structure: subject + metaphor decomposition + render style + per-component materials/finishes +
  composition + background + smallest-size constraint + negative cues.
- For photorealistic / 3D, the prompt must explicitly name the material and finish of every decomposed component.

## Quality Bar

- Recognizable silhouette at the smallest target size.
- One core metaphor; at most one secondary cue.
- Per-component material is set whenever style is photorealistic or 3D.
- Style vocabulary is consistent across decomposition, materials, and finishes.
- Explicit anti-patterns in the prompt: no text, no extra elements, single coherent metaphor.
