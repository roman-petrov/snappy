import { Agent as AgentRuntime } from "@snappy/agent";
import { Ai, type AiChatMessage } from "@snappy/ai";
import { useEffect, useRef, useState } from "react";

import type { StaticFormPlan } from "../../core";
import type { AgentArtifact, AgentComponentProps } from "../../Types";

import { scenarios } from "./Scenarios";
import { Storage } from "./Storage";
import { System } from "./System";
import { Tools } from "./Tools";

export type FreeOrchestratorActivityEntry =
  | { chunks: AsyncIterable<string>; tool: `chat`; type: `stream` }
  | { finished: Promise<{ label: string }>; text: string; type: `status` };

type FreeOrchestratorActivityItem = { entry: FreeOrchestratorActivityEntry; key: number };

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
  const [artifacts, setArtifacts] = useState<AgentArtifact[]>([]);
  const [pendingForm, setPendingForm] = useState<PendingForm | undefined>(undefined);
  const [starterOpen, setStarterOpen] = useState(true);
  const [starterLabel, setStarterLabel] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const stopRunRef = useRef<(() => void) | undefined>(undefined);
  const stopRequestedRef = useRef(false);
  const entryKeyRef = useRef(0);
  const onArtifactsRef = useRef(onArtifacts);
  const onRunningChangeRef = useRef(onRunningChange);

  const addEntry = (entry: FreeOrchestratorActivityEntry) => {
    const key = entryKeyRef.current;
    entryKeyRef.current += 1;
    setEntries(previous => [...previous, { entry, key }]);
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
      return;
    }

    stopRequestedRef.current = false;
    setRunning(true);

    const askForm = async (plan: StaticFormPlan) =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        setPendingForm({ cancel: reject, plan, submit: resolve });
      });

    const publishText = (item: { generationPrompt: string; html: string }) => {
      const artifact = { ...item, agentId: `free-orchestrator`, id: crypto.randomUUID(), type: `text` } as const;
      setArtifacts(previous => [...previous, artifact]);
      void onArtifactsRef.current([artifact]);
    };

    const publishImage = (item: { generationPrompt: string; src: string }) => {
      const artifact = { ...item, agentId: `free-orchestrator`, id: crypto.randomUUID(), type: `image` } as const;
      setArtifacts(previous => [...previous, artifact]);
      void onArtifactsRef.current([artifact]);
    };

    void (async () => {
      const text = `Starter task message: "${starterLabel.trim()}". Begin the analysis and intake phase: clarify only what is needed via ask before generation, general to specific.`;
      const storage = Storage();
      const initialMessages: AiChatMessage[] = [{ content: text, role: `user` }];
      const ai = await Ai({ ...aiConfig.options, locale });

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
          publishImage,
          publishText,
          storage,
        }),
      });

      const runInstance = agent.start(initialMessages);
      stopRunRef.current = runInstance.stop;
      try {
        for await (const part of runInstance) {
          switch (part.type) {
            case `run`: {
              if (part.reason === `failed`) {
                const html = part.error instanceof Error ? part.error.message : `unknown_error`;
                if (html.trim() !== ``) {
                  publishText({ generationPrompt: html, html });
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
              addEntry({ finished: part.finished, text: part.label, type: `status` });
              break;
            }
            default: {
              break;
            }
          }
        }
        await runInstance.done;
      } catch {}
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
    artifacts,
    entries,
    finishVisible: !running && (!starterOpen || artifacts.length > 0),
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
