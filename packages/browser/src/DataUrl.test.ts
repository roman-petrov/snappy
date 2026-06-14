import { Buffer } from "node:buffer";

import { describe, expect, it } from "vitest";

import { DataUrl } from "./DataUrl";

const ensureToBase64 = () => {
  if (`toBase64` in Uint8Array.prototype) {
    return;
  }

  Uint8Array.prototype.toBase64 = function toBase64(this: Uint8Array) {
    return Buffer.from(this).toString(`base64`);
  };
};

ensureToBase64();

const { blob, png } = DataUrl;

const hi = new Uint8Array([72, 105]);
const hiBase64 = Buffer.from(hi).toString(`base64`);

describe(`png`, () => {
  it(`builds image/png data url from bytes`, () => {
    expect(png(hi)).toBe(`data:image/png;base64,${hiBase64}`);
  });

  it(`builds data url for empty bytes`, () => {
    expect(png(new Uint8Array())).toBe(`data:image/png;base64,`);
  });
});

describe(`blob`, () => {
  it(`builds data url from blob type and bytes`, async () => {
    const raw = new Blob([hi], { type: `image/jpeg` });

    await expect(blob(raw)).resolves.toBe(`data:image/jpeg;base64,${hiBase64}`);
  });

  it(`preserves blob mime type`, async () => {
    const raw = new Blob([hi], { type: `image/webp` });

    await expect(blob(raw)).resolves.toBe(`data:image/webp;base64,${hiBase64}`);
  });
});
