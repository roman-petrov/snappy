/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Ai, AiOptions } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";
import type { AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { createElement } from "react";

import type { AgentArtifact, FeedArtifact } from "../Types";
import type { AgentFeedBadgeLabel, AgentFeedEntry, AgentFeedItem } from "./Types";

import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = {
  aiOptions: AiOptions;
  commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AgentFeedHandle = ({ aiOptions, commit, typeWriterSpeed }: AgentFeedHandleConfig) => {
  let keySeq = 0;

  const addEntry = (entry: AgentFeedEntry) => {
    const key = keySeq;
    keySeq += 1;
    commit(previous => [...previous, { entry, key }]);

    return key;
  };

  const removeEntry = (key: number) => commit(previous => previous.filter(item => item.key !== key));

  const updateArtifactEntry = (entryKey: number, patch: Partial<AgentArtifact>) =>
    commit(previous =>
      previous.map(item => {
        if (item.key !== entryKey || item.entry.type !== `artifact`) {
          return item;
        }

        const { artifact } = item.entry;

        const next: AgentArtifact =
          artifact.type === `text` ? { ...artifact, ...patch, type: `text` } : { ...artifact, ...patch, type: `image` };

        return { ...item, entry: { ...item.entry, artifact: next } };
      }),
    );

  const failArtifact = (entryKey: number, error: unknown, done: PromiseWithResolvers<{ artifactId: string }>) => {
    updateArtifactEntry(entryKey, {
      error: error instanceof Error ? error.message : `generation_failed`,
      generationStatus: `error`,
    });
    done.reject(error);
  };

  const publishArtifact = (
    entryKey: number,
    artifact: FeedArtifact,
    done: PromiseWithResolvers<{ artifactId: string }>,
  ) => {
    updateArtifactEntry(entryKey, { ...artifact, generationStatus: `done` });
    done.resolve({ artifactId: artifact.id });
  };

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
    const done = Promise.withResolvers<{ artifactId: string }>();

    const base =
      type === `image`
        ? ({ generationPrompt: prompt, src: ``, type: `image` } as const)
        : ({ generationPrompt: prompt, text: ``, type: `text` } as const);

    const key = addEntry({
      ai,
      artifact: { ...base, generationStatus: `running`, model },
      done,
      model,
      type: `artifact`,
    });

    return done.promise.catch((error: unknown) => {
      failArtifact(key, error, done);
      throw error;
    });
  };

  const generateText: AgentFeedRuntime[`generateText`] = async ({ ai, model, prompt }) =>
    generateArtifact({ ai, model, prompt, type: `text` });

  const generateImage: AgentFeedRuntime[`generateImage`] = async ({ ai, model, prompt }) =>
    generateArtifact({ ai, model, prompt, type: `image` });

  const ask: AgentFeedRuntime[`ask`] = async plan => {
    const done = Promise.withResolvers<StaticFormAnswersOf<StaticFormPlan>>();
    const key = addEntry({ done, plan, type: `form` });

    return done.promise.finally(() => removeEntry(key));
  };

  const rows = (items: AgentFeedItem[]) =>
    items.map(({ entry, key }) => {
      if (entry.type === `artifact`) {
        if (entry.ai === undefined) {
          return undefined;
        }

        const { artifact: item, done } = entry;

        const props = {
          ai: entry.ai,
          aiOptions,
          content: item.type === `image` ? item.src : item.text,
          id: `id` in item ? item.id : ``,
          model: entry.model ?? item.model ?? ``,
          onError: (_id: string, error: unknown) => failArtifact(key, error, done),
          onPublish: (artifact: FeedArtifact) => publishArtifact(key, artifact, done),
          onRemove: () => removeEntry(key),
          prompt: item.generationPrompt,
        };

        if (item.type === `image`) {
          return createElement(AgentFeedRow.image, { ...props, key });
        }

        return createElement(AgentFeedRow.text, { ...props, key, typeWriterSpeed });
      }

      if (entry.type === `status` || entry.type === `tool-badge`) {
        return createElement(AgentFeedRow.badge, {
          done: entry.done,
          key,
          ...(entry.type === `status` ? { hideOnSuccess: true as const } : {}),
          text: entry.text,
        });
      }

      if (entry.type === `form`) {
        return createElement(AgentFeedRow.form, {
          key,
          onSubmit: (value: StaticFormAnswersOf<StaticFormPlan>) => entry.done.resolve(value),
          plan: entry.plan,
        });
      }

      if (entry.type === `user`) {
        return createElement(AgentFeedRow.user, { key, text: entry.text });
      }

      if (entry.type === `reasoning`) {
        return createElement(AgentFeedRow.reasoning, {
          key,
          onComplete: () => entry.done.resolve(),
          stream: entry.stream,
        });
      }

      return createElement(AgentFeedRow.stream, {
        key,
        onComplete: () => entry.done.resolve(),
        stream: entry.stream,
        typeWriterSpeed,
      });
    });

  const appendStream = async (source: AsyncIterable<string>, type: `reasoning` | `stream`) => {
    const done = Promise.withResolvers<void>();
    addEntry({ done, stream: source, type });
    await done.promise.catch(_.noop);
  };

  const appendChatStream: AgentFeedRuntime[`appendChatStream`] = async source => appendStream(source, `stream`);

  const appendChatText: AgentFeedRuntime[`appendChatText`] = async text => {
    const chunks = async function* chunks() {
      yield await Promise.resolve(text);
    };

    await appendChatStream(chunks());
  };

  const appendReasoningStream: AgentFeedRuntime[`appendReasoningStream`] = async source =>
    appendStream(source, `reasoning`);

  const reset = () => {
    commit(previous => {
      for (const { entry } of previous) {
        if (`done` in entry) {
          entry.done.reject();
        }
      }

      return [];
    });
  };

  const appendStatus = (text: string, done: PromiseWithResolvers<AgentFeedBadgeLabel>) =>
    addEntry({ done, text, type: `status` });

  const appendToolBadge = (text: string, done: PromiseWithResolvers<AgentFeedBadgeLabel>) =>
    addEntry({ done, text, type: `tool-badge` });

  const appendUserText = (text: string) => addEntry({ text, type: `user` });

  return {
    appendChatStream,
    appendChatText,
    appendReasoningStream,
    appendStatus,
    appendToolBadge,
    appendUserText,
    ask,
    generateImage,
    generateText,
    reset,
    rows,
  };
};

export type AgentFeedHandle = ReturnType<typeof AgentFeedHandle>;
