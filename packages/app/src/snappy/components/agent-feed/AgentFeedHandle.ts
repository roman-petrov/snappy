/* eslint-disable init-declarations */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { createElement } from "react";

import type { AgentArtifact } from "../Types";
import type { AgentFeedArtifactSink, AgentFeedEntry, AgentFeedItem } from "./Types";

import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = {
  commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;
  getArtifactSink: () => AgentFeedArtifactSink | undefined;
};

export const AgentFeedHandle = ({ commit, getArtifactSink }: AgentFeedHandleConfig) => {
  type StreamEntryType = `reasoning` | `stream`;

  let keySeq = 0;

  const nextKey = () => {
    const key = keySeq;
    keySeq += 1;

    return key;
  };

  const pushEntry = (key: number, entry: AgentFeedEntry) => commit(previous => [...previous, { entry, key }]);

  const addEntry = (entry: AgentFeedEntry) => {
    const key = nextKey();
    pushEntry(key, entry);

    return key;
  };

  const removeEntry = (key: number) => commit(previous => previous.filter(item => item.key !== key));

  const replaceEntry = (key: number, entry: AgentFeedEntry) =>
    commit(previous => previous.map(item => (item.key === key ? { ...item, entry } : item)));

  const appendStream = (stream: AsyncIterable<string>, entryType: StreamEntryType) => {
    const key = nextKey();
    pushEntry(key, { stream, type: entryType });

    return key;
  };

  const updateArtifactEntry = (artifactId: string, patch: Partial<AgentArtifact>) => {
    commit(previous =>
      previous.map(item => {
        if (item.entry.type !== `artifact` || item.entry.artifact.id !== artifactId) {
          return item;
        }

        const { artifact } = item.entry;

        const next: AgentArtifact =
          artifact.type === `text` ? { ...artifact, ...patch, type: `text` } : { ...artifact, ...patch, type: `image` };

        return { ...item, entry: { ...item.entry, artifact: next } };
      }),
    );
  };

  const failArtifactGeneration = (artifactId: string, error: unknown) => {
    updateArtifactEntry(artifactId, {
      error: error instanceof Error ? error.message : `generation_failed`,
      generationStatus: `error`,
    });
  };

  const generateText: AgentFeedRuntime[`generateText`] = async ({ ai, model, prompt }) => {
    const artifactId = crypto.randomUUID();

    const artifact: AgentArtifact = {
      generationPrompt: prompt,
      generationStatus: `running`,
      html: ``,
      id: artifactId,
      model,
      type: `text`,
    };

    return new Promise<{ artifactId: string }>((resolve, reject) => {
      const key = addEntry({
        ai,
        artifact,
        model,
        onArtifactError: reject,
        onArtifactGenerated: async doneArtifact => {
          replaceEntry(key, { ai, artifact: doneArtifact, model, type: `artifact` });
          try {
            await getArtifactSink()?.publish(doneArtifact);
            resolve({ artifactId });
          } catch (error) {
            reject(error);
          }
        },
        type: `artifact`,
      });
    }).catch((error: unknown) => {
      failArtifactGeneration(artifactId, error);
      throw error;
    });
  };

  let pendingFormAnswer: ((value: StaticFormAnswersOf<StaticFormPlan>) => void) | undefined;

  const ask: AgentFeedRuntime[`ask`] = async plan => {
    const key = addEntry({ plan, type: `form` });

    return new Promise(resolve => {
      pendingFormAnswer = value => {
        removeEntry(key);
        resolve(value);
      };
    });
  };

  const submitForm = (value: StaticFormAnswersOf<StaticFormPlan>) => {
    pendingFormAnswer?.(value);
    pendingFormAnswer = undefined;
  };

  const rows = (items: AgentFeedItem[]) =>
    items.map(({ entry, key }) => {
      if (entry.type === `artifact`) {
        const { ai, artifact, model, onArtifactError, onArtifactGenerated } = entry;
        const prompt = artifact.generationPrompt;
        const externallyGenerating = artifact.generationStatus === `running`;
        const base = { onError: onArtifactError, prompt };

        if (artifact.type === `image`) {
          const suppressCardAi = externallyGenerating && artifact.src.trim() === ``;

          return createElement(AgentFeedRow.image, {
            key,
            ...base,
            ai: suppressCardAi ? undefined : ai,
            model: suppressCardAi ? undefined : (model ?? artifact.model),
            onGenerated: next =>
              onArtifactGenerated?.({ ...artifact, generationStatus: `done`, src: next, type: `image` }),
            src: artifact.src,
          });
        }

        return createElement(AgentFeedRow.text, {
          key,
          ...base,
          ai,
          generating: externallyGenerating,
          html: artifact.html,
          model: model ?? artifact.model,
          onGenerated: html => onArtifactGenerated?.({ ...artifact, generationStatus: `done`, html, type: `text` }),
        });
      }

      if (entry.type === `status` || entry.type === `tool-badge`) {
        return createElement(AgentFeedRow.badge, {
          finished: entry.finished,
          key,
          ...(entry.type === `status` ? { hideOnSuccess: true as const } : {}),
          text: entry.text,
          typography: `caption`,
        });
      }

      if (entry.type === `form`) {
        return createElement(AgentFeedRow.form, { key, onSubmit: submitForm, plan: entry.plan });
      }

      if (entry.type === `user`) {
        return createElement(AgentFeedRow.user, { key, text: entry.text });
      }

      if (entry.type === `reasoning`) {
        return createElement(AgentFeedRow.reasoning, { key, stream: entry.stream });
      }

      return createElement(AgentFeedRow.stream, { key, stream: entry.stream });
    });

  const generateImage: AgentFeedRuntime[`generateImage`] = async ({ ai, model, prompt, size }) => {
    const artifactId = crypto.randomUUID();

    const artifact: AgentArtifact = {
      generationPrompt: prompt,
      generationStatus: `running`,
      id: artifactId,
      model,
      src: ``,
      type: `image`,
    };

    const key = addEntry({ ai, artifact, model, type: `artifact` });

    try {
      const out = await ai.images.generate({
        model,
        prompt,
        quality: AiConstants.defaults.imageQuality,
        size: size ?? `1024x1024`,
      });

      const src = DataUrl.png(out.bytes);
      const doneArtifact: AgentArtifact = { ...artifact, generationStatus: `done`, src };
      replaceEntry(key, { ai, artifact: doneArtifact, model, type: `artifact` });
      await getArtifactSink()?.publish(doneArtifact);

      return { artifactId };
    } catch (error) {
      failArtifactGeneration(artifactId, error);
      throw error;
    }
  };

  const appendChatStream = (stream: AsyncIterable<string>) => appendStream(stream, `stream`);
  const appendReasoningStream = (stream: AsyncIterable<string>) => appendStream(stream, `reasoning`);

  const appendStatus = (text: string, finished: Promise<{ label: string }>) =>
    addEntry({ finished, text, type: `status` });

  const appendToolBadge = (text: string, finished: Promise<{ label: string }>) =>
    addEntry({ finished, text, type: `tool-badge` });

  const appendUserText = (text: string) => addEntry({ text, type: `user` });

  return {
    appendChatStream,
    appendReasoningStream,
    appendStatus,
    appendToolBadge,
    appendUserText,
    ask,
    generateImage,
    generateText,
    rows,
  };
};

export type AgentFeedHandle = ReturnType<typeof AgentFeedHandle>;
