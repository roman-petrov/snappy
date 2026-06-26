import { Presets } from "@snappy/snappy";
import { Language } from "@snappy/ui";
import { useMemo } from "react";

export const useSnappyLandingState = () => {
  const locale = Language.locale();
  const groups = useMemo(() => Presets.grouped(Presets.cards(locale)), [locale]);

  return { groups };
};
