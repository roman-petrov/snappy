import type { Meta, StaticFormAnswers } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useAudioChat = (chrome: AgentChromeProps, data: Meta) => {
  const { surface, viewProps } = useAgentChat(chrome);
  const { appendFeed, loading, locale, maxSpeechFileMegaBytes, runFlow, tools } = viewProps;
  const meta = data({ maxSpeechFileMegaBytes });
  const block = locale === `ru` ? meta.ru : meta.en;
  const plan = block.uiPlan;
  const mainPrompt = block.prompt;

  const onSubmit = (answers: StaticFormAnswers) => {
    void runFlow(async () => {
      const file = answers[`audio`];
      if (!(file instanceof File)) {
        return;
      }
      const transcript = await tools.speechRecognition(file);
      if (transcript === undefined || transcript.trim() === ``) {
        return;
      }
      const preset = UserMessage.build({ answers, locale, mainPrompt, plan });
      const text = await tools.chat(`${preset}\n\nTranscript:\n${transcript.trim()}`);
      if (text !== undefined && text.trim() !== ``) {
        appendFeed({ text });
      }
    });
  };

  const form = { disabled: loading, onSubmit, plan };

  return { form, surface };
};
