/* eslint-disable @typescript-eslint/no-magic-numbers */
export type Ease = (ratio: number) => number;

const inPoly = (ratio: number, power: number) => ratio ** power;
const outPoly = (ratio: number, power: number) => 1 - (1 - ratio) ** power;

const inOutPoly = (ratio: number, power: number) =>
  ratio < 0.5 ? 2 ** (power - 1) * ratio ** power : 1 - (-2 * ratio + 2) ** power / 2;

const poly = (power: number) => ({
  in: ((ratio: number) => inPoly(ratio, power)) as Ease,
  inOut: ((ratio: number) => inOutPoly(ratio, power)) as Ease,
  out: ((ratio: number) => outPoly(ratio, power)) as Ease,
});

const back = 1.70158;
const backOvershoot = back + 1;
const elastic = (2 * Math.PI) / 3;
const elasticInOut = (2 * Math.PI) / 4.5;
const linear: Ease = ratio => ratio;
const inBack: Ease = ratio => backOvershoot * ratio ** 3 - back * ratio ** 2;
const outBack: Ease = ratio => 1 + backOvershoot * (ratio - 1) ** 3 + back * (ratio - 1) ** 2;

const inOutBack: Ease = ratio => {
  const overshoot = back * 1.525;

  return ratio < 0.5
    ? (4 * ratio * ratio * ((overshoot + 1) * 2 * ratio - overshoot)) / 2
    : (4 * (ratio - 1) ** 2 * ((overshoot + 1) * (ratio * 2 - 2) + overshoot) + 2) / 2;
};

const outBounce: Ease = ratio => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (ratio < 1 / d1) {
    return n1 * ratio * ratio;
  }

  if (ratio < 2 / d1) {
    const t = ratio - 1.5 / d1;

    return n1 * t * t + 0.75;
  }

  if (ratio < 2.5 / d1) {
    const t = ratio - 2.25 / d1;

    return n1 * t * t + 0.9375;
  }

  const t = ratio - 2.625 / d1;

  return n1 * t * t + 0.984375;
};

const inBounce: Ease = ratio => 1 - outBounce(1 - ratio);

const inOutBounce: Ease = ratio =>
  ratio < 0.5 ? (1 - outBounce(1 - 2 * ratio)) / 2 : (1 + outBounce(2 * ratio - 1)) / 2;

const inCirc: Ease = ratio => 1 - Math.sqrt(1 - ratio ** 2);
const outCirc: Ease = ratio => Math.sqrt(1 - (ratio - 1) ** 2);

const inOutCirc: Ease = ratio =>
  ratio < 0.5 ? (1 - Math.sqrt(1 - (2 * ratio) ** 2)) / 2 : (Math.sqrt(1 - (-2 * ratio + 2) ** 2) + 1) / 2;

const inElastic: Ease = ratio =>
  ratio === 0 ? 0 : ratio === 1 ? 1 : -(2 ** (10 * ratio - 10)) * Math.sin((ratio * 10 - 10.75) * elastic);

const outElastic: Ease = ratio =>
  ratio === 0 ? 0 : ratio === 1 ? 1 : 2 ** (-10 * ratio) * Math.sin((ratio * 10 - 0.75) * elastic) + 1;

const inOutElastic: Ease = ratio =>
  ratio === 0
    ? 0
    : ratio === 1
      ? 1
      : ratio < 0.5
        ? -(2 ** (20 * ratio - 10) * Math.sin((20 * ratio - 11.125) * elasticInOut)) / 2
        : (2 ** (-20 * ratio + 10) * Math.sin((20 * ratio - 11.125) * elasticInOut)) / 2 + 1;

const inExpo: Ease = ratio => (ratio === 0 ? 0 : 2 ** (10 * ratio - 10));
const outExpo: Ease = ratio => (ratio === 1 ? 1 : 1 - 2 ** (-10 * ratio));

const inOutExpo: Ease = ratio =>
  ratio === 0 ? 0 : ratio === 1 ? 1 : ratio < 0.5 ? 2 ** (20 * ratio - 10) / 2 : (2 - 2 ** (-20 * ratio + 10)) / 2;

const inSine: Ease = ratio => 1 - Math.cos((ratio * Math.PI) / 2);
const outSine: Ease = ratio => Math.sin((ratio * Math.PI) / 2);
const inOutSine: Ease = ratio => -(Math.cos(Math.PI * ratio) - 1) / 2;
const { in: inQuad, inOut: inOutQuad, out: outQuad } = poly(2);
const { in: inCubic, inOut: inOutCubic, out: outCubic } = poly(3);
const { in: inQuart, inOut: inOutQuart, out: outQuart } = poly(4);
const { in: inQuint, inOut: inOutQuint, out: outQuint } = poly(5);

export const Ease = {
  inBack,
  inBounce,
  inCirc,
  inCubic,
  inElastic,
  inExpo,
  inOutBack,
  inOutBounce,
  inOutCirc,
  inOutCubic,
  inOutElastic,
  inOutExpo,
  inOutQuad,
  inOutQuart,
  inOutQuint,
  inOutSine,
  inQuad,
  inQuart,
  inQuint,
  inSine,
  linear,
  outBack,
  outBounce,
  outCirc,
  outCubic,
  outElastic,
  outExpo,
  outQuad,
  outQuart,
  outQuint,
  outSine,
};
