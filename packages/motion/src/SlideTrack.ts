/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/**
 * Reference: Telegram ViewPagerFixed
 * https://github.com/DrKLO/Telegram/blob/master/TMessagesProj/src/main/java/org/telegram/ui/Components/ViewPagerFixed.java
 */
import { Dom, Transform } from "@snappy/browser";
import { _, Gesture, type GesturePointer } from "@snappy/core";

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
  velocity?: number;
};

export type SlideTrackSnapInput = { release?: TrackReleaseSnap; state: SlideTrackState; velocity?: number };

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
  const flingVelocity = 3;
  const slop = 12;
  const distanceInfluence = (0.3 * Math.PI) / 2;
  const distanceInfluenceMid = 0.5;
  const durationFactor = 3.5;
  const durationFallbackMs = 85;
  const durationMax = 300;
  const durationMin = 150;
  const velocityScale = 1000;
  const easing = `cubic-bezier(0.2, 0, 0, 1)`;
  const manualDurationMs = 200;
  const manualEasing = `cubic-bezier(0.4, 0, 0.2, 1)`;
  const snapEpsilon = 0.001;
  const noneRelease: TrackReleaseSnap = { gesture: { type: `none` }, stay: true };
  const stayRatio = 1 / 3;
  const flipVelocity = 1;
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
  let peak = 0;
  let peakCross = 0;
  let started = 0;
  let pressOrigin = { x: 0, y: 0 };
  let pointerId: number | undefined;
  let velocityX = { sample: 0, time: 0, value: 0 };
  let velocityY = { sample: 0, time: 0, value: 0 };
  let peakVelocityX = 0;
  let pressArmed = false;
  let dragging = false;
  let documentDetach: (() => void) | undefined;

  const resetPointer = () => {
    pressArmed = false;
    dragging = false;
    peakVelocityX = 0;
    pointerId = undefined;
  };

  const stopDocumentListeners = () => {
    documentDetach?.();
    documentDetach = undefined;
  };

  const sampleVelocity = (event: PointerEvent) => {
    velocityX = Gesture.velocity(velocityX, event.clientX, event.timeStamp);
    velocityY = Gesture.velocity(velocityY, event.clientY, event.timeStamp);
    peakVelocityX = _.max([peakVelocityX, Math.abs(velocityX.value)]) ?? 0;
  };

  const releaseVelocityX = (dx: number, duration: number) => {
    const average = duration > 0 ? Math.abs(dx / duration) : 0;
    const magnitude = _.max([peakVelocityX, Math.abs(velocityX.value), average]) ?? 0;
    const sign = dx === 0 ? Math.sign(velocityX.value) : Math.sign(dx);

    return sign === 0 ? 0 : sign * magnitude;
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

  const stopSettle = () => {
    isSettling = false;
  };

  const state = (): SlideTrackState => ({ busy: dragging || isSettling, offset: translateX, width: trackWidth });

  const buildReleaseSnap = (offset: number, pointer: GesturePointer): TrackReleaseSnap => {
    if (!trackWidth) {
      return noneRelease;
    }

    const gesture = Gesture.detect(pointer);
    const releaseVelocity = Gesture.releaseVelocity(pointer);
    const crossVelocity = pointer.duration > 0 ? pointer.dy / pointer.duration : 0;
    const pageOffset = offset - anchor(trackWidth);

    const stay =
      Math.abs(pageOffset) < trackWidth * stayRatio &&
      (Math.abs(releaseVelocity) < flipVelocity || Math.abs(releaseVelocity) < Math.abs(crossVelocity));

    return { gesture, stay };
  };

  const startDrag = (event: PointerEvent, root: HTMLElement) => {
    dragging = true;
    refresh();
    start?.(state());
    root.setPointerCapture(event.pointerId);
    event.preventDefault();
    setTranslate(translate(event.clientX - pressOrigin.x, state()));
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
    sampleVelocity(event);

    if (!dragging && pressArmed) {
      const flingVelocityX = velocityX.value;
      const flingVelocityY = velocityY.value;

      if (Math.abs(flingVelocityX) >= flingVelocity && Math.abs(flingVelocityX) > Math.abs(flingVelocityY)) {
        const dx = flingVelocityX < 0 ? -slop - 1 : slop + 1;

        if (canDrag?.(dx, state()) !== false) {
          dragging = true;
          refresh();
          start?.(state());
          setTranslate(translate(dx, state()));
          const duration = event.timeStamp - started;
          const peakDistance = Math.max(peak, Math.abs(dx));
          const pointerData = { duration, dx, dy: 0, peak: peakDistance, peakCross: 0, velocity: flingVelocityX };

          gestureNavigation = true;
          commit(
            snap({ release: buildReleaseSnap(translateX, pointerData), state: state(), velocity: flingVelocityX }),
          );
          resetPointer();

          return;
        }
      }

      resetPointer();

      return;
    }

    if (!dragging) {
      resetPointer();

      return;
    }

    const dx = event.clientX - pressOrigin.x;
    const dy = event.clientY - pressOrigin.y;

    setTranslate(translate(dx, state()));

    const duration = event.timeStamp - started;
    const peakDistance = Math.max(peak, Math.abs(dx));
    const peakCrossDistance = Math.max(peakCross, Math.abs(dy));

    const data = {
      duration,
      dx,
      dy,
      peak: peakDistance,
      peakCross: peakCrossDistance,
      velocity: releaseVelocityX(dx, duration),
    };

    if (event.type === `pointercancel`) {
      gestureNavigation = true;
      commit(snap({ state: state() }));
    } else {
      gestureNavigation = true;
      commit(
        snap({ release: buildReleaseSnap(translateX, data), state: state(), velocity: Gesture.releaseVelocity(data) }),
      );
    }

    resetPointer();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const root = rootRef.current;

    if (root === null) {
      return;
    }

    sampleVelocity(event);

    const dx = event.clientX - pressOrigin.x;
    const dy = event.clientY - pressOrigin.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!dragging && pressArmed && absX >= slop && absX > absY && canDrag?.(dx, state()) !== false) {
      startDrag(event, root);
    }

    if (!dragging) {
      return;
    }

    event.preventDefault();
    peak = Math.max(peak, absX);
    peakCross = Math.max(peakCross, absY);
    setTranslate(translate(dx, state()));
  };

  const animate = async (targetTranslate: number, velocity?: number, manual = false) => {
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
      const distance = Math.abs(targetTranslate - startTranslate);
      const ratio = Math.min(1, distance / trackWidth);

      const influenced =
        trackWidth / 2 + (trackWidth / 2) * Math.sin((ratio - distanceInfluenceMid) * distanceInfluence);

      const velocityPxPerSecond = Math.abs(velocity ?? 0) * velocityScale;
      const settleWidth = trackWidth > 0 ? trackWidth : distance;

      const durationMs = manual
        ? manualDurationMs
        : velocity === undefined
          ? durationMax
          : velocityPxPerSecond > 0
            ? _.clamp(
                durationFactor * Math.round((velocityScale * influenced) / velocityPxPerSecond),
                durationMin,
                durationMax,
              )
            : _.clamp((distance / settleWidth + 1) * durationFallbackMs, durationMin, durationMax);

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
        options: { duration: durationMs, easing: manual ? manualEasing : easing, fill: `forwards` },
        tick: progress => onFrame(_.lerp(startTranslate, targetTranslate, progress)),
      });
    }

    if (generation !== animateGeneration) {
      return false;
    }

    stopSettle();
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

    stopSettle();
    refresh();
  };

  commit = plan => {
    plan.before?.();

    void (async () => {
      if (await animate(plan.target(trackWidth), plan.velocity)) {
        plan.after?.({ reset: resetPointer, setTranslate, width: trackWidth });
      }
    })();
  };
  transformActive = () => dragging || isSettling || (visible === undefined ? translateX !== 0 : visible(state()));

  const busy = () => dragging || isSettling;

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
          resetPointer();
          let interrupted = false;

          if (isSettling) {
            interrupt();
            interrupted = true;
          }

          peak = 0;
          peakCross = 0;
          pressArmed = true;
          const { clientX, clientY, pointerId: eventPointerId, timeStamp: timestamp } = event;
          pressOrigin = { x: clientX, y: clientY };
          started = timestamp;
          pointerId = eventPointerId;
          velocityX = { sample: clientX, time: timestamp, value: 0 };
          velocityY = { sample: clientY, time: timestamp, value: 0 };

          if (interrupted) {
            dragging = true;
            refresh();
            start?.(state());
            root.setPointerCapture(eventPointerId);
          }

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

  const draggingState = () => dragging;
  const offset = () => translateX;
  const width = () => trackWidth;

  return {
    animate,
    busy,
    consumeGestureLed,
    dragging: draggingState,
    interrupt,
    layout,
    offset,
    pointer,
    refresh,
    reset: resetPointer,
    setTranslate,
    width,
  };
};
