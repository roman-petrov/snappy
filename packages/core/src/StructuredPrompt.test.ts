/* eslint-disable vitest/expect-expect */
import { describe, expect, expectTypeOf, it } from "vitest";

import { StructuredPrompt, type StructuredPromptSection } from "./StructuredPrompt";

describe(`StructuredPrompt`, () => {
  describe(`types`, () => {
    it(`returns string`, () => {
      const prompt = StructuredPrompt([[`role`, `text`]] as const);

      expectTypeOf(prompt).toEqualTypeOf<string>();
    });

    it(`accepts unique section tags`, () => {
      const sections = [
        [`role`, `You are a helpful assistant.`],
        [`rules`, `Answer briefly.`],
      ] as const;

      expectTypeOf(StructuredPrompt).toBeFunction();
      expectTypeOf(sections).toExtend<readonly StructuredPromptSection[]>();
      expectTypeOf(StructuredPrompt(sections)).toEqualTypeOf<string>();
    });

    it(`rejects duplicate section tags at compile time`, () => {
      // @ts-expect-error duplicate section
      StructuredPrompt([
        [`role`, `You are a helpful assistant.`],
        [`role`, `Answer briefly.`],
      ] as const);
    });
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
