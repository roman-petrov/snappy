/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable init-declarations */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAiStreamState } from "./AiStream.state";

const tickMs = 16;

type StreamControl = { close: () => void; push: (chunk: string) => void; stream: AsyncIterable<string> };

type Timing = {
  advance: (ms: number) => Promise<void>;
  until: (predicate: () => boolean, maxMs?: number) => Promise<void>;
};

const controllableStream = (): StreamControl => {
  const values: string[] = [];
  let closed = false;
  let notify: (() => void) | undefined;

  const wait = async () =>
    new Promise<void>(resolve => {
      notify = resolve;
    });

  const wake = () => {
    notify?.();
    notify = undefined;
  };

  return {
    close: () => {
      closed = true;
      wake();
    },
    push: (chunk: string) => {
      values.push(chunk);
      wake();
    },
    stream: {
      async *[Symbol.asyncIterator]() {
        let index = 0;
        for (;;) {
          while (index < values.length) {
            const chunk = values.at(index);
            index += 1;
            if (chunk === undefined) {
              continue;
            }
            yield chunk;
          }
          if (closed) {
            return;
          }
          await wait();
        }
      },
    },
  };
};

const withTiming = async (run: (timing: Timing) => Promise<void> | void) => {
  vi.useFakeTimers({
    toFake: [`setTimeout`, `setInterval`, `requestAnimationFrame`, `cancelAnimationFrame`, `performance`],
  });

  const advance = async (ms: number) => {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  };

  const until = async (predicate: () => boolean, maxMs = 5000) => {
    let elapsed = 0;

    while (!predicate() && elapsed < maxMs) {
      await advance(tickMs);
      elapsed += tickMs;
    }
  };

  try {
    await run({ advance, until });
  } finally {
    vi.useRealTimers();
  }
};

