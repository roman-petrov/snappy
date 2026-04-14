/* eslint-disable functional/no-expression-statements, functional/no-loop-statements, functional/no-try-statements, no-await-in-loop, no-continue */
import type { AiModel } from "@snappy/ai";

import { Console } from "@snappy/node";
import { createInterface } from "node:readline/promises";

import type { TFunction } from "./locales";

import { Theme } from "./Theme";

type CoderChatModelChoice = Extract<AiModel, { type: `chat` }>;

type CoderEmbedderModelChoice = Extract<AiModel, { type: `embedder` }>;

const promptChoice = async <TChoice extends AiModel>({
  choices,
  t,
  title,
}: {
  choices: { label: string; model: TChoice }[];
  t: TFunction;
  title: string;
}): Promise<TChoice> => {
  Console.logLine(Theme.title(title));
  for (const [index, c] of choices.entries()) {
    Console.logLine(`  ${Theme.command(`${String(index + 1)})`)} ${c.label}`);
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    for (;;) {
      const raw = (await rl.question(t(`modelPrompt.pickModelNumber`))).trim();
      const index = Number.parseInt(raw, 10);
      if (!Number.isFinite(index) || index < 1 || index > choices.length) {
        Console.logLine(Theme.warning(t(`modelPrompt.choiceOutOfRange`, { max: choices.length })));

        continue;
      }

      const picked = choices[index - 1];
      if (picked === undefined) {
        continue;
      }

      return picked.model;
    }
  } finally {
    rl.close();
  }
};

const prompt = async ({ models, t }: { models: AiModel[]; t: TFunction }) => {
  const chatChoices = models
    .filter((model): model is CoderChatModelChoice => model.type === `chat`)
    .map(model => ({ label: `${model.source} · ${model.name}`, model }));

  const embeddingChoices = models
    .filter((model): model is CoderEmbedderModelChoice => model.type === `embedder`)
    .map(model => ({ label: `${model.source} · ${model.name}`, model }));

  const chatModel = await promptChoice({ choices: chatChoices, t, title: t(`modelPrompt.chooseChat`) });
  const embeddingModel = await promptChoice({ choices: embeddingChoices, t, title: t(`modelPrompt.chooseEmbedding`) });

  return { chatModel, embeddingModel };
};

export const ModelPrompt = { prompt };
