/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Ai } from "@snappy/ai";
import type { AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { createElement } from "react";

import type { AgentArtifact } from "../Types";
import type { AgentFeedEntry, AgentFeedItem } from "./Types";

import { ChatFeed } from "../../../pages/feed/ChatFeed";
import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = { commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void };

type ArtifactPending = { reject: (error: unknown) => void; resolve: (value: { artifactId: string }) => void };

export const AgentFeedHandle = ({ commit }: AgentFeedHandleConfig) => {
  let keySeq = 0;
  const artifactPending = new Map<string, ArtifactPending>();

  const seed = (type: AgentArtifact[`type`], id: string, prompt: string) =>
    type === `image`
      ? ({ generationPrompt: prompt, id, src: ``, type: `image` } as const)
      : ({ generationPrompt: prompt, id, text: ``, type: `text` } as const);

  const addEntry = (entry: AgentFeedEntry) => {
    const key = keySeq;
    keySeq += 1;
    commit(previous => [...previous, { entry, key }]);

    return key;
  };

  const removeEntry = (key: number) => commit(previous => previous.filter(item => item.key !== key));

  const updateArtifactEntry = (artifactId: string, patch: Partial<AgentArtifact>) =>
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

  const settleArtifactPending = (artifactId: string, error?: unknown) => {
    const pending = artifactPending.get(artifactId);
    if (pending === undefined) {
      return;
    }
    artifactPending.delete(artifactId);
    if (error === undefined) {
      pending.resolve({ artifactId });
    } else {
      pending.reject(error);
    }
  };

  const failArtifact = (artifactId: string, error: unknown) => {
    updateArtifactEntry(artifactId, {
      error: error instanceof Error ? error.message : `generation_failed`,
      generationStatus: `error`,
    });
    settleArtifactPending(artifactId, error);
  };

  const publish = async (artifactId: string) => {
    const row = (await ChatFeed.read()).find(item => item.id === artifactId);
    if (row === undefined) {
      return;
    }

    updateArtifactEntry(
      artifactId,
      row.type === `image`
        ? { generationStatus: `done`, src: row.src, type: `image` }
        : { generationStatus: `done`, text: row.text, type: `text` },
    );
    settleArtifactPending(artifactId);
  };

  const onPublish = (artifactId: string) => {
    void publish(artifactId);
  };

  const onRemove = (artifactId: string) =>
    commit(previous =>
      previous.filter(item => item.entry.type !== `artifact` || item.entry.artifact.id !== artifactId),
    );

  const trackArtifact = async (artifactId: string) =>
    new Promise<{ artifactId: string }>((resolve, reject) => {
      artifactPending.set(artifactId, { reject, resolve });
    });

  const generateArtifact = async ({
    ai,
    model,
    prompt,
    type,
  }: {
    ai: Ai;
    model: string;
    prompt: string;
    type: AgentArtifact[`type`];
  }) => {
    const id = crypto.randomUUID();
    const base = seed(type, id, prompt);

    await ChatFeed.upsert(base);
    addEntry({ ai, artifact: { ...base, generationStatus: `running`, model }, model, type: `artifact` });

    return trackArtifact(id).catch((error: unknown) => {
      failArtifact(id, error);
      throw error;
    });
  };

  const generateText: AgentFeedRuntime[`generateText`] = async ({ ai, model, prompt }) =>
    generateArtifact({ ai, model, prompt, type: `text` });

  const generateImage: AgentFeedRuntime[`generateImage`] = async ({ ai, model, prompt }) =>
    generateArtifact({ ai, model, prompt, type: `image` });

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
        if (entry.ai === undefined) {
          return undefined;
        }

        const { artifact } = entry;

        const props = {
          ai: entry.ai,
          content: artifact.type === `image` ? artifact.src : artifact.text,
          id: artifact.id,
          key,
          model: entry.model ?? artifact.model ?? ``,
          onError: failArtifact,
          onPublish,
          onRemove,
          prompt: artifact.generationPrompt,
        };

        return createElement(artifact.type === `image` ? AgentFeedRow.image : AgentFeedRow.text, props);
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

  const appendChatStream = (stream: AsyncIterable<string>) => addEntry({ stream, type: `stream` });
  const appendReasoningStream = (stream: AsyncIterable<string>) => addEntry({ stream, type: `reasoning` });

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
