/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { AgentCard, AgentDefinition, AgentGroupId, AgentLocale } from "./Types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- this is an entry point
const modules = import.meta.glob<{ Agent: (locale: AgentLocale) => Omit<AgentDefinition, `id`> }>(
  `./agents/*/Agent.ts`,
  { eager: true },
);

const list = () =>
  Object.entries(modules)
    .map(([path, moduleObject]) => ({ entry: moduleObject.Agent, id: path.split(`/`).at(-2) ?? `` }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const groupOrder: AgentGroupId[] = [`text`, `audio`, `visual`, `lab`];
const cards = (locale: AgentLocale) => list().map(({ entry, id }) => ({ ...entry(locale).meta, id }));

const byId = (agentId: string, locale: AgentLocale) => {
  const resolvedId = agentId.trim() === `` ? list()[0]?.id : agentId.trim();
  if (resolvedId === undefined) {
    return undefined;
  }

  const agentModule = list().find(item => item.id === resolvedId)?.entry;
  if (agentModule === undefined) {
    return undefined;
  }

  return { ...agentModule(locale), id: resolvedId };
};

const byGroup = (items: readonly AgentCard[]) => {
  const grouped = Object.groupBy(items, card => card.group);

  return new Map(
    groupOrder.flatMap(groupId => {
      const groupAgents = grouped[groupId];

      return groupAgents === undefined || groupAgents.length === 0 ? [] : [[groupId, groupAgents]];
    }),
  );
};

export const Agents = { byGroup, byId, cards, groupOrder };
