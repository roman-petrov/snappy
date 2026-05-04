import { Ai } from "@snappy/ai";
import { useEffect, useRef, useState } from "react";

import type { AgentFeedEntry, AgentFeedItem } from "../../components/agent-feed";
import type { StaticFormAnswers } from "../../../core";
import type { StaticTextAgentComponentProps } from "./StaticTextAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

const copy = (locale: StaticTextAgentComponentProps[`locale`]) => ({
  chatDone: locale === `ru` ? `Ответ получен` : `Response generated`,
  thinking: locale === `ru` ? `Думаю` : `Thinking`,
});

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

  const addEntry = (entry: AgentFeedEntry) => {
    const key = entryKeyRef.current;
    entryKeyRef.current += 1;
    setEntries(previous => [...previous, { entry, key }]);
  };

  const appendArtifact = async (generationPrompt: string, html: string) => {
    const item = { agentId, generationPrompt, html, id: crypto.randomUUID(), type: `text` } as const;
    addEntry({ artifact: item, type: `artifact` });
    await onArtifacts([item]);
  };

  const chat = async (promptText: string) => {
    const labels = copy(locale);
    let resolveThinking!: (value: { label: string }) => void;
    const thinkingFinished = new Promise<{ label: string }>(r => {
      resolveThinking = r;
    });
    addEntry({ finished: thinkingFinished, text: labels.thinking, type: `status` });

    let resolveText!: (value: string) => void;
    const textPromise = new Promise<string>(r => {
      resolveText = r;
    });

    try {
      const ai = await Ai({ ...aiConfig.options, locale });
      const session = await ai.chat.completions.create({ model: aiConfig.models.chat, prompt: promptText });

      let fullText = ``;
      let firstChunk = true;

      async function* chunks() {
        try {
          for await (const part of session.stream) {
            if (part.type !== `text`) {
              continue;
            }
            if (!mountedRef.current) {
              return;
            }
            if (firstChunk) {
              firstChunk = false;
              resolveThinking({ label: labels.chatDone });
            }
            fullText += part.text;
            yield part.text;
          }
          if (firstChunk) {
            resolveThinking({ label: labels.chatDone });
          }
        } finally {
          await session.cost();
          resolveText(fullText);
        }
      }

      addEntry({ chunks: chunks(), tool: `chat`, type: `stream` });
    } catch {
      resolveThinking({ label: labels.chatDone });
      resolveText(``);
    }

    return textPromise;
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
      const generationPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
      await appendArtifact(generationPrompt, await chat(generationPrompt));
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
