import {
  AgentFeedMessageBadge,
  AgentFeedMessageDetailStream,
  AgentFeedMessageForm,
  AgentFeedMessageImage,
  AgentFeedMessageStream,
  AgentFeedMessageText,
  AgentFeedMessageUser,
} from "./messages";

export const AgentFeedRow = {
  badge: AgentFeedMessageBadge,
  detail: AgentFeedMessageDetailStream,
  form: AgentFeedMessageForm,
  image: AgentFeedMessageImage,
  stream: AgentFeedMessageStream,
  text: AgentFeedMessageText,
  user: AgentFeedMessageUser,
} as const;
