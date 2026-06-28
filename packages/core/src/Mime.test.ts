// cspell:word AQID BAUG
import { describe, expect, it } from "vitest";

import { Mime } from "./Mime";
import { MimeType } from "./MimeType";

const { base64, blob, dataUrl, pngDataUrl } = Mime;

describe(`base64`, () => {
  it(`encodes bytes`, () => {
    expect(base64(new Uint8Array([1, 2, 3]))).toBe(`AQID`);
  });
});

describe(`dataUrl`, () => {
  it(`encodes bytes as base64 data URL`, () => {
    expect(dataUrl(MimeType.imagePng, new Uint8Array([1, 2, 3]))).toBe(`data:image/png;base64,AQID`);
  });
});

describe(`pngDataUrl`, () => {
  it(`uses image/png type`, () => {
    expect(pngDataUrl(new Uint8Array([4, 5, 6]))).toBe(`data:image/png;base64,BAUG`);
  });
});

describe(`blob`, () => {
  it(`uses blob type`, async () => {
    const raw = new Blob([new Uint8Array([7, 8, 9])], { type: MimeType.textPlain });

    await expect(blob(raw)).resolves.toBe(`data:${MimeType.textPlain};base64,BwgJ`);
  });
});
