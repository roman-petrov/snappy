import { Agent as AgentRuntime, type AgentStreamPart } from "@snappy/agent";
import { Ai, type AiChatMessage, type AiImageSize } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { useEffect, useRef, useState } from "react";

import type { AgentFeedEntry, AgentFeedItem } from "../../common/components/agent-feed";
import type { StaticFormPlan } from "../../core";
import type { AgentComponentProps } from "../../Types";

import { scenarios } from "./Scenarios";
import { System } from "./System";
import { Tools } from "./Tools";

export type FreeOrchestratorActivityEntry = AgentFeedEntry;

type FreeOrchestratorActivityItem = AgentFeedItem;

type PendingForm = {
  cancel: (error: Error) => void;
  plan: StaticFormPlan;
  submit: (value: Record<string, unknown>) => void;
};

export const useFreeOrchestratorComponentState = ({
  aiConfig,
  locale,
  onArtifacts,
  onRequestClose,
  onRunningChange,
}: AgentComponentProps) => {
  const [entries, setEntries] = useState<FreeOrchestratorActivityItem[]>([]);
  const [pendingForm, setPendingForm] = useState<PendingForm | undefined>(undefined);
  const [starterOpen, setStarterOpen] = useState(true);
  const [starterLabel, setStarterLabel] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const stopRunRef = useRef<(() => void) | undefined>(undefined);
  const stopRequestedRef = useRef(false);
  const entryKeyRef = useRef(0);
  const onArtifactsRef = useRef(onArtifacts);
  const onRunningChangeRef = useRef(onRunningChange);

  const addEntry = (entry: AgentFeedEntry): number => {
    const key = entryKeyRef.current;
    entryKeyRef.current += 1;
    setEntries(previous => [...previous, { entry, key }]);

    return key;
  };

  const removeEntry = (key: number) => {
    setEntries(previous => previous.filter(item => item.key !== key));
  };

  const replaceEntry = (key: number, entry: AgentFeedEntry) => {
    setEntries(previous => previous.map(item => (item.key === key ? { ...item, entry } : item)));
  };

  useEffect(() => {
    onArtifactsRef.current = onArtifacts;
  }, [onArtifacts]);
  useEffect(() => {
    onRunningChangeRef.current = onRunningChange;
  }, [onRunningChange]);

  useEffect(() => {
    onRunningChangeRef.current(running);
  }, [running]);

  useEffect(() => {
    if (starterLabel === undefined) {
      return () => undefined;
    }

    stopRequestedRef.current = false;
    setRunning(true);

    const askForm = async (plan: StaticFormPlan) =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        setPendingForm({ cancel: reject, plan, submit: resolve });
      });

    const publishRunErrorText = (item: { generationPrompt: string; html: string }) => {
      const artifact = { ...item, agentId: `free-orchestrator`, id: crypto.randomUUID(), type: `text` } as const;
      addEntry({ artifact, type: `artifact` });
      void onArtifactsRef.current([artifact]);
    };

    void (async () => {
      const text = `Starter task message: "${starterLabel.trim()}". Begin the analysis and intake phase: clarify only what is needed via ask before generation, general to specific.`;
      const initialMessages: AiChatMessage[] = [{ content: text, role: `user` }];
      const ai = await Ai({ ...aiConfig.options, locale });

      const streamTextArtifact = async (prompt: string): Promise<string> => {
        const htmlBridge: { settle: (value: string) => void } = {
          settle: () => undefined,
        };

        const htmlPromise = new Promise<string>(resolve => {
          htmlBridge.settle = resolve;
        });

        const streamChunks = async function* streamChunks(): AsyncGenerator<string> {
          let html = ``;
          try {
            const session = await ai.chat.completions.create({
              model: aiConfig.models.chat,
              prompt,
            });
            for await (const part of session.stream) {
              if (stopRequestedRef.current) {
                break;
              }

              if (part.type === `text`) {
                html += part.text;
                yield part.text;
              }
            }
            await session.cost();
          } finally {
            htmlBridge.settle(html);
          }
        };

        const key = addEntry({
          chunks: streamChunks(),
          generationPrompt: prompt,
          type: `text-card-stream`,
        });

        const html = await htmlPromise;
        if (html.trim() === `` || stopRequestedRef.current) {
          removeEntry(key);

          return ``;
        }
        const artifact = {
          agentId: `free-orchestrator`,
          generationPrompt: prompt,
          html,
          id: crypto.randomUUID(),
          type: `text`,
        } as const;
        replaceEntry(key, { artifact, type: `artifact` });
        void onArtifactsRef.current([artifact]);

        return html;
      };

      const streamImageArtifact = async (input: {
        prompt: string;
        size?: AiImageSize;
      }): Promise<boolean> => {
        const { prompt, size } = input;
        const key = addEntry({ generationPrompt: prompt, type: `image-card-progress` });

        const out = await ai.images.generate({
          model: aiConfig.models.image,
          prompt,
          quality: aiConfig.models.imageQuality,
          size: size ?? `1024x1024`,
        });
        if (out.bytes.length === 0 || stopRequestedRef.current) {
          removeEntry(key);

          return false;
        }

        const src = DataUrl.png(out.bytes);

        const artifact = {
          agentId: `free-orchestrator`,
          generationPrompt: prompt,
          id: crypto.randomUUID(),
          src,
          type: `image`,
        } as const;
        replaceEntry(key, { artifact, type: `artifact` });
        void onArtifactsRef.current([artifact]);

        return true;
      };

      const agent = AgentRuntime({
        ai,
        chatModel: aiConfig.models.chat,
        locale,
        maxRounds: 8,
        systemPrompt: System.prompt,
        tools: Tools.list({
          agentContext: { isStopped: () => stopRequestedRef.current },
          ai,
          askForm,
          config: aiConfig,
          isStopped: () => stopRequestedRef.current,
          streamImageArtifact,
          streamTextArtifact,
        }),
      });

      const runInstance = agent.start(initialMessages);
      stopRunRef.current = runInstance.stop;

      const handleStreamPart = (part: AgentStreamPart) => {
        switch (part.type) {
          case `run`: {
            if (part.reason === `failed`) {
              const html = part.error instanceof Error ? part.error.message : `unknown_error`;
              if (html.trim() !== ``) {
                publishRunErrorText({ generationPrompt: html, html });
              }
            }
            setRunning(false);
            break;
          }
          case `text`: {
            addEntry({ chunks: part.chunks, tool: `chat`, type: `stream` });
            break;
          }
          case `thinking`: {
            addEntry({ finished: part.finished, text: part.label, type: `status` });
            break;
          }
          case `tool`: {
            if (part.label.trim() !== ``) {
              addEntry({ finished: part.finished, text: part.label, type: `status` });
            }
            break;
          }
          default: {
            break;
          }
        }
      };

      try {
        for await (const part of runInstance) {
          handleStreamPart(part);
        }
        await runInstance.done;
      } catch {
        /* Agent loop aborted */
      }
    })();

    return () => {
      stopRequestedRef.current = true;
      stopRunRef.current?.();
      stopRunRef.current = undefined;
      setPendingForm(current => {
        current?.cancel(new Error(`agent_stopped`));

        return undefined;
      });
      setRunning(false);
    };
  }, [aiConfig, locale, starterLabel]);

  return {
    entries,
    finishVisible:
      !running &&
      (!starterOpen || entries.some(({ entry }) => entry.type === `artifact`)),
    locale,
    onFinish: onRequestClose,
    onFormCancel: () =>
      setPendingForm(current => {
        current?.cancel(new Error(`ui_cancelled`));

        return undefined;
      }),
    onFormSubmit: (value: Record<string, unknown>) =>
      setPendingForm(current => {
        current?.submit(value);

        return undefined;
      }),
    pendingForm,
    starterProps: starterOpen
      ? {
          onCancel: () => setStarterOpen(false),
          onStart: (label: string) => {
            setStarterOpen(false);
            setStarterLabel(label);
          },
          options: scenarios(locale),
        }
      : undefined,
  };
};
