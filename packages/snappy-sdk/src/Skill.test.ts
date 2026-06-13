import { describe, expect, it } from "vitest";

import { Skill } from "./Skill";

describe(`Skill.parse`, () => {
  it(`parses frontmatter and sorts skills by id`, () => {
    expect(
      Skill.parse([
        `---
id: zeta
description: "Zeta description"
name:
  en: "Zeta title"
  ru: "Зета"
---
Zeta body`,
        `---
id: alpha
description: "Alpha description"
name:
  en: "Alpha title"
  ru: "Альфа"
---
Alpha body`,
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "content": "Alpha body",
          "id": "alpha",
          "meta": {
            "description": "Alpha description",
            "name": {
              "en": "Alpha title",
              "ru": "Альфа",
            },
          },
        },
        {
          "content": "Zeta body",
          "id": "zeta",
          "meta": {
            "description": "Zeta description",
            "name": {
              "en": "Zeta title",
              "ru": "Зета",
            },
          },
        },
      ]
    `);
  });

  it(`returns empty meta fields when frontmatter is missing`, () => {
    expect(Skill.parse([`Plain body`])).toMatchInlineSnapshot(`
      [
        {
          "content": "Plain body",
          "id": "",
          "meta": {
            "description": "",
            "name": {
              "en": "",
              "ru": "",
            },
          },
        },
      ]
    `);
  });

  it(`returns empty strings for missing metadata keys`, () => {
    expect(
      Skill.parse([
        `---
id: partial
name:
  en: "Only EN"
---
Body`,
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "content": "Body",
          "id": "partial",
          "meta": {
            "description": "",
            "name": {
              "en": "Only EN",
              "ru": "",
            },
          },
        },
      ]
    `);
  });

  it(`unquotes both single and double quoted values`, () => {
    expect(
      Skill.parse([
        `---
id: quotes
description: 'Single quoted description'
name:
  en: "Double quoted en"
  ru: 'Single quoted ru'
---
Body`,
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "content": "Body",
          "id": "quotes",
          "meta": {
            "description": "Single quoted description",
            "name": {
              "en": "Double quoted en",
              "ru": "Single quoted ru",
            },
          },
        },
      ]
    `);
  });
});
