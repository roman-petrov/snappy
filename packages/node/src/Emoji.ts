/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
import { Unicode } from "@snappy/core";

const buggy = [`🖥️`, `⚙️`, `🗄️`, `⬇️`, `🛡️`, `▶️`];
const ansi = new RegExp(String.raw`${Unicode.escape}\[[0-9;]*m`, `gu`);
const gapBeforeLetter = `(?:${ansi.source})*`;

const fix = (text: string) => {
  let result = text;
  for (const emoji of buggy) {
    const adjacentText = new RegExp(String.raw`${emoji}(?!\s)(?=${gapBeforeLetter}[\p{L}\p{N}])`, `gu`);
    const singleSpaceText = new RegExp(String.raw`${emoji} (?! )(?=${gapBeforeLetter}[\p{L}\p{N}])`, `gu`);
    result = result.replaceAll(adjacentText, `${emoji} `).replaceAll(singleSpaceText, `${emoji}  `);
  }

  return result;
};

export const Emoji = { fix };
