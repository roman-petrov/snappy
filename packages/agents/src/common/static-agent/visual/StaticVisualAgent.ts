import { Ai } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { createElement } from "react";

import type { AgentComponentProps, AgentDefinition, AgentRegenerateInput } from "../../../Types";
import type { StaticAgentMeta, StaticAgentMetaParameters } from "../StaticAgentMeta";

import { StaticVisualAgentComponent } from "./StaticVisualAgentComponent";

export const StaticVisualAgent =
  (data: StaticAgentMeta, parameters: StaticAgentMetaParameters = {}) =>
  (locale: AgentComponentProps[`locale`]): Omit<AgentDefinition, `id`> => {
    const { plan, prompt, ...meta } = data(parameters, locale);

    const regenerate = async ({ aiConfig, artifact, locale }: AgentRegenerateInput) => {
      const ai = await Ai({ ...aiConfig.options, locale });

      const result = await ai.images.generate({
        model: aiConfig.models.image,
        prompt: artifact.generationPrompt,
        quality: aiConfig.models.imageQuality,
        size: `1024x1024`,
      });

      return { src: DataUrl.png(result.bytes) };
    };

    return {
      component: props => createElement(StaticVisualAgentComponent, { ...props, agentId: meta.title, plan, prompt }),
      headless: { regenerate },
      meta,
    };
  };
