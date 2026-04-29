import { Agents } from "@snappy/snappy-presets";
import { Language } from "@snappy/ui";
import { useMemo } from "react";

export const useCatalogState = () => {
  const locale = Language.locale();
  const cards = useMemo(() => Agents.cards(locale), [locale]);
  const agents = Agents.grouped(cards);

  return { agents };
};
