/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { act, render } from "@testing-library/react";
import { type Ref, useImperativeHandle } from "react";
import { describe, expect, it, vi } from "vitest";

import type { UserSettings } from "../../../../data";
import type { AgentFeedHandle } from "./AgentFeedHandle";

import { useAgentChatState } from "./AgentChat.state";

const { dataState } = vi.hoisted(
  (): { dataState: { balance: undefined | { balance: number; id: string }; settings: undefined | UserSettings } } => {
    const settings = {
      aiTunnelDirect: false,
      aiTunnelKey: ``,
      llmChatModel: ``,
      llmImageModel: ``,
      llmImageQuality: `standard`,
      llmSpeechRecognitionModel: ``,
      llmVisionModel: ``,
      typeWriterSpeed: undefined,
    } satisfies UserSettings;

    return { dataState: { balance: { balance: 10, id: `u` }, settings } };
  },
);

vi.mock(`./AgentFeed`, () => ({
  AgentFeed: ({ ref }: { ref?: Ref<AgentFeedHandle> }) => {
    useImperativeHandle(ref, () => ({ reset: vi.fn() }) as unknown as AgentFeedHandle);

    return undefined;
  },
}));

vi.mock(`../../../../core`, () => ({ AgentAiFromSettings: () => ({ models: { chat: {} } }) }));

vi.mock(`../../../../data`, () => ({
  r: { balance: () => dataState.balance, settings: () => [dataState.settings, vi.fn()] as const },
}));

describe(`useAgentChatState`, () => {
  it(`does not restart agent when parent re-renders without session or settings change`, () => {
    const run = vi.fn();
    const stop = vi.fn();
    const runtime = vi.fn(() => ({ run, stop }));

    const Host = ({ showFeed }: { showFeed: boolean }) => {
      const { feed } = useAgentChatState({ runtime, session: [`en`, ``, `start prompt`], showFeed });

      return feed ?? undefined;
    };

    const { rerender } = render(<Host showFeed={false} />);

    expect(run).toHaveBeenCalledTimes(1);

    act(() => {
      rerender(<Host showFeed={false} />);
    });

    expect(run).toHaveBeenCalledTimes(1);
    expect(stop).not.toHaveBeenCalled();
  });
});
