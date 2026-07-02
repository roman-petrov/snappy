/* eslint-disable functional/no-expression-statements */
import type { StaticFormField } from "@snappy/snappy";

import { StaticAgent, type StaticAgentMetaCreateInput, type StaticAgentMetaPayload } from "./StaticAgent";
import { StaticAgentChat } from "./StaticAgentChat";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

type Localization = Record<string, readonly [string, string]>;

export const StaticVisualAgent = <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
) =>
  StaticAgent(localizationFactory, create, async ({ answers, feed, isStopped, locale, models, plan, prompt }) => {
    const generationPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
    const session = models.chat.completions({ messages: StaticAgentChat.messages(locale, generationPrompt) });
    await feed.appendChatStream(session.chatText(isStopped));

    const imagePrompt = (await session.assistant()).content;
    if (isStopped()) {
      return;
    }
    await feed.generateImage({ model: models.image, prompt: imagePrompt });
  });
