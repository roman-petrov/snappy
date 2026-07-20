/* eslint-disable functional/immutable-data */
/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-magic-numbers */

/**
 * ? Reference: Telegram ViewPagerFixed
 * https://github.com/DrKLO/Telegram/blob/master/TMessagesProj/src/main/java/org/telegram/ui/Components/ViewPagerFixed.java
 */
import { Dom } from "@snappy/browser";
import { _, Gesture, type GesturePointer, Vector } from "@snappy/core";

import type { Motion, MotionTarget } from "./Motion";
import type { DomRef, TrackReleaseSnap } from "./Types";

export type SlideTrack = ReturnType<typeof SlideTrack>;

export type SlideTrackConfig = {
  anchor: (width: number) => number;
  blocked?: () => boolean;
  canDrag?: (dx: number, state: SlideTrackState) => boolean;
  drag?: boolean;
  motion: Motion;
  move?: (translate: number, width: number) => void;
  onInterrupt?: (translate: number, width: number) => void;
  root: DomRef;
  settle?: (input: SlideTrackSettleInput) => readonly MotionTarget[];
  snap: (input: SlideTrackSnapInput) => SlideTrackSnap;
  start?: (state: SlideTrackState) => void;
  stayRatio?: number;
  sync?: () => void;
  track: DomRef;
  translate: (dx: number, state: SlideTrackState) => number;
  visible?: (state: SlideTrackState) => boolean;
};

export type SlideTrackControl = { reset: () => void; setTranslate: (translate: number) => void; width: number };

export type SlideTrackSettleInput = { end: number; start: number; width: number };

export type SlideTrackSnap = {
  after?: (control: SlideTrackControl) => void;
  before?: () => void;
  target: (width: number) => number;
};

export type SlideTrackSnapInput = { release?: TrackReleaseSnap; state: SlideTrackState };

export type SlideTrackState = { busy: boolean; offset: number; width: number };

type PressSample = Pick<PointerEvent, `clientX` | `clientY` | `timeStamp`>;

