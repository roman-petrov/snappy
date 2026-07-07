import { useChromeAccentHost } from "@snappy/app-router";
import { useContext } from "react";

import type { PageProps } from "./Page";

import { AppHeaderContext } from "./AppHeaderContext";

export const usePageState = ({
  back = false,
  children,
  fill = false,
  header,
  tab = false,
  title,
  trailing,
}: PageProps) => {
  const contextTrailing = useContext(AppHeaderContext);
  const customHeader = header;
  const showLogo = title === undefined && !back;
  const resolvedTrailing = trailing ?? contextTrailing;
  const headerRef = useChromeAccentHost(tab);

  return { back, children, customHeader, fill, headerRef, showLogo, tab, title, trailing: resolvedTrailing };
};
