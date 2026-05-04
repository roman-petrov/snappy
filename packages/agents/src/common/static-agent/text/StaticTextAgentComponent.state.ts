import { Ai } from "@snappy/ai";
import { useEffect, useRef, useState } from "react";

import type { StaticFormAnswers } from "../../../core";
import type { AgentFeedEntry, AgentFeedItem } from "../../components/agent-feed";
import type { StaticTextAgentComponentProps } from "./StaticTextAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

export const useStaticTextAgentComponentState = ({
  agentId,
  aiConfig,
  locale,
  onArtifacts,
  onRequestClose,
  onRunningChange,
  plan,
  prompt,
}: StaticTextAgentComponentProps) => {
  const [entries, setEntries] = useState<AgentFeedItem[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [running, setRunning] = useState(false);
  const mountedRef = useRef(true);
  const entryKeyRef = useRef(0);

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

  const chat = async (promptText: string): Promise<string> => {
    const htmlBridge: { settle: (value: string) => void } = {
      settle: () => undefined,
    };

    const htmlPromise = new Promise<string>(resolve => {
      htmlBridge.settle = resolve;
    });

    const streamChunks = async function* streamChunks(): AsyncGenerator<string> {
      let html = ``;
      try {
        const ai = await Ai({ ...aiConfig.options, locale });
        const session = await ai.chat.completions.create({
          model: aiConfig.models.chat,
          prompt: promptText,
        });
        for await (const part of session.stream) {
          if (!mountedRef.current) {
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
      generationPrompt: promptText,
      type: `text-card-stream`,
    });

    const html = await htmlPromise;
    if (!mountedRef.current || html.trim() === ``) {
      removeEntry(key);

      return ``;
    }
    const item = {
      agentId,
      generationPrompt: promptText,
      html,
      id: crypto.randomUUID(),
      type: `text`,
    } as const;
    replaceEntry(key, { artifact: item, type: `artifact` });
    await onArtifacts([item]);

    return html;
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onRunningChange(running);
  }, [onRunningChange, running]);

  const run = async (answers: StaticFormAnswers) => {
    setRunning(true);
    try {
      await chat(StaticAgentPrompt({ answers, mainPrompt: prompt, plan }));
    } finally {
      if (mountedRef.current) {
        setRunning(false);
      }
    }
  };

  return {
    entries,
    finishVisible:
      !running &&
      (entries.some(({ entry }) => entry.type === `artifact`) || !showForm),
    formProps:
      showForm && !running
        ? {
            onCancel: () => setShowForm(false),
            onSubmit: (value: StaticFormAnswers) => {
              setShowForm(false);
              void run(value);
            },
            plan,
          }
        : undefined,
    locale,
    onFinish: onRequestClose,
  } as const;
};
