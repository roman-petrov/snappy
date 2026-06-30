import { Language } from "@snappy/ui";
import { useMemo } from "react";

import { Catalog } from "../../catalog/registry";

export const useSnappyLandingState = () => {
  const locale = Language.locale();
  const groups = useMemo(() => Catalog.grouped(Catalog.cards(locale)), [locale]);

  return { groups };
};
