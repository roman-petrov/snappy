/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Transform, type TransformInput } from "@snappy/browser";
import { _, Ease } from "@snappy/core";
import { Vibrate } from "@snappy/platform";

export type Motion = ReturnType<typeof Motion>;

export type MotionPlayOptions = { clear?: boolean; durationMs: number };

export type MotionPlayShot = {
  element: HTMLElement;
  start: TransformInput;
  transformAtProgress: (progress: number) => TransformInput;
};

export type MotionRunInput = {
  after?: (element: HTMLElement) => void;
  before?: (element: HTMLElement) => void;
  confirm?: boolean;
  element: HTMLElement;
  keyframes: Keyframe[];
  options: Omit<KeyframeAnimationOptions, `easing`> & { duration: number };
  tick?: (progress: number) => void;
};

export const Motion = () => {
  const ease = Ease.outQuart;
  const easeSteps = 64;
  const easing = `linear(${_.gen(easeSteps + 1, step => ease(step / easeSteps).toFixed(4)).join(`, `)})`;
  let pending: (() => void) | undefined;
  let tickFrame: number | undefined;

  const pin = (element: HTMLElement, input: TransformInput) => {
    element.style.transform = Transform.css(input);
  };

  const stopTick = () => {
    if (tickFrame !== undefined) {
      cancelAnimationFrame(tickFrame);
      tickFrame = undefined;
    }
  };

  const finishPending = () => {
    const resolve = pending;
    pending = undefined;
    resolve?.();
  };

  const cancel = (elements: readonly HTMLElement[]) => {
    stopTick();
    finishPending();

    for (const element of elements) {
      for (const animation of element.getAnimations?.() ?? []) {
        animation.commitStyles();
        animation.cancel();
      }
    }
  };

  const run = async ({ after, before, confirm = true, element, keyframes, options, tick }: MotionRunInput) => {
    cancel([element]);
    before?.(element);

    const animation = element.animate(keyframes, { ...options, easing });
    element.style.transform = ``;

    const wait = new Promise<void>(resolve => {
      pending = resolve;
    });

    if (tick !== undefined) {
      const tickAnimation = () => {
        if (animation.playState !== `running`) {
          return;
        }

        const { progress } = animation.effect?.getComputedTiming() ?? {};
        tick(_.clamp(progress ?? 0, 0, 1));
        tickFrame = requestAnimationFrame(tickAnimation);
      };

      tickFrame = requestAnimationFrame(tickAnimation);
    }

    const finish = (success: boolean) => {
      stopTick();

      if (success) {
        after?.(element);
        animation.cancel();

        if (confirm) {
          Vibrate.trigger(`confirm`);
        }
      }

      finishPending();
    };

    void animation.finished.then(
      () => finish(true),
      () => finish(false),
    );

    await wait;
  };

  const play = async (shots: readonly MotionPlayShot[], { clear = false, durationMs }: MotionPlayOptions) => {
    if (shots.length === 0) {
      return;
    }

    await Promise.all(
      shots.map(async ({ element, start, transformAtProgress }) =>
        run({
          after: target => {
            if (clear) {
              target.style.transform = ``;
            } else {
              pin(target, transformAtProgress(1));
            }
          },
          before: target => pin(target, start),
          confirm: false,
          element,
          keyframes: [{ transform: Transform.css(start) }, { transform: Transform.css(transformAtProgress(1)) }],
          options: { duration: durationMs, fill: `forwards` },
        }),
      ),
    );

    Vibrate.trigger(`confirm`);
  };

  return { cancel, pin, play, run };
};
