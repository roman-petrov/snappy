/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

import type { DomRef, TrackReleaseSnap } from "../Types";

import { SlideTrack, type SlideTrackControl, type SlideTrackSnapInput } from "../SlideTrack";

export type Slide = ReturnType<typeof Slide>;

export type SlideConfig = {
  count: () => number;
  drag?: boolean;
  index: number;
  onIndex: (index: number) => void;
  onPageIndex?: (pageIndex: number, animating: boolean) => void;
  root: DomRef;
  track: DomRef;
};

export const Slide = ({ count, drag, index, onIndex, onPageIndex, root, track }: SlideConfig) => {
  const noneRelease: TrackReleaseSnap = { gesture: { type: `none` }, stay: true };
  let touchEnabled = false;
  let dragBaseline = 0;
  let dragIndex = 0;
  let dragOffset = 0;
  let settled = index;
  const settleAt = (value: number) => onPageIndex?.(value, false);
  const span = (total: number) => Math.max(0, total - 1);

  const translateForIndex = (page: number, width: number, total: number, offset = 0) => {
    const steps = span(total);

    return steps ? -page * width + offset : offset;
  };

  const activeIndex = (offset: number, width: number) => {
    const total = count();

    if (!width || total <= 1) {
      return settled;
    }

    const steps = span(total);

    return steps ? Math.round(_.clamp(-offset / width, 0, steps)) : 0;
  };

  const buildSnap = (release: TrackReleaseSnap) => {
    const total = count();

    const delta = release.stay
      ? 0
      : release.gesture.type === `swipe`
        ? release.gesture.direction === `right`
          ? -1
          : 1
        : -Math.sign(dragOffset);

    const target = _.clamp(dragIndex + delta, 0, total - 1);

    return {
      after: ({ reset, setTranslate, width }: SlideTrackControl) => {
        reset();
        setTranslate(translateForIndex(target, width, total));
        settleAt(target);
      },
      before: () => {
        settled = target;
        onIndex(target);
      },
      target: (width: number) => translateForIndex(target, width, total),
    };
  };

  const snap = ({ release }: SlideTrackSnapInput) => buildSnap(release ?? noneRelease);

  const motion = SlideTrack({
    anchor: width => translateForIndex(settled, width, count()),
    canDrag: (dx, { offset, width }) => {
      const at = activeIndex(offset, width);
      const last = count() - 1;

      return !(dx > 0 && at === 0) && !(dx < 0 && at >= last);
    },
    drag,
    move: (translate, width) => {
      const steps = span(count());

      onPageIndex?.(width && steps ? -translate / width : 0, true);
    },
    root,
    snap,
    start: ({ offset, width }) => {
      dragIndex = activeIndex(offset, width);
      dragBaseline = offset - translateForIndex(dragIndex, width, count());
    },
    sync: () => settleAt(settled),
    track,
    translate: (dx, { width }) => {
      const total = count();
      const offset = _.clamp(dragBaseline + dx, dragIndex < total - 1 ? -width : 0, dragIndex > 0 ? width : 0);
      dragOffset = offset;

      return translateForIndex(dragIndex, width, total, offset);
    },
    visible: ({ busy, offset }) => touchEnabled || busy || offset !== 0,
  });

  const select = async (target: number) => {
    if (target < 0 || motion.busy() || target === settled) {
      return;
    }

    motion.refresh();
    dragIndex = settled;
    dragOffset = 0;

    const total = count();
    const targetTranslate = translateForIndex(target, motion.width(), total);

    settled = target;
    await motion.animate(targetTranslate);
    motion.reset();
    motion.setTranslate(targetTranslate);
    settleAt(target);
  };

  const frame = (next: boolean) => {
    touchEnabled = next;
  };

  const sync = (next: number) => {
    settled = next;
  };

  const { consumeGestureLed } = motion;
  const { layout } = motion;
  const { pointer } = motion;
  const { resize } = motion;

  return { consumeGestureLed, frame, layout, pointer, resize, select, sync };
};
