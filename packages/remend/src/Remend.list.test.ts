// cspell:disable
import { Unicode } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;

describe(`apply`, () => {
  describe(`list`, () => {
    it(`completes incomplete nested marker for early empty list item`, () => {
      expect(apply(`- One\n  -`)).toBe(`- One\n  - ${Unicode.zeroWidthSpace}`);
    });

    it(`leaves balanced list item emphasis unchanged`, () => {
      expect(apply(`- First **bold** second`)).toMatchInlineSnapshot(`"- First **bold** second"`);
    });

    it(`closes partial asterisk bold in list item`, () => {
      expect(apply(`- First **bo`)).toMatchInlineSnapshot(`"- First **bo**"`);
    });

    it(`closes partial underscore bold in list item`, () => {
      expect(apply(`- First __bo`)).toMatchInlineSnapshot(`"- First __bo__"`);
    });

    it(`closes open bold when streamed text ends after closing marker`, () => {
      expect(apply(`- First **bold**`)).toMatchInlineSnapshot(`"- First **bold**"`);
    });

    it(`closes nested bold marker on last line`, () => {
      expect(apply(`- One\n  - **nested`)).toMatchInlineSnapshot(`
        "- One
          - **nested**"
      `);
    });

    it(`completes incomplete top-level list marker for early empty list item`, () => {
      expect(apply(`- One\n-`)).toBe(`- One\n- ${Unicode.zeroWidthSpace}`);
    });

    it(`completes incomplete ordered list marker for early empty list item`, () => {
      expect(apply(`- One\n1.`)).toBe(`- One\n1. ${Unicode.zeroWidthSpace}`);
    });

    it(`closes partial bold in ordered item`, () => {
      expect(apply(`1. **bo`)).toMatchInlineSnapshot(`"1. **bo**"`);
    });

    it(`supports plus marker list`, () => {
      expect(apply(`+ item`)).toMatchInlineSnapshot(`"+ item"`);
    });

    it(`supports asterisk marker list`, () => {
      expect(apply(`* item`)).toMatchInlineSnapshot(`"* item"`);
    });

    it(`closes partial underscore italic in list item`, () => {
      expect(apply(`- Alpha _ita`)).toMatchInlineSnapshot(`"- Alpha _ita_"`);
    });

    it(`preserves list item text after closed bold mid-stream`, () => {
      expect(apply(`- First **bold** sec`)).toMatchInlineSnapshot(`"- First **bold** sec"`);
    });

    it(`leaves balanced emphasis in parent and nested items unchanged`, () => {
      expect(apply(`- **a**\n  - _b_`)).toMatchInlineSnapshot(`
        "- **a**
          - _b_"
      `);
    });

    it(`closes partial bold in third-level nested item`, () => {
      expect(apply(`- L1\n  - L2\n    - **x`)).toMatchInlineSnapshot(`
        "- L1
          - L2
            - **x**"
      `);
    });

    it(`closes partial italic in nested item on last line`, () => {
      expect(apply(`- A\n  - _it`)).toMatchInlineSnapshot(`
        "- A
          - _it_"
      `);
    });

    it(`closes partial bold in ordered nested item`, () => {
      expect(apply(`1. A\n   2. **bo`)).toMatchInlineSnapshot(`
        "1. A
           2. **bo**"
      `);
    });

    it(`closes partial bold in task list item`, () => {
      expect(apply(`- [ ] **ta`)).toMatchInlineSnapshot(`"- [ ] **ta**"`);
    });

    it(`closes partial bold-italic on parent line before nested item`, () => {
      expect(apply(`- A ***bo\n  - B`)).toMatchInlineSnapshot(`
        "- A ***bo***
          - B"
      `);
    });

    it(`closes partial bold in each nested list item on its line`, () => {
      expect(apply(`- **ou\n  - **in`)).toMatchInlineSnapshot(`
        "- **ou**
          - **in**"
      `);
    });

    it(`closes outer list item bold when nested item has balanced bold`, () => {
      expect(apply(`- **outer\n  - **inner**`)).toMatchInlineSnapshot(`
        "- **outer**
          - **inner**"
      `);
    });

    it(`closes partial emphasis in list item`, () => {
      expect(apply(`- **bo`)).toMatchInlineSnapshot(`"- **bo**"`);
      expect(apply(`- *it`)).toMatchInlineSnapshot(`"- *it*"`);
      expect(apply(`- ***x`)).toMatchInlineSnapshot(`"- ***x***"`);
      expect(apply(`- ~~st`)).toMatchInlineSnapshot(`"- ~~st~~"`);
      expect(apply(`- __bo`)).toMatchInlineSnapshot(`"- __bo__"`);
      expect(apply(`- _it`)).toMatchInlineSnapshot(`"- _it_"`);
    });

    it(`leaves balanced emphasis in list item unchanged`, () => {
      expect(apply(`- **b**`)).toMatchInlineSnapshot(`"- **b**"`);
      expect(apply(`- *i*`)).toMatchInlineSnapshot(`"- *i*"`);
      expect(apply(`- ***bi***`)).toMatchInlineSnapshot(`"- ***bi***"`);
      expect(apply(`- ~~s~~`)).toMatchInlineSnapshot(`"- ~~s~~"`);
      expect(apply(`- __b__`)).toMatchInlineSnapshot(`"- __b__"`);
      expect(apply(`- _i_`)).toMatchInlineSnapshot(`"- _i_"`);
    });
  });
});
