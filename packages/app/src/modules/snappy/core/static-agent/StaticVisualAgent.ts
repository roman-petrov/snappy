/* eslint-disable functional/no-expression-statements */
import type { Bilingual } from "@snappy/intl";
import type { StaticFormField } from "@snappy/snappy";

import type { StaticImageFormat } from "../Types";

import { AgentChat } from "..";
import { ImageFormat } from "../ImageFormat";
import { StaticAgent, type StaticAgentMetaCreateInput, type StaticAgentMetaPayload } from "./StaticAgent";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

type Localization = Record<string, Bilingual>;

export const StaticVisualAgent = <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
  format?: StaticImageFormat,
) =>
  StaticAgent(
    localizationFactory,
    create,
    async input => {
      const { answers, feed, isStopped, locale, models, plan, prompt } = input;
      const generationPrompt = StaticAgentPrompt({ answers, locale, mainPrompt: prompt, plan });
      const session = models.chat.completions({ messages: AgentChat.messages(locale, generationPrompt) });
      await feed.appendChatStream(session.chatText(isStopped));

      const imagePrompt = (await session.assistant()).content;
      if (isStopped()) {
        return;
      }
      await feed.generateImage({
        locale,
        model: models.image,
        prompt: imagePrompt,
        ...ImageFormat.request(answers, models.image, format),
      });
    },
    ImageFormat.extra(format),
  );
