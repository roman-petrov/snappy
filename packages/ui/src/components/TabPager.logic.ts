import type { CSSProperties } from "react";

import { _ } from "@snappy/core";

const panelTintRatio = 25;
const indicatorTintRatio = 40;

const mix = (accent: string, ratio: number, base: string, space: `oklch` | `srgb`) =>
  `color-mix(in ${space}, ${accent} ${ratio}%, ${base})`;

const slotOpacity = (pageIndex: number, slot: number) => Math.max(0, 1 - Math.abs(pageIndex - slot));

const tints = (accents: readonly string[], pageIndex: number, ratio: number) =>
  accents.map((accent, slot) => ({
    backgroundColor: mix(accent, ratio, `transparent`, `oklch`),
    opacity: slotOpacity(pageIndex, slot),
  }));

const routeIndex = (items: { id: string }[], activeId?: string, lastId?: string) => {
  const id = [activeId, lastId].find(candidate => candidate !== undefined && items.some(item => item.id === candidate));

  return id === undefined ? 0 : items.findIndex(item => item.id === id);
};

const chromeFrame = (accents: readonly string[], backdrop: string, pageIndex: number) => {
  const panel = (accent: string) => mix(accent, panelTintRatio, backdrop, `srgb`);

  const active = accents.flatMap((accent, slot) => {
    const opacity = slotOpacity(pageIndex, slot);

    return opacity > 0 ? [{ accent, opacity }] : [];
  });

  const [first, second] = active;

  const chromeColor =
    first === undefined
      ? backdrop
      : second === undefined
        ? panel(first.accent)
        : mix(
            panel(first.accent),
            _.percent(first.opacity, first.opacity + second.opacity),
            panel(second.accent),
            `srgb`,
          );

  const indicatorTints = tints(accents, pageIndex, indicatorTintRatio) as CSSProperties[];
  const panelTints = tints(accents, pageIndex, panelTintRatio) as CSSProperties[];

  return { chromeColor, indicatorTints, panelTints };
};

export const TabPagerLogic = { chromeFrame, routeIndex };
