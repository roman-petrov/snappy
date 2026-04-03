import { type ComponentType, createElement } from "react";

import type { Meta, MetaParameters } from "../common/Meta";
import type { AgentChromeProps, AgentLocale, AgentModule, AgentMountInput } from "../Types";

export const AgentDefinition = (
  data: Meta,
  parameters: MetaParameters,
  chromeView: ComponentType<AgentChromeProps>,
): AgentModule => {
  const meta = data(parameters);

  const localize = (locale: AgentLocale) => {
    const block = locale === `ru` ? meta.ru : meta.en;

    return { description: block.labels.description, emoji: block.emoji, title: block.labels.title };
  };

  const mount = (input: AgentMountInput) => {
    const block = input.locale === `ru` ? meta.ru : meta.en;

    const chrome: AgentChromeProps = {
      agentId: input.agentId,
      hostTools: input.hostTools,
      maxImagePromptLength: input.maxImagePromptLength,
      maxSpeechFileMegaBytes: input.maxSpeechFileMegaBytes,
    };

    const mountedView = () => createElement(chromeView, chrome);

    return { title: block.labels.title, View: mountedView };
  };

  return { group: meta.group, localize, mount };
};
