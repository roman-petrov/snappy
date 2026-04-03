/* eslint-disable react-refresh/only-export-components */
import type { ComponentType } from "react";

import type { AgentChatProps } from "../../common/components/AgentChat";
import type { Meta, MetaParameters } from "../../common/Meta";
import type { AgentChromeProps } from "../../Types";

import { AgentDefinition } from "../../core";
import { useAudioChat, useTextChat, useVisualChat } from "./hooks";
import { SimpleStaticAgentComponent } from "./SimpleStaticAgentComponent";

export const SimpleStaticAgent = <P extends MetaParameters>(
  data: Meta,
  parameters: P,
  useChat: (chrome: AgentChromeProps, meta: Meta, parameters: P) => AgentChatProps,
): ComponentType<AgentChromeProps> => {
  const Chrome = (chrome: AgentChromeProps) => (
    <SimpleStaticAgentComponent chrome={chrome} data={data} parameters={parameters} useChat={useChat} />
  );

  return Chrome;
};

export const SimpleStaticTextAgent = (data: Meta, parameters: MetaParameters = {}) =>
  AgentDefinition(data, parameters, SimpleStaticAgent(data, parameters, useTextChat));

export const SimpleStaticAudioAgent = (data: Meta, parameters: MetaParameters = {}) =>
  AgentDefinition(data, parameters, SimpleStaticAgent(data, parameters, useAudioChat));

export const SimpleStaticVisualAgent = <P extends MetaParameters>(data: Meta, parameters: P) =>
  AgentDefinition(data, parameters, SimpleStaticAgent(data, parameters, useVisualChat));
