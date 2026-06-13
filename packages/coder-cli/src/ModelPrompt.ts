/* eslint-disable functional/no-expression-statements, functional/no-loop-statements, functional/no-try-statements, no-await-in-loop, no-continue, unicorn/try-complexity */
import type { Ai, AiModelItem } from "@snappy/ai";

import { Console } from "@snappy/node";
import { createInterface } from "node:readline/promises";

import type { TFunction } from "./locales";

import { Theme } from "./Theme";

const promptChoice = async <TChoice extends AiModelItem>({
  choices,
  t,
  title,
}: {
  choices: { label: string; model: TChoice }[];
  t: TFunction;
  title: string;
}): Promise<TChoice> => {
  Console.logLine(Theme.title(title));
  for (const [index, choice] of choices.entries()) {
    Console.logLine(`  ${Theme.command(`${String(index + 1)})`)} ${choice.label}`);
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

const prompt = async ({ ai, models, t }: { ai: Ai; models: readonly AiModelItem[]; t: TFunction }) => {
  const chatChoices = models
    .filter(model => model.type === `chat`)
    .map(model => ({ label: `${model.source} · ${model.name}`, model }));

  const embeddingChoices = models
    .filter(model => model.type === `embedder`)
    .map(model => ({ label: `${model.source} · ${model.name}`, model }));

  const chatPick = await promptChoice({ choices: chatChoices, t, title: t(`modelPrompt.chooseChat`) });
  const embedPick = await promptChoice({ choices: embeddingChoices, t, title: t(`modelPrompt.chooseEmbedding`) });

  return { chat: ai.chat(chatPick.name), embedder: ai.embedder(embedPick.name) };
};

export const ModelPrompt = { prompt };
