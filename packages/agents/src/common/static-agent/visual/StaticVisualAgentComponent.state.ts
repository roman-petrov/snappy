import { Ai } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { useEffect, useRef, useState } from "react";

import type { StaticFormAnswers } from "../../../core";
import type { AgentArtifact } from "../../../Types";
import type { StaticVisualAgentComponentProps } from "./StaticVisualAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

type ImageArtifact = Extract<AgentArtifact, { type: `image` }>;

type ToolEntry = {
  cost?: number;
  id: string;
  status: `done` | `error` | `running`;
  text: string;
  tool: `chat` | `image`;
  type: `tool`;
};

export const useStaticVisualAgentComponentState = ({
  agentId,
  aiConfig,
  locale,
  onArtifacts,
  onRequestClose,
  onRunningChange,
  plan,
  prompt,
}: StaticVisualAgentComponentProps) => {
  const [entries, setEntries] = useState<ToolEntry[]>([]);
  const [artifacts, setArtifacts] = useState<ImageArtifact[]>([]);
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

  const appendArtifact = async (generationPrompt: string, src: string) => {
    const item = { agentId, generationPrompt, id: crypto.randomUUID(), src, type: `image` } as const;
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

  const image = async (promptText: string) => {
    const id = appendTool({ status: `running`, text: `chat.feed.image.pending`, tool: `image` });
    const ai = await Ai({ ...aiConfig.options, locale });

    const out = await ai.images.generate({
      model: aiConfig.models.image,
      prompt: promptText,
      quality: aiConfig.models.imageQuality,
      size: `1024x1024`,
    });
    patchTool(id, { cost: out.cost, status: `done`, text: `chat.feed.image.done` });

    return mountedRef.current ? out.bytes : new Uint8Array();
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
      const generationPrompt = await chat(StaticAgentPrompt({ answers, mainPrompt: prompt, plan }));
      await appendArtifact(generationPrompt, DataUrl.png(await image(generationPrompt)));
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
