/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/**
 * ? Reference: Telegram ViewPagerFixed
 * https://github.com/DrKLO/Telegram/blob/master/TMessagesProj/src/main/java/org/telegram/ui/Components/ViewPagerFixed.java
 */
import { Dom, Transform } from "@snappy/browser";
import { _, Gesture, type GesturePointer, Vector } from "@snappy/core";

import type { DomRef, TrackReleaseSnap } from "./Types";

import { Motion } from "./Motion";

export type SlideTrack = ReturnType<typeof SlideTrack>;

export type SlideTrackConfig = {
  anchor: (width: number) => number;
  blocked?: () => boolean;
  canDrag?: (dx: number, state: SlideTrackState) => boolean;
  drag?: boolean;
  move?: (translate: number, width: number) => void;
  root: DomRef;
  snap: (input: SlideTrackSnapInput) => SlideTrackSnap;
  start?: (state: SlideTrackState) => void;
  sync?: () => void;
  track: DomRef;
  translate: (dx: number, state: SlideTrackState) => number;
  visible?: (state: SlideTrackState) => boolean;
};

export type SlideTrackControl = { reset: () => void; setTranslate: (translate: number) => void; width: number };

export type SlideTrackSnap = {
  after?: (control: SlideTrackControl) => void;
  before?: () => void;
  target: (width: number) => number;
};

export type SlideTrackSnapInput = { release?: TrackReleaseSnap; state: SlideTrackState };

export type SlideTrackState = { busy: boolean; offset: number; width: number };

