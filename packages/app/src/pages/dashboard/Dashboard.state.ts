/* eslint-disable init-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import {
  type AgentChatInput,
  type AgentChatOutput,
  type AgentHostTools,
  Agents,
  type AgentUiRequest,
  type ChatFeedClient,
  type ChatFeedMessage,
} from "@snappy/agents";
import { Ai, type AiImageQuality, type AiModel, type ImageGenerationOptions, type Ai as SnappyAi } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { _, type Action } from "@snappy/core";
import { useStoreValue } from "@snappy/store";
import { $locale, Locale, useAsyncEffect, useGo } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api } from "../../core";
import { Routes } from "../../Routes";
import { type AgentSessionCard, ChatFeed, type ChatFeedArtifactPatch, type RegenerateArtifactInput } from "./ChatFeed";

type LiveSession = { agentEmoji: string; agentName: string; entries: ChatFeedMessage[]; status: `running` };

export const useDashboardState = () => {
  type ChatPhase = `blocked` | `booting` | `ready`;

  const isBalanceBlockedError = useCallback((error: unknown): boolean => {
    if (!_.isObject(error)) {
      return false;
    }
    const nestedError = (error as { error?: { status?: unknown } }).error;

    return nestedError?.status === `balanceBlocked`;
  }, []);

  const modelOf = useCallback(
    <TType extends AiModel[`type`]>(
      ai: SnappyAi,
      type: TType,
      name: string,
    ): Extract<AiModel, { type: TType }> | undefined =>
      ai.models.find((model): model is Extract<AiModel, { type: TType }> => model.type === type && model.name === name),
    [],
  );

  const go = useGo();
  const locale = useStoreValue($locale);
  const [phase, setPhase] = useState<ChatPhase>(`booting`);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(``);
  const [agentRunning, setAgentRunning] = useState(false);
  const [pendingUi, setPendingUi] = useState<AgentUiRequest<unknown> | undefined>(undefined);
  const [sessions, setSessions] = useState<AgentSessionCard[]>([]);
  const [activeSession, setActiveSession] = useState<LiveSession | undefined>(undefined);
  const [regeneratingMessageIds, setRegeneratingMessageIds] = useState(new Set<string>());
  const [snappyAi, setSnappyAi] = useState<SnappyAi | undefined>(undefined);

  const [llm, setLlm] = useState<
    undefined | { chat: string; image: string; imageQuality: AiImageQuality; speech: string }
  >(undefined);

  const [maxImagePromptLength, setMaxImagePromptLength] = useState(0);
  const [maxSpeechFileMegaBytes, setMaxSpeechFileMegaBytes] = useState(0);
  const chatFeed = useMemo(ChatFeed, []);
  const stopRequestedRef = useRef(false);
  const stopAgentRef = useRef<Action | undefined>(undefined);

  const pendingAskRef = useRef<undefined | { reject: (error: Error) => void; resolve: (value: unknown) => void }>(
    undefined,
  );

  const activeSessionRef = useRef<LiveSession | undefined>(undefined);
  const listenersRef = useRef<((messages: ChatFeedMessage[]) => void)[]>([]);
  const effectiveLocale = locale === `system` ? Locale.effective() : locale;
  const agents = useMemo(() => Agents.cards(effectiveLocale), [effectiveLocale]);
  const byGroup = Agents.byGroup(agents);
  const { groupOrder } = Agents;
  const selectedAgent = agents.find(item => item.id === selectedAgentId);

  const clearPendingUi = useCallback(() => {
    setPendingUi(undefined);
    pendingAskRef.current = undefined;
  }, []);

  const rejectPendingUi = useCallback(
    (message = `ui_cancelled`) => {
      pendingAskRef.current?.reject(new Error(message));
      clearPendingUi();
    },
    [clearPendingUi],
  );

  const askUi = useCallback(
    async <TResult, TProps extends object>(request: AgentUiRequest<TResult, TProps>) =>
      new Promise<TResult>((resolve, reject) => {
        rejectPendingUi();
        pendingAskRef.current = { reject, resolve: value => resolve(value as TResult) };
        setPendingUi(request as unknown as AgentUiRequest<unknown>);
      }),
    [rejectPendingUi],
  );

  const onResolveUi = useCallback(
    (value: unknown) => {
      const pending = pendingAskRef.current;
      if (pending === undefined) {
        return;
      }
      pending.resolve(value);
      clearPendingUi();
    },
    [clearPendingUi],
  );

  const interruptAgent = useCallback(() => {
    stopAgentRef.current?.();
    stopAgentRef.current = undefined;
  }, []);

  const onRejectUi = useCallback(() => {
    stopRequestedRef.current = true;
    interruptAgent();
    rejectPendingUi();
  }, [interruptAgent, rejectPendingUi]);

  const updateLiveSession = useCallback((next: LiveSession | undefined) => {
    activeSessionRef.current = next;
    setActiveSession(next === undefined ? undefined : { ...next, entries: next.entries.map(entry => ({ ...entry })) });
    const entries = activeSessionRef.current?.entries ?? [];
    for (const listener of listenersRef.current) {
      listener(entries.map(entry => ({ ...entry })));
    }
  }, []);

  const runtimeFeed = useMemo<ChatFeedClient>(
    () => ({
      append: message => {
        const id = crypto.randomUUID();
        const { current } = activeSessionRef;
        if (current === undefined) {
          return id;
        }
        updateLiveSession({ ...current, entries: [...current.entries, { ...message, id }] });

        return id;
      },
      clear: () => {
        const { current } = activeSessionRef;
        if (current !== undefined) {
          updateLiveSession({ ...current, entries: [] });
        }
      },
      list: () => (activeSessionRef.current?.entries ?? []).map(item => ({ ...item })),
      patch: (id, patch) => {
        const { current } = activeSessionRef;
        if (current === undefined) {
          throw new Error(`No active session`);
        }
        const nextEntries = current.entries.map(item =>
          item.id === id && item.type === `tool` ? { ...item, ...patch } : item,
        );

        const nextTool = nextEntries.find(item => item.id === id && item.type === `tool`);
        if (nextTool?.type !== `tool`) {
          throw new Error(`Live tool message not found: ${id}`);
        }
        updateLiveSession({ ...current, entries: nextEntries });

        return nextTool;
      },
      remove: id => {
        const { current } = activeSessionRef;
        if (current !== undefined) {
          updateLiveSession({ ...current, entries: current.entries.filter(item => item.id !== id) });
        }
      },
      subscribe: listener => {
        listenersRef.current = [...listenersRef.current, listener];
        listener((activeSessionRef.current?.entries ?? []).map(item => ({ ...item })));

        return () => {
          listenersRef.current = listenersRef.current.filter(item => item !== listener);
        };
      },
    }),
    [updateLiveSession],
  );

  const balanceLow = useCallback(() => {
    void go(Routes.balance.low, { replace: true });
  }, [go]);

  const finalizeLiveAgentSession = useCallback(
    async ({ failed }: { failed: boolean }) => {
      const { current } = activeSessionRef;
      if (current !== undefined) {
        await chatFeed.appendSession({
          agentEmoji: current.agentEmoji,
          agentName: current.agentName,
          entries: current.entries,
          status: stopRequestedRef.current ? `stopped` : failed ? `error` : `done`,
        });
      }
      updateLiveSession(undefined);
      setAgentRunning(false);
      clearPendingUi();
    },
    [chatFeed, clearPendingUi, updateLiveSession],
  );

  const stopAgent = useCallback(() => {
    const hadPendingUi = pendingAskRef.current !== undefined;
    stopRequestedRef.current = true;
    interruptAgent();
    rejectPendingUi(`agent_stopped`);
    if (hadPendingUi) {
      void finalizeLiveAgentSession({ failed: false });
    }
  }, [finalizeLiveAgentSession, interruptAgent, rejectPendingUi]);

  const trackTool = useCallback(
    async <T>({
      doneText,
      fallback,
      pendingText,
      run,
      tool,
    }: {
      doneText: (value: T) => string;
      fallback: T;
      pendingText: string;
      run: (context: { toolId: string }) => Promise<{ cost: number; value: T }>;
      tool: `chat` | `image` | `speechRecognition`;
    }) => {
      if (stopRequestedRef.current) {
        throw new Error(`agent_stopped`);
      }
      const id = runtimeFeed.append({ status: `running`, text: pendingText, tool, type: `tool` });
      try {
        const result = await run({ toolId: id });
        runtimeFeed.patch(id, { cost: result.cost, status: `done`, text: doneText(result.value) });

        return result.value;
      } catch (error) {
        if (isBalanceBlockedError(error)) {
          runtimeFeed.patch(id, { status: `error`, text: `balanceBlocked` });
          stopAgent();
          balanceLow();

          return fallback;
        }
        runtimeFeed.patch(id, { status: `error`, text: `request_failed` });

        return fallback;
      }
    },
    [balanceLow, isBalanceBlockedError, runtimeFeed, stopAgent],
  );

  const hostTools = useMemo(
    (): AgentHostTools => ({
      ask: askUi,
      chat: async (input: AgentChatInput) => {
        const asText = _.isString(input);
        if (llm === undefined || snappyAi === undefined) {
          return asText ? `` : { content: ``, role: `assistant` };
        }
        if (asText && input.trim() !== ``) {
          runtimeFeed.append({ role: `user`, text: input, type: `llm` });
        }
        const out = await trackTool<AgentChatOutput>({
          doneText: () => `chat.feed.chat.done`,
          fallback: asText ? `` : { content: ``, role: `assistant` },
          pendingText: `chat.feed.chat.pending`,
          run: async ({ toolId }) => {
            const cm = modelOf(snappyAi, `chat`, llm.chat);
            if (cm === undefined) {
              throw new Error(`chat_model_missing`);
            }
            const { done, stream } = await cm.process(
              asText ? input : { messages: input.messages, toolChoice: input.toolChoice, tools: input.tools },
            );

            let text = ``;
            for await (const delta of stream) {
              text += delta;
              void runtimeFeed.patch(toolId, { text });
            }
            const { cost, message, text: doneText } = await done;

            return { cost, value: asText ? doneText : message };
          },
          tool: `chat`,
        });
        if (_.isString(out)) {
          runtimeFeed.append({ role: `assistant`, text: out, type: `llm` });
        } else if (out.content.trim() !== ``) {
          runtimeFeed.append({ role: `assistant`, text: out.content, type: `llm` });
        }

        return out;
      },
      image: async (prompt: string, options: ImageGenerationOptions) =>
        llm === undefined || snappyAi === undefined
          ? new Uint8Array()
          : trackTool<Uint8Array>({
              doneText: () => `chat.feed.image.done`,
              fallback: new Uint8Array(),
              pendingText: `chat.feed.image.pending`,
              run: async () => {
                const im = modelOf(snappyAi, `image`, llm.image);
                if (im === undefined) {
                  throw new Error(`image_model_missing`);
                }
                const result = await im.process(prompt, { quality: llm.imageQuality, size: options.size });

                return { cost: result.cost, value: result.bytes };
              },
              tool: `image`,
            }),
      speechRecognition: async (file: File) =>
        llm === undefined ||
        snappyAi === undefined ||
        (maxSpeechFileMegaBytes > 0 && file.size > _.mb(maxSpeechFileMegaBytes))
          ? ``
          : trackTool<string>({
              doneText: () => `chat.feed.speechRecognition.done`,
              fallback: ``,
              pendingText: `chat.feed.speechRecognition.pending`,
              run: async () => {
                const sm = modelOf(snappyAi, `speech-recognition`, llm.speech);
                if (sm === undefined) {
                  throw new Error(`speech_model_missing`);
                }
                const bytes = new Uint8Array(await file.arrayBuffer());

                const result = await sm.process({
                  bytes,
                  fileName: file.name,
                  mimeType: file.type.trim() === `` ? `application/octet-stream` : file.type,
                });

                return { cost: result.cost, value: result.text };
              },
              tool: `speechRecognition`,
            }),
    }),
    [askUi, llm, maxSpeechFileMegaBytes, modelOf, runtimeFeed, snappyAi, trackTool],
  );

  useEffect(() => chatFeed.subscribe(setSessions), [chatFeed]);

  useAsyncEffect(async () => {
    setPhase(`booting`);
    const [balanceResponse, llmSettingsResponse, aiLoaded] = await Promise.all([
      api.balanceGet(),
      api.userLlmSettingsGet(),
      Ai({ locale: Locale.effective(), url: `${globalThis.location.origin}/api/ai-tunnel/v1` }),
    ]);
    setSnappyAi(aiLoaded);
    setLlm({
      chat: llmSettingsResponse.llmChatModel,
      image: llmSettingsResponse.llmImageModel,
      imageQuality: llmSettingsResponse.llmImageQuality,
      speech: llmSettingsResponse.llmSpeechRecognitionModel,
    });
    setMaxImagePromptLength(llmSettingsResponse.maxImagePromptLength);
    setMaxSpeechFileMegaBytes(llmSettingsResponse.maxSpeechFileMegaBytes);

    if (balanceResponse.balance <= 0) {
      setPhase(`blocked`);
      balanceLow();

      return;
    }
    setPhase(`ready`);
  }, [balanceLow]);

  useEffect(() => {
    if (phase !== `ready` || llm === undefined || snappyAi === undefined || selectedAgent === undefined) {
      interruptAgent();
      rejectPendingUi();
      setAgentRunning(false);
      updateLiveSession(undefined);

      return _.noop;
    }
    const instance = Agents.create(selectedAgent.id, Locale.effective());
    if (instance === undefined) {
      setAgentRunning(false);
      updateLiveSession(undefined);
    } else {
      setCatalogOpen(false);
      setAgentRunning(true);
      updateLiveSession({
        agentEmoji: selectedAgent.emoji,
        agentName: selectedAgent.title,
        entries: [],
        status: `running`,
      });
      stopAgentRef.current = instance.start({
        feed: runtimeFeed,
        hostTools,
        isStopped: () => stopRequestedRef.current,
        maxImagePromptLength,
        maxSpeechFileMegaBytes,
        onDone: async ({ failed }) => {
          await finalizeLiveAgentSession({ failed });
        },
      });
    }

    return _.singleAction([interruptAgent, rejectPendingUi]);
  }, [
    finalizeLiveAgentSession,
    hostTools,
    interruptAgent,
    llm,
    maxImagePromptLength,
    maxSpeechFileMegaBytes,
    phase,
    rejectPendingUi,
    runtimeFeed,
    selectedAgent,
    snappyAi,
    updateLiveSession,
  ]);

  const onOpenCatalog = () => {
    if (!agentRunning) {
      setCatalogOpen(true);
    }
  };

  const onPickAgent = (id: string) => {
    stopRequestedRef.current = false;
    setSelectedAgentId(id);
    setCatalogOpen(false);
  };

  const onRemoveSession = (id: string) => {
    void chatFeed.removeSession(id);
  };

  const setRegenerating = useCallback((id: string, on: boolean) => {
    setRegeneratingMessageIds(previous => {
      const next = new Set(previous);
      if (on) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }, []);

  const patchLiveArtifact = useCallback(
    (messageId: string, patch: ChatFeedArtifactPatch) => {
      const { current } = activeSessionRef;
      if (current === undefined) {
        return;
      }
      updateLiveSession({
        ...current,
        entries: current.entries.map(entry =>
          entry.id === messageId && (entry.type === `text` || entry.type === `image`) ? { ...entry, ...patch } : entry,
        ),
      });
    },
    [updateLiveSession],
  );

  const regenerateArtifact = useCallback(
    async ({ kind, messageId, sessionId }: RegenerateArtifactInput) => {
      if (llm === undefined || snappyAi === undefined) {
        return;
      }
      const entries =
        sessionId === undefined
          ? activeSessionRef.current?.entries
          : chatFeed.list().find(session => session.id === sessionId)?.entries;

      const candidate = entries?.find(item => item.id === messageId);
      if (candidate?.type !== kind) {
        return;
      }

      setRegenerating(messageId, true);
      try {
        try {
          let patch: ChatFeedArtifactPatch;
          if (kind === `image`) {
            const im = modelOf(snappyAi, `image`, llm.image);
            if (im === undefined) {
              return;
            }
            const result = await im.process(candidate.generationPrompt, {
              quality: llm.imageQuality,
              size: `1024x1024`,
            });

            patch = { src: DataUrl.png(result.bytes) };
          } else {
            const cm = modelOf(snappyAi, `chat`, llm.chat);
            if (cm === undefined) {
              return;
            }
            const { done, stream } = await cm.process(candidate.generationPrompt);
            let html = ``;

            const patchLive =
              sessionId === undefined
                ? (nextHtml: string) => patchLiveArtifact(messageId, { html: nextHtml })
                : undefined;
            for await (const delta of stream) {
              html += delta;
              patchLive?.(html);
            }
            patch = { html: (await done).text };
          }

          if (sessionId === undefined) {
            patchLiveArtifact(messageId, patch);
          } else {
            await chatFeed.patchSessionEntry(sessionId, messageId, patch);
          }
        } catch (error) {
          if (isBalanceBlockedError(error)) {
            balanceLow();

            return;
          }
          throw error;
        }
      } finally {
        setRegenerating(messageId, false);
      }
    },
    [balanceLow, chatFeed, isBalanceBlockedError, llm, modelOf, patchLiveArtifact, setRegenerating, snappyAi],
  );

  return {
    activeSession,
    agentRunning,
    catalogOpen,
    onCloseCatalog: () => setCatalogOpen(false),
    onOpenCatalog,
    onPickAgent,
    onRejectUi,
    onRemoveSession,
    onResolveUi,
    onStop: stopAgent,
    pendingUi,
    presets: { byGroup, groupOrder },
    regenerateArtifact,
    regeneratingMessageIds,
    sessions,
  };
};
