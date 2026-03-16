import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { $locale } from "./Store";

export const useAppState = ({ children, disableTextSelection = false }: AppProps) => {
  const locale = useStoreValue($locale);

  return { children, disableTextSelection, locale };
};
