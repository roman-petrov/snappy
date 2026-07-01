/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable vitest/prefer-spy-on */
import { _, type Gesture } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import type { DomRef, TrackReleaseSnap } from "./Types";

import { SlideTrack, type SlideTrackSnapInput } from "./SlideTrack";

vi.mock(import(`@snappy/platform`), () => ({ Vibrate: { trigger: vi.fn() } }));

type Harness = {
  dispatch: (type: TouchPhase, input: TouchInput) => void;
  field: HTMLInputElement;
  motion: ReturnType<typeof SlideTrack>;
  records: SnapRecord[];
  root: HTMLDivElement;
  settle: () => Promise<void>;
};

type SnapRecord = { release?: TrackReleaseSnap; state: { busy: boolean; offset: number; width: number } };

type TouchInput = {
  id?: number;
  on?: `field` | `root`;
  pointerType?: `mouse` | `touch`;
  time?: number;
  x: number;
  y?: number;
};

type TouchPhase = `touchcancel` | `touchend` | `touchmove` | `touchstart`;

const pageWidth = 300;
const pageCount = 3;

const resizeObserver = function resizeObserver(callback: ResizeObserverCallback) {
  resizeObserver.callback = callback;
  resizeObserver.instance = { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() };

  return resizeObserver.instance;
};
resizeObserver.callback = (() => undefined) as ResizeObserverCallback;
resizeObserver.instance = { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() };

const flushMicrotasks = async (rounds = 12) => {
  for (let index = 0; index < rounds; index += 1) {
    await Promise.resolve();
  }
};

const gesture = (record: SnapRecord | undefined) => record?.release?.gesture;

const harness = (index = 0): Harness => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.stubGlobal(`ResizeObserver`, vi.fn(resizeObserver));

  let clock = 0;
  let currentIndex = index;
  let dragIndex = 0;
  let dragBaseline = 0;
  let dragOffset = 0;
  const records: SnapRecord[] = [];
  const pending: (() => void)[] = [];
  const translateForIndex = (page: number, width = pageWidth, offset = 0) => -page * width + offset;
  const root = document.createElement(`div`);
  const track = document.createElement(`div`);
  const field = document.createElement(`input`);

  document.body.append(root);
  root.append(track);
  track.append(field);

  Object.defineProperty(root, `clientWidth`, { configurable: true, value: pageWidth });
  root.setPointerCapture = vi.fn();
  root.releasePointerCapture = vi.fn();
  root.hasPointerCapture = vi.fn(() => true);

  track.animate = vi.fn(() => ({
    cancel: vi.fn(),
    commitStyles: vi.fn(),
    effect: { getComputedTiming: () => ({ progress: 1 }) },
    finished: new Promise<void>(resolve => {
      pending.push(resolve);
    }),
    playState: `running`,
  })) as unknown as typeof track.animate;

  const snap = ({ release, state }: SlideTrackSnapInput) => {
    records.push({ release, state: { ...state } });

    const none: TrackReleaseSnap = { gesture: { type: `none` }, stay: true };
    const sample = release ?? none;

    const delta = sample.stay
      ? 0
      : sample.gesture.type === `swipe`
        ? sample.gesture.direction === `right`
          ? -1
          : 1
        : -Math.sign(dragOffset);

    const target = _.clamp(dragIndex + delta, 0, pageCount - 1);

    return {
      after: ({ reset, setTranslate }: { reset: () => void; setTranslate: (value: number) => void }) => {
        reset();
        currentIndex = target;
        setTranslate(translateForIndex(target));
      },
      before: () => {
        currentIndex = target;
      },
      target: () => translateForIndex(target),
    };
  };

  const rootRef: DomRef = { current: root };
  const trackRef: DomRef = { current: track };

  const motion = SlideTrack({
    anchor: width => translateForIndex(currentIndex, width),
    canDrag: (dx, { offset, width }) => {
      const page = width ? Math.round(_.clamp(-offset / width, 0, pageCount - 1)) : currentIndex;

      return !(dx > 0 && page === 0) && !(dx < 0 && page >= pageCount - 1);
    },
    move: () => undefined,
    root: rootRef,
    snap,
    start: ({ offset, width }) => {
      dragIndex = width ? Math.round(_.clamp(-offset / width, 0, pageCount - 1)) : currentIndex;
      dragBaseline = offset - translateForIndex(dragIndex, width);
    },
    track: trackRef,
    translate: (dx, { width }) => {
      const offset = _.clamp(dragBaseline + dx, dragIndex < pageCount - 1 ? -width : 0, dragIndex > 0 ? width : 0);
      dragOffset = offset;

      return translateForIndex(dragIndex, width, offset);
    },
  });

  motion.layout();
  motion.resize();
  motion.pointer();

  const touches = new Map<number, { target: EventTarget; x: number; y: number }>();

  const touchList = (items: Touch[]) => {
    const list = items as unknown as TouchList;

    Object.defineProperty(list, `item`, { value: (position: number) => items[position] ?? undefined });

    return list;
  };

  const touchPoint = (id: number, target: EventTarget, x: number, y: number): Touch => ({
    clientX: x,
    clientY: y,
    force: 1,
    identifier: id,
    pageX: x,
    pageY: y,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    screenX: x,
    screenY: y,
    target,
  });

  const activeTouches = () =>
    [...touches.entries()].map(([id, point]) => touchPoint(id, point.target, point.x, point.y));

  const dispatch = (type: TouchPhase, input: TouchInput) => {
    const { id = 1, on, pointerType = `touch`, time = 16, x, y = 0 } = input;
    clock += time;

    if (pointerType === `mouse`) {
      const phase =
        type === `touchstart`
          ? `pointerdown`
          : type === `touchend`
            ? `pointerup`
            : type === `touchmove`
              ? `pointermove`
              : `pointercancel`;

      const event = new PointerEvent(phase, {
        bubbles: true,
        button: 0,
        clientX: x,
        clientY: y,
        pointerId: id,
        pointerType: `mouse`,
      });
      Object.defineProperty(event, `timeStamp`, { configurable: true, value: clock });
      root.dispatchEvent(event);

      return;
    }

    const target = on === `field` ? field : type === `touchstart` ? root : document;
    const point = touches.get(id);
    const source = point?.target ?? target;

    if (type === `touchstart`) {
      touches.set(id, { target: source, x, y });
    } else if (type === `touchmove` && point !== undefined) {
      touches.set(id, { ...point, x, y });
    }

    const changed = touchPoint(id, source, x, y);

    if (type === `touchend` || type === `touchcancel`) {
      touches.delete(id);
    }

    const event = new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      changedTouches: touchList([changed]),
      targetTouches: touchList(activeTouches()),
      touches: touchList(activeTouches()),
    } as unknown as TouchEventInit);
    Object.defineProperty(event, `timeStamp`, { configurable: true, value: clock });
    target.dispatchEvent(event);
  };

  const settle = async () => {
    while (pending.length > 0) {
      const finish = pending.shift();
      finish?.();
      await flushMicrotasks();
    }

    await flushMicrotasks();
  };

  return { dispatch, field, motion, records, root, settle };
};

