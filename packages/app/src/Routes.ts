import { RouteCollection } from "@snappy/ui";

export const Routes = RouteCollection({
  agent: `agent/:agentId`,
  balance: { topUp: `balance/top-up` },
  feed: `feed`,
  forgotPassword: `forgot-password`,
  resetPassword: `reset-password`,
  settings: {
    aiTunnel: `settings/ai-tunnel`,
    language: `settings/language`,
    models: { chat: `settings/models/chat`, image: `settings/models/image`, speech: `settings/models/speech` },
    root: `settings`,
    theme: `settings/theme`,
    typeWriterSpeed: `settings/type-writer-speed`,
  },
  signIn: `login`,
  signUp: `register`,
  snappy: `snappy`,
} as const);
