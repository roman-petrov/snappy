/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable unicorn/prefer-includes-over-repeated-comparisons */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Cover, Flip, Slide } from "@snappy/motion";
import type { RouterPageState, TransitionCommit, TransitionFn } from "@snappy/router";

import { _ } from "@snappy/core";
import { Viewport } from "@snappy/hooks";
import { flushSync } from "react-dom";

import type { RouteLayerOf } from "./RouteStack";

type Bound = {
  cover?: Cover;
  flip?: Flip;
  pageAt?: () => RouterPageState | undefined;
  setOutgoing?: (page: RouterPageState | undefined) => void;
  slide?: Slide;
  trackAt?: (pattern: string) => number | undefined;
};

let bound: Bound | undefined;

const bind = (patch: Partial<Bound>, anchor: keyof Bound) => {
  bound = { ...bound, ...patch };

  return () => {
    if (bound?.[anchor] !== patch[anchor]) {
      return;
    }

    const next = { ...bound };

    for (const key of _.keys(patch)) {
      next[key] = undefined;
    }

    bound = next;
  };
};

const bindCover = (cover: Cover) => bind({ cover }, `cover`);

const bindFlip = (
  flip: Flip,
  pageAt: () => RouterPageState | undefined,
  setOutgoing: (page: RouterPageState | undefined) => void,
) => bind({ flip, pageAt, setOutgoing }, `flip`);

const bindSlide = (slide: Slide, trackAt: (pattern: string) => number | undefined) => bind({ slide, trackAt }, `slide`);

const slideTab = (motion: Bound | undefined, from: string, to: string) => {
  const fromIndex = motion?.trackAt?.(from);
  const toIndex = motion?.trackAt?.(to);
  const slide = motion?.slide;

  return slide === undefined || fromIndex === undefined || toIndex === undefined ? undefined : { slide, toIndex };
};

const desktopTransition = async ({
  commit,
  from,
  fromLayer,
  motion,
  to,
  toLayer,
}: {
  commit: TransitionCommit;
  from: string;
  fromLayer: ReturnType<RouteLayerOf>;
  motion: Bound | undefined;
  to: string;
  toLayer: ReturnType<RouteLayerOf>;
}) => {
  const fadeCommit = async (history: `push` | `replace` = `push`) => {
    const update = () => {
      flushSync(() => {
        commit(history);
      });
    };

    if (typeof document !== `undefined` && `startViewTransition` in document) {
      await document.startViewTransition(update).finished;
    } else {
      update();
    }
  };

  if (fromLayer === undefined && toLayer === undefined && from !== to) {
    slideTab(motion, from, to)?.slide.consumeGestureLed();

    await fadeCommit(`replace`);

    return;
  }

  await fadeCommit(`push`);
};

const transition =
  (layerOf: RouteLayerOf): TransitionFn =>
  async ({ back, commit, from, to }) => {
    const fromLayer = layerOf(from);
    const toLayer = layerOf(to);
    const motion = bound;
    const push = () => commit(`push`);

    if (!Viewport.mobile()) {
      await desktopTransition({ commit, from, fromLayer, motion, to, toLayer });

      return;
    }

    if (fromLayer === undefined && toLayer === undefined && from !== to) {
      const tab = slideTab(motion, from, to);

      if (tab !== undefined) {
        if (!tab.slide.consumeGestureLed()) {
          await tab.slide.select(tab.toIndex);
        }

        commit(`silent`);

        return;
      }

      commit(`replace`);

      return;
    }
    if (motion === undefined) {
      push();

      return;
    }

    const { cover, flip: flipMotion, pageAt, setOutgoing } = motion;

    if (cover?.consumeGestureLed() === true) {
      push();

      return;
    }

    const flipCover =
      (fromLayer === `flip` && toLayer === `cover`) || (back && fromLayer === `cover` && toLayer === `flip`);

    if ([fromLayer, toLayer].includes(`flip`) && !flipCover) {
      if (flipMotion === undefined || pageAt === undefined || setOutgoing === undefined) {
        push();

        return;
      }

      flushSync(() => {
        setOutgoing(pageAt());
        push();
      });
      await flipMotion.run({ forward: true });
      flushSync(() => {
        setOutgoing(undefined);
      });

      return;
    }

    if (cover === undefined) {
      push();

      return;
    }

    if (back && fromLayer === `cover`) {
      await cover.leave();
      push();
      cover.release();

      return;
    }

    flushSync(() => {
      cover.prepareEnter();
      push();
    });
    await cover.enter();
  };

export const RouteMotion = { bindCover, bindFlip, bindSlide, transition };
