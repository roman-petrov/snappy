import { Language } from "@snappy/ui";
import { useMemo } from "react";

import { Catalog } from "../catalog";

export const useSnappyState = () => {
  const locale = Language.locale();
  const groups = useMemo(() => Catalog.grouped(Catalog.cards(locale)), [locale]);

  return { groups };
};
