import { Agents } from "@snappy/snappy-presets";
import { Language } from "@snappy/ui";
import { useMemo } from "react";

export const useAgentsState = () => {
  const locale = Language.locale();
  const cards = useMemo(() => Agents.cards(locale), [locale]);
  const groups = useMemo(() => Agents.grouped(cards), [cards]);

  return { groups };
};
