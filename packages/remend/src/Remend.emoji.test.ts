// cspell:disable
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;

describe(`apply`, () => {
  describe(`emoji`, () => {
    it(`strips lone high surrogate`, () => {
      expect(apply(`\uD83D`)).toMatchInlineSnapshot(`""`);
    });

    it(`strips partial flag`, () => {
      expect(apply(`🇧🇷`.slice(0, 2))).toMatchInlineSnapshot(`""`);
    });

    it(`keeps complete emoji`, () => {
      expect(apply(`😀`)).toMatchInlineSnapshot(`"😀"`);
    });

    it(`keeps bold emoji`, () => {
      expect(apply(`**😀**`)).toMatchInlineSnapshot(`"**😀**"`);
    });

    it(`keeps text before incomplete emoji`, () => {
      expect(apply(`Hi \uD83D`)).toMatchInlineSnapshot(`"Hi "`);
    });

    it(`keeps complete regional indicator pair`, () => {
      expect(apply(`🇧🇷`)).toMatchInlineSnapshot(`"🇧🇷"`);
    });

    it(`strips incomplete emoji surrogate in table cell`, () => {
      const result = apply(`| Hi \uD83D |`);

      expect(apply(`Hi \uD83D`)).toBe(`Hi `);
      expect(result).toBe(`| Hi  |\n| --- |`);
    });

    it(`closes partial bold in list item with trailing emoji`, () => {
      expect(apply(`- **ta 😀`)).toMatchInlineSnapshot(`"- **ta 😀**"`);
    });
  });
});
