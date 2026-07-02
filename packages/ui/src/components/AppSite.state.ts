import { useStoreValue } from "@snappy/store";

import type { AppSiteProps } from "./AppSite";

import { $locale } from "../Store";

export const useAppSiteState = ({ ...rest }: AppSiteProps) => {
  const locale = useStoreValue($locale);

  return { ...rest, locale };
};
