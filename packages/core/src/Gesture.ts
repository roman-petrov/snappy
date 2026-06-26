import { type Vec2, type Vec2Axis, Vector } from "./Vector";

export type Gesture = { direction: GestureDirection; type: `swipe` } | { type: `none` };

export type GestureAxis = Vec2Axis;

export type GestureConfig = {
  axisThreshold?: number;
  swipeMaxDuration?: number;
  swipeMaxRestraint?: number;
  swipeMinDistance?: number;
  swipeMinVelocity?: number;
};

export type GestureDirection = `left` | `right`;

export type GesturePointer = { delta: Vec2; duration: number; peak: Vec2; speed: Vec2 };

export type VelocitySample = { sample: number; time: number; value: number };

const defaults: Required<GestureConfig> = {
  axisThreshold: 4,
  swipeMaxDuration: 300,
  swipeMaxRestraint: 80,
  swipeMinDistance: 10,
  swipeMinVelocity: 0.25,
};

const pointer = (duration: number, delta: Vec2, peak: Vec2, speed: Vec2): GesturePointer => ({
  delta,
  duration,
  peak,
  speed,
});

const releaseVelocity = ({ delta, duration, speed }: GesturePointer) => {
  const average = duration > 0 ? delta.x / duration : 0;

  return speed.x === 0 ? average : Math.abs(speed.x) >= Math.abs(average) ? speed.x : average;
};

const axis = (vector: Vec2, axisThreshold = defaults.axisThreshold) => Vector.axis(vector, axisThreshold);

const detect = (sample: GesturePointer, config: GestureConfig = {}): Gesture => {
  const { axisThreshold, swipeMaxDuration, swipeMaxRestraint, swipeMinDistance, swipeMinVelocity } = {
    ...defaults,
    ...config,
  };

  const { delta, duration, peak } = sample;
  const travel = Vector.max(Vector.abs(delta), peak);

  if (Vector.axis(delta, axisThreshold) !== `horizontal`) {
    return { type: `none` };
  }

  if (travel.y > swipeMaxRestraint) {
    return { type: `none` };
  }

  if (duration > swipeMaxDuration) {
    return { type: `none` };
  }

  const absVelocity = Math.abs(releaseVelocity(sample));

  if (travel.x < swipeMinDistance && absVelocity < swipeMinVelocity) {
    return { type: `none` };
  }

  const sign = delta.x === 0 ? Math.sign(releaseVelocity(sample)) : Math.sign(delta.x);

  return sign === 0 ? { type: `none` } : { direction: sign < 0 ? `left` : `right`, type: `swipe` };
};

const velocity = (previous: VelocitySample, clientX: number, timestamp: number): VelocitySample => {
  const dt = timestamp - previous.time;

  return dt > 0
    ? { sample: clientX, time: timestamp, value: (clientX - previous.sample) / dt }
    : { ...previous, sample: clientX, time: timestamp };
};

export const Gesture = { axis, defaults, detect, pointer, releaseVelocity, velocity };
