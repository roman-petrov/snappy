import { DataUrl } from "@snappy/browser";

import type { Meta, MetaParameters } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useVisualChat = (chrome: AgentChromeProps, data: Meta, parameters: MetaParameters) =>
  useAgentChat(chrome, {
    data,
    parameters,
    submit: async ({ answers, appendFeed, locale, mainPrompt, plan, tools }) => {
      const prompt = UserMessage.build({ answers, locale, mainPrompt, plan });
      const line = await tools.chat(prompt);
      if (line === undefined || line.trim() === ``) {
        return;
      }
      const bytes = await tools.image(line.trim(), { size: `1024x1024` });
      if (bytes === undefined) {
        return;
      }
      appendFeed({ imageSrc: DataUrl.png(bytes), text: `` });
    },
  });
