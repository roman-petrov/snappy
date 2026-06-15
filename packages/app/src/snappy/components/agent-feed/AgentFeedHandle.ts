/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { TypeWriterSpeed } from "@snappy/domain";

import { _ } from "@snappy/core";
import {
  type AgentFeedArtifactResult,
  type AgentFeedRuntime,
  type StaticFormAnswers,
  StaticFormAnswersOf,
  type StaticFormPlan,
} from "@snappy/snappy-sdk";
import { createElement } from "react";

import type { AgentArtifact, FeedArtifact } from "../Types";
import type { AgentFeedArtifactEntry, AgentFeedBadgeLabel, AgentFeedEntry, AgentFeedItem } from "./Types";

import { AgentFeedRow } from "./AgentFeedRow";

export type AgentFeedHandleConfig = {
  commit: (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AgentFeedHandle = ({ commit, typeWriterSpeed }: AgentFeedHandleConfig) => {
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
      previous.map(item =>
        item.key === entryKey && item.entry.type === `artifact`
          ? {
              ...item,
              entry:
                item.entry.variant === `text`
                  ? { ...item.entry, artifact: { ...item.entry.artifact, ...patch, type: `text` } }
                  : { ...item.entry, artifact: { ...item.entry.artifact, ...patch, type: `image` } },
            }
          : item,
      ),
    );

  const failArtifact = (entryKey: number, error: unknown, done: PromiseWithResolvers<AgentFeedArtifactResult>) => {
    updateArtifactEntry(entryKey, {
      error: error instanceof Error ? error.message : `generation_failed`,
      generationStatus: `error`,
    });
    done.reject(error);
  };

  const publishArtifact = (
    entryKey: number,
    artifact: FeedArtifact,
    done: PromiseWithResolvers<AgentFeedArtifactResult>,
  ) => {
    updateArtifactEntry(entryKey, { ...artifact, generationStatus: `done` });
    done.resolve({ artifactId: artifact.id, content: artifact.type === `image` ? artifact.src : artifact.text });
  };

  const runArtifact = async (entry: AgentFeedArtifactEntry) => {
    const key = addEntry(entry);

    return entry.done.promise.catch((error: unknown) => {
      failArtifact(key, error, entry.done);
      throw error;
    });
  };

  const generateText: AgentFeedRuntime[`generateText`] = async ({ model, prompt }) =>
    runArtifact({
      artifact: { generationPrompt: prompt, generationStatus: `running`, model: model.name, text: ``, type: `text` },
      done: Promise.withResolvers(),
      model,
      type: `artifact`,
      variant: `text`,
    });

  const generateImage: AgentFeedRuntime[`generateImage`] = async ({ edit, model, prompt, size }) =>
    runArtifact({
      artifact: {
        generationPrompt: prompt,
        generationStatus: `running`,
        model: model.name,
        src: ``,
        type: `image`,
        ...(edit === undefined ? {} : { edit }),
        ...(size === undefined ? {} : { size }),
      },
      done: Promise.withResolvers(),
      model,
      type: `artifact`,
      variant: `image`,
    });

  const ask: AgentFeedRuntime[`ask`] = async <TPlan extends StaticFormPlan>(plan: TPlan) => {
    const done = Promise.withResolvers<StaticFormAnswers>();
    const key = addEntry({ done, plan, type: `form` });
    const answers = await done.promise;

    commit(previous =>
      previous.map(item => (item.key === key ? { ...item, entry: { answers, plan, type: `form` } } : item)),
    );

    return StaticFormAnswersOf<TPlan>(answers);
  };

  const artifactRow = (key: number, entry: AgentFeedArtifactEntry) => {
    const { artifact, done, model, variant } = entry;

    const shared = {
      id: `id` in artifact ? artifact.id : ``,
      key,
      onError: (_id: string, error: unknown) => failArtifact(key, error, done),
      onPublish: (published: FeedArtifact) => publishArtifact(key, published, done),
      onRemove: () => removeEntry(key),
      prompt: artifact.generationPrompt,
    };

    if (variant === `image`) {
      return createElement(AgentFeedRow.image, {
        ...shared,
        content: artifact.src,
        edit: artifact.edit,
        model,
        size: artifact.size,
      });
    }

    return createElement(AgentFeedRow.text, { ...shared, content: artifact.text, model, typeWriterSpeed });
  };

  const row = ({ entry, key }: AgentFeedItem) => {
    switch (entry.type) {
      case `artifact`: {
        return artifactRow(key, entry);
      }
      case `form`: {
        if (`answers` in entry) {
          return createElement(AgentFeedRow.form, { answers: entry.answers, key, plan: entry.plan });
        }

        return createElement(AgentFeedRow.form, {
          key,
          onSubmit: value => entry.done.resolve(value),
          plan: entry.plan,
        });
      }
      case `reasoning`: {
        return createElement(AgentFeedRow.reasoning, {
          key,
          onComplete: () => entry.done.resolve(),
          stream: entry.stream,
        });
      }
      case `status`: {
        return createElement(AgentFeedRow.badge, { done: entry.done, hideOnSuccess: true, key, text: entry.text });
      }
      case `stream`: {
        return createElement(AgentFeedRow.stream, {
          key,
          onComplete: () => entry.done.resolve(),
          stream: entry.stream,
          typeWriterSpeed,
        });
      }
      case `tool-badge`: {
        return createElement(AgentFeedRow.badge, { done: entry.done, key, text: entry.text });
      }
      case `user`: {
        return createElement(AgentFeedRow.user, { key, text: entry.text });
      }
      // No default
    }
  };

  const rows = (items: AgentFeedItem[]) => items.map(row);

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
