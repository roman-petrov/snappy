import { Ai } from "@snappy/ai";
import { useEffect, useRef, useState } from "react";

import type { AgentFeedEntry, AgentFeedItem } from "../../components/agent-feed";
import type { StaticFormAnswers } from "../../../core";
import type { StaticAudioAgentComponentProps } from "./StaticAudioAgentComponent";

import { StaticAgentPrompt } from "../StaticAgentPrompt";

const copy = (locale: StaticAudioAgentComponentProps[`locale`]) => ({
  chatDone: locale === `ru` ? `Ответ получен` : `Response generated`,
  speechDone: locale === `ru` ? `Речь распознана` : `Speech recognized`,
  speechPending: locale === `ru` ? `Распознаю речь` : `Recognizing speech`,
  thinking: locale === `ru` ? `Думаю` : `Thinking`,
});

export const useStaticAudioAgentComponentState = ({
  agentId,
  aiConfig,
  locale,
  onArtifacts,
  onRequestClose,
  onRunningChange,
  plan,
  prompt,
}: StaticAudioAgentComponentProps) => {
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

  const speechRecognition = async (file: File) => {
    const labels = copy(locale);
    let resolveDone!: (value: { label: string }) => void;
    const finished = new Promise<{ label: string }>(r => {
      resolveDone = r;
    });
    addEntry({ finished, text: labels.speechPending, type: `status` });

    try {
      const ai = await Ai({ ...aiConfig.options, locale });
      const bytes = new Uint8Array(await file.arrayBuffer());

      const out = await ai.audio.transcriptions.create({
        file: { bytes, fileName: file.name, mimeType: file.type.trim() === `` ? `application/octet-stream` : file.type },
        model: aiConfig.models.speech,
      });
      resolveDone({ label: labels.speechDone });

      return mountedRef.current ? out.text : ``;
    } catch {
      resolveDone({ label: labels.speechDone });

      return ``;
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
      const file = answers[`audio`];
      if (!(file instanceof File)) {
        return;
      }
      const transcript = await speechRecognition(file);
      const preset = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
      const generationPrompt = `${preset}\n\nTranscript:\n${transcript.trim()}`;
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