const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe(`useAiStreamState`, () => {
  it(`coalesces many chunks into one buffer update per animation frame`, async () => {
    await withTiming(async ({ advance }) => {
      const control = controllableStream();
      const { result } = renderHook(() => useAiStreamState({ stream: control.stream, theme: `chat` }));

      await act(async () => {
        for (const chunk of [`a`, `b`, `c`, `d`, `e`]) {
          control.push(chunk);
        }
        await flushMicrotasks();
      });

      expect(result.current.text).toBe(``);

      await advance(tickMs);

      expect(result.current.text).toBe(`abcde`);
      expect(result.current.streaming).toBe(true);
    });
  });

  it(`calls onComplete only after network ends and the tail is not busy`, async () => {
    await withTiming(async ({ advance, until }) => {
      const control = controllableStream();
      const onComplete = vi.fn();
      const { result } = renderHook(() => useAiStreamState({ onComplete, stream: control.stream, theme: `chat` }));
      await act(async () => {
        control.push(`hello`);
        await flushMicrotasks();
      });
      await advance(tickMs);

      act(() => {
        result.current.onTailBusyChange(true);
      });

      await act(async () => {
        control.close();
        await flushMicrotasks();
      });
      await advance(tickMs);

      expect(result.current.streaming).toBe(true);
      expect(onComplete).not.toHaveBeenCalled();

      act(() => {
        result.current.onTailBusyChange(false);
      });
      await until(() => onComplete.mock.calls.length > 0);

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(`hello`);
      expect(result.current.streaming).toBe(false);
    });
  });

  it(`does not call onComplete from a previous stream after identity changes`, async () => {
    await withTiming(async ({ advance, until }) => {
      const first = controllableStream();
      const onComplete = vi.fn();

      const { rerender, result } = renderHook(
        ({ stream }: { stream: AsyncIterable<string> }) => useAiStreamState({ onComplete, stream, theme: `chat` }),
        { initialProps: { stream: first.stream } },
      );

      await act(async () => {
        first.push(`old`);
        first.close();
        await flushMicrotasks();
      });
      await until(() => onComplete.mock.calls.length === 1);

      expect(result.current.text).toBe(`old`);

      const second = controllableStream();
      rerender({ stream: second.stream });

      await act(async () => {
        second.push(`new`);
        await flushMicrotasks();
      });
      await advance(tickMs);

      expect(result.current.text).toBe(`new`);
      expect(onComplete).toHaveBeenCalledTimes(1);

      await act(async () => {
        second.close();
        await flushMicrotasks();
      });
      await until(() => onComplete.mock.calls.length === 2);

      expect(onComplete).toHaveBeenLastCalledWith(`new`);
    });
  });

  it(`clears buffer text when the stream identity changes`, async () => {
    await withTiming(async ({ advance, until }) => {
      const first = controllableStream();

      const { rerender, result } = renderHook(
        ({ stream }: { stream: AsyncIterable<string> }) => useAiStreamState({ stream, theme: `chat` }),
        { initialProps: { stream: first.stream } },
      );

      await act(async () => {
        first.push(`old`);
        first.close();
        await flushMicrotasks();
      });
      await until(() => result.current.text === `old` && !result.current.streaming);

      const second = controllableStream();
      rerender({ stream: second.stream });
      await advance(tickMs);

      expect(result.current.text).toBe(``);
    });
  });

  it(`unmounts safely while the pump is still open`, async () => {
    await withTiming(async ({ advance }) => {
      const control = controllableStream();
      const { unmount } = renderHook(() => useAiStreamState({ stream: control.stream, theme: `chat` }));

      await act(async () => {
        control.push(`partial`);
        await flushMicrotasks();
      });
      await advance(tickMs);

      expect(() => {
        unmount();
      }).not.toThrow();

      await act(async () => {
        control.push(`more`);
        control.close();
        await flushMicrotasks();
      });
      await advance(tickMs);
    });
  });

  it(`skips empty and non-string chunks`, async () => {
    await withTiming(async ({ advance, until }) => {
      const queue: unknown[] = [``, 42, `ok`, undefined, `ay`];

      const stream = {
        [Symbol.asyncIterator]: () => ({
          next: async () => {
            await Promise.resolve();
            if (queue.length === 0) {
              return { done: true as const, value: undefined };
            }

            return { done: false as const, value: queue.shift() };
          },
        }),
      } as AsyncIterable<string>;

      const { result } = renderHook(() => useAiStreamState({ stream, theme: `chat` }));

      await act(async () => {
        await flushMicrotasks();
        await Promise.resolve();
      });
      await until(() => result.current.text.includes(`ok`));
      await advance(tickMs);

      expect(result.current.text).toBe(`okay`);
    });
  });

  it(`calls onComplete with an empty string when the stream has no chunks`, async () => {
    await withTiming(async ({ until }) => {
      const control = controllableStream();
      const onComplete = vi.fn();
      renderHook(() => useAiStreamState({ onComplete, stream: control.stream, theme: `chat` }));

      await act(async () => {
        control.close();
        await flushMicrotasks();
      });
      await until(() => onComplete.mock.calls.length === 1);

      expect(onComplete).toHaveBeenCalledWith(``);
    });
  });

  it(`resets buffer when generationKey changes for a chat completion`, async () => {
    await withTiming(async ({ advance, until }) => {
      const onComplete = vi.fn();
      let generation = 0;

      const completions = vi.fn(({ messages }: { messages: { content: string; role: `user` }[] }) => {
        const key = generation;
        const text = messages[0]?.content ?? ``;

        return {
          chatText: async function* chatText() {
            await Promise.resolve();
            yield `${text}:${key}`;
          },
        };
      });

      const { rerender, result } = renderHook(
        ({ generationKey, messages }: { generationKey: number; messages: { content: string; role: `user` }[] }) =>
          useAiStreamState({
            active: true,
            chatModel: { completions } as never,
            generationKey,
            messages,
            onComplete,
            theme: `chat`,
          }),
        { initialProps: { generationKey: 0, messages: [{ content: `first`, role: `user` }] } },
      );

      await until(() => result.current.text.includes(`first`));
      await until(() => onComplete.mock.calls.length === 1);

      expect(result.current.text).toBe(`first:0`);

      generation = 1;
      rerender({ generationKey: 1, messages: [{ content: `second`, role: `user` }] });
      await advance(tickMs);
      await until(() => result.current.text.includes(`second`));

      expect(result.current.text).toBe(`second:1`);

      await until(() => onComplete.mock.calls.length === 2);

      expect(onComplete).toHaveBeenLastCalledWith(`second:1`);
    });
  });
});
