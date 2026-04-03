import { DataUrl } from "@snappy/browser";

import type { Meta, MetaParameters, StaticFormAnswers } from "../../../common/Meta";
import type { AgentChromeProps } from "../../../Types";

import { UserMessage } from "../../../common/UserMessage";
import { useAgentChat } from "./useAgentChat";

export const useVisualChat = (chrome: AgentChromeProps, data: Meta, parameters: MetaParameters) => {
  const { surface, viewProps } = useAgentChat(chrome);
  const { appendFeed, loading, locale, runFlow, tools } = viewProps;
  const meta = data(parameters);
  const block = locale === `ru` ? meta.ru : meta.en;
  const plan = block.uiPlan;
  const mainPrompt = block.prompt;

  const onSubmit = (answers: StaticFormAnswers) => {
    void runFlow(async () => {
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
    });
  };

  const form = { disabled: loading, onSubmit, plan };

  return { form, surface };
};
