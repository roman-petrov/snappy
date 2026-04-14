/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { DataUrl } from "@snappy/browser";
import { _ } from "@snappy/core";

import type { Meta, MetaParameters } from "../common/Meta";
import type { AgentModule, AgentStartInput, AgentTools } from "../Types";
import type { StaticFormAnswers } from "./Schema";

import { StaticForm } from "../common/components";
import { UserMessage, type UserMessageBuildInput } from "../common/UserMessage";

type SubmitHandler = (input: SubmitHandlerInput) => Promise<void>;

type SubmitHandlerInput = Omit<UserMessageBuildInput, `answers`> & {
  answers: StaticFormAnswers;
  appendFeed: (line: { generationPrompt: string; imageSrc?: string; text: string }) => void;
  tools: AgentTools;
};

const fromSubmit =
  (submit: SubmitHandler, defaults: MetaParameters = {}) =>
  (data: Meta, parameters: MetaParameters = {}): AgentModule =>
  locale => {
    const { prompt, uiPlan, ...meta } = data({ ...defaults, ...parameters }, locale);
    let stopped = false;

    const appendFeed = (
      feed: AgentStartInput[`feed`],
      line: { generationPrompt: string; imageSrc?: string; text: string },
    ) => {
      if (line.imageSrc === undefined) {
        feed.append({ generationPrompt: line.generationPrompt, html: line.text, type: `text` });

        return;
      }
      feed.append({ generationPrompt: line.generationPrompt, src: line.imageSrc, type: `image` });
    };

    const tools = ({ feed, hostTools, isStopped }: AgentStartInput): AgentTools => ({
      chat: async promptText => {
        if (stopped || isStopped()) {
          return ``;
        }
        const out = await hostTools.chat(promptText);
        if (isStopped()) {
          return ``;
        }

        return _.isString(out) ? out : out.content;
      },
      image: async (promptText, options) => {
        if (stopped || isStopped()) {
          return new Uint8Array();
        }
        const out = await hostTools.image(promptText, options);
        if (isStopped()) {
          return new Uint8Array();
        }

        return out;
      },
      speechRecognition: async file => {
        if (stopped || isStopped()) {
          return ``;
        }
        const out = await hostTools.speechRecognition(file);
        if (isStopped()) {
          return ``;
        }

        return out;
      },
      vectorize: async ({ imageBase64 }) => {
        /**
         * TODO: Implement using https://github.com/IguteChung/potrace-wasm
         */
        const id = feed.append({
          status: `running`,
          text: locale === `ru` ? `Трассировка SVG...` : `Tracing SVG...`,
          tool: `vectorize`,
          type: `tool`,
        });

        const result = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" data-in="${String((_.isString(imageBase64) ? imageBase64 : ``).length)}"><rect width="100%" height="100%" fill="#eee"/><text x="8" y="36" font-size="10">trace</text></svg>`;
        feed.patch(id, { status: `done` });

        return result;
      },
    });

    return {
      meta,
      start: input => {
        const run = async () => {
          const { feed, hostTools } = input;
          const answers = await hostTools.ask({ component: StaticForm, props: { plan: uiPlan } });
          if (stopped || input.isStopped()) {
            await input.onDone({ failed: false });

            return;
          }
          await submit({
            answers,
            appendFeed: line => appendFeed(feed, line),
            locale,
            mainPrompt: prompt,
            plan: uiPlan,
            tools: tools(input),
          });
          await input.onDone({ failed: false });
        };

        void run();

        return () => (stopped = true);
      },
    };
  };

export const StaticTextAgent = fromSubmit(async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
  const prompt = UserMessage.build({ answers, locale, mainPrompt, plan });
  const text = await tools.chat(prompt);

  appendFeed({ generationPrompt: prompt, text });
});

export const StaticAudioAgent = fromSubmit(
  async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
    const file = answers[`audio`];
    if (!(file instanceof File)) {
      return;
    }
    const transcript = await tools.speechRecognition(file);
    const preset = UserMessage.build({ answers, locale, mainPrompt, plan });
    const generationPrompt = `${preset}\n\nTranscript:\n${transcript.trim()}`;
    const text = await tools.chat(generationPrompt);

    appendFeed({ generationPrompt, text });
  },
  { maxSpeechFileMegaBytes: 0 },
);

export const StaticVisualAgent = fromSubmit(async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
  const prompt = UserMessage.build({ answers, locale, mainPrompt, plan });
  const imagePrompt = await tools.chat(prompt);
  const bytes = await tools.image(imagePrompt, { size: `1024x1024` });

  appendFeed({ generationPrompt: imagePrompt, imageSrc: DataUrl.png(bytes), text: `` });
});
