// cspell:disable
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;

describe(`apply`, () => {
  describe(`code`, () => {
    it(`closes opening fence`, () => {
      expect(apply(`\`\`\`ts\nconst `)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const 
        \`\`\`
        "
      `);
    });

    it(`closes unclosed fence body`, () => {
      expect(apply(`\`\`\`ts\nconst x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const x = 1
        \`\`\`
        "
      `);
    });

    it(`closes complete fenced block`, () => {
      expect(
        apply(`\`\`\`ts
const x = 1;
\`\`\``),
      ).toMatchInlineSnapshot(`
        "\`\`\`ts
        const x = 1;
        \`\`\`"
      `);
    });

    it(`closes fence without language tag`, () => {
      expect(apply(`\`\`\`\ncode`)).toMatchInlineSnapshot(`
        "\`\`\`
        code
        \`\`\`
        "
      `);
    });

    it(`closes partial inline backtick`, () => {
      expect(apply(`\`code`)).toMatchInlineSnapshot(`"\`code\`"`);
    });

    it(`closes partial inline backtick in open fence`, () => {
      expect(apply(`\`\`\`ts\nconst x = \`y`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const x = \`y
        \`\`\`
        "
      `);
    });

    it(`does not remend emphasis inside open fenced block`, () => {
      expect(apply(`\`\`\`ts\nconst **x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const **x = 1
        \`\`\`
        "
      `);
      expect(apply(`\`\`\`ts\nconst *x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const *x = 1
        \`\`\`
        "
      `);
      expect(apply(`\`\`\`ts\nconst ***x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const ***x = 1
        \`\`\`
        "
      `);
      expect(apply(`\`\`\`ts\nconst ~~x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const ~~x = 1
        \`\`\`
        "
      `);
      expect(apply(`\`\`\`ts\nconst __x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const __x = 1
        \`\`\`
        "
      `);
      expect(apply(`\`\`\`ts\nconst _x = 1`)).toMatchInlineSnapshot(`
        "\`\`\`ts
        const _x = 1
        \`\`\`
        "
      `);
    });

    it(`closes partial bold in table row after fence without extra column`, () => {
      expect(apply(`\`\`\`js\nok();\n\`\`\`\n| **b |`)).toMatchInlineSnapshot(`
        "\`\`\`js
        ok();
        \`\`\`
        | **b** |
        | --- |"
      `);
    });

    it(`closes second open fence without orphan backticks`, () => {
      expect(
        apply(
          `\`\`\`js
a();
\`\`\`

\`\`\`ts
const y = 2;
\`\``,
        ),
      ).toMatchInlineSnapshot(`
        "\`\`\`js
        a();
        \`\`\`

        \`\`\`ts
        const y = 2;
        \`\`\`"
      `);
    });
  });
});
