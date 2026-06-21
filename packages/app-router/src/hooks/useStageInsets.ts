import { Dom } from "@snappy/browser";
import { ThemeVar, useIsMobile } from "@snappy/hooks";
import { Bridge } from "@snappy/platform";
import { useEffect, useState } from "react";

export const useStageInsets = (shellHeight?: number, pageHeight?: number) => {
  const mobile = useIsMobile();
  const edge = ThemeVar.ref(mobile ? `space-sm` : `space-md`);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(
    () =>
      Bridge.available
        ? Dom.subscribe(window, Bridge.keyboardChangedEvent, event => setKeyboard(event.detail.open))
        : undefined,
    [],
  );
  const safe = keyboard ? `0px` : `env(safe-area-inset-bottom, 0px)`;
  const dockPad = `calc(${edge} + ${safe})`;

  const lane = (height?: number) => ({
    fadeMinHeight: height === undefined ? safe : dockPad,
    scrollPad: height === undefined ? `calc(${safe} + ${edge})` : `calc(${safe} + ${edge} + ${height}px + ${edge})`,
  });

  const page = lane(pageHeight);
  const shell = lane(shellHeight);
  const insets = { dockPad, page, shell };

  return { insets, keyboard };
};
