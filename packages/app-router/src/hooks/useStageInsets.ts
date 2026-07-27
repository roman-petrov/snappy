import { Keyboard } from "@snappy/browser";
import { ThemeVar, useIsMobile } from "@snappy/hooks";

export const useStageInsets = (shellHeight?: number, pageHeight?: number) => {
  const mobile = useIsMobile();
  const edge = ThemeVar.ref(mobile ? `space-sm` : `space-md`);
  const pageSafe = Keyboard.safe;
  const shellSafe = `env(safe-area-inset-bottom, 0px)`;
  const ime = Keyboard.height;
  const sum = (head: string, ...rest: string[]) => (rest.length === 0 ? head : `calc(${[head, ...rest].join(` + `)})`);

  const zone = (safe: string, height?: number, ...extra: string[]) => ({
    fadeMinHeight: height === undefined ? sum(safe, ...extra) : sum(edge, safe, ...extra),
    scrollPad: height === undefined ? sum(safe, edge, ...extra) : sum(safe, edge, `${height}px`, edge, ...extra),
  });

  const insets = {
    dockPad: sum(edge, pageSafe),
    page: zone(pageSafe, pageHeight, ime),
    shell: zone(shellSafe, shellHeight),
  };

  return { insets };
};