export const SlideTrack = ({
  anchor,
  blocked,
  canDrag,
  drag = true,
  move,
  root: rootRef,
  snap,
  start,
  sync,
  track: trackRef,
  translate,
  visible,
}: SlideTrackConfig) => {
  const slop = 12;
  const crossRatio = 3;
  const snapEpsilon = 0.001;
  const stayRatio = 1 / 3;
  const flipVelocity = 0.3;
  const motion = Motion();
  const downOptions = { passive: true } as const;
  const moveOptions = { passive: false } as const;
  let gestureNavigation = false;
  let trackWidth = 0;
  let translateX = 0;
  let isSettling = false;
  let animateGeneration = 0;
  let transformActive: () => boolean;
  let commit: (snap: SlideTrackSnap) => void = () => undefined;
  let peak = Vector.from(0, 0);
  let started = 0;
  let pressOrigin = Vector.from(0, 0);
  let pointerId: number | undefined;
  let pressArmed = false;
  let isDragging = false;
  let documentDetach: (() => void) | undefined;

  const reset = () => {
    pressArmed = false;
    isDragging = false;
    pointerId = undefined;
  };

  const stopDocumentListeners = () => {
    documentDetach?.();
    documentDetach = undefined;
  };

  const pointerDelta = (event: PointerEvent) => Vector.delta(pressOrigin, event.clientX, event.clientY);

  const releasePointer = (
    event: PointerEvent,
    delta: ReturnType<typeof Vector.delta>,
    travel: ReturnType<typeof Vector.abs>,
  ) => {
    const elapsed = event.timeStamp - started;
    const speed = elapsed > 0 ? Vector.from(delta.x / elapsed, delta.y / elapsed) : Vector.from(0, 0);

    return Gesture.pointer(elapsed, delta, travel, speed);
  };

  const pinTranslate = (element: HTMLElement, value: number, active = true) => {
    motion.pin(element, active ? { translateX: value } : {});
  };

  const setTranslate = (value: number) => {
    translateX = value;
    const element = trackRef.current;

    if (element !== null) {
      if (isSettling || (element.getAnimations?.().length ?? 0) > 0) {
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

  const onPointerEnd = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const root = rootRef.current;

    if (root?.hasPointerCapture(event.pointerId) === true) {
      root.releasePointerCapture(event.pointerId);
    }
    stopDocumentListeners();

    if (!isDragging && pressArmed) {
      const delta = pointerDelta(event);
      const travel = Vector.max(peak, Vector.abs(delta));

      if (Vector.horizontal(travel, slop, crossRatio) && canDrag?.(delta.x, state()) !== false) {
        refresh();
        start?.(state());
        gestureNavigation = true;
        commit(snap({ release: buildReleaseSnap(translateX, releasePointer(event, delta, travel)), state: state() }));
      }

      reset();

      return;
    }

    if (!isDragging) {
      reset();

      return;
    }

    const delta = pointerDelta(event);
    const travel = Vector.max(peak, Vector.abs(delta));

    setTranslate(translate(delta.x, state()));
    gestureNavigation = true;
    commit(
      snap(
        event.type === `pointercancel`
          ? { state: state() }
          : { release: buildReleaseSnap(translateX, releasePointer(event, delta, travel)), state: state() },
      ),
    );
    reset();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const root = rootRef.current;

    if (root === null) {
      return;
    }

    const delta = pointerDelta(event);
    const size = Vector.abs(delta);

    if (pressArmed) {
      peak = Vector.max(peak, size);

      if (!isDragging) {
        if (Vector.vertical(size, slop, crossRatio) || Vector.vertical(peak, slop, crossRatio)) {
          pressArmed = false;
        } else if (Vector.horizontal(size, slop, crossRatio) && canDrag?.(delta.x, state()) !== false) {
          isDragging = true;
          refresh();
          start?.(state());
          root.setPointerCapture(event.pointerId);
          event.preventDefault();
          setTranslate(translate(delta.x, state()));
        }
      }
    }

    if (!isDragging) {
      return;
    }

    event.preventDefault();
    setTranslate(translate(delta.x, state()));
  };

  const animate = async (targetTranslate: number) => {
    refresh();
    const startTranslate = translateX;
    const element = trackRef.current;
    const generation = ++animateGeneration;

    if (trackWidth === 0 || Math.abs(targetTranslate - startTranslate) < snapEpsilon || element === null) {
      setTranslate(targetTranslate);

      return true;
    }

    isSettling = true;

    const onFrame = (value: number) => {
      translateX = value;
      move?.(value, trackWidth);
    };

    if (startTranslate !== targetTranslate) {
      await motion.run({
        after: target => {
          onFrame(targetTranslate);
          pinTranslate(target, targetTranslate);
        },
        before: target => {
          pinTranslate(target, startTranslate);
        },
        element,
        keyframes: [
          { transform: Transform.css({ translateX: startTranslate }) },
          { transform: Transform.css({ translateX: targetTranslate }) },
        ],
        tick: progress => onFrame(_.lerp(startTranslate, targetTranslate, progress)),
      });
    }

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

    motion.cancel(element === null ? [] : [element]);

    if (element !== null) {
      pinTranslate(element, translateX);
    }

    isSettling = false;
    refresh();
  };

  commit = plan => {
    plan.before?.();

    void (async () => {
      if (await animate(plan.target(trackWidth))) {
        plan.after?.({ reset, setTranslate, width: width() });
      }
    })();
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

  const pointer = () => {
    const root = rootRef.current;

    if (root === null || !drag) {
      return _.noop;
    }

    const unbind = _.singleAction([
      Dom.watchSize(root, refresh),
      Dom.subscribe(
        root,
        `pointerdown`,
        (event: PointerEvent) => {
          if (event.button !== 0 || (event.pointerType !== `touch` && event.pointerType !== `pen`)) {
            return;
          }

          stopDocumentListeners();
          reset();

          if (isSettling) {
            interrupt();
          }

          peak = Vector.from(0, 0);
          pressArmed = true;
          const { clientX, clientY, pointerId: eventPointerId, timeStamp: timestamp } = event;
          pressOrigin = Vector.from(clientX, clientY);
          started = timestamp;
          pointerId = eventPointerId;

          documentDetach = _.singleAction([
            Dom.subscribe(document, `pointermove`, onPointerMove, moveOptions),
            Dom.subscribe(document, `pointerup`, onPointerEnd, downOptions),
            Dom.subscribe(document, `pointercancel`, onPointerEnd, downOptions),
          ]);
        },
        downOptions,
      ),
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
    interrupt,
    layout,
    offset,
    pointer,
    refresh,
    reset,
    setTranslate,
    width,
  };
};
