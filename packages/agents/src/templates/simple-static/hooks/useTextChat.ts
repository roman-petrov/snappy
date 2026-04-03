import type { Meta } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useTextChat = (chrome: AgentChromeProps, data: Meta) =>
  useAgentChat(chrome, {
    data,
    submit: async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
      const prompt = UserMessage.build({ answers, locale, mainPrompt, plan });
      const text = await tools.chat(prompt);
      if (text === undefined) {
        return;
      }
      appendFeed({ text });
    },
  });
