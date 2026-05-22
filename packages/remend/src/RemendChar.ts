const word = /[\p{L}\p{N}_]/u;
const content = /[\p{Extended_Pictographic}\p{L}\p{N}]/u;
const isSpace = (char: string) => char === ` ` || char === `\t` || char === `\n` || char === `\r`;

export const RemendChar = {
  content: (char: string) => content.test(char),
  isSpace,
  word: (char: string) => word.test(char),
};
