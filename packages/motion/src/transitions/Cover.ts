/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";

import type { DomRef, TrackReleaseSnap } from "../Types";

import { Motion, type MotionFrame, type MotionTarget } from "../Motion";
import {
  SlideTrack,
  type SlideTrackControl,
  type SlideTrackSettleInput,
  type SlideTrackSnapInput,
} from "../SlideTrack";

export type Cover = ReturnType<typeof Cover>;

export type CoverConfig = {
  drag?: boolean;
  onDismiss: () => void;
  onMove?: (x: number) => void;
  onPhase?: (phase: { closing: boolean; entering: boolean }) => void;
  root: DomRef;
  track: DomRef;
  underlay?: CoverUnderlay;
};

export type CoverUnderlay = { fade?: () => boolean; targets: () => readonly HTMLElement[] };

export const Cover = ({ drag, onDismiss, onMove, onPhase, root, track, underlay }: CoverConfig) => {
  const underlayShift = 0.12;
  const underlayScale = 0.08;
  const underlayFade = 0.5;
  const paint = Motion();
  let isClosing = false;
  let isEntering = false;
  let dismissing = false;
  let underlayElements: HTMLElement[] = [];
  const locked = () => isClosing || isEntering || dismissing;
  const notifyPhase = () => onPhase?.({ closing: isClosing, entering: isEntering });

  const underlayFrame = (x: number, width: number): MotionFrame => {
    if (width === 0) {
      return {};
    }

    const reveal = _.clamp(1 - x / width, 0, 1);
    const faded = underlay?.fade?.() === true;

    return {
      ...(faded ? { opacity: 1 - reveal * underlayFade } : {}),
      transform: { scale: 1 - reveal * underlayScale, translateX: -width * reveal * underlayShift },
    };
  };

  const underlayAt = (x: number, width: number, active = false) => {
    if (underlay === undefined || width === 0) {
      return;
    }

    const elements = underlay.targets();

    if (elements.length > 0) {
      underlayElements = [...elements];
    }

    const frame = underlayFrame(x, width);

    Dom.each(underlayElements, element => {
      element.style.willChange = active ? `opacity, transform` : ``;
      paint.pin(element, frame);
    });
  };

  const clearUnderlay = () => {
    if (underlayElements.length === 0) {
      return;
    }

    paint.cancel(underlayElements);

    Dom.each(underlayElements, element => {
      element.style.willChange = ``;
      paint.reset(element);
    });

    underlayElements = [];
  };

  const underlaySettle = ({ end, start, width }: SlideTrackSettleInput): readonly MotionTarget[] => {
    if (underlayElements.length === 0 || width === 0) {
      return [];
    }

    const endFrame = underlayFrame(end, width);
    const startFrame = underlayFrame(start, width);

    return underlayElements.map(element => ({
      after: target => paint.pin(target, endFrame),
      element,
      end: endFrame,
      start: startFrame,
    }));
  };

  const buildSnap = (release: TrackReleaseSnap) => {
    const outcome =
      (release.gesture.type === `swipe` && release.gesture.direction === `left`) || release.stay
        ? (`stay` as const)
        : (`dismiss` as const);

    return {
      after: ({ reset, setTranslate }: SlideTrackControl) => {
        reset();
        dismissing = false;

        if (outcome === `stay`) {
          setTranslate(0);
        } else {
          onDismiss();
        }
      },
      before: () => {
        if (outcome !== `dismiss` || dismissing) {
          return;
        }

        dismissing = true;
      },
      target: (width: number) => (outcome === `stay` ? 0 : width),
    };
  };

  const motion = SlideTrack({
    anchor: () => 0,
    blocked: locked,
    canDrag: (dx, { offset }) => !dismissing && (dx >= 0 || offset > 0),
    drag,
    motion: paint,
    move: (x, width) => {
      if (!motion.busy() || motion.dragging()) {
        underlayAt(x, width, motion.busy() || locked());
      }

      onMove?.(x);
    },
    onInterrupt: (x, width) => {
      underlayAt(x, width, true);
    },
    root,
    settle: underlaySettle,
    snap: ({ release }: SlideTrackSnapInput) => buildSnap(release ?? { gesture: { type: `none` }, stay: true }),
    track,
    translate: (dx, { width }) => _.clamp(dx, 0, width),
    visible: ({ busy, offset }) => busy || locked() || offset > 0,
  });

  const enter = async () => {
    dismissing = false;
    motion.refresh();
    isEntering = true;
    notifyPhase();

    if (motion.width() === 0) {
      isEntering = false;
      notifyPhase();

      return;
    }

    motion.setTranslate(motion.width());
    await motion.animate(0);
    isEntering = false;
    notifyPhase();
  };

  const prepareEnter = () => {
    isEntering = true;
    notifyPhase();
  };

  const leave = async () => {
    motion.refresh();
    isClosing = true;
    notifyPhase();

    if (motion.width() === 0) {
      isClosing = false;
      notifyPhase();

      return;
    }

    motion.setTranslate(0);
    await motion.animate(motion.width());
  };

  const reset = () => {
    dismissing = false;
    clearUnderlay();
  };

  const release = () => {
    if (!isClosing) {
      return;
    }

    isClosing = false;
    notifyPhase();
    reset();
  };

  const { consumeGestureLed, pointer, resize } = motion;

  return { consumeGestureLed, enter, leave, pointer, prepareEnter, release, reset, resize };
};
