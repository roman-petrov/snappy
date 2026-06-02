import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { $locale } from "./Store";

export const useAppState = ({ children, disableSelection = false, router }: AppProps) => {
  const locale = useStoreValue($locale);

  return { children, disableSelection, locale, router };
};
