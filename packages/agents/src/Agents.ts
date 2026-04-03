/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { AgentCard, AgentGroupId, AgentLocale, AgentModule, AgentMountInput } from "./Types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- this is an entry point
const modules = import.meta.glob<{ Agent: AgentModule }>(`./agents/*/Agent.ts`, { eager: true });

const list = () =>
  Object.entries(modules)
    .map(([path, moduleObject]) => ({ entry: moduleObject.Agent, id: path.split(`/`).at(-2) ?? `` }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const groupOrder: AgentGroupId[] = [`text`, `audio`, `visual`];

const localized = (locale: AgentLocale) =>
  list().map(({ entry, id }) => ({ ...entry.localize(locale), group: entry.group, id }));

const mount = (agentId: string, input: Omit<AgentMountInput, `agentId`>) => {
  const resolvedId = agentId.trim() === `` ? list()[0]?.id : agentId.trim();
  if (resolvedId === undefined) {
    return undefined;
  }

  const agentModule = list().find(item => item.id === resolvedId)?.entry;
  if (agentModule === undefined) {
    return undefined;
  }

  return agentModule.mount({ agentId, ...input });
};

const byGroup = (items: readonly AgentCard[]) => {
  const grouped = items.reduce<Partial<Record<AgentGroupId, AgentCard[]>>>((accumulator, card) => {
    const bucket = accumulator[card.group] ?? [];

    return { ...accumulator, [card.group]: [...bucket, card] };
  }, {});

  return new Map(
    groupOrder.flatMap(groupId => {
      const groupAgents = grouped[groupId];

      return groupAgents === undefined || groupAgents.length === 0 ? [] : [[groupId, groupAgents]];
    }),
  );
};

export const Agents = { byGroup, groupOrder, localized, mount };
