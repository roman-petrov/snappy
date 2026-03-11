/* eslint-disable @typescript-eslint/no-magic-numbers */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
const easeInQuart = (t: number) => t ** 4;

export const Easing = { easeInQuart, easeOutExpo };
