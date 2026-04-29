import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { $locale } from "./Store";

export const useAppState = ({ children, disableLinkSelection = false, disableTextSelection = false }: AppProps) => {
  const locale = useStoreValue($locale);

  return { children, disableLinkSelection, disableTextSelection, locale };
};
