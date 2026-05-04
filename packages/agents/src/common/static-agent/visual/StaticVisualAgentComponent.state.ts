import { Ai } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { useEffect, useRef, useState } from "react";

import type { AgentFeedEntry, AgentFeedItem } from "../../components/agent-feed";
import type { StaticFormAnswers } from "../../../core";
import type { StaticVisualAgentComponentProps } from "./StaticVisualAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

const copy = (locale: StaticVisualAgentComponentProps[`locale`]) => ({
  chatDone: locale === `ru` ? `Ответ получен` : `Response generated`,
  imageDone: locale === `ru` ? `Изображение готово` : `Image generated`,
  imagePending: locale === `ru` ? `Генерирую изображение` : `Generating image`,
  thinking: locale === `ru` ? `Думаю` : `Thinking`,
});

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

  const addEntry = (entry: AgentFeedEntry) => {
    const key = entryKeyRef.current;
    entryKeyRef.current += 1;
    setEntries(previous => [...previous, { entry, key }]);
  };

  const appendArtifact = async (generationPrompt: string, src: string) => {
    const item = { agentId, generationPrompt, id: crypto.randomUUID(), src, type: `image` } as const;
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

  const image = async (promptText: string) => {
    const labels = copy(locale);
    let resolveDone!: (value: { label: string }) => void;
    const finished = new Promise<{ label: string }>(r => {
      resolveDone = r;
    });
    addEntry({ finished, text: labels.imagePending, type: `status` });

    try {
      const ai = await Ai({ ...aiConfig.options, locale });

      const out = await ai.images.generate({
        model: aiConfig.models.image,
        prompt: promptText,
        quality: aiConfig.models.imageQuality,
        size: `1024x1024`,
      });
      resolveDone({ label: labels.imageDone });

      return mountedRef.current ? out.bytes : new Uint8Array();
    } catch {
      resolveDone({ label: labels.imageDone });

      return new Uint8Array();
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
      await appendArtifact(generationPrompt, DataUrl.png(await image(generationPrompt)));
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
