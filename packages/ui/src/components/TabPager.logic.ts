import { _ } from "@snappy/core";

type VelocitySample = { sample: number; time: number; value: number };

const axisThreshold = 4;
const snapRatio = 0.15;
const velocityThreshold = 0.06;
const progressEpsilon = 0.001;
const panelTintRatio = 25;
const indicatorTintRatio = 40;
const settleDuration = _.timeBuild({ milliseconds: 260 });
const span = (count: number) => Math.max(0, count - 1);

const fromTranslate = (translateX: number, width: number, count: number) => {
  const steps = span(count);

  return width && steps ? -translateX / (width * steps) : 0;
};

const toTranslate = (progress: number, width: number, count: number) => -progress * span(count) * width;

const fromIndex = (index: number, count: number) => {
  const steps = span(count);

  return steps ? index / steps : 0;
};

const fromDrag = (index: number, offset: number, width: number, count: number) =>
  toTranslate(fromIndex(index, count), width, count) + offset;

const fromDragProgress = (index: number, offset: number, width: number, count: number) =>
  fromTranslate(fromDrag(index, offset, width, count), width, count);

const toIndex = (progress: number, count: number) => progress * span(count);

const axisLock = (dx: number, dy: number) => {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  return absX < axisThreshold && absY < axisThreshold
    ? (`pending` as const)
    : absX > absY
      ? (`horizontal` as const)
      : (`vertical` as const);
};

const clampOffset = (offset: number, width: number, index: number, count: number) =>
  _.clamp(offset, index < count - 1 ? -width : 0, index > 0 ? width : 0);

const snapTarget = (index: number, offset: number, width: number, count: number, velocity = 0) => {
  const threshold = width * snapRatio;
  const fling = Math.abs(velocity) > velocityThreshold;
  const previous = (offset > threshold || (fling && velocity > 0)) && index > 0;
  const next = (offset < -threshold || (fling && velocity < 0)) && index < count - 1;

  return index + (previous ? -1 : next ? 1 : 0);
};

const routeIndex = (items: { id: string }[], activeId?: string, lastId?: string) => {
  const id = [activeId, lastId].find(candidate => candidate !== undefined && items.some(item => item.id === candidate));

  return id === undefined ? 0 : items.findIndex(item => item.id === id);
};

const mix = (accent: string, ratio: number, base: string, space: `oklch` | `srgb`) =>
  `color-mix(in ${space}, ${accent} ${ratio}%, ${base})`;

const slotOpacity = (barIndex: number, slot: number) => Math.max(0, 1 - Math.abs(barIndex - slot));

const tints = (accents: readonly string[], barIndex: number, ratio: number) =>
  accents.map((accent, slot) => ({
    backgroundColor: mix(accent, ratio, `transparent`, `oklch`),
    opacity: slotOpacity(barIndex, slot),
  }));

const metaColor = (accents: readonly string[], backdrop: string, barIndex: number) => {
  const panel = (accent: string) => mix(accent, panelTintRatio, backdrop, `srgb`);

  const active = accents.flatMap((accent, slot) => {
    const opacity = slotOpacity(barIndex, slot);

    return opacity > 0 ? [{ accent, opacity }] : [];
  });

  const [first, second] = active;

  return first === undefined
    ? backdrop
    : second === undefined
      ? panel(first.accent)
      : `color-mix(in srgb, ${panel(first.accent)} ${_.percent(first.opacity, first.opacity + second.opacity)}%, ${panel(second.accent)})`;
};

const chrome = (
  accents: readonly string[],
  backdrop: string,
  barOffset: number | undefined,
  index: number,
  count: number,
) => {
  const barIndex = toIndex(barOffset ?? fromIndex(index, count), count);

  return {
    barIndex,
    chromeColor: metaColor(accents, backdrop, barIndex),
    indicatorTints: tints(accents, barIndex, indicatorTintRatio),
    panelTints: tints(accents, barIndex, panelTintRatio),
  };
};

const velocity = (previous: VelocitySample, clientX: number, timestamp: number): VelocitySample => {
  const dt = timestamp - previous.time;

  return dt > 0
    ? { sample: clientX, time: timestamp, value: (clientX - previous.sample) / dt }
    : { ...previous, sample: clientX, time: timestamp };
};

const settleRatio = (now: number, startTime: number) => Math.min(1, (now - startTime) / settleDuration);
const shouldSettle = (start: number, end: number) => Math.abs(end - start) >= progressEpsilon;

export const TabPagerLogic = {
  axisLock,
  chrome,
  clampOffset,
  fromDrag,
  fromDragProgress,
  fromIndex,
  fromTranslate,
  routeIndex,
  settleRatio,
  shouldSettle,
  snapTarget,
  toIndex,
  toTranslate,
  velocity,
};
