import type { ComponentType } from "react";

import type { AgentChatProps } from "../../common/components/AgentChat";
import type { Meta, MetaParameters } from "../../common/Meta";
import type { AgentChromeProps } from "../../Types";

import { SimpleStaticAgentComponent } from "./SimpleStaticAgentComponent";

export const SimpleStaticAgent = <P extends MetaParameters>(
  data: Meta,
  parameters: P,
  useChat: (chrome: AgentChromeProps, meta: Meta, parameters_: P) => AgentChatProps,
): ComponentType<AgentChromeProps> => {
  const Chrome = (chrome: AgentChromeProps) => (
    <SimpleStaticAgentComponent chrome={chrome} data={data} parameters={parameters} useChat={useChat} />
  );

  return Chrome;
};
