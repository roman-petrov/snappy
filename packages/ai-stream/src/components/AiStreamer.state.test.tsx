/* @vitest-environment jsdom */
/* eslint-disable functional/no-this-expressions */
/* eslint-disable unicorn/no-this-outside-of-class */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { TypeWriterSpeed } from "@snappy/domain";

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
const streamFrameMs = 1000 / 60;

type HarnessProps = { networkDone: boolean; stream?: boolean; text: string; typeWriterSpeed?: TypeWriterSpeed };

type Timing = {
  advance: (ms: number) => Promise<void>;
  until: (predicate: () => boolean, maxMs?: number) => Promise<void>;
};

const useHarness = ({ networkDone, stream = false, text, typeWriterSpeed = `fast` }: HarnessProps) => {
  const [tailBusy, setTailBusy] = useState(false);
  const streaming = !networkDone || tailBusy;

  const state = useAiStreamerState({
    onTailBusyChange: setTailBusy,
    streaming,
    text,
    theme: `chat`,
    typeWriterSpeed: stream ? undefined : typeWriterSpeed,
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

const attachHost = (tailHost: ((host: HTMLDivElement | null) => void) | undefined) => {
  const host = document.createElement(`div`);
  document.body.append(host);
  act(() => {
    tailHost?.(host);
  });

  return host;
};

describe(`useAiStreamerState`, () => {
  it(`keeps the stream busy until text after a code block is typed out`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `\`\`\`js\nconst a = 1;\n\`\`\`\n\nfinal words after code`;
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: markdown });

      await until(() => result.current.sealedDoc.length + result.current.liveDoc.length > 0);

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

  it(`streams instantly with a host and drops busy when the network ends`, async () => {
    await withTiming(async ({ until }) => {
      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, stream: true, text: `hello stream` });

      await until(() => host.textContent.includes(`hello stream`));

      expect(result.current.waitingHost).toBe(false);
      expect(result.current.tailHost).toBeTypeOf(`function`);

      rerender({ networkDone: true, stream: true, text: `hello stream` });

      await until(() => !result.current.streaming);

      expect(result.current.streaming).toBe(false);
      expect(host.textContent).toContain(`hello stream`);
    });
  });

  it(`shows stream text within two paint frames`, async () => {
    await withTiming(async ({ advance }) => {
      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, stream: true, text: `pending now` });
      await advance(streamFrameMs);
      await advance(streamFrameMs);

      expect(host.textContent).toContain(`pending now`);
      expect(result.current.playIndex).toBe(0);
    });
  });

  it(`keeps busy in stream mode until code tail html arrives`, async () => {
    await withTiming(async ({ advance, until }) => {
      const markdown = `\`\`\`js\nconst a = 42;\n\`\`\``;

      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      attachHost(result.current.tailHost);

      rerender({ networkDone: false, stream: true, text: markdown });
      await until(() => result.current.sealedDoc.length + result.current.liveDoc.length > 0);

      rerender({ networkDone: true, stream: true, text: markdown });
      await advance(tickMs);

      expect(result.current.streaming).toBe(true);

      act(() => {
        result.current.pushTailHtml(`<pre><code>const a = 42;</code></pre>`);
      });
      await until(() => !result.current.streaming);

      expect(result.current.streaming).toBe(false);
    });
  });

  it(`advances playIndex across html and code segments while animated`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `intro\n\n\`\`\`js\nx\n\`\`\`\n\noutro`;
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: markdown });
      await until(() => result.current.playIndex === 0 && result.current.liveDoc.length > 0);
      await until(() => result.current.playIndex === 1);

      act(() => {
        result.current.pushTailHtml(`<pre><code>x</code></pre>`);
      });

      await until(() => result.current.playIndex >= 2 && host.textContent.includes(`outro`));

      expect(result.current.playIndex).toBeGreaterThanOrEqual(2);
      expect(host.textContent).toContain(`outro`);
    });
  });

  it(`seals completed top pieces behind the play head`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `first\n\n\`\`\`js\nx\n\`\`\``;
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: markdown });
      await until(() => result.current.playIndex === 1);

      act(() => {
        result.current.pushTailHtml(`<pre><code>x</code></pre>`);
      });

      await until(() => result.current.playIndex >= 1 && result.current.sealedDoc.length > 0);

      expect(result.current.sealedDoc.length).toBeGreaterThanOrEqual(1);
      expect(result.current.liveDoc.length).toBeLessThan(
        result.current.sealedDoc.length + result.current.liveDoc.length,
      );
    });
  });

  it(`resets seal and play state when streaming text clears`, async () => {
    await withTiming(async ({ until }) => {
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: `hello world` });
      await until(() => result.current.sealedDoc.length + result.current.liveDoc.length > 0);

      rerender({ networkDone: false, text: `` });
      await until(() => result.current.waitingHost && result.current.playIndex === 0);

      expect(result.current.playIndex).toBe(0);
      expect(result.current.sealedDoc).toHaveLength(0);
      expect(result.current.waitingHost).toBe(true);
    });
  });

  it(`reveals a growing stream prefix instantly without typing lag`, async () => {
    await withTiming(async ({ advance }) => {
      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      const host = attachHost(result.current.tailHost);
      const full = `alpha bravo charlie`;

      for (let sent = 6; sent <= full.length; sent += 6) {
        const part = full.slice(0, sent);
        rerender({ networkDone: false, stream: true, text: part });
        await advance(streamFrameMs);

        expect(host.textContent).toContain(part);
      }
    });
  });

  it(`destroys the typewriter on unmount during a push`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `word `.repeat(40).trim();
      const { rerender, result, unmount } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: markdown });
      await until(() => result.current.liveDoc.length > 0);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  it(`drops the tail host when streaming ends`, async () => {
    await withTiming(async ({ until }) => {
      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, stream: true, text: `done` });
      await until(() => host.textContent.includes(`done`));

      rerender({ networkDone: true, stream: true, text: `done` });
      await until(() => !result.current.streaming);

      expect(result.current.tailHost).toBeUndefined();
    });
  });

  it(`catches up when switching from animated speed to stream mid-reveal`, async () => {
    await withTiming(async ({ until }) => {
      const markdown = `word `.repeat(40).trim();

      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: false, text: `` },
      });

      const host = attachHost(result.current.tailHost);
      const revealed = () => host.textContent.length;

      rerender({ networkDone: false, stream: false, text: markdown });
      await until(() => revealed() > 5 && revealed() < markdown.length);

      rerender({ networkDone: false, stream: true, text: markdown });
      await until(() => host.textContent.includes(markdown));

      expect(host.textContent).toContain(markdown);
      expect(result.current.playIndex).toBe(0);
    });
  });

  it(`renders static completed text without a waiting host`, async () => {
    await withTiming(async ({ advance }) => {
      const { result } = renderHook(() =>
        useAiStreamerState({ streaming: false, text: `static answer`, theme: `chat` }),
      );

      await advance(tickMs);

      expect(result.current.waitingHost).toBe(false);
      expect(result.current.tailHost).toBeUndefined();
      expect(result.current.sealedDoc.length + result.current.liveDoc.length).toBeGreaterThan(0);
    });
  });

  it(`keeps stream playIndex at the end when trailing text arrives after a code block`, async () => {
    await withTiming(async ({ until }) => {
      const codeOnly = `\`\`\`js\nconst a = 42;\n\`\`\``;
      const withTrailing = `${codeOnly}\n\ntrailing`;

      const { rerender, result } = renderHook(useHarness, {
        initialProps: { networkDone: false, stream: true, text: `` },
      });

      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, stream: true, text: codeOnly });
      await until(() => result.current.playIndex === 0);

      rerender({ networkDone: false, stream: true, text: withTrailing });
      await until(() => result.current.playIndex === 1 && host.textContent.includes(`trailing`));

      expect(result.current.playIndex).toBe(1);
      expect(result.current.sealedDoc.length + result.current.liveDoc.length).toBeGreaterThan(1);
      expect(host.textContent).toContain(`trailing`);
    });
  });

  it(`restarts playback from the first segment after text replacement`, async () => {
    await withTiming(async ({ until }) => {
      const long = `- one\n- two\n- three`;
      const replaced = `intro\n\n\`\`\`js\nx\n\`\`\`\n\noutro`;
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: long });
      await until(() => result.current.playIndex >= 2);

      rerender({ networkDone: false, text: replaced });
      await until(() => host.textContent.includes(`intro`));

      expect(host.textContent).toContain(`intro`);
      expect(result.current.playIndex).toBeLessThan(2);
      expect(host.textContent).not.toContain(`outro`);
    });
  });

  it(`does not reveal code or trailing text until shiki tail html arrives`, async () => {
    await withTiming(async ({ advance, until }) => {
      const markdown = `\`\`\`js\nconst answer = 42;\n\`\`\`\n\nafter code`;
      const { rerender, result } = renderHook(useHarness, { initialProps: { networkDone: false, text: `` } });
      const host = attachHost(result.current.tailHost);

      rerender({ networkDone: false, text: markdown });
      await until(() => result.current.sealedDoc.length + result.current.liveDoc.length > 0);

      rerender({ networkDone: true, text: markdown });
      await advance(tickMs);

      expect(result.current.streaming).toBe(true);
      expect(host.textContent).not.toContain(`after code`);

      act(() => {
        result.current.pushTailHtml(`<pre><code>const answer = 42;</code></pre>`);
      });
      await until(() => !result.current.streaming && host.textContent.includes(`after code`));

      expect(result.current.streaming).toBe(false);
      expect(host.textContent).toContain(`after code`);
    });
  });
});
