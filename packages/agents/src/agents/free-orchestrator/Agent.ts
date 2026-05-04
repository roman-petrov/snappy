/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { Ai } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";

import type { AgentDefinition, AgentRegenerateInput } from "../../Types";

import { FreeOrchestratorComponent } from "./FreeOrchestratorComponent";

export const Agent = (locale: `en` | `ru`): Omit<AgentDefinition, `id`> => {
  const regenerate = async ({ aiConfig, artifact, locale: agentLocale }: AgentRegenerateInput) => {
    const ai = await Ai({ ...aiConfig.options, locale: agentLocale });
    if (artifact.type === `image`) {
      const result = await ai.images.generate({
        model: aiConfig.models.image,
        prompt: artifact.generationPrompt,
        quality: aiConfig.models.imageQuality,
        size: `1024x1024`,
      });

      return { src: DataUrl.png(result.bytes) };
    }
    const session = await ai.chat.completions.create({
      model: aiConfig.models.chat,
      prompt: artifact.generationPrompt,
    });

    let html = ``;
    for await (const part of session.stream) {
      if (part.type === `text`) {
        html += part.text;
      }
    }
    await session.cost();

    return { html };
  };

  return {
    component: FreeOrchestratorComponent,
    headless: { regenerate },
    meta: {
      description:
        locale === `ru`
          ? `Динамический агент с инструментами и пошаговой генерацией формы во время работы.`
          : `Dynamic tool-based agent with runtime form generation.`,
      emoji: `🧪`,
      group: `lab`,
      title: locale === `ru` ? `Свободный оркестратор` : `Free orchestrator`,
    },
  };
};
