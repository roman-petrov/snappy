/* eslint-disable init-declarations */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Ai } from "@snappy/ai";
import type { AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { createElement } from "react";

import type { AgentFeedArtifactSink } from "../../../pages/feed";
import type { AgentArtifact } from "../Types";
import type { AgentFeedEntry, AgentFeedItem } from "./Types";

import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = {
  commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;
  getArtifactSink: () => AgentFeedArtifactSink | undefined;
};

type ArtifactPending = { reject: (error: unknown) => void; resolve: (value: { artifactId: string }) => void };

export const AgentFeedHandle = ({ commit, getArtifactSink }: AgentFeedHandleConfig) => {
  type StreamEntryType = `reasoning` | `stream`;

  let keySeq = 0;
  const artifactPending = new Map<string, ArtifactPending>();

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

  const persistArtifact = async (done: AgentArtifact) => {
    updateArtifactEntry(done.id, done);
    try {
      await getArtifactSink()?.publish(done);
      settleArtifactPending(done.id);
    } catch (error) {
      failArtifact(done.id, error);
      throw error;
    }
  };

  const artifactDone = (artifact: AgentArtifact, content: string): AgentArtifact =>
    artifact.type === `image`
      ? { ...artifact, generationStatus: `done`, src: content, type: `image` }
      : { ...artifact, generationStatus: `done`, html: content, type: `text` };

  const trackArtifact = async (artifactId: string) =>
    new Promise<{ artifactId: string }>((resolve, reject) => {
      artifactPending.set(artifactId, { reject, resolve });
    });

  const addArtifactEntry = ({
    ai,
    artifact,
    model,
    onArtifactError,
  }: {
    ai: Ai;
    artifact: AgentArtifact;
    model: string;
    onArtifactError?: (error: unknown) => void;
  }) => addEntry({ ai, artifact, model, onArtifactError, type: `artifact` });

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

    const settled = trackArtifact(artifactId);

    addArtifactEntry({ ai, artifact, model, onArtifactError: error => failArtifact(artifactId, error) });

    return settled.catch((error: unknown) => {
      failArtifact(artifactId, error);
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
        const { ai, artifact, model, onArtifactError } = entry;
        const prompt = artifact.generationPrompt;
        const externallyGenerating = artifact.generationStatus === `running`;

        const base = {
          onError: (error: unknown) => {
            onArtifactError?.(error);
            failArtifact(artifact.id, error);
          },
          onGenerated: async (content: string) => persistArtifact(artifactDone(artifact, content)),
          prompt,
        };

        if (artifact.type === `image`) {
          return createElement(AgentFeedRow.image, {
            key,

            ...base,
            ai,
            model: model ?? artifact.model,
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

  const generateImage: AgentFeedRuntime[`generateImage`] = async ({ ai, model, prompt }) => {
    const artifactId = crypto.randomUUID();

    const artifact: AgentArtifact = {
      generationPrompt: prompt,
      generationStatus: `running`,
      id: artifactId,
      model,
      src: ``,
      type: `image`,
    };

    const settled = trackArtifact(artifactId);

    addArtifactEntry({ ai, artifact, model, onArtifactError: error => failArtifact(artifactId, error) });

    return settled.catch((error: unknown) => {
      failArtifact(artifactId, error);
      throw error;
    });
  };

  const appendStream = (stream: AsyncIterable<string>, entryType: StreamEntryType) => {
    const key = nextKey();
    pushEntry(key, { stream, type: entryType });

    return key;
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
