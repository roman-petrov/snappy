import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { $locale } from "../Store";

export const useAppState = ({ children, content = false, disableSelection = false, header, track }: AppProps) => {
  const locale = useStoreValue($locale);

  return { children, content, disableSelection, header, locale, track };
};
