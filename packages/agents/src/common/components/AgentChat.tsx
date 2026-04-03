import type { AgentFeedItem, AgentSessionStep } from "../../Types";
import type { StaticFormProps } from "./StaticForm";

import { useAgentChatState } from "./AgentChat.state";
import { AgentChatView } from "./AgentChat.view";

export type AgentChatProps = {
  form: Pick<StaticFormProps, `disabled` | `onSubmit` | `plan`>;
  surface: { error: string; feedItems: AgentFeedItem[]; sessionSteps: AgentSessionStep[] };
};

export const AgentChat = (props: AgentChatProps) => <AgentChatView {...useAgentChatState(props)} />;
