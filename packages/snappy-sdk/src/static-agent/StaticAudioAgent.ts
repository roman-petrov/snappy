/* eslint-disable functional/no-expression-statements */
import type { StaticFormField } from "../Schema";

import { StaticAgentPrompt } from "../StaticAgentPrompt";
import {
  StaticAgent,
  type StaticAgentMetaCreateInput,
  type StaticAgentMetaPayload,
  type StaticAgentRunInput,
} from "./StaticAgent";

type Localization = Record<string, readonly [string, string]>;

export const StaticAudioAgent = <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
  resolve: (input: StaticAgentRunInput<TFields>) => File | undefined,
) =>
  StaticAgent(localizationFactory, create, async input => {
    const file = resolve(input);
    if (file === undefined || input.isStopped()) {
      return;
    }

    const { answers, feed, isStopped, locale, models, plan, prompt } = input;
    const transcribe = Promise.withResolvers<{ label: string }>();

    feed.appendStatus(locale === `ru` ? `Расшифровываю аудиофайл…` : `Transcribing audio file…`, transcribe);

    const out = await models.speech.transcribe({ file });
    transcribe.resolve({ label: `` });
    if (isStopped()) {
      return;
    }

    const transcript = out.text;
    await feed.appendChatText(transcript);
    if (isStopped()) {
      return;
    }

    const generationPrompt = `${StaticAgentPrompt({ answers, mainPrompt: prompt, plan })}\n\nTranscript:\n${transcript}`;
    await feed.generateText({ model: models.chat, prompt: generationPrompt });
  });
