import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { $locale } from "./core";

export const useAppState = ({ children, disableTextSelection = false }: AppProps) => {
  useStoreValue($locale);

  return { children, disableTextSelection };
};
