import { Dom } from "@snappy/browser";
import { useContext, useEffect, useId } from "react";

import type { ContextMenuProps } from "./ContextMenu";

import { useIsMobile } from "../../hooks/useIsMobile";
import { ContextMenuContext } from "./ContextMenuContext";

export const useContextMenuState = ({ children, elementRef }: ContextMenuProps) => {
  const commands = useContext(ContextMenuContext);
  if (commands === undefined) {
    throw new Error(`ContextMenu must be used within ContextMenuHost`);
  }
  const { close, toggle } = commands;
  const sourceId = useId();
  const mobile = useIsMobile();

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) {
      return;
    }
    const openAt = (event: MouseEvent) => {
      toggle({ content: children(close), point: { x: event.clientX, y: event.clientY }, source: { id: sourceId } });
    };

    if (mobile) {
      const onClick = (event: MouseEvent) => {
        openAt(event);
      };

      return Dom.subscribe(element, `click`, onClick);
    }

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      openAt(event);
    };

    return Dom.subscribe(element, `contextmenu`, onContextMenu);
  }, [children, close, elementRef, mobile, sourceId, toggle]);

  return {};
};
