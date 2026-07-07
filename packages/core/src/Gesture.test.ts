import { describe, expect, it } from "vitest";

import { Gesture, type GesturePointer } from "./Gesture";
import { type Vec2, Vector } from "./Vector";

const { detect, pointer, releaseVelocity } = Gesture;
const { from } = Vector;

type PointerInput = {
  delta?: Vec2;
  duration?: number;
  dx: number;
  dy?: number;
  peak?: Vec2;
  sampleVelocity?: number;
  speed?: Vec2;
};

const sample = ({
  delta,
  duration = 120,
  dx,
  dy = 0,
  peak,
  sampleVelocity = 0,
  speed,
}: PointerInput): GesturePointer => {
  const displacement = delta ?? from(dx, dy);
  const peaks = peak ?? Vector.abs(displacement);
  const speeds = speed ?? from(sampleVelocity, 0);

  return pointer(duration, displacement, peaks, speeds);
};

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
