/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { AiImageModel } from "@snappy/ai";

import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useImageCardState } from "./ImageCard.state";

vi.hoisted(() => {
  Object.defineProperty(globalThis, `cookieStore`, {
    configurable: true,
    value: {
      get: async () => {
        await Promise.resolve();
      },
      set: async () => {
        await Promise.resolve();
      },
    },
  });
});

vi.mock(`../data`, () => ({
  r: {
    feed: {
      create: vi.fn(async () => {
        await Promise.resolve();

        return { id: `a`, src: ``, type: `image` };
      }),
      patch: vi.fn(),
      remove: vi.fn(),
    },
  },
}));

describe(`useImageCardState`, () => {
  it(`does not start another generation when callbacks change`, async () => {
    const generate = vi.fn(async () => {
      await Promise.resolve();

      return { bytes: new Uint8Array([1]), cost: 0 };
    });

    const model = { generate } as unknown as AiImageModel;

    const Host = ({ onError }: { onError: () => void }) => {
      useImageCardState({ content: ``, id: ``, locale: `en`, model, onError, prompt: `lighthouse` });

      return undefined;
    };

    const { rerender } = render(<Host onError={vi.fn()} />);

    expect(generate).toHaveBeenCalledTimes(1);

    rerender(<Host onError={vi.fn()} />);

    expect(generate).toHaveBeenCalledTimes(1);

    await act(async () => {
      await Promise.resolve();
    });
  });
});
