import type { AppProps } from "./App";

import { $locale } from "./core";

export const useAppState = ({ children, disableTextSelection = false }: AppProps) => {
  void $locale.value;

  return { children, disableTextSelection };
};
