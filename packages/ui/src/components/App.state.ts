import { useStoreValue } from "@snappy/store";

import type { AppProps } from "./App";

import { useAnchorNavigation } from "../hooks/useAnchorNavigation";
import { $locale } from "../Store";

export const useAppState = ({ children, content = false, disableSelection = false, header, track }: AppProps) => {
  useAnchorNavigation();
  const locale = useStoreValue($locale);

  return { children, content, disableSelection, header, locale, track };
};