const swipe = (session: Harness, from: number, to: number, steps = 1, id = 1, on: TouchInput[`on`] = `root`) => {
  session.dispatch(`touchstart`, { id, on, x: from });
  const delta = (to - from) / steps;

  for (let step = 1; step <= steps; step += 1) {
    session.dispatch(`touchmove`, { id, x: from + delta * step });
  }
};

const expectPageAnchor = (offset: number) => {
  expect(offset % pageWidth || 0).toBe(0);
};

const expectGesture = (record: SnapRecord | undefined, expected: Gesture) => {
  expect(gesture(record)).toStrictEqual(expected);
};

describe(`pointer`, () => {
  describe(`drag release`, () => {
    it(`detects a left swipe and advances to the next page`, async () => {
      const session = harness();
      swipe(session, 200, 80, 4);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 60 });

      expect(session.motion.dragging()).toBe(false);
      expect(session.records).toHaveLength(1);

      expectGesture(session.records[0], { direction: `left`, type: `swipe` });

      expect(session.records[0]?.release?.stay).toBe(false);

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
      expect(session.motion.busy()).toBe(false);
      expect(session.motion.consumeGestureLed()).toBe(true);
    });

    it(`detects a right swipe and moves to the previous page`, async () => {
      const session = harness(1);
      session.motion.setTranslate(-pageWidth);
      session.motion.layout();

      swipe(session, 80, 200, 4);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 220 });

      expectGesture(session.records[0], { direction: `right`, type: `swipe` });

      expect(session.records[0]?.release?.stay).toBe(false);

      await session.settle();

      expect(session.motion.offset()).toBe(0);
    });

    it(`stays on the page after a slow short drag`, async () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, time: 0, x: 200 });
      session.dispatch(`touchmove`, { id: 1, time: 80, x: 170 });
      session.dispatch(`touchmove`, { id: 1, time: 80, x: 150 });
      session.dispatch(`touchend`, { id: 1, time: 200, x: 150 });

      expect(session.records).toHaveLength(1);
      expect(session.records[0]?.release?.stay).toBe(true);

      expectGesture(session.records[0], { type: `none` });

      await session.settle();

      expect(session.motion.offset()).toBe(0);
    });

    it(`flips page from drag offset without a swipe gesture`, async () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, time: 0, x: 200 });
      session.dispatch(`touchmove`, { id: 1, time: 200, x: 140 });
      session.dispatch(`touchmove`, { id: 1, time: 200, x: 80 });
      session.dispatch(`touchend`, { id: 1, time: 100, x: 80 });

      expect(session.records).toHaveLength(1);
      expect(session.records[0]?.release?.stay).toBe(false);

      expectGesture(session.records[0], { type: `none` });

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
    });

    it(`ignores mostly vertical movement`, () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, x: 100, y: 100 });
      session.dispatch(`touchmove`, { id: 1, x: 102, y: 160 });
      session.dispatch(`touchend`, { id: 1, x: 102, y: 180 });

      expect(session.records).toHaveLength(0);
      expect(session.motion.offset()).toBe(0);
      expect(session.motion.consumeGestureLed()).toBe(false);
    });

    it(`snaps back to the anchored page after touchcancel during drag`, async () => {
      const session = harness();
      swipe(session, 200, 120, 2);
      session.dispatch(`touchcancel`, { id: 1, x: 120 });

      expect(session.records).toHaveLength(1);
      expect(session.records[0]?.release).toBeUndefined();

      await session.settle();

      expect(session.motion.offset()).toBe(0);
      expect(session.motion.busy()).toBe(false);
    });
  });

  describe(`multi-touch`, () => {
    it(`ignores a second finger during drag without snapping`, async () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, x: 200 });
      session.dispatch(`touchmove`, { id: 1, x: 150 });
      const offsetBeforeSecondFinger = session.motion.offset();

      session.dispatch(`touchstart`, { id: 2, x: 50 });

      expect(session.records).toHaveLength(0);
      expect(session.motion.dragging()).toBe(true);

      session.dispatch(`touchmove`, { id: 1, x: 110 });

      expect(session.motion.offset()).not.toBe(offsetBeforeSecondFinger);

      session.dispatch(`touchend`, { id: 2, x: 50 });

      expect(session.records).toHaveLength(0);
      expect(session.motion.dragging()).toBe(true);

      session.dispatch(`touchend`, { id: 1, time: 40, x: 100 });

      expect(session.records).toHaveLength(1);

      expectGesture(session.records[0], { direction: `left`, type: `swipe` });

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
      expect(session.motion.busy()).toBe(false);
    });

    it(`ignores a second finger while press is armed`, () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, x: 200 });
      session.dispatch(`touchstart`, { id: 2, x: 80 });
      session.dispatch(`touchmove`, { id: 1, x: 150 });

      expect(session.motion.dragging()).toBe(true);
      expect(session.records).toHaveLength(0);
    });

    it(`snaps when both fingers lift after the primary finger started the drag`, async () => {
      const session = harness();
      swipe(session, 200, 120, 2, 1);
      session.dispatch(`touchstart`, { id: 2, x: 40 });
      session.dispatch(`touchend`, { id: 2, x: 40 });
      session.dispatch(`touchend`, { id: 1, time: 40, x: 100 });

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
      expect(session.motion.busy()).toBe(false);
    });

    it(`does not snap when only the secondary finger lifts during drag`, async () => {
      const session = harness();
      swipe(session, 200, 80, 4, 1);
      session.dispatch(`touchstart`, { id: 2, x: 60 });
      session.dispatch(`touchend`, { id: 2, x: 60 });

      expect(session.records).toHaveLength(0);
      expect(session.motion.dragging()).toBe(true);
      expect(session.motion.offset()).toBeLessThan(0);

      session.dispatch(`touchend`, { id: 1, time: 40, x: 60 });
      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
    });

    it(`does not freeze mid-track after multi-touch release`, async () => {
      const session = harness();
      swipe(session, 200, 90, 3, 1);
      session.dispatch(`touchstart`, { id: 2, x: 40 });
      session.dispatch(`touchend`, { id: 1, time: 40, x: 80 });
      session.dispatch(`touchend`, { id: 2, x: 40 });

      await session.settle();

      expectPageAnchor(session.motion.offset());

      expect(session.motion.busy()).toBe(false);
    });
  });

  describe(`input filter`, () => {
    it(`ignores mouse pointers`, () => {
      const session = harness();
      session.dispatch(`touchstart`, { pointerType: `mouse`, x: 200 });

      expect(session.motion.dragging()).toBe(false);
      expect(session.records).toHaveLength(0);
    });

    it(`blocks dragging past the first page to the right`, () => {
      const session = harness();
      swipe(session, 100, 220, 4);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 240 });

      expect(session.motion.offset()).toBe(0);
      expect(session.records).toHaveLength(0);
    });

    it(`advances when horizontal drag starts on an input field`, async () => {
      const session = harness();
      swipe(session, 200, 80, 4, 1, `field`);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 60 });

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
      expect(session.motion.busy()).toBe(false);
      expect(session.records).toHaveLength(1);

      expectGesture(session.records[0], { direction: `left`, type: `swipe` });
    });
  });

  describe(`settle interrupt`, () => {
    it(`snaps after a quick re-press during settling instead of freezing mid-track`, async () => {
      const session = harness();
      swipe(session, 200, 120, 2);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 120 });

      expect(session.records).toHaveLength(1);
      expect(session.motion.busy()).toBe(true);

      session.dispatch(`touchstart`, { id: 1, time: 20, x: 120 });

      expect(session.records.length).toBeGreaterThanOrEqual(2);

      session.dispatch(`touchend`, { id: 1, time: 20, x: 120 });
      await session.settle();

      expectPageAnchor(session.motion.offset());

      expect(session.motion.busy()).toBe(false);
    });

    it(`re-snaps from the interrupted settle position on same-finger re-press`, async () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, time: 0, x: 200 });
      session.dispatch(`touchmove`, { id: 1, time: 100, x: 140 });
      session.dispatch(`touchend`, { id: 1, time: 100, x: 140 });

      expect(session.motion.busy()).toBe(true);

      const midSettleOffset = session.motion.offset();

      expect(midSettleOffset).toBeLessThan(0);
      expect(midSettleOffset).toBeGreaterThan(-pageWidth);

      session.dispatch(`touchstart`, { id: 1, time: 20, x: 140 });
      await session.settle();

      expectPageAnchor(session.motion.offset());

      expect(session.motion.busy()).toBe(false);
    });

    it(`ignores a second finger during settling`, async () => {
      const session = harness();
      swipe(session, 200, 120, 2);
      session.dispatch(`touchend`, { id: 1, time: 40, x: 120 });

      expect(session.motion.busy()).toBe(true);

      const recordsBefore = session.records.length;
      session.dispatch(`touchstart`, { id: 2, x: 40 });

      expect(session.records).toHaveLength(recordsBefore);

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
      expect(session.motion.busy()).toBe(false);
    });
  });

  describe(`tap flick`, () => {
    it(`navigates from a short quick horizontal release without crossing drag threshold`, async () => {
      const session = harness();
      session.dispatch(`touchstart`, { id: 1, time: 0, x: 200 });
      session.dispatch(`touchend`, { id: 1, time: 40, x: 170 });

      expect(session.records).toHaveLength(1);

      expectGesture(session.records[0], { direction: `left`, type: `swipe` });

      await session.settle();

      expect(session.motion.offset()).toBe(-pageWidth);
    });
  });
});

describe(`layout`, () => {
  it(`keeps the current offset while dragging`, () => {
    const session = harness(1);
    session.motion.setTranslate(-pageWidth);
    session.motion.layout();

    expect(session.motion.offset()).toBe(-pageWidth);

    session.dispatch(`touchstart`, { id: 1, x: 100 });
    session.dispatch(`touchmove`, { id: 1, x: 60 });
    session.motion.layout();

    expect(session.motion.offset()).toBeLessThan(-pageWidth);
  });
});

describe(`resize`, () => {
  it(`re-anchors translate when root width changes`, () => {
    const session = harness(1);

    expect(session.motion.offset()).toBe(-pageWidth);

    Object.defineProperty(session.root, `clientWidth`, { configurable: true, value: 600 });
    resizeObserver.callback([], resizeObserver.instance);

    expect(session.motion.offset()).toBe(-600);
  });
});

describe(`consumeGestureLed`, () => {
  it(`returns false before a gesture-driven navigation`, () => {
    const session = harness();

    expect(session.motion.consumeGestureLed()).toBe(false);
  });
});
