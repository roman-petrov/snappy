import { describe, expect, it } from "vitest";

import { Gesture, type GesturePointer } from "./Gesture";
import { Vector, type Vec2 } from "./Vector";

const { axis, detect, pointer, releaseVelocity, velocity } = Gesture;
const { from } = Vector;

type PointerInput = {
  delta?: Vec2;
  duration?: number;
  dx: number;
  dy?: number;
  peak?: Vec2;
  speed?: Vec2;
  sampleVelocity?: number;
};

const sample = ({
  duration = 120,
  delta,
  dx,
  dy = 0,
  peak,
  speed,
  sampleVelocity = 0,
}: PointerInput): GesturePointer => {
  const displacement = delta ?? from(dx, dy);
  const peaks = peak ?? Vector.abs(displacement);
  const speeds = speed ?? from(sampleVelocity, 0);

  return pointer(duration, displacement, peaks, speeds);
};

describe(`axis`, () => {
  it(`returns pending below threshold`, () => {
    expect(axis(from(3, 3))).toBe(`pending`);
  });

  it(`prefers horizontal on equal axes`, () => {
    expect(axis(from(8, 8))).toBe(`horizontal`);
  });

  it(`returns vertical when y dominates`, () => {
    expect(axis(from(2, 10))).toBe(`vertical`);
  });
});

describe(`detect`, () => {
  it(`detects a short quick swipe by distance`, () => {
    expect(detect(sample({ duration: 100, dx: 12, dy: 1 }))).toStrictEqual({ direction: `right`, type: `swipe` });
  });

  it(`detects a fast flick by velocity`, () => {
    expect(detect(sample({ duration: 40, dx: 10, peak: from(10, 0), speed: from(0, 0) }))).toStrictEqual({
      direction: `right`,
      type: `swipe`,
    });
    expect(releaseVelocity(sample({ duration: 50, dx: 20, peak: from(20, 0), speed: from(0, 0) }))).toBe(0.4);
  });

  it(`prefers faster average velocity when sample is lower`, () => {
    expect(releaseVelocity(sample({ duration: 100, dx: 200, peak: from(200, 0), speed: from(1, 0) }))).toBe(2);
  });

  it(`rejects slow pan`, () => {
    expect(detect(sample({ duration: 400, dx: 60, dy: 2, peak: from(60, 2) }))).toStrictEqual({ type: `none` });
  });

  it(`rejects mostly vertical movement`, () => {
    expect(detect(sample({ duration: 120, dx: 20, dy: 30, peak: from(20, 30) }))).toStrictEqual({ type: `none` });
  });

  it(`rejects tiny stationary release`, () => {
    expect(detect(sample({ duration: 120, dx: 2, peak: from(2, 0) }))).toStrictEqual({ type: `none` });
  });

  it(`detects left swipe`, () => {
    expect(detect(sample({ duration: 100, dx: -15, dy: 1 }))).toStrictEqual({ direction: `left`, type: `swipe` });
  });
});

describe(`velocity`, () => {
  it(`computes speed from pointer samples`, () => {
    expect(velocity({ sample: 0, time: 0, value: 0 }, 100, 100)).toStrictEqual({ sample: 100, time: 100, value: 1 });
  });
});
