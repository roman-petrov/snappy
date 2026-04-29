/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Locale } from "@snappy/intl";
import type { AgentCard, AgentDefinition, AgentEntry, AgentGroupId } from "@snappy/snappy-sdk";

// eslint-disable-next-line @typescript-eslint/naming-convention -- this is an entry point
const modules = import.meta.glob<{ Agent: AgentEntry }>(`./agents/*/Agent.ts`, { eager: true });

const list = (locale: Locale) =>
  Object.entries(modules)
    .map(([path, moduleObject]) => ({ entry: moduleObject.Agent(locale), id: path.split(`/`).at(-2) ?? `` }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const groupOrder: AgentGroupId[] = [`text`, `audio`, `visual`, `lab`];
const cards = (locale: Locale) => list(locale).map(({ entry, id }) => ({ ...entry.meta, id }));

const byId = (agentId: string, locale: Locale) => {
  const resolvedId = agentId.trim() === `` ? list(locale)[0]?.id : agentId.trim();
  if (resolvedId === undefined) {
    return undefined;
  }

  const agentModule = list(locale).find(item => item.id === resolvedId)?.entry;
  if (agentModule === undefined) {
    return undefined;
  }

  return { ...agentModule, id: resolvedId } satisfies AgentDefinition;
};

const grouped = (items: readonly AgentCard[]) => {
  const groupedItems = Object.groupBy(items, card => card.group);

  return groupOrder.flatMap(id => {
    const groupItems = groupedItems[id];

    return groupItems === undefined || groupItems.length === 0 ? [] : [{ id, items: groupItems }];
  });
};

export const Agents = { byId, cards, grouped };
