/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { TransformInput } from "@snappy/browser";

import { _ } from "@snappy/core";

import type { DomRef } from "../Types";

import { Motion } from "../Motion";

export type Flip = ReturnType<typeof Flip>;

export type FlipConfig = { host: DomRef; onAnimating?: (animating: boolean) => void; outgoing?: DomRef; root: DomRef };

export type FlipRunInput = { back?: boolean; forward?: boolean };

export const Flip = ({ host, onAnimating, outgoing, root }: FlipConfig) => {
  const perspective = 75;
  const rotate = 180;
  const scaleFrom = 0.94;
  const motion = Motion();
  let active = false;

  const transformFlipIn = (progress: number): TransformInput => ({
    rotateY: _.lerp(-rotate, 0, progress),
    scale: _.lerp(scaleFrom, 1, progress),
  });

  const transformFlipOut = (rotateY: number, progress: number): TransformInput => ({
    rotateY: _.lerp(0, rotateY, progress),
    scale: _.lerp(1, scaleFrom, progress),
  });

  const setAnimating = (value: boolean) => {
    active = value;
    onAnimating?.(value);
  };

  const layout = (animating = false) => {
    const rootElement = root.current ?? undefined;

    if (rootElement !== undefined) {
      rootElement.style.perspective = animating ? `${perspective}rem` : ``;
      rootElement.style.transformStyle = animating ? `preserve-3d` : ``;
    }

    for (const ref of [host, outgoing]) {
      const element = ref?.current ?? undefined;

      if (element !== undefined) {
        element.style.backfaceVisibility = animating ? `hidden` : ``;
        element.style.transformStyle = animating ? `preserve-3d` : ``;
      }
    }
  };

  const run = async ({ back = false, forward = false }: FlipRunInput) => {
    layout(true);
    setAnimating(true);
    const incoming = host.current ?? undefined;
    const out = outgoing?.current ?? undefined;

    if (forward && out !== undefined && incoming !== undefined) {
      await motion.play(
        [
          {
            element: out,
            start: { rotateY: 0, scale: 1 },
            transformAtProgress: progress => transformFlipOut(rotate, progress),
          },
          { element: incoming, start: { rotateY: -rotate, scale: scaleFrom }, transformAtProgress: transformFlipIn },
        ],
        { clear: true },
      );
    } else if (back && out !== undefined) {
      await motion.play(
        [
          {
            element: out,
            start: { rotateY: 0, scale: 1 },
            transformAtProgress: progress => transformFlipOut(-rotate, progress),
          },
        ],
        { clear: true },
      );

      if (incoming !== undefined) {
        motion.pin(incoming, {});
      }
    }

    layout();
    setAnimating(false);
  };

  const animating = () => active;

  return { animating, layout, run };
};
