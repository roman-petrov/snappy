// cspell:disable
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;

describe(`apply`, () => {
  describe(`table`, () => {
    it(`strips lone table opener before header has cell content`, () => {
      expect(apply(`|`)).toBe(``);
      expect(apply(`| `)).toBe(``);
      expect(apply(`Intro\n\n|`)).toBe(`Intro\n\n`);
      expect(apply(`## Metrics\n\n|`)).toBe(`## Metrics\n\n`);
    });

    it(`adds separator only after header row has cell content`, () => {
      expect(apply(`| N`)).toMatchInlineSnapshot(`
        "| N |
        | --- |"
      `);
      expect(apply(`| Name | Value |`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
    });

    it(`does not append empty or partial separator rows while streaming after header`, () => {
      expect(apply(`| Name | Value |\n|`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
      expect(apply(`| Name | Value |\n| -`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
    });

    it(`adds GFM separator after header row`, () => {
      expect(apply(`| Name | Value |`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
    });

    it(`completes truncated GFM separator`, () => {
      expect(apply(`| Name | Value |\n| --- |`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
    });

    it(`repairs partial cell with bold`, () => {
      expect(apply(`| **partial`)).toMatchInlineSnapshot(`
        "| **partial** |
        | --- |"
      `);
    });

    it(`completes header row missing trailing pipe`, () => {
      expect(apply(`| Name | Value`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |"
      `);
    });

    it(`inserts separator for multi-row table block`, () => {
      expect(
        apply(`| A | B |
| 1 | 2 |`),
      ).toMatchInlineSnapshot(`
        "| A | B |
        | --- | --- |
        | 1 | 2 |"
      `);
    });

    it(`completes dashed separator row for GFM table parse`, () => {
      expect(
        apply(
          `Metrics for comparison.

| | Name | Size | Distance | Moons |
|----------|-------------- |`,
        ),
      ).toMatchInlineSnapshot(`
        "Metrics for comparison.

        | | Name | Size | Distance | Moons |
        | --- | --- | --- | --- | --- |"
      `);
    });

    it(`counts empty leading column in separator`, () => {
      expect(apply(`| | Name | Size |`)).toMatchInlineSnapshot(`
        "| | Name | Size |
        | --- | --- | --- |"
      `);
    });

    it(`leaves balanced bold and italic in separate cells unchanged`, () => {
      expect(apply(`| **b** | _i_ |`)).toMatchInlineSnapshot(`
        "| **b** | _i_ |
        | --- | --- |"
      `);
    });

    it(`closes partial bold in table cell without extra column`, () => {
      expect(apply(`| ok | **bo |`)).toMatchInlineSnapshot(`
        "| ok | **bo** |
        | --- | --- |"
      `);
    });

    it(`closes partial emphasis in single-cell row without extra separator columns`, () => {
      expect(apply(`| __bo |`)).toMatchInlineSnapshot(`
        "| __bo__ |
        | --- |"
      `);
      expect(apply(`| ***x |`)).toMatchInlineSnapshot(`
        "| ***x*** |
        | --- |"
      `);
    });

    it(`closes partial bold in body row without extra column`, () => {
      expect(apply(`| H1 | H2 |\n| plain | **bo |`)).toMatchInlineSnapshot(`
        "| H1 | H2 |
        | --- | --- |
        | plain | **bo** |"
      `);
    });

    it(`does not treat blank line before table as table row`, () => {
      expect(apply(`Intro line\n\n| cell |\n| **bo |`)).toMatchInlineSnapshot(`
        "Intro line

        | cell |
        | --- |
        | **bo** |"
      `);
    });

    it(`closes partial italic inside first table cell`, () => {
      expect(apply(`| _it | plain |`)).toMatchInlineSnapshot(`
        "| _it_ | plain |
        | --- | --- |"
      `);
    });

    it(`closes partial bold in first table cell without extra column`, () => {
      expect(apply(`| Name | Value |\n| **partial | end |`)).toMatchInlineSnapshot(`
        "| Name | Value |
        | --- | --- |
        | **partial** | end |"
      `);
    });

    it(`closes partial inline code in table cell without extra column`, () => {
      expect(apply(`| \`co |`)).toMatchInlineSnapshot(`
        "| \`co\` |
        | --- |"
      `);
    });

    it(`closes partial emphasis in table cell`, () => {
      expect(apply(`| **bo |`)).toMatchInlineSnapshot(`
        "| **bo** |
        | --- |"
      `);
      expect(apply(`| *it |`)).toMatchInlineSnapshot(`
        "| *it* |
        | --- |"
      `);
      expect(apply(`| ***x |`)).toMatchInlineSnapshot(`
        "| ***x*** |
        | --- |"
      `);
      expect(apply(`| ~~st |`)).toMatchInlineSnapshot(`
        "| ~~st~~ |
        | --- |"
      `);
      expect(apply(`| __bo |`)).toMatchInlineSnapshot(`
        "| __bo__ |
        | --- |"
      `);
      expect(apply(`| _it |`)).toMatchInlineSnapshot(`
        "| _it_ |
        | --- |"
      `);
    });

    it(`leaves balanced emphasis in table cells unchanged`, () => {
      expect(apply(`| **b** |`)).toMatchInlineSnapshot(`
        "| **b** |
        | --- |"
      `);
      expect(apply(`| *i* |`)).toMatchInlineSnapshot(`
        "| *i* |
        | --- |"
      `);
      expect(apply(`| ***bi*** |`)).toMatchInlineSnapshot(`
        "| ***bi*** |
        | --- |"
      `);
      expect(apply(`| ~~s~~ |`)).toMatchInlineSnapshot(`
        "| ~~s~~ |
        | --- |"
      `);
      expect(apply(`| __b__ |`)).toMatchInlineSnapshot(`
        "| __b__ |
        | --- |"
      `);
      expect(apply(`| _i_ |`)).toMatchInlineSnapshot(`
        "| _i_ |
        | --- |"
      `);
    });
  });
});
