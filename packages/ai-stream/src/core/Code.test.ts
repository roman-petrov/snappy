import { describe, expect, it } from "vitest";

import { Code } from "./Code";

describe(`Code`, () => {
  it(`falls back to text for unknown or partial fence language ids`, async () => {
    const highlight = Code();
    const html = await highlight({ lang: `t`, source: `const x = 1;`, theme: `dark-plus` });

    expect(html).toContain(`<pre`);
    expect(html).toContain(`const x = 1;`);
  });

  it(`highlights a known language without throwing`, async () => {
    const highlight = Code();
    const html = await highlight({ closed: true, lang: `ts`, source: `const x = 1;`, theme: `light-plus` });

    expect(html).toContain(`<pre`);
    expect(html).toContain(`>const<`);
    expect(html).toContain(`>x<`);
  });
});
