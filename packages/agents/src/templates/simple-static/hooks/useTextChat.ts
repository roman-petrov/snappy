import type { Meta, StaticFormAnswers } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useTextChat = (chrome: AgentChromeProps, data: Meta) => {
  const { surface, viewProps } = useAgentChat(chrome);
  const { appendFeed, loading, locale, runFlow, tools } = viewProps;
  const meta = data({});
  const block = locale === `ru` ? meta.ru : meta.en;
  const plan = block.uiPlan;
  const mainPrompt = block.prompt;

  const onSubmit = (answers: StaticFormAnswers) => {
    void runFlow(async () => {
      const prompt = UserMessage.build({ answers, locale, mainPrompt, plan });
      const text = await tools.chat(prompt);
      if (text !== undefined && text.trim() !== ``) {
        appendFeed({ text });
      }
    });
  };

  const form = { disabled: loading, onSubmit, plan };

  return { form, surface };
};
