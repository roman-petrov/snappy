---
id: greeting-text
name:
  en: "🎉 Text greeting generation"
  ru: "🎉 Генерация поздравительного текста"
description: "Building personalized text greetings with the right tone and structure."
---

# Skill: Greeting Text Generation

## Goal

Create a personalized greeting that is immediately ready to send: emotionally accurate, audience-aware, and explicitly
styled by selected emoji/formatting intensity.

## Use When

- User asks for a greeting, wish message, celebratory note, or ceremonial text.
- User needs short, medium, or long greeting adapted to recipient and occasion.

## Ready For Generation Criteria

- Occasion is selected from concrete holiday/event options (not left generic).
- Recipient category is selected from concrete addressee options (family, partner, colleague, boss, team, acquaintance,
  etc.).
- Tone, length, and addressing style are selected.
- Emoji intensity and formatting intensity are explicitly selected.
- Gender handling is resolved where linguistically relevant:
  - recipient gender: ask when not implied by recipient category;
  - sender gender: ask when first-person gender agreement can affect wording.
- Sensitive boundaries and forbidden themes are identified.

## User Discovery Topics

- Occasion and emotional intent.
- Recipient category and relationship distance.
- Optional recipient name and addressing style.
- Tone and target length.
- Emoji intensity (minimal / medium / rich).
- Formatting intensity (minimal / medium / rich, using GitHub-Flavored Markdown: **bold**, _italic_, lists, ##
  headings).
- Recipient and sender gender where applicable for grammar/style.
- Optional personalization anchors (facts, milestones, hobbies, shared context).

## Clarification Strategy

1. Mandatory base choices: ask and fix occasion, recipient category, tone, length, emoji intensity, and formatting
   intensity.
2. Grammar-sensitive choices: ask recipient/sender gender only where it can change natural wording in the target
   language.
3. Personalization depth: collect optional name, specifics, context anchors, and constraints.
4. Final confirmation: confirm the style package and produce the final ready-to-send text.

## Required Option Policy

- **CRITICAL:** Never invent facts in the greeting. Do not add achievements, events, relationships, dates, places, or
  personal details that were not explicitly provided by the user or selected in structured options.
- **CRITICAL:** If data is missing, ask for clarification via choice/input flow instead of guessing.
- Always propose a concrete selectable list for **occasion** and **recipient**.
- Occasion and recipient must be collected via **choice fields only** (single/multi-choice), not free text input.
- Offer a broad, practically exhaustive option set for both:
  - occasions: major holidays, family events, personal milestones, professional events, universal celebration cases;
  - recipients: close family, extended family, partner/spouse, friends, colleagues, managers, teams/groups,
    acquaintances, children/teens.
- If exact case is not covered, include `Other occasion` / `Other recipient` as selectable options; only after that
  option is chosen, request a short free-text clarification.
- Always propose a concrete selectable list for **emoji intensity** and **formatting intensity**.
- Do not skip style choices even if the user did not ask directly.
- The generated greeting must always include:
  - emoji according to selected intensity;
  - GitHub-Flavored Markdown according to selected formatting intensity (minimal = light emphasis; rich = headings,
    lists, and structure throughout).
- If user requests strict plain text, clarify conflict and ask whether to override the mandatory style policy.

## Gender Applicability Rule (General)

- Request recipient gender only when it is not already obvious from selected recipient category.
- Do not request recipient gender for categories with fixed gender semantics (example: mother/father, wife/husband,
  sister/brother, grandma/grandpa).
- Request sender gender when first-person wording can require gender agreement or when style precision depends on it.
- For group recipients (team/audience), prefer neutral/plural phrasing and skip unnecessary gender questions.

## Quality Checklist

- Message sounds human and situation-aware.
- Occasion and recipient fit the selected options.
- Opening, core wish, and ending are balanced.
- Personal details are integrated naturally.
- Tone consistency is preserved throughout.
- Emoji usage matches selected intensity.
- Formatting usage matches selected intensity.
- No clichés unless user explicitly prefers them.

## Common Failure Modes And Prevention

- Generic greeting: require selected occasion + recipient category and at least 1-2 concrete anchors when available.
- Tone mismatch: validate formality and humor tolerance before drafting.
- Missing style controls: never generate before emoji/formatting intensity is chosen.
- Gender mistakes in grammar-sensitive languages: ask only applicable gender questions, then lock agreement rules before
  drafting.
- Overlong text: lock length target and channel-specific limits upfront.
