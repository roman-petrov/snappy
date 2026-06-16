import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { useEffect, useId } from "react";

import type { ContextMenuProps } from "./ContextMenu";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { ContextMenuContext } from "./ContextMenuContext";

export const useContextMenuState = ({ children, elementRef }: ContextMenuProps) => {
  const { close, toggle } = useRequiredContext(ContextMenuContext, `ContextMenu`, `ContextMenuContext`);
  const sourceId = useId();
  const mobile = useIsMobile();

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) {
      return _.noop;
    }
    const openAt = (event: MouseEvent) =>
      toggle({ content: children(close), point: { x: event.clientX, y: event.clientY }, source: { id: sourceId } });

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

  return undefined;
};
