import { describe, expect, it } from "vitest";

import { Gesture, type GesturePointer } from "./Gesture";

const { axis, detect, releaseVelocity, velocity } = Gesture;

type PointerInput = {
  duration?: number;
  dx: number;
  dy?: number;
  peak?: number;
  peakCross?: number;
  sampleVelocity?: number;
};

const pointer = ({
  duration = 120,
  dx,
  dy = 0,
  peak = Math.abs(dx),
  peakCross = Math.abs(dy),
  sampleVelocity = 0,
}: PointerInput): GesturePointer => ({ duration, dx, dy, peak, peakCross, velocity: sampleVelocity });

describe(`axis`, () => {
  it(`returns pending below threshold`, () => {
    expect(axis(3, 3)).toBe(`pending`);
  });

  it(`prefers horizontal on equal axes`, () => {
    expect(axis(8, 8)).toBe(`horizontal`);
  });

  it(`returns vertical when dy dominates`, () => {
    expect(axis(2, 10)).toBe(`vertical`);
  });
});

describe(`detect`, () => {
  it(`detects a short quick swipe by distance`, () => {
    expect(detect(pointer({ duration: 100, dx: 12, dy: 1 }))).toStrictEqual({ direction: `right`, type: `swipe` });
  });

  it(`detects a fast flick by velocity`, () => {
    expect(detect(pointer({ duration: 40, dx: 10, peak: 10, sampleVelocity: 0 }))).toStrictEqual({
      direction: `right`,
      type: `swipe`,
    });
    expect(releaseVelocity(pointer({ duration: 50, dx: 20, peak: 20, sampleVelocity: 0 }))).toBe(0.4);
  });

  it(`prefers faster average velocity when sample is lower`, () => {
    expect(releaseVelocity(pointer({ duration: 100, dx: 200, peak: 200, sampleVelocity: 1 }))).toBe(2);
  });

  it(`rejects slow pan`, () => {
    expect(detect(pointer({ duration: 400, dx: 60, dy: 2, peak: 60 }))).toStrictEqual({ type: `none` });
  });

  it(`rejects mostly vertical movement`, () => {
    expect(detect(pointer({ duration: 120, dx: 20, dy: 30, peak: 20, peakCross: 30 }))).toStrictEqual({ type: `none` });
  });

  it(`rejects tiny stationary release`, () => {
    expect(detect(pointer({ duration: 120, dx: 2, peak: 2 }))).toStrictEqual({ type: `none` });
  });

  it(`detects left swipe`, () => {
    expect(detect(pointer({ duration: 100, dx: -15, dy: 1 }))).toStrictEqual({ direction: `left`, type: `swipe` });
  });
});

describe(`velocity`, () => {
  it(`computes speed from pointer samples`, () => {
    expect(velocity({ sample: 0, time: 0, value: 0 }, 100, 100)).toStrictEqual({ sample: 100, time: 100, value: 1 });
  });
});
