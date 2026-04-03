import type { Meta } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useAudioChat = (chrome: AgentChromeProps, data: Meta) =>
  useAgentChat(chrome, {
    data,
    parameters: { maxSpeechFileMegaBytes: chrome.maxSpeechFileMegaBytes },
    submit: async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
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
      if (text === undefined) {
        return;
      }
      appendFeed({ text });
    },
  });
