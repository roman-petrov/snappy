import { useRouterGo } from "@snappy/app-router";
import { useCallback } from "react";

import type { PageHeaderProps } from "./PageHeader";

export const usePageHeaderState = ({ back = false, ...props }: PageHeaderProps) => {
  const go = useRouterGo();
  const backAction = useCallback(async () => go(-1), [go]);

  return { ...props, back, backAction };
};
