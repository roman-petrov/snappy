// cspell:word dall
import { describe, expect, it } from "vitest";

import { ProxyApiCostCalculator } from "./ProxyApiCostCalculator";

const calc = ProxyApiCostCalculator(1);
const perMillion = 1_000_000;
const imageTokenRubPerMillion = 400;
const chatModelIds = [`gpt-5-mini`, `gpt-5.4-mini`, `gpt-5.4-nano`] as const;
const imageModelIds = [`dall-e-3`, `gemini-3.1-flash-image-preview`, `gpt-image-1.5`] as const;
const speechModelIds = [`whisper-1`, `gpt-4o-transcribe`] as const;

describe(`proxyApiCostCalculator.chat`, () => {
  it(`floors every supported model when token cost would be below the Snappy minimum (0.05 ₽)`, () => {
    for (const modelId of chatModelIds) {
      expect(calc.chat(modelId, { completionTok: 0, promptTok: 1 })).toBe(0.05);
    }
  });

  it(`charges zero prompt and zero completion at the chat floor (not zero rub)`, () => {
    expect(calc.chat(`gpt-5-mini`, { completionTok: 0, promptTok: 0 })).toBe(0.05);
  });

  it(`gpt-5-mini: 1M prompt tokens at 65 ₽/1M (proxyapi.ru list)`, () => {
    expect(calc.chat(`gpt-5-mini`, { completionTok: 0, promptTok: perMillion })).toBe(65);
  });

  it(`gpt-5-mini: 1M completion-only at 516 ₽/1M (proxyapi.ru list)`, () => {
    expect(calc.chat(`gpt-5-mini`, { completionTok: perMillion, promptTok: 0 })).toBe(516);
  });

  it(`gpt-5.4-mini: 1M in + 1M out = 230 + 1 370 ₽ (proxyapi.ru list)`, () => {
    expect(calc.chat(`gpt-5.4-mini`, { completionTok: perMillion, promptTok: perMillion })).toBe(230 + 1370);
  });

  it(`gpt-5.4-nano: blends 75% prompt (61 ₽/M) and 25% completion (380 ₽/M)`, () => {
    expect(calc.chat(`gpt-5.4-nano`, { completionTok: 250_000, promptTok: 750_000 })).toBe(0.75 * 61 + 0.25 * 380);
  });
});

describe(`proxyApiCostCalculator.image`, () => {
  describe(`dall-e-3`, () => {
    it(`per-image prices match proxyapi.ru list (dall-e-2 small squares, dall-e-3 large)`, () => {
      expect(calc.image(`dall-e-3`, { size: `256x256`, totalTokens: 0 })).toBe(4.13);
      expect(calc.image(`dall-e-3`, { size: `512x512`, totalTokens: 0 })).toBe(4.64);
      expect(calc.image(`dall-e-3`, { size: `1024x1024`, totalTokens: 0 })).toBe(11);
      expect(calc.image(`dall-e-3`, { size: `1024x1792`, totalTokens: 0 })).toBe(21);
      expect(calc.image(`dall-e-3`, { size: `1792x1024`, totalTokens: 0 })).toBe(21);
    });

    it(`uses per-token path when totalTokens > 0 (size ignored on that branch)`, () => {
      const tokens = 10_000;

      expect(calc.image(`dall-e-3`, { size: `256x256`, totalTokens: tokens })).toBe(
        (tokens / perMillion) * imageTokenRubPerMillion,
      );
    });

    it(`token path equals the Snappy floor when raw cost is exactly 0.1 ₽ (250 tokens at 400 ₽/M)`, () => {
      expect(calc.image(`dall-e-3`, { size: `1024x1024`, totalTokens: 250 })).toBe(0.1);
    });

    it(`token path lifts to the floor when raw cost is just under 0.1 ₽`, () => {
      expect(calc.image(`dall-e-3`, { size: `1024x1024`, totalTokens: 249 })).toBe(0.1);
    });

    it(`single reported token on token path is floored to 0.1 ₽`, () => {
      expect(calc.image(`dall-e-3`, { size: `1024x1024`, totalTokens: 1 })).toBe(0.1);
    });
  });

  describe(`gemini-3.1-flash-image-preview`, () => {
    it(`~1K image: 1120 output tokens × 18 200 ₽/1M ≈ 20,40 ₽ (proxyapi.ru pricing page)`, () => {
      const tokens = 1120;
      const expected = (tokens / perMillion) * 18_200;

      expect(calc.image(`gemini-3.1-flash-image-preview`, { size: `1024x1024`, totalTokens: tokens })).toBeCloseTo(
        expected,
        5,
      );
      expect(expected).toBeCloseTo(20.384, 2);
    });

    it(`has no extra rub floor on the token branch (tiny usage stays sub-0.1 ₽)`, () => {
      expect(calc.image(`gemini-3.1-flash-image-preview`, { size: `1024x1024`, totalTokens: 1 })).toBe(
        18_200 / perMillion,
      );
    });

    it(`zero tokens uses flat 20.4 ₽ approximation (proxyapi.ru 1K line)`, () => {
      expect(calc.image(`gemini-3.1-flash-image-preview`, { size: `1024x1024`, totalTokens: 0 })).toBe(20.4);
    });

    it(`returns the same token-based cost for any size when usage is present`, () => {
      const tokens = 50_000;
      const a = calc.image(`gemini-3.1-flash-image-preview`, { size: `256x256`, totalTokens: tokens });
      const b = calc.image(`gemini-3.1-flash-image-preview`, { size: `1792x1024`, totalTokens: tokens });

      expect(a).toBe(b);
    });
  });

  describe(`gpt-image-1.5`, () => {
    it(`maps Snappy sizes to low/medium tiers (proxyapi.ru list)`, () => {
      expect(calc.image(`gpt-image-1.5`, { size: `256x256`, totalTokens: 0 })).toBe(2.73);
      expect(calc.image(`gpt-image-1.5`, { size: `512x512`, totalTokens: 0 })).toBe(3.95);
      expect(calc.image(`gpt-image-1.5`, { size: `1024x1024`, totalTokens: 0 })).toBe(11);
      expect(calc.image(`gpt-image-1.5`, { size: `1024x1792`, totalTokens: 0 })).toBe(16);
    });

    it(`uses the same token path as dall-e-3 when usage is reported (400 ₽/M, 0.1 ₽ floor)`, () => {
      const tokens = 333_333;

      expect(calc.image(`gpt-image-1.5`, { size: `1024x1024`, totalTokens: tokens })).toBe(
        (tokens / perMillion) * imageTokenRubPerMillion,
      );
    });
  });

  it(`enumerates every image model id without throwing for a baseline call`, () => {
    for (const modelId of imageModelIds) {
      expect(() => calc.image(modelId, { size: `1024x1024`, totalTokens: 0 })).not.toThrow();
    }
  });
});

