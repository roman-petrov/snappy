import { Ai } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { useEffect, useRef, useState } from "react";

import type { StaticFormAnswers } from "../../../core";
import type { AgentFeedEntry, AgentFeedItem } from "../../components/agent-feed";
import type { StaticVisualAgentComponentProps } from "./StaticVisualAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

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

  const image = async (promptText: string): Promise<void> => {
    const key = addEntry({ generationPrompt: promptText, type: `image-card-progress` });
    try {
      const ai = await Ai({ ...aiConfig.options, locale });

      const out = await ai.images.generate({
        model: aiConfig.models.image,
        prompt: promptText,
        quality: aiConfig.models.imageQuality,
        size: `1024x1024`,
      });
      if (!mountedRef.current || out.bytes.length === 0) {
        removeEntry(key);

        return;
      }

      const src = DataUrl.png(out.bytes);

      const item = {
        agentId,
        generationPrompt: promptText,
        id: crypto.randomUUID(),
        src,
        type: `image`,
      } as const;
      replaceEntry(key, { artifact: item, type: `artifact` });
      await onArtifacts([item]);
    } catch {
      removeEntry(key);
    }

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
      if (generationPrompt.trim() !== ``) {
        await image(generationPrompt);
      }
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
