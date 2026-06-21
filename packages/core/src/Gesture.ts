export type Gesture = { direction: GestureDirection; type: `swipe` } | { type: `none` };

export type GestureAxis = `horizontal` | `pending` | `vertical`;

export type GestureConfig = {
  axisThreshold?: number;
  swipeMaxDuration?: number;
  swipeMaxRestraint?: number;
  swipeMinDistance?: number;
  swipeMinVelocity?: number;
};

export type GestureDirection = `left` | `right`;

export type GesturePointer = {
  duration: number;
  dx: number;
  dy: number;
  peak: number;
  peakCross: number;
  velocity: number;
};

export type VelocitySample = { sample: number; time: number; value: number };

const defaults: Required<GestureConfig> = {
  axisThreshold: 4,
  swipeMaxDuration: 300,
  swipeMaxRestraint: 80,
  swipeMinDistance: 10,
  swipeMinVelocity: 0.25,
};

const releaseVelocity = ({ duration, dx, velocity }: GesturePointer) => {
  const average = duration > 0 ? dx / duration : 0;

  return velocity === 0 ? average : Math.abs(velocity) >= Math.abs(average) ? velocity : average;
};

const axis = (dx: number, dy: number, axisThreshold = defaults.axisThreshold): GestureAxis => {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  return absX < axisThreshold && absY < axisThreshold ? `pending` : absX >= absY ? `horizontal` : `vertical`;
};

const detect = (pointer: GesturePointer, config: GestureConfig = {}): Gesture => {
  const { axisThreshold, swipeMaxDuration, swipeMaxRestraint, swipeMinDistance, swipeMinVelocity } = {
    ...defaults,
    ...config,
  };

  const { duration, dx, dy, peak, peakCross } = pointer;

  if (axis(dx, dy, axisThreshold) !== `horizontal`) {
    return { type: `none` };
  }

  if (Math.max(Math.abs(dy), peakCross) > swipeMaxRestraint) {
    return { type: `none` };
  }

  if (duration > swipeMaxDuration) {
    return { type: `none` };
  }

  const travel = Math.max(Math.abs(dx), peak);
  const absVelocity = Math.abs(releaseVelocity(pointer));

  if (travel < swipeMinDistance && absVelocity < swipeMinVelocity) {
    return { type: `none` };
  }

  const sign = dx === 0 ? Math.sign(releaseVelocity(pointer)) : Math.sign(dx);

  return sign === 0 ? { type: `none` } : { direction: sign < 0 ? `left` : `right`, type: `swipe` };
};

const velocity = (previous: VelocitySample, clientX: number, timestamp: number): VelocitySample => {
  const dt = timestamp - previous.time;

  return dt > 0
    ? { sample: clientX, time: timestamp, value: (clientX - previous.sample) / dt }
    : { ...previous, sample: clientX, time: timestamp };
};

export const Gesture = { axis, defaults, detect, releaseVelocity, velocity };
