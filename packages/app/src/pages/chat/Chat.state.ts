import type { ImageGenerationOptions } from "@snappy/domain";

import { type AgentHostTools, Agents } from "@snappy/agents";
import { _ } from "@snappy/core";
import { Locale, useAsyncEffect, useGo } from "@snappy/ui";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../core";
import { Routes } from "../../Routes";

const isOkStatus = <R extends { status: string }>(r: R): r is Extract<R, { status: `ok` }> => r.status === `ok`;

const llmOk = async <T, R extends { status: string }>(
  whenBalanceBlocked: () => void,
  request: () => Promise<R>,
  value: (ok: Extract<R, { status: `ok` }>) => T,
): Promise<T | undefined> => {
  const response = await request();
  if (response.status === `balanceBlocked`) {
    whenBalanceBlocked();

    return undefined;
  }
  if (!isOkStatus(response)) {
    return undefined;
  }

  return value(response);
};

export const useChatState = () => {
  type ChatPhase = `blocked` | `booting` | `ready`;

  const go = useGo();
  const { agentId: routeAgentId } = useParams<{ agentId: string }>();
  const agentId = routeAgentId ?? ``;
  const [phase, setPhase] = useState<ChatPhase>(`booting`);
  const [llm, setLlm] = useState<undefined | { chat: string; image: string; speech: string }>(undefined);
  const [maxImagePromptLength, setMaxImagePromptLength] = useState(0);
  const [maxSpeechFileMegaBytes, setMaxSpeechFileMegaBytes] = useState(0);

  const balanceLow = useCallback(() => {
    void go(Routes.balance.low, { replace: true });
  }, [go]);

  const hostTools = useMemo(
    (): AgentHostTools => ({
      chat: async (prompt: string) =>
        llm === undefined
          ? undefined
          : llmOk(
              balanceLow,
              async () => api.llmChat({ model: llm.chat, prompt }),
              r => r.text,
            ),
      image: async (prompt: string, options: ImageGenerationOptions) =>
        llm === undefined
          ? undefined
          : llmOk(
              balanceLow,
              async () => api.llmImage({ model: llm.image, prompt, size: options.size }),
              r => r.bytes,
            ),
      speechRecognition: async (file: File) =>
        llm === undefined || (maxSpeechFileMegaBytes > 0 && file.size > _.mb(maxSpeechFileMegaBytes))
          ? undefined
          : llmOk(
              balanceLow,
              async () =>
                api.llmSpeechRecognition({
                  data: await file.arrayBuffer(),
                  fileName: file.name,
                  model: llm.speech,
                  type: file.type,
                }),
              r => r.text,
            ),
    }),
    [balanceLow, llm, maxSpeechFileMegaBytes],
  );

  useAsyncEffect(async () => {
    setPhase(`booting`);
    const [balanceResponse, llmSettingsResponse] = await Promise.all([api.balanceGet(), api.userLlmSettingsGet()]);
    if (llmSettingsResponse.status === `ok`) {
      setLlm({
        chat: llmSettingsResponse.llmChatModel,
        image: llmSettingsResponse.llmImageModel,
        speech: llmSettingsResponse.llmSpeechRecognitionModel,
      });
      setMaxImagePromptLength(llmSettingsResponse.maxImagePromptLength);
      setMaxSpeechFileMegaBytes(llmSettingsResponse.maxSpeechFileMegaBytes);
    }

    if (balanceResponse.balance <= 0) {
      setPhase(`blocked`);
      balanceLow();

      return;
    }

    setPhase(`ready`);
  }, [agentId, balanceLow, go]);

  const agent = useMemo(
    () =>
      phase !== `ready` || llm === undefined
        ? undefined
        : Agents.mount(agentId, {
            hostTools,
            locale: Locale.effective(),
            maxImagePromptLength,
            maxSpeechFileMegaBytes,
          }),
    [agentId, hostTools, llm, maxImagePromptLength, maxSpeechFileMegaBytes, phase],
  );

  return { agent };
};
