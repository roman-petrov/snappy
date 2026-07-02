import { describe, expect, it } from "vitest";

import { ImageSize } from "./ImageSize";

const { apiBody, request } = ImageSize;

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
