/* @vitest-environment jsdom */
import { describe, expect, it } from "vitest";

import { Probe } from "./Probe";

const { activeTip, finish, suspicious } = Probe;

describe(`suspicious`, () => {
  it.each([
    [`ends with bold open`, `text **`],
    [`ends with italic underscore`, `word _`],
    [`ends with bare tick`, `code \``],
    [`ends with table pipe`, `cell |`],
    [`contains strike open`, `gone ~~`],
    [`mid italic star`, `a*b`],
  ])(`flags %s`, (_label, tip) => {
    expect(suspicious(tip)).toBe(true);
  });

  it.each([
    [`plain text`, `hello world`],
    [`fence-only backticks`, `\`\`\``],
    [`fence with zero-width spaces`, `\`\u200B\`\u200B\``],
    [`closed sentence`, `plain sentence.`],
  ])(`allows %s`, (_label, tip) => {
    expect(suspicious(tip)).toBe(false);
  });
});

describe(`activeTip`, () => {
  it(`uses the last text node so prior code stars do not pollute the tip`, () => {
    const root = document.createElement(`div`);
    root.innerHTML = `<pre><code>value * 2);</code></pre><h2>Between fences</h2>`;

    expect(activeTip(root).tip).toBe(`Between fences`);
    expect(suspicious(activeTip(root).tip)).toBe(false);
  });
});

describe(`finish`, () => {
  it(`passes when text, markers, and shape match`, () => {
    expect(finish({ expected: `doc`, finalText: `doc`, rawMarkers: 0, root: undefined, shape: [] })).toStrictEqual({
      finalText: `doc`,
      ok: true,
      rawMarkers: 0,
    });
  });

  it(`fails on final text mismatch`, () => {
    expect(finish({ expected: `doc`, finalText: `other`, rawMarkers: 0, root: undefined, shape: [] })).toStrictEqual({
      finalText: `other`,
      ok: false,
      rawMarkers: 0,
      reason: `final text mismatch`,
    });
  });

  it(`fails on raw markers`, () => {
    expect(finish({ expected: `doc`, finalText: `doc`, rawMarkers: 2, root: undefined, shape: [] })).toStrictEqual({
      finalText: `doc`,
      ok: false,
      rawMarkers: 2,
      reason: `raw markers`,
    });
  });

  it(`fails on missing shape when root is absent`, () => {
    expect(
      finish({ expected: `doc`, finalText: `doc`, rawMarkers: 0, root: undefined, shape: [`h1`, `pre`] }),
    ).toStrictEqual({ finalText: `doc`, missing: [`h1`, `pre`], ok: false, rawMarkers: 0, reason: `missing shape` });
  });
});
