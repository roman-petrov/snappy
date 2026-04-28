import { describe, expect, it } from "vitest";

import { StructuredPrompt } from "./StructuredPrompt";

describe(`StructuredPrompt`, () => {
  it(`rejects duplicate section tags at compile time`, () => {
    // @ts-expect-error duplicate "role" section must fail type-check
    StructuredPrompt([
      [`role`, `You are a helpful assistant.`],
      [`role`, `Answer briefly.`],
    ] as const);

    expect(true).toBe(true);
  });

  it(`wraps sections with XML-like tags`, () => {
    expect(
      StructuredPrompt([
        [`role`, `You are a helpful assistant.`],
        [`rules`, `Answer briefly.`],
      ] as const),
    ).toMatchInlineSnapshot(`
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
      StructuredPrompt([
        [
          `language_policy`,
          `Use only Russian.
Never mix languages.`,
        ],
      ] as const),
    ).toMatchInlineSnapshot(`
      "<language_policy>
      Use only Russian.
      Never mix languages.
      </language_policy>"
    `);
  });
});
