export const AgentGroupId = [`text`, `visual`, `vision`, `edit`, `audio`, `plan`] as const;

export type AgentGroupId = (typeof AgentGroupId)[number];
