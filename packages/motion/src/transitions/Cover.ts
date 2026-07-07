/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

import type { DomRef, TrackReleaseSnap } from "../Types";

import { SlideTrack, type SlideTrackControl, type SlideTrackSnapInput } from "../SlideTrack";

export type Cover = ReturnType<typeof Cover>;

export type CoverConfig = {
  count: () => number;
  drag?: boolean;
  onClose: () => void;
  onIndex: (index: number) => void;
  onMove?: (x: number) => void;
  onPhase?: (phase: { closing: boolean; entering: boolean }) => void;
  root: DomRef;
  track: DomRef;
};

export const Cover = ({ count, drag, onClose, onIndex, onMove, onPhase, root, track }: CoverConfig) => {
  const noneRelease: TrackReleaseSnap = { gesture: { type: `none` }, stay: true };
  let isClosing = false;
  let isEntering = false;
  const notifyPhase = () => onPhase?.({ closing: isClosing, entering: isEntering });

  const resolveOutcome = (release: TrackReleaseSnap) => {
    const dismiss = count() === 1 ? (`close` as const) : (`back` as const);

    return (release.gesture.type === `swipe` && release.gesture.direction === `left`) || release.stay
      ? (`stay` as const)
      : dismiss;
  };

  const buildSnap = (release: TrackReleaseSnap) => {
    const outcome = resolveOutcome(release);

    return {
      after: ({ reset, setTranslate }: SlideTrackControl) => {
        reset();

        if (outcome === `stay`) {
          setTranslate(0);
        }

        if (outcome === `close`) {
          onClose();
        } else if (outcome === `back`) {
          onIndex(Math.max(0, count() - 2));
        }
      },
      target: (width: number) => (outcome === `stay` ? 0 : width),
    };
  };

  const snap = ({ release }: SlideTrackSnapInput) => buildSnap(release ?? noneRelease);
  const frame = { dragging: () => false };

  const motion = SlideTrack({
    anchor: () => 0,
    blocked: () => isClosing || isEntering,
    canDrag: (dx, { offset }) => dx >= 0 || offset > 0,
    drag,
    move: x => {
      if (!frame.dragging()) {
        onMove?.(0);

        return;
      }

      onMove?.(x);
    },
    root,
    snap,
    track,
    translate: (dx, { width }) => _.clamp(dx, 0, width),
    visible: ({ busy, offset }) => busy || isClosing || isEntering || offset > 0,
  });

  frame.dragging = motion.dragging;

  const enter = async () => {
    motion.refresh();
    isEntering = true;
    notifyPhase();

    if (motion.width() === 0) {
      isEntering = false;
      notifyPhase();
      motion.layout();

      return;
    }

    motion.setTranslate(motion.width());
    await motion.animate(0);
    isEntering = false;
    notifyPhase();
    motion.layout();
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
      return;
    }

    motion.setTranslate(0);
    await motion.animate(motion.width());
  };

  const release = () => {
    if (!isClosing) {
      return;
    }

    isClosing = false;
    notifyPhase();
  };

  const closing = () => isClosing;
  const entering = () => isEntering;
  const { consumeGestureLed } = motion;
  const { layout } = motion;
  const { pointer } = motion;
  const { resize } = motion;

  return { closing, consumeGestureLed, enter, entering, layout, leave, pointer, prepareEnter, release, resize };
};
