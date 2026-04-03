/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";
import type { ApiAgentMessage, ApiAgentStepBody, ApiAgentStepResultUnion } from "@snappy/server-api";

import { Agent } from "@snappy/agent";
import { AiProvider, LlmErrors } from "@snappy/ai";
import { _, Json } from "@snappy/core";

import type { BridgeRegistry } from "../BridgeRegistry";
import type { FileStorage } from "../FileStorage";

import { showUi, vectorizeImage } from "./tools";

export const ServerAgent = ({
  agentSession,
  bridge,
  fileStorage,
  freeRequestLimit,
  hasActiveSubscription,
  snappySettings,
  storedFile,
}: {
  agentSession: Db[`agentSession`];
  bridge: BridgeRegistry;
  fileStorage: FileStorage;
  freeRequestLimit: number;
  hasActiveSubscription: (userId: number) => Promise<boolean>;
  snappySettings: Db[`snappySettings`];
  storedFile: Db[`storedFile`];
}) => {
  const { runChatLoop: runChatLoopFree } = Agent({ tools: [showUi, vectorizeImage] });
  const { runChatLoop: runChatLoopPreset } = Agent({ tools: [vectorizeImage] });

  const toApiMessages = (
    rows: { content: unknown; hiddenFromFeed: boolean; id: string; role: string }[],
  ): ApiAgentMessage[] =>
    rows.map(r => ({ content: r.content, hiddenFromFeed: r.hiddenFromFeed, id: r.id, role: r.role }));

  const step = async (userId: number, body: ApiAgentStepBody): Promise<ApiAgentStepResultUnion> => {
    const now = _.now();
    const premium = await hasActiveSubscription(userId);
    const settings = await snappySettings.upsertWithReset(userId, now, 0);
    const reset = _.now() - settings.lastReset > _.day;
    if (reset) {
      await snappySettings.resetCounter(userId, now);
    }
    const effectiveSettings = await snappySettings.findByUserId(userId);
    const count = effectiveSettings?.requestCount ?? 0;
    if (!premium && !reset && count >= freeRequestLimit) {
      return { status: `requestLimitReached` };
    }

    const {
      answersLocale,
      clientToolResults,
      message,
      presetId: presetIdRaw,
      sessionId: sessionIdRaw,
      uiAnswers,
      uiToolCallId,
    } = body;

    const presetId = presetIdRaw ?? `free`;
    const presetFirstStep = presetId !== `free` && uiAnswers !== undefined;
    const isNewSession = sessionIdRaw === undefined || sessionIdRaw === ``;
    if (isNewSession && !presetFirstStep && (message === undefined || message.trim() === ``)) {
      return { status: `processingFailed` };
    }

    const sessionId =
      sessionIdRaw === undefined || sessionIdRaw === ``
        ? (await agentSession.create(userId)).id
        : (await agentSession.sessionForUser(sessionIdRaw, userId)) === null
          ? undefined
          : sessionIdRaw;

    if (sessionId === undefined) {
      return { status: `processingFailed` };
    }

    const hasUiStep = uiAnswers !== undefined && (presetId !== `free` || uiToolCallId !== undefined);

    const hasContinuation =
      presetFirstStep ||
      (message !== undefined && message.trim() !== ``) ||
      hasUiStep ||
      (clientToolResults !== undefined && clientToolResults.length > 0);

    if (!isNewSession && !hasContinuation) {
      return { status: `processingFailed` };
    }

    const sessionPort = {
      appendMessage: async (role: string, content: unknown, options?: { hiddenFromFeed?: boolean }) =>
        agentSession.appendMessage(sessionId, role, content, options?.hiddenFromFeed ?? false),
      messages: async () => agentSession.messagesForSession(sessionId),
      touch: async () => agentSession.touchSession(sessionId),
    };

    const runChatLoop = presetId === `free` ? runChatLoopFree : runChatLoopPreset;
    const provider = (effectiveSettings?.llmProvider ?? `community`).trim() === `self` ? `self` : `community`;
    const userRelayKey = (effectiveSettings?.ollamaRelayKey ?? ``).trim();
    const userText = (effectiveSettings?.communityTextModel ?? ``).trim();
    const userImage = (effectiveSettings?.communityImageModel ?? ``).trim();
    const catalogCommunity = bridge.listCommunityCatalog();
    let chatModel: string;
    let imageModel: string;

    if (provider === `community`) {
      chatModel = userText || catalogCommunity.chat[0] || ``;
      imageModel = userImage || catalogCommunity.image[0] || ``;
      if (chatModel === `` || imageModel === ``) {
        return { status: `modelsUnavailable` };
      }
    } else {
      if (userRelayKey === `` || !bridge.validateRelayKey(userRelayKey)) {
        return { status: `relayKeyMissing` };
      }
      if (!bridge.relayConnected(userRelayKey)) {
        return { status: `relayOffline` };
      }
      const catalogSelf = bridge.listRelayCatalog(userRelayKey);
      chatModel = userText || catalogSelf.chat[0] || ``;
      imageModel = userImage || catalogSelf.image[0] || ``;
      if (chatModel === `` || imageModel === ``) {
        return { status: `modelsUnavailable` };
      }
    }

    const llm =
      provider === `self`
        ? AiProvider.fromLlm({
            chatCompletion: async chatRequest => bridge.chatCompletion(userRelayKey, chatRequest),
            generatePng: async (prompt, model) => bridge.generatePng(userRelayKey, prompt, model),
          })
        : AiProvider.fromLlm({
            chatCompletion: async chatRequest => {
              const model = typeof chatRequest.model === `string` ? chatRequest.model : chatModel;
              const key = bridge.pickPublicRelay(model, `chat`) ?? bridge.pickPublicRelay(chatModel, `chat`);
              if (key === undefined) {
                throw new Error(LlmErrors.bridgeOffline);
              }

              return bridge.chatCompletion(key, chatRequest);
            },
            generatePng: async (prompt, model) => {
              const key = bridge.pickPublicRelay(model, `image`) ?? bridge.pickPublicRelay(imageModel, `image`);
              if (key === undefined) {
                throw new Error(LlmErrors.bridgeOffline);
              }

              return bridge.generatePng(key, prompt, model);
            },
          });

    const loopResult = await runChatLoop({
      answersLocale,
      chatModel,
      clientToolResults,
      imageModel,
      llm,
      message,
      persistPng: async png => {
        const saved = await fileStorage.savePng(userId, png);

        const fileRow = await storedFile.create({
          kind: `image_png`,
          mime: `image/png`,
          sessionId,
          size: saved.size,
          storageKey: saved.storageKey,
          userId,
        });

        return Json.stringify({ fileId: fileRow.id, kind: `image_png` });
      },
      presetId,
      session: sessionPort,
      uiAnswers,
      uiToolCallId,
    });

    if (loopResult.status === `relayOffline`) {
      return { status: `relayOffline` };
    }

    if (loopResult.status === `ok`) {
      if (!premium) {
        await snappySettings.upsert(userId, { incrementOnUpdate: true, lastReset: now, requestCount: 1 });
      }

      return { ...loopResult, sessionId };
    }

    return loopResult;
  };

  const getSession = async (userId: number, sessionId: string) => {
    const s = await agentSession.sessionForUser(sessionId, userId);
    if (s === null) {
      return { status: `processingFailed` as const };
    }
    const rows = await agentSession.messagesForSession(sessionId);

    return { messages: toApiMessages(rows), sessionId, status: `ok` as const };
  };

  return { getSession, step };
};

export type ServerAgent = ReturnType<typeof ServerAgent>;