export const SlideTrack = ({
  anchor,
  blocked,
  canDrag,
  drag = true,
  motion,
  move,
  onInterrupt,
  root: rootRef,
  settle,
  snap,
  start,
  stayRatio = 1 / 3,
  sync,
  track: trackRef,
  translate,
  visible,
}: SlideTrackConfig) => {
  const slop = 12;
  const crossRatio = 3;
  const snapEpsilon = 0.001;
  const flipVelocity = 0.3;
  const velocityHorizon = 100;
  const minSettle = 150;
  const maxSettle = 600;

  const settleDuration = (remaining: number, width: number, velX: number) => {
    if (width === 0) {
      return minSettle;
    }

    const half = width / 2;
    const ratio = Math.min(1, remaining / width);
    const distance = half + half * Math.sin((ratio - 0.5) * 0.15 * Math.PI);
    const duration = velX > 0 ? 4 * Math.round(distance / velX) : Math.round((remaining / width + 1) * 100);

    return _.clamp(duration, minSettle, maxSettle);
  };

  const capture = { capture: true, passive: true } as const;
  const active = { capture: true, passive: false } as const;
  let gestureNavigation = false;
  let trackWidth = 0;
  let translateX = 0;
  let isSettling = false;
  let animateGeneration = 0;
  let transformActive: () => boolean;
  let commit: (snap: SlideTrackSnap, velX?: number) => void = () => undefined;
  let peak = Vector.from(0, 0);
  let started = 0;
  let pressOrigin = Vector.from(0, 0);
  let touchId: number | undefined;
  let pressArmed = false;
  let skipFlick = false;
  let isDragging = false;
  let settleArmed = false;
  let velocityTrack: readonly { t: number; x: number }[] = [];
  let moveDetach: (() => void) | undefined;
  let settleElements: readonly HTMLElement[] = [];

  const resetPress = () => {
    pressArmed = false;
    skipFlick = false;
    isDragging = false;
    settleArmed = false;
  };

  const reset = () => {
    resetPress();
    touchId = undefined;
  };

  const stopMoveListener = () => {
    moveDetach?.();
    moveDetach = undefined;
  };

  const inRoot = (event: Event) => {
    const root = rootRef.current;

    return root !== null && event.composedPath().includes(root);
  };

  const delta = (sample: PressSample) => Vector.delta(pressOrigin, sample.clientX, sample.clientY);

  const trackSample = (x: number, t: number) => {
    velocityTrack = [...velocityTrack.filter(item => t - item.t <= velocityHorizon), { t, x }];
  };

  // ? Telegram VelocityTracker: release speed measured over the last ~100ms window, not the whole gesture
  const sampleVelocity = (x: number, t: number) => {
    const first = velocityTrack.find(item => t - item.t <= velocityHorizon);

    return first !== undefined && t > first.t ? (x - first.x) / (t - first.t) : 0;
  };

  const release = (
    sample: PressSample,
    offset: ReturnType<typeof Vector.delta>,
    travel: ReturnType<typeof Vector.abs>,
  ) => {
    const elapsed = sample.timeStamp - started;
    const velY = elapsed > 0 ? offset.y / elapsed : 0;

    return Gesture.pointer(
      elapsed,
      offset,
      travel,
      Vector.from(sampleVelocity(sample.clientX, sample.timeStamp), velY),
    );
  };

  const pinTranslate = (element: HTMLElement, value: number, activePin = true) => {
    element.style.willChange = activePin ? `transform` : ``;
    motion.pin(element, activePin ? { transform: { translateX: value } } : { transform: {} });
  };

  const setTranslate = (value: number) => {
    translateX = value;
    const element = trackRef.current;

    if (element !== null) {
      if (isSettling) {
        motion.cancel([element]);
      }

      pinTranslate(element, value, transformActive());
    }

    move?.(value, trackWidth);
  };

  const refresh = () => {
    trackWidth = rootRef.current?.clientWidth ?? 0;
  };

  const dragging = () => isDragging;
  const offset = () => translateX;
  const width = () => trackWidth;
  const state = (): SlideTrackState => ({ busy: isDragging || isSettling, offset: offset(), width: width() });

  const buildReleaseSnap = (position: number, sample: GesturePointer): TrackReleaseSnap => {
    if (!trackWidth) {
      return { gesture: { type: `none` }, stay: true };
    }

    const gesture = Gesture.detect(sample);
    const releaseVelocity = Gesture.releaseVelocity(sample);
    const crossVelocity = sample.duration > 0 ? sample.delta.y / sample.duration : 0;
    const pageOffset = position - anchor(trackWidth);

    const stay =
      Math.abs(pageOffset) < trackWidth * stayRatio &&
      (Math.abs(releaseVelocity) < flipVelocity || Math.abs(releaseVelocity) < Math.abs(crossVelocity));

    return { gesture, stay };
  };

  const onMove = (sample: PressSample, claim?: () => void) => {
    const shift = delta(sample);
    const size = Vector.abs(shift);

    if (pressArmed) {
      trackSample(sample.clientX, sample.timeStamp);
      peak = Vector.max(peak, size);

      if (!isDragging) {
        if (Vector.vertical(size, slop, crossRatio) || Vector.vertical(peak, slop, crossRatio)) {
          stopMoveListener();
          reset();

          return;
        }

        if (Vector.horizontal(size, slop, crossRatio) && canDrag?.(shift.x, state()) !== false) {
          isDragging = true;
          refresh();
          start?.(state());
          claim?.();
          setTranslate(translate(shift.x, state()));
        }
      }
    }

    if (!isDragging) {
      return;
    }

    claim?.();
    setTranslate(translate(shift.x, state()));
  };

  const onEnd = (sample: PressSample, cancel = false) => {
    stopMoveListener();

    if (!isDragging && pressArmed) {
      const shift = delta(sample);
      const travel = Vector.max(peak, Vector.abs(shift));

      if (!skipFlick && Vector.horizontal(travel, slop, crossRatio) && canDrag?.(shift.x, state()) !== false) {
        refresh();
        start?.(state());
        gestureNavigation = true;
        const pointer = release(sample, shift, travel);
        commit(
          snap({ release: buildReleaseSnap(translateX, pointer), state: state() }),
          Math.abs(Gesture.releaseVelocity(pointer)),
        );
        resetPress();
        touchId = undefined;

        return;
      }

      if (settleArmed) {
        refresh();
        gestureNavigation = true;
        commit(snap({ state: state() }));
      }

      reset();

      return;
    }

    if (!isDragging) {
      reset();

      return;
    }

    const shift = delta(sample);
    const travel = Vector.max(peak, Vector.abs(shift));

    setTranslate(translate(shift.x, state()));
    gestureNavigation = true;
    const pointer = cancel ? undefined : release(sample, shift, travel);
    commit(
      snap(
        pointer === undefined ? { state: state() } : { release: buildReleaseSnap(translateX, pointer), state: state() },
      ),
      pointer === undefined ? 0 : Math.abs(Gesture.releaseVelocity(pointer)),
    );
    resetPress();
    touchId = undefined;
  };

  const animate = async (targetTranslate: number, velX = 0) => {
    if (trackWidth === 0) {
      refresh();
    }

    const startTranslate = translateX;
    const element = trackRef.current;
    const generation = ++animateGeneration;

    if (trackWidth === 0 || Math.abs(targetTranslate - startTranslate) < snapEpsilon || element === null) {
      setTranslate(targetTranslate);
      isSettling = false;

      return true;
    }

    isSettling = true;

    const onFrame = (value: number) => {
      translateX = value;
      move?.(value, trackWidth);
    };

    const duration = settleDuration(Math.abs(targetTranslate - startTranslate), trackWidth, velX);
    const layers = settle?.({ end: targetTranslate, start: startTranslate, width: trackWidth }) ?? [];
    settleElements = layers.map(layer => layer.element);

    await motion.run({
      duration,
      targets: [
        {
          after: target => {
            onFrame(targetTranslate);
            pinTranslate(target, targetTranslate);
          },
          before: target => {
            pinTranslate(target, startTranslate);
          },
          element,
          end: { transform: { translateX: targetTranslate } },
          start: { transform: { translateX: startTranslate } },
        },
        ...layers,
      ],
      tick: progress => onFrame(_.lerp(startTranslate, targetTranslate, progress)),
    });

    if (generation !== animateGeneration) {
      return false;
    }

    isSettling = false;
    setTranslate(targetTranslate);

    return true;
  };

  const interrupt = () => {
    animateGeneration += 1;
    const element = trackRef.current;

    motion.cancel(element === null ? settleElements : [element, ...settleElements]);

    if (element !== null) {
      pinTranslate(element, translateX);
    }

    onInterrupt?.(translateX, trackWidth);
    isSettling = false;
    refresh();
  };

  commit = (plan, velX = 0) => {
    isSettling = true;
    plan.before?.();

    void (async () => {
      if (await animate(plan.target(trackWidth), velX)) {
        plan.after?.({ reset, setTranslate, width: width() });
      }
    })();
  };

  const interruptSettle = () => {
    interrupt();
    settleArmed = true;
  };

  const onTouchMove = (event: TouchEvent) => {
    const id = touchId;
    const touch = id === undefined ? undefined : [...event.touches].find(item => item.identifier === id);

    if (touch === undefined) {
      return;
    }

    onMove(
      { clientX: touch.clientX, clientY: touch.clientY, timeStamp: event.timeStamp },
      isDragging ? () => event.preventDefault() : undefined,
    );
  };

  const onTouchEnd = (event: TouchEvent) => {
    const id = touchId;
    const touch = id === undefined ? undefined : [...event.changedTouches].find(item => item.identifier === id);

    if (touch === undefined) {
      return;
    }

    onEnd({ clientX: touch.clientX, clientY: touch.clientY, timeStamp: event.timeStamp }, event.type === `touchcancel`);
  };

  const onTouchStart = (event: TouchEvent) => {
    if (!inRoot(event) || event.touches.length > 1) {
      return;
    }

    if (blocked?.() === true) {
      return;
    }

    const root = rootRef.current;

    if (
      root !== null &&
      event.composedPath().some(node => {
        if (!(node instanceof Element) || !root.contains(node)) {
          return false;
        }

        const { overflowX } = getComputedStyle(node);

        return (overflowX === `auto` || overflowX === `scroll`) && node.scrollWidth > node.clientWidth;
      })
    ) {
      return;
    }

    const [touch] = event.changedTouches;

    if (touch === undefined) {
      return;
    }

    if ((isDragging || pressArmed) && touchId !== undefined && touch.identifier !== touchId) {
      return;
    }

    if (isSettling) {
      interruptSettle();
    } else {
      stopMoveListener();
      reset();
    }

    const { target, timeStamp } = event;

    peak = Vector.from(0, 0);
    pressArmed = true;
    skipFlick =
      target instanceof Element &&
      target.closest(`input,textarea,select,button,a,[contenteditable],[role="button"]`) !== null;
    pressOrigin = Vector.from(touch.clientX, touch.clientY);
    started = timeStamp;
    velocityTrack = [{ t: timeStamp, x: touch.clientX }];
    touchId = touch.identifier;

    moveDetach = Dom.subscribe(document, `touchmove`, onTouchMove, active);
  };

  transformActive = () => isDragging || isSettling || (visible === undefined ? translateX !== 0 : visible(state()));

  const busy = () => isDragging || isSettling;

  const layout = () => {
    if (blocked?.() === true || busy()) {
      return;
    }

    refresh();
    setTranslate(anchor(trackWidth));
    sync?.();
  };

  const resize = () => {
    const root = rootRef.current;

    return root === null ? _.noop : Dom.watchSize(root, layout);
  };

  const pointer = () => {
    const root = rootRef.current;

    if (root === null || !drag) {
      return _.noop;
    }

    const { touchAction } = root.style;

    root.style.touchAction = `pan-y pinch-zoom`;

    const unbind = _.singleAction([
      Dom.subscribe(document, `touchstart`, onTouchStart, capture),
      Dom.subscribe(document, `touchend`, onTouchEnd, capture),
      Dom.subscribe(document, `touchcancel`, onTouchEnd, capture),
      () => {
        stopMoveListener();
        root.style.touchAction = touchAction;
      },
      () => motion.cancel([]),
    ]);

    sync?.();

    return unbind;
  };

  const consumeGestureLed = () => {
    const value = gestureNavigation;
    gestureNavigation = false;

    return value;
  };

  return {
    animate,
    busy,
    consumeGestureLed,
    dragging,
    layout,
    offset,
    pointer,
    refresh,
    reset,
    resize,
    setTranslate,
    width,
  };
};
