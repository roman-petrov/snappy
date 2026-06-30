import {
  AgentFeedMessageBadge,
  AgentFeedMessageForm,
  AgentFeedMessageImage,
  AgentFeedMessageReasoning,
  AgentFeedMessageStream,
  AgentFeedMessageText,
  AgentFeedMessageUser,
} from "./messages";

export const AgentFeedRow = {
  badge: AgentFeedMessageBadge,
  form: AgentFeedMessageForm,
  image: AgentFeedMessageImage,
  reasoning: AgentFeedMessageReasoning,
  stream: AgentFeedMessageStream,
  text: AgentFeedMessageText,
  user: AgentFeedMessageUser,
} as const;
