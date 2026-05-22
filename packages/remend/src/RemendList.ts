import { Unicode } from "@snappy/core";

import { RemendEmphasis } from "./RemendEmphasis";

const lineEnd = (line: string) => {
  const nested = /^(?<indent>\s+)(?<marker>[*+-])\s*$/u.exec(line);

  if (nested !== null) {
    const { indent = ``, marker = `` } = nested.groups ?? {};

    return `${indent}${marker} ${Unicode.zeroWidthSpace}`;
  }

  const top = /^(?<marker>[*+-])\s*$/u.exec(line);

  if (top !== null) {
    const { marker = `` } = top.groups ?? {};

    return `${marker} ${Unicode.zeroWidthSpace}`;
  }

  const ordered = /^(?<indent>\s*)(?<number>\d+)\.\s*$/u.exec(line);

  if (ordered !== null) {
    const { indent = ``, number = `` } = ordered.groups ?? {};

    return `${indent}${number}. ${Unicode.zeroWidthSpace}`;
  }

  return line;
};

const completeLine = (line: string) => (RemendEmphasis.markerOnly(line) ? line : lineEnd(line));
const complete = (text: string) => text.split(`\n`).map(completeLine).join(`\n`);

export const RemendList = { complete };
