import { describe, expect, it } from "vitest";

import { ImageSize } from "./ImageSize";

const { apiBody, orientation, request } = ImageSize;

describe(`request`, () => {
  it(`passes size through for gpt models`, () => {
    expect(request(`gpt`, { size: `1536x1024` })).toStrictEqual({ size: `1536x1024` });
  });

  it(`returns empty request when size is omitted`, () => {
    expect(request(`gpt`, {})).toStrictEqual({});
  });

  it(`builds gemini image config from aspect ratio and resolution`, () => {
    expect(request(`gemini`, { aspectRatio: `16:9`, resolution: `4K` })).toStrictEqual({
      imageConfig: { aspectRatio: `16:9`, resolution: `4K` },
    });
  });

  it(`defaults gemini aspect ratio when only resolution is set`, () => {
    expect(request(`gemini`, { resolution: `2K` })).toStrictEqual({
      imageConfig: { aspectRatio: `1:1`, resolution: `2K` },
    });
  });

  it(`builds flux image config from width and height`, () => {
    expect(request(`flux`, { height: 768, width: 1344 })).toStrictEqual({ imageConfig: { height: 768, width: 1344 } });
  });

  it(`ignores partial flux dimensions`, () => {
    expect(request(`flux`, { width: 1024 })).toStrictEqual({});
  });
});

describe(`orientation`, () => {
  const sizes = [`1024x1024`, `1024x1536`, `1536x1024`] as const;

  it(`picks the matching size for each orientation`, () => {
    expect(orientation(sizes, `square`)).toBe(`1024x1024`);
    expect(orientation(sizes, `portrait`)).toBe(`1024x1536`);
    expect(orientation(sizes, `landscape`)).toBe(`1536x1024`);
  });

  it(`returns undefined for an unknown orientation`, () => {
    expect(orientation(sizes, `centered`)).toBeUndefined();
  });

  it(`returns undefined when the model has no matching size`, () => {
    expect(orientation([`1024x1024`], `portrait`)).toBeUndefined();
  });
});

describe(`apiBody`, () => {
  it(`maps gemini config to aspect_ratio and image_size`, () => {
    expect(apiBody({ aspectRatio: `16:9`, resolution: `2K` })).toStrictEqual({
      aspect_ratio: `16:9`,
      image_size: `2K`,
    });
  });

  it(`maps flux config to width and height`, () => {
    expect(apiBody({ height: 1024, width: 1024 })).toStrictEqual({ height: 1024, width: 1024 });
  });
});
