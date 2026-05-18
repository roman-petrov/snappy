import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type ContextMenuContent = ReactNode;

type ContextMenuPoint = { x: number; y: number };

type ContextMenuSource = { id: string; kind?: string };

type ContextMenuState = {
  content?: ContextMenuContent;
  open: boolean;
  point: ContextMenuPoint;
  source?: ContextMenuSource;
};

type ContextMenuToggleArgs = { content: ContextMenuContent; point: ContextMenuPoint; source: ContextMenuSource };

const initialState: ContextMenuState = { open: false, point: { x: 0, y: 0 } };

export type UseContextMenuHostStateArgs = { children: ReactNode };

export const useContextMenuHostState = ({ children }: UseContextMenuHostStateArgs) => {
  const [menu, setMenu] = useState<ContextMenuState>(initialState);
  const [point, setPoint] = useState(menu.point);
  const layerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setMenu(current => {
      if (!current.open) {
        return current;
      }

      return { ...current, content: undefined, open: false, source: undefined };
    });
  }, []);

  const toggle = useCallback((next: ContextMenuToggleArgs) => {
    setMenu(current => {
      if (current.open && current.source?.id === next.source.id && current.source.kind === next.source.kind) {
        return { ...current, content: undefined, open: false, source: undefined };
      }

      return { content: next.content, open: true, point: next.point, source: next.source };
    });
  }, []);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (layer === null) {
      return;
    }
    const rect = layer.getBoundingClientRect();
    const maxX = Math.max(window.innerWidth - rect.width, 0);
    const maxY = Math.max(window.innerHeight - rect.height, 0);
    setPoint({ x: clamp(menu.point.x, 0, maxX), y: clamp(menu.point.y, 0, maxY) });
  }, [menu.content, menu.open, menu.point.x, menu.point.y]);

  useEffect(() => {
    const layer = layerRef.current;
    if (layer === null) {
      return;
    }
    if (menu.open) {
      layer.showPopover();
    } else if (layer.matches(`:popover-open`)) {
      layer.hidePopover();
    }
  }, [menu.open]);

  useEffect(() => {
    const layer = layerRef.current;
    if (layer === null) {
      return _.noop;
    }
    const onToggle = () => {
      if (!layer.matches(`:popover-open`)) {
        close();
      }
    };

    return _.singleAction([Dom.subscribe(layer, `toggle`, onToggle)]);
  }, [close]);

  const { content } = menu;

  return { children, close, content, layerRef, open: menu.open, point, toggle };
};
