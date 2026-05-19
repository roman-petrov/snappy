/* eslint-disable init-declarations */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";
import type { Color, Typography } from "@snappy/ui";

import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";

import type { ImageCardProps } from "../ImageCard";
import type { TextCardProps } from "../TextCard";
import type { AgentArtifact } from "../Types";
import type { AgentFeedBadgeProps } from "./AgentFeedBadge";
import type { AgentFeedStreamCardProps } from "./AgentFeedStreamCard";
import type { AgentFeedArtifactSink, AgentFeedEntry, AgentFeedHandle, AgentFeedItem } from "./Types";

export type AgentFeedRow =
  | { key: number; props: AgentFeedBadgeProps; variant: `badge` }
  | { key: number; props: AgentFeedStreamCardProps; variant: `stream` }
  | { key: number; props: ImageCardProps; variant: `image` }
  | { key: number; props: TextCardProps; variant: `text` }
  | { key: number; props: { plan: StaticFormPlan }; variant: `form` }
  | { key: number; props: { text: string }; variant: `user` };

type EntriesCommit = (recipe: (previous: AgentFeedItem[]) => AgentFeedItem[]) => void;

const activeEntryKeyFrom = (items: AgentFeedItem[]): number | undefined => {
  if (items.some(({ entry }) => entry.type === `form`)) {
    return undefined;
  }
  const item = items.findLast(({ entry }) => {
    if (entry.type === `artifact`) {
      const { generationStatus } = entry.artifact;

      return generationStatus === `running`;
    }

    return entry.type === `stream` && entry.closed !== true;
  });

  return item?.key;
};

const streamClosedOnEnd = (key: number, stream: AsyncIterable<string>, commit: EntriesCommit): AsyncIterable<string> =>
  (async function* streamText() {
    try {
      for await (const text of stream) {
        yield text;
      }
    } finally {
      commit(previous =>
        previous.map(streamItem =>
          streamItem.key === key && streamItem.entry.type === `stream`
            ? { ...streamItem, entry: { ...streamItem.entry, closed: true } }
            : streamItem,
        ),
      );
    }
  })();

const rowsFromEntries = (entries: AgentFeedItem[]): AgentFeedRow[] => {
  const activeKey = activeEntryKeyFrom(entries);

  return entries.map(({ entry, key }): AgentFeedRow => {
    const active = activeKey !== undefined && key === activeKey;

    if (entry.type === `artifact`) {
      const { ai, artifact, model, onArtifactError, onArtifactGenerated } = entry;
      const prompt = artifact.generationPrompt;
      const externallyGenerating = artifact.generationStatus === `running`;
      const base = { active, onError: onArtifactError, prompt };

      if (artifact.type === `image`) {
        const suppressCardAi = externallyGenerating && artifact.src.trim() === ``;

        return {
          key,
          props: {
            ...base,
            ai: suppressCardAi ? undefined : ai,
            model: suppressCardAi ? undefined : (model ?? artifact.model),
            onGenerated: next =>
              onArtifactGenerated?.({ ...artifact, generationStatus: `done`, src: next, type: `image` }),
            src: artifact.src,
          },
          variant: `image`,
        };
      }

      return {
        key,
        props: {
          ...base,
          ai,
          generating: externallyGenerating,
          html: artifact.html,
          model: model ?? artifact.model,
          onGenerated: html => onArtifactGenerated?.({ ...artifact, generationStatus: `done`, html, type: `text` }),
        },
        variant: `text`,
      };
    }

    if (entry.type === `status` || entry.type === `tool-badge`) {
      return {
        key,
        props: {
          finished: entry.finished,
          ...(entry.type === `status` ? { hideOnSuccess: true as const } : {}),
          text: entry.text,
          typography: `caption`,
        },
        variant: `badge`,
      };
    }

    if (entry.type === `form`) {
      return { key, props: { plan: entry.plan }, variant: `form` };
    }

    if (entry.type === `user`) {
      return { key, props: { text: entry.text }, variant: `user` };
    }

    return {
      key,
      props: { active, color: entry.color ?? `text`, stream: entry.stream, typography: entry.typography ?? `caption` },
      variant: `stream`,
    };
  });
};

export type AgentFeedInterfaceInput = {
  commit: EntriesCommit;
  getArtifactSink: () => AgentFeedArtifactSink | undefined;
};

export const AgentFeedInterface = ({ commit, getArtifactSink }: AgentFeedInterfaceInput) => {
  let keySeq = 0;

  const nextKey = () => {
    const key = keySeq;
    keySeq += 1;

    return key;
  };

  const pushEntry = (key: number, entry: AgentFeedEntry) => {
    commit(previous => [...previous, { entry, key }]);
  };

  const addEntry = (entry: AgentFeedEntry): number => {
    const key = nextKey();
    pushEntry(key, entry);

    return key;
  };

  const removeEntry = (key: number) => {
    commit(previous => previous.filter(item => item.key !== key));
  };

  const replaceEntry = (key: number, entry: AgentFeedEntry) => {
    commit(previous => previous.map(item => (item.key === key ? { ...item, entry } : item)));
  };

  const appendStream = (
    stream: AsyncIterable<string>,
    { color, typography }: { color: Color; typography: Typography },
  ) => {
    const key = nextKey();
    pushEntry(key, { color, stream: streamClosedOnEnd(key, stream, commit), type: `stream`, typography });

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

  const generateText: AgentFeedHandle[`generateText`] = async ({ ai, model, prompt }) => {
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

  const ask: AgentFeedHandle[`ask`] = async plan => {
    const key = addEntry({ plan, type: `form` });

    return new Promise(resolve => {
      pendingFormAnswer = value => {
        removeEntry(key);
        resolve(value);
      };
    });
  };

  const answerForm = (value: StaticFormAnswersOf<StaticFormPlan>) => {
    pendingFormAnswer?.(value);
    pendingFormAnswer = undefined;
  };

  const generateImage: AgentFeedHandle[`generateImage`] = async ({ ai, model, prompt, size }) => {
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
      if (out.bytes.length === 0) {
        throw new Error(`Image bytes are empty`);
      }
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

  const handle: AgentFeedHandle = {
    appendArtifact: (artifact, options) =>
      addEntry({ ai: options?.ai, artifact, model: options?.model, type: `artifact` }),
    appendChatStream: stream => appendStream(stream, { color: `text`, typography: `caption` }),
    appendForm: plan => addEntry({ plan, type: `form` }),
    appendReasoningStream: stream => appendStream(stream, { color: `outline`, typography: `captionSm` }),
    appendStatus: (text, finished) => addEntry({ finished, text, type: `status` }),
    appendToolBadge: (text, finished) => addEntry({ finished, text, type: `tool-badge` }),
    appendUserText: text => addEntry({ text, type: `user` }),
    ask,
    clear: () => commit(() => []),
    generateImage,
    generateText,
    removeEntry,
    updateArtifact: updateArtifactEntry,
  };

  return { answerForm, handle, rows: rowsFromEntries };
};
