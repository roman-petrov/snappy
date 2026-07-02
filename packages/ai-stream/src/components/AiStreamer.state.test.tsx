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

type HarnessProps = { networkDone: boolean; text: string };

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

const settle = async (ms: number) =>
  act(async () => {
    await new Promise<void>(resolve => {
      setTimeout(resolve, ms);
    });
  });

describe(`useAiStreamerState`, () => {
  it(`keeps the stream busy until text after a code block is typed out`, async () => {
    const markdown = `\`\`\`js\nconst a = 1;\n\`\`\`\n\nfinal words after code`;
    const host = document.createElement(`div`);
    document.body.append(host);

    const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });

    act(() => {
      result.current.tailHost?.(host);
    });

    rerender({ networkDone: false, text: markdown });

    while (result.current.doc.length === 0) {
      await settle(20);
    }

    rerender({ networkDone: true, text: markdown });

    act(() => {
      result.current.pushTailHtml(`<pre><code>const a = 1;</code></pre>`);
    });

    const start = performance.now();
    const typedAll = () => host.textContent.includes(`final words after code`);
    let droppedEarly = false;

    while (!typedAll() && performance.now() - start < 4000) {
      if (!result.current.streaming) {
        droppedEarly = true;
        break;
      }
      await settle(20);
    }

    expect(droppedEarly).toBe(false);
    expect(typedAll()).toBe(true);

    while (result.current.streaming && performance.now() - start < 5000) {
      await settle(20);
    }

    expect(result.current.streaming).toBe(false);

    host.remove();
  });
});
