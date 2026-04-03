/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable id-length */
import type { UiPlan } from "@snappy/domain";
import type { ApiAgentMessage, ApiAgentStepBody } from "@snappy/server-api";

import { Locale, useAsyncEffect } from "@snappy/ui";
import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { api, t } from "../../core";

const vectorizeImageBase64 = (imageBase64: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" data-in="${String(imageBase64.length)}"><rect width="100%" height="100%" fill="#eee"/><text x="8" y="36" font-size="10">trace</text></svg>`;

const parseJson = (s: string): unknown => JSON.parse(s) as unknown;

const messageText = (m: ApiAgentMessage): string => {
  const c = m.content as null | Record<string, unknown>;
  if (c === null || typeof c !== `object`) {
    return ``;
  }
  if (m.role === `tool`) {
    const raw = String(c[`content`] ?? ``);
    try {
      const index = parseJson(raw) as { fileId?: string };
      if (index.fileId !== undefined) {
        return ``;
      }
    } catch {
      /* Ignore */
    }

    return raw;
  }
  if (m.role === `assistant`) {
    const t0 = c[`content`];
    if (t0 === null || t0 === undefined) {
      return ``;
    }

    return String(t0);
  }

  return String(c[`content`] ?? ``);
};

const toolFileId = (m: ApiAgentMessage): string | undefined => {
  if (m.role !== `tool`) {
    return undefined;
  }
  const c = m.content as null | Record<string, unknown>;
  if (c === null || typeof c !== `object`) {
    return undefined;
  }
  const raw = String(c[`content`] ?? ``);
  try {
    const index = parseJson(raw) as { fileId?: string };

    return index.fileId;
  } catch {
    return undefined;
  }
};

export type ChatFeedBubble = { id: string; imageFileId?: string; text: string };

const feedBubblesFromMessages = (messages: readonly ApiAgentMessage[]): ChatFeedBubble[] =>
  messages
    .filter(m => m.hiddenFromFeed !== true)
    .map(m => ({ id: m.id, imageFileId: toolFileId(m), text: messageText(m) }));

export const useChatState = () => {
  const { presetId: routePresetId } = useParams<{ presetId: string }>();
  const runStepRef = useRef<((body: ApiAgentStepBody) => Promise<void>) | undefined>(undefined);
  const [initLoading, setInitLoading] = useState(true);
  const [limitFromCatalog, setLimitFromCatalog] = useState(false);
  const [presetId, setPresetId] = useState(() => routePresetId ?? `free`);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ApiAgentMessage[]>([]);
  const [pendingUi, setPendingUi] = useState<undefined | { plan: UiPlan; toolCallId?: string }>();
  const [text, setText] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [limitHitInSession, setLimitHitInSession] = useState(false);

  useAsyncEffect(async () => {
    setInitLoading(true);
    setPendingUi(undefined);
    const loc = Locale.effective();
    const id = routePresetId ?? `free`;

    const [remainingResponse, presetResult] = await Promise.all([
      api.remaining(),
      id === `free` ? Promise.resolve(undefined) : api.presetById(id, loc),
    ]);

    if (remainingResponse.remaining === 0 && remainingResponse.isPremium !== true) {
      setLimitFromCatalog(true);
    }
    setPresetId(id);
    if (presetResult?.status === `ok` && presetResult.preset.uiPlan !== undefined) {
      setPendingUi({ plan: presetResult.preset.uiPlan });
    }
    setInitLoading(false);
  }, [routePresetId]);

  const runStep = useCallback(
    async (body: ApiAgentStepBody) => {
      setError(``);
      setLoading(true);
      const merged: ApiAgentStepBody = { ...body, presetId: body.presetId ?? presetId };
      const r = await api.agentStep(merged);
      setLoading(false);
      if (r.status !== `ok`) {
        if (r.status === `requestLimitReached`) {
          setLimitHitInSession(true);

          return;
        }
        if (r.status === `relayKeyMissing`) {
          setError(t(`dashboard.errors.relayKeyMissing`));

          return;
        }
        if (r.status === `relayOffline`) {
          setError(t(`dashboard.errors.relayOffline`));

          return;
        }
        if (r.status === `modelsUnavailable`) {
          setError(t(`dashboard.errors.modelsUnavailable`));

          return;
        }
        setError(t(`dashboard.errors.processingFailed`));

        return;
      }
      setSessionId(r.sessionId);
      setMessages(r.messages);
      if (r.pendingUi !== undefined) {
        setPendingUi({ plan: r.pendingUi.plan, toolCallId: r.pendingUi.toolCallId });

        return;
      }
      setPendingUi(undefined);
      if (r.pendingClientTool !== undefined) {
        const raw = r.pendingClientTool.args[`image_base64`];
        const svg = vectorizeImageBase64(typeof raw === `string` ? raw : ``);
        await runStepRef.current?.({
          clientToolResults: [{ content: svg, toolCallId: r.pendingClientTool.toolCallId }],
          presetId,
          sessionId: r.sessionId,
        });
      }
    },
    [presetId],
  );
  runStepRef.current = runStep;

  const sendMessage = useCallback(async () => {
    if (text.trim() === ``) {
      return;
    }
    const base: ApiAgentStepBody =
      sessionId === undefined
        ? { message: text.trim(), presetId: `free` }
        : { message: text.trim(), presetId: `free`, sessionId };
    setText(``);
    await runStep(base);
  }, [runStep, sessionId, text]);

  const submitUi = useCallback(
    async (answers: Record<string, boolean | number | string | string[] | undefined>) => {
      if (pendingUi === undefined) {
        return;
      }
      const { toolCallId } = pendingUi;
      const loc = Locale.effective();

      if (presetId === `free`) {
        if (toolCallId === undefined) {
          return;
        }
        await runStep({
          answersLocale: loc,
          presetId,
          ...(sessionId === undefined ? {} : { sessionId }),
          uiAnswers: answers,
          uiToolCallId: toolCallId,
        });

        return;
      }

      await runStep({
        answersLocale: loc,
        presetId,
        ...(sessionId === undefined ? {} : { sessionId }),
        uiAnswers: answers,
      });
    },
    [pendingUi, presetId, runStep, sessionId],
  );

  const feedBubbles = useMemo(() => feedBubblesFromMessages(messages), [messages]);
  const limitReached = limitFromCatalog || limitHitInSession;

  return {
    error,
    feedBubbles,
    initLoading,
    limitReached,
    loading,
    pendingUi,
    presetId,
    sendMessage,
    setText,
    submitUi,
    text,
  };
};
