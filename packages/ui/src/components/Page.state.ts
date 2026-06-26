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

  return { back, children, customHeader, fill, showLogo, tab, title, trailing: resolvedTrailing };
};
