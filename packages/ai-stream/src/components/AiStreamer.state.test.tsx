/* @vitest-environment jsdom */
/* eslint-disable functional/no-this-expressions */
/* eslint-disable unicorn/no-this-outside-of-class */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { useAiStreamerState } from "./AiStreamer.state";

vi.mock(`../themes`, () => ({ AiStreamTheme: { chat: { cn: ``, components: {} } } }));

const unitPx = 10;
Range.prototype.getClientRects = function getClientRects(this: Range) {
  return [{ width: (this.endOffset - this.startOffset) * unitPx }] as unknown as DOMRectList;
};

const tickMs = 50;

type HarnessProps = { networkDone: boolean; text: string };

type Timing = {
  advance: (ms: number) => Promise<void>;
  until: (predicate: () => boolean, maxMs?: number) => Promise<void>;
};

const useHarness = ({ networkDone, text }: HarnessProps) => {
  const [tailBusy, setTailBusy] = useState(false);
  const streaming = !networkDone || tailBusy;

  const state = useAiStreamerState({
    onTailBusyChange: setTailBusy,
    streaming,
    text,
    theme: `chat`,
    typeWriterSpeed: `fast`,
  });

  return { ...state, streaming };
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
    document.body.replaceChildren();
  }
};

describe(`useAiStreamerState`, () => {
  it(`keeps the stream busy until text after a code block is typed out`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `\`\`\`js\nconst a = 1;\n\`\`\`\n\nfinal words after code`;
      const host = document.createElement(`div`);
      document.body.append(host);

      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });

      act(() => {
        result.current.tailHost?.(host);
      });

      rerender({ networkDone: false, text: markdown });

      await until(() => result.current.doc.length > 0);

      rerender({ networkDone: true, text: markdown });

      act(() => {
        result.current.pushTailHtml(`<pre><code>const a = 1;</code></pre>`);
      });

      const typedAll = () => host.textContent.includes(`final words after code`);
      let droppedEarly = false;

      await until(() => {
        if (!result.current.streaming && !typedAll()) {
          droppedEarly = true;
        }

        return typedAll() || droppedEarly;
      });

      expect(droppedEarly).toBe(false);
      expect(typedAll()).toBe(true);

      await until(() => !result.current.streaming);

      expect(result.current.streaming).toBe(false);
    });
  });
});
