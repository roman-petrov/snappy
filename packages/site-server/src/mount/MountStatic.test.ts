import { describe, expect, it } from "vitest";

import { MountStatic } from "./MountStatic";

const file = (name: string) => ({ isFile: () => true, name });
const dir = (name: string) => ({ isFile: () => false, name });

describe(`MountStatic`, () => {
  it(`lists root files except index.html`, () => {
    const root = `/site`;

    expect(
      MountStatic([file(`favicon.ico`), file(`index.html`), file(`manifest.json`), dir(`assets`)], root),
    ).toStrictEqual([
      { name: `favicon.ico`, path: `/favicon.ico`, root },
      { name: `manifest.json`, path: `/manifest.json`, root },
    ]);
  });

  it(`returns an empty list when only index.html is present`, () => {
    expect(MountStatic([file(`index.html`)], `/site`)).toStrictEqual([]);
  });
});
