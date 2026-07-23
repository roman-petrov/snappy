/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";

import { Probe } from "./Probe";

const { finish, toJson, watch } = Probe;

const flushObservers = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const withRoot = async (run: (root: HTMLElement) => Promise<() => void>) => {
  const root = document.createElement(`div`);
  Object.defineProperty(root, `innerText`, { configurable: true, get: () => root.textContent || `` });
  document.body.append(root);
  let stop = (): void => undefined;

  try {
    stop = await run(root);
  } finally {
    stop();
    root.remove();
  }
};

describe(`watch`, () => {
  it.each([
    [`ends with bold open`, `text **`],
    [`ends with italic underscore`, `word _`],
    [`ends with bare tick`, `code \``],
    [`ends with table pipe`, `cell |`],
    [`contains strike open`, `gone ~~`],
    [`mid italic star`, `a*b`],
    [`ends with open link bracket`, `See [`],
    [`ends with closed link label`, `See [x]`],
    [`contains link url open`, `See [x](`],
    [`open link label in tip`, `See [exam`],
  ])(`reports a marker hit when tip %s`, async (_label, tip) => {
    await withRoot(async root => {
      const onMarkerHit = vi.fn();
      const { stop } = watch({ onMarkerHit, onRegression: vi.fn(), root });

      root.textContent = tip;
      await flushObservers();

      expect(onMarkerHit).toHaveBeenCalledTimes(1);

      return stop;
    });
  });

  it.each([
    [`plain text`, `hello world`],
    [`fence-only backticks`, `\`\`\``],
    [`fence with zero-width spaces`, `\`\u200B\`\u200B\``],
    [`closed sentence`, `plain sentence.`],
    [`balanced literal stars`, `*not bold*`],
    [`balanced literal underscores`, `_not italic_`],
    [`balanced literal ticks`, `\`not code\``],
    [`pipe in the middle of a tip`, `pipe | out`],
  ])(`ignores %s`, async (_label, tip) => {
    await withRoot(async root => {
      const onMarkerHit = vi.fn();
      const { stop } = watch({ onMarkerHit, onRegression: vi.fn(), root });

      root.textContent = tip;
      await flushObservers();

      expect(onMarkerHit).not.toHaveBeenCalled();

      return stop;
    });
  });

  it(`ignores suspicious tips inside trusted code`, async () => {
    await withRoot(async root => {
      const onMarkerHit = vi.fn();
      const { stop } = watch({ onMarkerHit, onRegression: vi.fn(), root });

      root.innerHTML = `<pre><code>text **</code></pre>`;
      await flushObservers();

      expect(onMarkerHit).not.toHaveBeenCalled();

      return stop;
    });
  });

  it(`uses the last text node so prior code stars do not pollute the tip`, async () => {
    await withRoot(async root => {
      const onMarkerHit = vi.fn();
      const { stop } = watch({ onMarkerHit, onRegression: vi.fn(), root });

      root.innerHTML = `<pre><code>value * 2);</code></pre><h2>Between fences</h2>`;
      await flushObservers();

      expect(onMarkerHit).not.toHaveBeenCalled();

      return stop;
    });
  });

  it(`reports a visible regression when word length shrinks`, async () => {
    await withRoot(async root => {
      const onRegression = vi.fn();
      const { stop } = watch({ onMarkerHit: vi.fn(), onRegression, root });
      const longer = document.createTextNode(`hello world again please`);
      root.append(longer);
      await flushObservers();
      longer.data = `hello`;
      await flushObservers();

      expect(onRegression).toHaveBeenCalledTimes(1);

      return stop;
    });
  });
});

describe(`finish`, () => {
  it(`passes when text, markers, regressions, and shape match`, () => {
    expect(
      finish({ expected: `doc`, finalText: `doc`, rawMarkers: 0, regressions: 0, root: undefined, shape: [] }),
    ).toStrictEqual({ finalText: `doc`, ok: true, rawMarkers: 0, regressions: 0 });
  });

  it(`fails on final text mismatch`, () => {
    expect(
      finish({ expected: `doc`, finalText: `other`, rawMarkers: 0, regressions: 0, root: undefined, shape: [] }),
    ).toStrictEqual({ finalText: `other`, ok: false, rawMarkers: 0, reason: `final text mismatch`, regressions: 0 });
  });

  it(`fails on raw markers`, () => {
    expect(
      finish({ expected: `doc`, finalText: `doc`, rawMarkers: 2, regressions: 0, root: undefined, shape: [] }),
    ).toStrictEqual({ finalText: `doc`, ok: false, rawMarkers: 2, reason: `raw markers`, regressions: 0 });
  });

  it(`fails on visible regressions`, () => {
    expect(
      finish({ expected: `doc`, finalText: `doc`, rawMarkers: 0, regressions: 3, root: undefined, shape: [] }),
    ).toStrictEqual({ finalText: `doc`, ok: false, rawMarkers: 0, reason: `visible regressions`, regressions: 3 });
  });

  it(`fails on missing shape when root is absent`, () => {
    expect(
      finish({
        expected: `doc`,
        finalText: `doc`,
        rawMarkers: 0,
        regressions: 0,
        root: undefined,
        shape: [`h1`, `pre`],
      }),
    ).toStrictEqual({
      finalText: `doc`,
      missing: [`h1`, `pre`],
      ok: false,
      rawMarkers: 0,
      reason: `missing shape`,
      regressions: 0,
    });
  });
});

describe(`toJson`, () => {
  it(`returns an empty string for undefined`, () => {
    expect(toJson(undefined)).toBe(``);
  });

  it(`pretty-prints a report`, () => {
    expect(toJson({ finalText: `doc`, ok: true, rawMarkers: 0, regressions: 0 })).toBe(
      JSON.stringify({ finalText: `doc`, ok: true, rawMarkers: 0, regressions: 0 }, undefined, 2),
    );
  });
});
