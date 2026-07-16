import { useChromeAccentHost } from "@snappy/app-router";
import { useContext } from "react";

import type { PageProps } from "./Page";

import { AppHeaderContext } from "./AppHeaderContext";

export const usePageState = ({
  back = false,
  center = false,
  children,
  fill = false,
  header: customHeader,
  tab = false,
  title,
  trailing: trailingProp,
}: PageProps) => {
  const contextTrailing = useContext(AppHeaderContext);
  const headerRef = useChromeAccentHost(tab);
  const showLogo = title === undefined && !back;
  const trailing = trailingProp ?? contextTrailing;

  return { back, center, children, customHeader, fill, headerRef, showLogo, tab, title, trailing };
};
