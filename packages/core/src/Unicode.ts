/* eslint-disable regexp/no-control-character */
/* eslint-disable unicorn/no-hex-escape */
/* eslint-disable unicorn/escape-case */
/* eslint-disable no-control-regex */
const escape = `\u001B`;
const ansi = /\x1b\[[0-9;]*m/gu;
const stripAnsi = (text: string) => text.replaceAll(ansi, ``);

export const Unicode = {
  ansi,
  codePoint: {
    highSurrogateMax: 0xdb_ff,
    highSurrogateMin: 0xd8_00,
    regionalIndicatorMax: 0x1_f1_ff,
    regionalIndicatorMin: 0x1_f1_e6,
    supplementary: 0xff_ff,
  },
  escape,
  null: `\u0000`,
  startOfHeading: `\u0001`,
  stripAnsi,
  zeroWidthSpace: `\u200B`,
} as const;
