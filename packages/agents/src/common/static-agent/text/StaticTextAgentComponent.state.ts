import { Ai } from "@snappy/ai";
import { useEffect, useRef, useState } from "react";

import type { StaticFormAnswers } from "../../../core";
import type { AgentArtifact } from "../../../Types";
import type { StaticTextAgentComponentProps } from "./StaticTextAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

type TextArtifact = Extract<AgentArtifact, { type: `text` }>;

type ToolEntry = {
  cost?: number;
  id: string;
  status: `done` | `error` | `running`;
  text: string;
  tool: `chat`;
  type: `tool`;
};

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
  const [entries, setEntries] = useState<ToolEntry[]>([]);
  const [artifacts, setArtifacts] = useState<TextArtifact[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [running, setRunning] = useState(false);
  const mountedRef = useRef(true);

  const appendTool = (entry: Omit<ToolEntry, `id` | `type`>) => {
    const id = crypto.randomUUID();
    setEntries(previous => [...previous, { ...entry, id, type: `tool` }]);

    return id;
  };

  const patchTool = (id: string, patch: Partial<ToolEntry>) =>
    setEntries(previous => previous.map(item => (item.id === id ? { ...item, ...patch } : item)));

  const appendArtifact = async (generationPrompt: string, html: string) => {
    const item = { agentId, generationPrompt, html, id: crypto.randomUUID(), type: `text` } as const;
    setArtifacts(previous => [...previous, item]);
    await onArtifacts([item]);
  };

  const chat = async (promptText: string) => {
    const id = appendTool({ status: `running`, text: `chat.feed.chat.pending`, tool: `chat` });
    const ai = await Ai({ ...aiConfig.options, locale });
    const session = await ai.chat.completions.create({ model: aiConfig.models.chat, prompt: promptText });
    let text = ``;

    for await (const part of session.stream) {
      if (part.type !== `text`) {
        continue;
      }
      if (!mountedRef.current) {
        return ``;
      }
      text += part.text;
      patchTool(id, { text });
    }
    const cost = await session.cost();
    if (!mountedRef.current) {
      return ``;
    }
    patchTool(id, { cost, status: `done`, text: `chat.feed.chat.done` });

    return text;
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
    artifacts,
    finishVisible: !running && (artifacts.length > 0 || !showForm),
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
    lines: entries,
    locale,
    onFinish: onRequestClose,
  } as const;
};
