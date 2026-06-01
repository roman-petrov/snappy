/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Ai, AiOptions } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";
import type { AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { createElement } from "react";

import type { AgentArtifact } from "../Types";
import type { AgentFeedBadgeLabel, AgentFeedEntry, AgentFeedItem } from "./Types";

import { ChatFeed } from "../../../pages/feed/ChatFeed";
import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = {
  aiOptions: AiOptions;
  commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AgentFeedHandle = ({ aiOptions, commit, typeWriterSpeed }: AgentFeedHandleConfig) => {
  let keySeq = 0;

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

  const failArtifact = (artifactId: string, error: unknown, done: PromiseWithResolvers<{ artifactId: string }>) => {
    updateArtifactEntry(artifactId, {
      error: error instanceof Error ? error.message : `generation_failed`,
      generationStatus: `error`,
    });
    done.reject(error);
  };

  const publishArtifact = (artifactId: string, done: PromiseWithResolvers<{ artifactId: string }>) => {
    void (async () => {
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
      done.resolve({ artifactId });
    })();
  };

  const onRemove = (artifactId: string) =>
    commit(previous =>
      previous.filter(item => item.entry.type !== `artifact` || item.entry.artifact.id !== artifactId),
    );

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
    const done = Promise.withResolvers<{ artifactId: string }>();

    await ChatFeed.upsert(base);
    addEntry({ ai, artifact: { ...base, generationStatus: `running`, model }, done, model, type: `artifact` });

    return done.promise.catch((error: unknown) => {
      failArtifact(id, error, done);
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
          id: item.id,
          key,
          model: entry.model ?? item.model ?? ``,
          onError: (_id: string, error: unknown) => failArtifact(item.id, error, done),
          onPublish: () => publishArtifact(item.id, done),
          onRemove,
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
          typography: `captionSm`,
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
