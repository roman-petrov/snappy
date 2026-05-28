/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import { _ } from "@snappy/core";

import type { Slot } from "./HtmlReveal";

export type GraphemeCountResult = { full: number; partial: number; totalPx: number };

export type WidthCache = { cumulative: Float32Array; totalPx: number };

const firstTextIn = (root: ParentNode) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const node = walker.nextNode();

  return node instanceof Text ? node : undefined;
};

const utf16Offset = (parts: readonly string[], graphemeCount: number) => {
  if (graphemeCount <= 0) {
    return 0;
  }

  let offset = 0;
  let left = graphemeCount;

  for (const part of parts) {
    if (left <= 0) {
      break;
    }
    offset += part.length;
    left -= 1;
  }

  return offset;
};

const rangeRectsWidthSum = (range: Range) => _.sum([...range.getClientRects()].map(rect => rect.width)) ?? 0;

const slotAtGrapheme = (slots: readonly Slot[], graphemeIndex: number) => {
  for (const slot of slots) {
    if (graphemeIndex < slot.end) {
      return { local: graphemeIndex - slot.start, slot };
    }
  }

  return undefined;
};

const measureGraphemeInSlot = (range: Range, slot: Slot, localIndex: number) => {
  const startOffset = utf16Offset(slot.graphemes, localIndex);
  const endOffset = utf16Offset(slot.graphemes, localIndex + 1);
  range.setStart(slot.node, startOffset);
  range.setEnd(slot.node, endOffset);

  return rangeRectsWidthSum(range);
};

const widths = (root: HTMLElement, slots: readonly Slot[], total: number): WidthCache => {
  if (total === 0) {
    return { cumulative: new Float32Array(0), totalPx: 0 };
  }

  const cumulative = new Float32Array(total);
  const range = document.createRange();
  if (firstTextIn(root) === undefined) {
    return { cumulative, totalPx: 0 };
  }

  _.gen(total, index => {
    const position = slotAtGrapheme(slots, index);
    const step = position === undefined ? 0 : measureGraphemeInSlot(range, position.slot, position.local);
    const previous = index > 0 ? cumulative[index - 1] : undefined;
    cumulative[index] = index > 0 ? (previous ?? 0) + step : step;
  });

  return { cumulative, totalPx: cumulative[total - 1] ?? 0 };
};

const countAtPx = (cache: WidthCache, px: number): GraphemeCountResult => {
  if (px <= 0 || cache.cumulative.length === 0) {
    return { full: 0, partial: 0, totalPx: 0 };
  }

  const { cumulative } = cache;
  let low = 0;
  let high = cumulative.length - 1;
  let floor = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = cumulative[mid];

    if (midValue !== undefined && midValue <= px) {
      floor = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const floorValue = floor >= 0 ? cumulative[floor] : undefined;
  const previousWidth = floorValue ?? 0;
  const partial = Math.max(0, px - previousWidth);
  const full = floor + 1;

  return { full, partial, totalPx: px };
};

const pxAt = (cache: WidthCache, graphemeCount: number) =>
  graphemeCount <= 0 ? 0 : (cache.cumulative[graphemeCount - 1] ?? cache.totalPx);

const buildWidthCache = (root: HTMLElement, slots: readonly Slot[]): WidthCache => {
  const total = slots.reduce((sum, slot) => sum + slot.graphemes.length, 0);

  return widths(root, slots, total);
};

export const TextMetrics = { buildWidthCache, countAtPx, pxAt };
