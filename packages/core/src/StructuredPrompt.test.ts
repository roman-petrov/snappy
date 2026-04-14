import { describe, expect, it } from "vitest";

import { StructuredPrompt } from "./StructuredPrompt";

const { create } = StructuredPrompt;

describe(`create`, () => {
  it(`wraps sections with XML-like tags`, () => {
    expect(create({ role: `You are a helpful assistant.`, rules: `Answer briefly.` })).toMatchInlineSnapshot(`
      "<role>
      You are a helpful assistant.
      </role>

      <rules>
      Answer briefly.
      </rules>"
    `);
  });

  it(`keeps multiline content and blank line separation`, () => {
    expect(
      create({
        language_policy: `Use only Russian.
Never mix languages.`,
      }),
    ).toMatchInlineSnapshot(`
      "<language_policy>
      Use only Russian.
      Never mix languages.
      </language_policy>"
    `);
  });
});
