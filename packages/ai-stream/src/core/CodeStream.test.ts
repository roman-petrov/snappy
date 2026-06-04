import { describe, expect, it } from "vitest";

import { CodeStream } from "./CodeStream";

const { finalizeBody, preStyle, preWrap, requestKey, sessionKey, sessionReset, sourceDelta, streamBody, tokenSpan } =
  CodeStream;

const span = (token: { content: string }) => tokenSpan(token.content, ``);

describe(`tokenSpan`, () => {
  it(`escapes plain content`, () => {
    expect(tokenSpan(`a & b`, ``)).toBe(`a &amp; b`);
  });

  it(`wraps styled content`, () => {
    expect(tokenSpan(`x`, `color:#f00`)).toBe(`<span style="color:#f00">x</span>`);
  });
});

describe(`streamBody`, () => {
  it(`appends tail when chunk is non-empty`, () => {
    expect(streamBody([{ content: `a` }], span, `tail`, `#fff`)).toContain(`tail`);
  });

  it(`returns stable body only when chunk is empty`, () => {
    expect(streamBody([{ content: `a` }], span, ``, `#fff`)).toBe(`<span class="line">a</span>`);
  });

  it(`splits on newline tokens`, () => {
    expect(streamBody([{ content: `a` }, { content: `\n` }, { content: `b` }], span, ``, `#fff`)).toBe(
      `<span class="line">a</span>\n<span class="line">b</span>`,
    );
  });
});

describe(`finalizeBody`, () => {
  it(`merges token groups into lines`, () => {
    expect(finalizeBody([{ content: `a` }], [{ content: `b` }], [{ content: `c` }], span)).toBe(
      `<span class="line">abc</span>`,
    );
  });
});

describe(`preStyle`, () => {
  it(`builds shiki pre style`, () => {
    expect(preStyle(`#111`, `#eee`)).toBe(`background-color:#111;color:#eee`);
  });

  it(`returns empty when colors are missing`, () => {
    expect(preStyle(undefined, `#eee`)).toBe(``);
  });
});

describe(`preWrap`, () => {
  it(`wraps body in shiki pre`, () => {
    expect(preWrap(`dark-plus`, `color:#1`, `<span class="line">x</span>`)).toBe(
      `<pre class="shiki dark-plus" style="color:#1" tabindex="0"><code><span class="line">x</span></code></pre>`,
    );
  });
});

describe(`sessionKey`, () => {
  it(`joins theme and lang`, () => {
    expect(sessionKey(`typescript`, `dark-plus`)).toBe(`dark-plus::typescript`);
  });
});

describe(`requestKey`, () => {
  it(`includes closed flag and source`, () => {
    expect(requestKey({ closed: true, lang: `js`, source: `x`, theme: `light-plus` })).toBe(`light-plus::js::true::x`);
  });
});

describe(`sourceDelta`, () => {
  it(`returns suffix after last source`, () => {
    expect(sourceDelta(`ab`, `abcd`)).toBe(`cd`);
  });
});

describe(`sessionReset`, () => {
  it(`is true when key changes`, () => {
    expect(sessionReset({ lang: `b`, lastSource: ``, theme: `a` }, `b`, `c`, `x`)).toBe(true);
  });

  it(`is true when source is not a prefix`, () => {
    expect(sessionReset({ lang: `b`, lastSource: `old`, theme: `a` }, `b`, `a`, `new`)).toBe(true);
  });

  it(`is false when key matches and source extends last`, () => {
    expect(sessionReset({ lang: `b`, lastSource: `ab`, theme: `a` }, `b`, `a`, `abc`)).toBe(false);
  });
});
