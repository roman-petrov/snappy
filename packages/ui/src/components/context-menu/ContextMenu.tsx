import type { ReactNode, RefObject } from "react";

import { useContextMenuState } from "./ContextMenu.state";

export type ContextMenuProps = {
  children: (close: () => void) => ReactNode;
  elementRef: RefObject<HTMLElement | null>;
};

export const ContextMenu = (props: ContextMenuProps) => {
  useContextMenuState(props);

  return null;
};
