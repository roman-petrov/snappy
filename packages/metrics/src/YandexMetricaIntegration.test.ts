/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";

import { YandexMetricaIntegration } from "./YandexMetricaIntegration";

const { preview } = YandexMetricaIntegration;

const previewIn = ({ iframe, referrer }: { iframe: boolean; referrer: string }) => {
  vi.stubGlobal(`document`, { referrer });
  const frame = {};
  vi.stubGlobal(`window`, iframe ? { self: {}, top: { parent: true } } : { self: frame, top: frame });
  const result = preview();
  vi.unstubAllGlobals();

  return result;
};

describe(`preview`, () => {
  it(`returns true in a Metrica iframe`, () => {
    expect(previewIn({ iframe: true, referrer: `https://metrika.yandex.ru/stat/` })).toBe(true);
  });

  it(`returns false outside an iframe`, () => {
    expect(previewIn({ iframe: false, referrer: `https://metrika.yandex.ru/stat/` })).toBe(false);
  });

  it(`returns false in an iframe with an unrelated referrer`, () => {
    expect(previewIn({ iframe: true, referrer: `https://example.com/` })).toBe(false);
  });
});