describe(`proxyApiCostCalculator.speech`, () => {
  const base = { audioSeconds: 0, byteLength: 0, completionTok: 0, promptTok: 0 };

  it(`uses 1,55 ₽/min for every speech model id (proxyapi.ru list)`, () => {
    const options = { ...base, audioSeconds: 60 };

    for (const modelId of speechModelIds) {
      expect(calc.speech(modelId, options)).toBeCloseTo(1.55, 5);
    }
  });

  it(`applies the same per-minute rate for whisper and gpt-4o-transcribe`, () => {
    const options = { ...base, audioSeconds: 60 };

    expect(calc.speech(`whisper-1`, options)).toBe(calc.speech(`gpt-4o-transcribe`, options));
  });

  describe(`token usage branch`, () => {
    it(`floors billed minutes from prompt tokens and applies the rub floor`, () => {
      const cost = calc.speech(`whisper-1`, { ...base, completionTok: 0, promptTok: 1 });

      expect(cost).toBeCloseTo(0.0775, 5);
    });

    it(`enters the token branch when only completion tokens are present (minutes still floor)`, () => {
      const cost = calc.speech(`whisper-1`, { ...base, completionTok: 10, promptTok: 0 });

      expect(cost).toBeCloseTo(0.0775, 5);
    });

    it(`scales with prompt tokens above the minute floor`, () => {
      const promptTok = 300_000;
      const cost = calc.speech(`whisper-1`, { ...base, completionTok: 0, promptTok });

      expect(cost).toBeCloseTo(155, 5);
    });
  });

  describe(`audio duration branch`, () => {
    it(`uses audioSeconds when no token usage is reported`, () => {
      const cost = calc.speech(`whisper-1`, { ...base, audioSeconds: 120 });

      expect(cost).toBeCloseTo(3.1, 5);
    });

    it(`floors very short audio to the minimum billed minutes`, () => {
      const cost = calc.speech(`whisper-1`, { ...base, audioSeconds: 1 });

      expect(cost).toBeCloseTo(0.0775, 5);
    });
  });

  describe(`byte-length fallback`, () => {
    it(`derives duration from 16 kHz stereo PCM when tokens and seconds are absent`, () => {
      const bytesPerSecond = 16_000 * 2;
      const audioSeconds = 30;
      const byteLength = bytesPerSecond * audioSeconds;
      const cost = calc.speech(`whisper-1`, { ...base, byteLength });

      expect(cost).toBeCloseTo(0.775, 5);
    });

    it(`floors empty payload to the minimum billed minutes`, () => {
      const cost = calc.speech(`whisper-1`, { ...base, byteLength: 0 });

      expect(cost).toBeCloseTo(0.0775, 5);
    });
  });

  describe(`branch priority`, () => {
    it(`prefers token usage over audioSeconds and byteLength`, () => {
      const cost = calc.speech(`whisper-1`, {
        audioSeconds: 3600,
        byteLength: 1_000_000,
        completionTok: 0,
        promptTok: 100,
      });

      expect(cost).toBeCloseTo(0.0775, 5);
    });

    it(`uses audioSeconds before byte fallback when tokens are absent`, () => {
      const cost = calc.speech(`whisper-1`, {
        audioSeconds: 60,
        byteLength: 1_000_000,
        completionTok: 0,
        promptTok: 0,
      });

      expect(cost).toBeCloseTo(1.55, 5);
    });
  });
});

describe(`proxyApiCostCalculator priceMultiplier`, () => {
  it(`scales list rub by the multiplier`, () => {
    const doubled = ProxyApiCostCalculator(2);

    expect(doubled.chat(`gpt-5-mini`, { completionTok: 0, promptTok: 0 })).toBe(0.1);
    expect(doubled.image(`dall-e-3`, { size: `1024x1024`, totalTokens: 0 })).toBe(22);
  });
});
