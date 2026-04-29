import { Agent, type AgentCreateInput } from "@snappy/agent";

import { System } from "./System";

export type CoderConfig = Omit<AgentCreateInput, `maxRounds` | `systemPrompt`>;

export const Coder = (props: CoderConfig) => Agent({ ...props, maxRounds: 24, systemPrompt: System.prompt });
