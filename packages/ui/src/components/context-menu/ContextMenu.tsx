import type { ReactNode, RefObject } from "react";

export type ContextMenuProps = {
  children: (close: () => void) => ReactNode;
  elementRef: RefObject<HTMLElement | null>;
};

export { useContextMenuState as ContextMenu } from "./ContextMenu.state";
