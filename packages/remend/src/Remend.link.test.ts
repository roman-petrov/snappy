import { Unicode } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;
const task = (mark: ` ` | `x`) => `- [${mark}] ${Unicode.zeroWidthSpace}`;

describe(`apply`, () => {
  describe(`link`, () => {
    it(`closes incomplete label as a placeholder link`, () => {
      expect(apply(`See [ex`)).toBe(`See [ex](#)`);
    });

    it(`closes bare label before the url arrives`, () => {
      expect(apply(`See [example]`)).toBe(`See [example](#)`);
    });

    it(`closes empty url paren with a placeholder`, () => {
      expect(apply(`See [example](`)).toBe(`See [example](#)`);
    });

    it(`closes a partial url`, () => {
      expect(apply(`See [example](https://exam`)).toBe(`See [example](https://exam)`);
    });

    it(`closes a partial titled url`, () => {
      expect(apply(`See [repo](https://example.com "Ex`)).toBe(`See [repo](https://example.com "Ex")`);
    });

    it(`leaves a complete inline link unchanged`, () => {
      expect(apply(`See [example](https://example.com).`)).toBe(`See [example](https://example.com).`);
    });

    it(`leaves a complete titled link unchanged`, () => {
      expect(apply(`[repo](https://example.com "Example title")`)).toBe(`[repo](https://example.com "Example title")`);
    });

    it(`rewrites an incomplete reference destination to a placeholder link`, () => {
      expect(apply(`See [same site][exam`)).toBe(`See [same site](#)`);
    });

    it(`rewrites a reference link before its definition arrives`, () => {
      expect(apply(`See [same site][example-ref] after.`)).toBe(`See [same site](#) after.`);
    });

    it(`keeps a reference link once its definition is present`, () => {
      expect(apply(`See [same site][example-ref].\n\n[example-ref]: https://example.com/ref`)).toBe(
        `See [same site][example-ref].\n\n[example-ref]: https://example.com/ref`,
      );
    });

    it(`leaves a complete link definition line alone`, () => {
      expect(apply(`[example-ref]: https://example.com/ref`)).toBe(`[example-ref]: https://example.com/ref`);
    });

    it(`hides an empty link definition until the url arrives`, () => {
      expect(apply(`See [same site][example-ref].\n\n[example-ref]:`)).toBe(`See [same site](#).\n\n`);
    });

    it(`drops an unfinished definition title while keeping the url`, () => {
      expect(apply(`[example-ref]: https://example.com/ref "Tit`)).toBe(`[example-ref]: https://example.com/ref`);
    });

    it(`closes an incomplete autolink`, () => {
      expect(apply(`Go <https://example.com/pa`)).toBe(`Go <https://example.com/pa>`);
    });

    it(`hides an autolink opener until the url scheme is ready`, () => {
      expect(apply(`Autolink form: <http`)).toBe(`Autolink form: `);
      expect(apply(`Autolink form: <https`)).toBe(`Autolink form: `);
      expect(apply(`Autolink form: <https:`)).toBe(`Autolink form: `);
      expect(apply(`Autolink form: <https:/`)).toBe(`Autolink form: `);
    });

    it(`leaves a complete autolink unchanged`, () => {
      expect(apply(`Go <https://example.com/path>.`)).toBe(`Go <https://example.com/path>.`);
    });

    it(`repairs links inside a table cell before the row trailing pipe is added`, () => {
      expect(apply(`| Note |\n| --- |\n| link cell [docs`)).toBe(`| Note |\n| --- |\n| link cell [docs](#) |`);
      expect(apply(`| Note |\n| --- |\n| link cell [docs]`)).toBe(`| Note |\n| --- |\n| link cell [docs](#) |`);
      expect(apply(`| Note |\n| --- |\n| link cell [docs](https://exam`)).toBe(
        `| Note |\n| --- |\n| link cell [docs](https://exam) |`,
      );
    });

    it(`keeps a finished table-cell link intact`, () => {
      expect(apply(`| Note |\n| --- |\n| link cell [docs](https://example.com) |`)).toBe(
        `| Note |\n| --- |\n| link cell [docs](https://example.com) |`,
      );
    });

    it(`strips an incomplete image`, () => {
      expect(apply(`Before ![alt`)).toBe(`Before `);
    });

    it(`strips an incomplete image url`, () => {
      expect(apply(`Before ![alt](https://img`)).toBe(`Before `);
    });

    it(`does not repair links inside a fenced block`, () => {
      expect(apply(`\`\`\`\nSee [ex\n\`\`\``)).toBe(`\`\`\`\nSee [ex\n\`\`\``);
    });

    it(`does not repair links inside inline code`, () => {
      expect(apply(`Use \`[ex\` later`)).toMatchInlineSnapshot(`"Use \`[ex\` later"`);
    });

    it(`keeps streaming prefixes free of raw link markers in visible markdown`, () => {
      const full = `See [example](https://example.com) and [repo](https://example.com "Title") and <https://example.com/x>.`;

      for (let index = 1; index <= full.length; index += 1) {
        const repaired = apply(full.slice(0, index));

        expect(repaired.includes(`](`) && !repaired.includes(`)`)).toBe(false);
        expect(/\[[^\]]{0,500}$/u.test(repaired)).toBe(false);
        expect(/<http[^\n>]{0,500}$/u.test(repaired)).toBe(false);
      }
    });

    it(`keeps streaming table-cell link prefixes free of raw brackets`, () => {
      const full = `| Note |\n| --- |\n| link cell [docs](https://example.com) |`;

      for (let index = 1; index <= full.length; index += 1) {
        const repaired = apply(full.slice(0, index));

        expect(repaired).not.toMatch(/\[[^\]]{0,500}\|/u);
        expect(repaired).not.toMatch(/\]\([^)]{0,500}\|\)/u);
        expect(repaired.includes(`](`) && !repaired.includes(`)`)).toBe(false);
      }
    });

    it(`completes a streaming task checkbox so marked can emit an input, not raw brackets`, () => {
      expect(apply(`- [`)).toBe(task(` `));
      expect(apply(`- [x`)).toBe(task(`x`));
      expect(apply(`- [ ]`)).toBe(task(` `));
      expect(apply(`- [x]`)).toBe(task(`x`));
      expect(apply(`* [ ]`)).toBe(`* [ ] ${Unicode.zeroWidthSpace}`);
      expect(apply(`1. [ ]`)).toBe(`1. [ ] ${Unicode.zeroWidthSpace}`);
    });

    it(`leaves labeled task items unchanged while still repairing prose links after the checkbox`, () => {
      expect(apply(`- [ ] Triage inbox with today`)).toBe(`- [ ] Triage inbox with today`);
      expect(apply(`- [x] File one evergreen note`)).toBe(`- [x] File one evergreen note`);
      expect(apply(`- [ ] See [docs`)).toBe(`- [ ] See [docs](#)`);
    });

    it(`keeps streaming task list prefixes free of placeholder links and raw bare checkboxes`, () => {
      const full = `- [ ] Triage inbox with today
- [x] File one evergreen note with links
- [ ] Prune a stale note with care`;

      for (let index = 1; index <= full.length; index += 1) {
        const repaired = apply(full.slice(0, index));

        expect(repaired).not.toMatch(/\]\(#\)/u);
        expect(repaired).not.toMatch(/(?:^|\n)[^\S\n]*(?:[*+-]|\d+\.)[^\S\n]+\[[ x]?\]?[^\S\n]*$/iu);
      }
    });
  });
});
