export const Unicode = {
  codePoint: {
    highSurrogateMax: 0xdb_ff,
    highSurrogateMin: 0xd8_00,
    regionalIndicatorMax: 0x1_f1_ff,
    regionalIndicatorMin: 0x1_f1_e6,
    supplementary: 0xff_ff,
  },
  escape: `\u001B`,
  null: `\u0000`,
  startOfHeading: `\u0001`,
  zeroWidthSpace: `\u200B`,
} as const;
