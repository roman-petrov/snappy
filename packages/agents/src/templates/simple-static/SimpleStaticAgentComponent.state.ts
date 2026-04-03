import type { AgentChatProps } from "../../common/components/AgentChat";
import type { Meta, MetaParameters } from "../../common/Meta";
import type { AgentChromeProps } from "../../Types";

export type SimpleStaticAgentComponentInput<P extends MetaParameters> = {
  chrome: AgentChromeProps;
  data: Meta;
  parameters: P;
  useChat: (chrome: AgentChromeProps, data: Meta, parameters: P) => AgentChatProps;
};

export const useSimpleStaticAgentComponentState = <P extends MetaParameters>({
  chrome,
  data,
  parameters,
  useChat,
}: SimpleStaticAgentComponentInput<P>): AgentChatProps => useChat(chrome, data, parameters);
