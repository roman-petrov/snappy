/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Transform, type TransformInput } from "@snappy/browser";
import { _ } from "@snappy/core";
import { Vibrate } from "@snappy/platform";

export type Motion = ReturnType<typeof Motion>;

export type MotionFrame = { opacity?: number; transform?: TransformInput };

export type MotionPlayOptions = { clear?: boolean };

export type MotionPlayShot = {
  element: HTMLElement;
  frameAtProgress: (progress: number) => MotionFrame;
  start: MotionFrame;
};

export type MotionRun = {
  confirm?: boolean;
  duration?: number;
  targets: readonly MotionTarget[];
  tick?: (progress: number) => void;
};

export type MotionTarget = {
  after?: (element: HTMLElement) => void;
  before?: (element: HTMLElement) => void;
  element: HTMLElement;
  end: MotionFrame;
  start: MotionFrame;
};

export const Motion = () => {
  // ? Telegram CubicBezierInterpolator.EASE_OUT_QUINT
  const easing = `cubic-bezier(0.23, 1, 0.32, 1)`;
  const baseDuration = 220;
  const fill = `forwards` as const;
  let pending: PromiseWithResolvers<void> | undefined;
  let tickFrame: number | undefined;

  const frameKeyframe = ({ opacity, transform }: MotionFrame): Keyframe => ({
    ...(opacity === undefined ? undefined : { opacity }),
    ...(transform === undefined ? undefined : { transform: Transform.css(transform) }),
  });

  const reset = (element: HTMLElement) => {
    element.style.transform = ``;
    element.style.opacity = ``;
  };

  const pin = (element: HTMLElement, frame: MotionFrame = {}) => {
    if (frame.transform !== undefined) {
      element.style.transform = Transform.css(frame.transform);
    }

    if (frame.opacity !== undefined) {
      element.style.opacity = `${frame.opacity}`;
    }
  };

  const stopTick = () => {
    if (tickFrame !== undefined) {
      cancelAnimationFrame(tickFrame);
      tickFrame = undefined;
    }
  };

  const finishPending = () => {
    pending?.resolve();
    pending = undefined;
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

  const run = async ({ confirm = true, duration, targets, tick }: MotionRun) => {
    cancel(targets.map(target => target.element));

    for (const { before, element, start } of targets) {
      before?.(element);
      pin(element, start);
    }

    const animations = targets.map(({ element, end, start }) =>
      element.animate([frameKeyframe(start), frameKeyframe(end)], { duration: duration ?? baseDuration, easing, fill }),
    );

    pending = Promise.withResolvers();
    const [lead] = animations;

    if (tick !== undefined && lead !== undefined) {
      tick(0);

      const tickAnimation = () => {
        if (lead.playState !== `running`) {
          return;
        }

        const { progress } = lead.effect?.getComputedTiming() ?? {};
        tick(_.clamp(progress ?? 0, 0, 1));
        tickFrame = requestAnimationFrame(tickAnimation);
      };

      tickFrame = requestAnimationFrame(tickAnimation);
    }

    const finish = (success: boolean) => {
      stopTick();

      if (success) {
        for (const { after, element } of targets) {
          after?.(element);
        }

        for (const animation of animations) {
          animation.cancel();
        }

        if (confirm) {
          Vibrate.trigger(`confirm`);
        }
      }

      finishPending();
    };

    void Promise.all(animations.map(async animation => animation.finished)).then(
      () => finish(true),
      () => finish(false),
    );

    await pending.promise;
  };

  const play = async (shots: readonly MotionPlayShot[], { clear = false }: MotionPlayOptions = {}) => {
    if (shots.length === 0) {
      return;
    }

    await run({
      confirm: false,
      targets: shots.map(({ element, frameAtProgress, start }) => ({
        after: target => (clear ? reset(target) : pin(target, frameAtProgress(1))),
        before: target => pin(target, start),
        element,
        end: frameAtProgress(1),
        start,
      })),
    });

    Vibrate.trigger(`confirm`);
  };

  return { cancel, pin, play, reset, run };
};
