/* eslint-disable @typescript-eslint/no-magic-numbers */
import { _ } from "@snappy/core";

const code = (value: number) => `\u001B[${value}m`;
const reset = code(0);

const codes = {
  blue: code(34),
  bold: code(1),
  cyan: code(36),
  dim: code(2),
  green: code(32),
  red: code(31),
  yellow: code(33),
} as const;

const paint = (sequence: string) => (text: string) => `${sequence}${text}${reset}`;

export const Terminal = _.fromEntries(
  _.keys(codes).map(name => [
    name,
    Object.assign(
      paint(codes[name]),
      _.fromEntries(_.keys(codes).map(style => [style, paint(`${codes[name]}${codes[style]}`)])),
    ),
  ]),
);
