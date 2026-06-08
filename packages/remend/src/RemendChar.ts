const word = /[\p{L}\p{N}_]/u;
const content = /[\p{Extended_Pictographic}\p{L}\p{N}]/u;
const isSpace = (char: string) => [`\n`, `\r`, `\t`, ` `].includes(char);

export const RemendChar = {
  content: (char: string) => content.test(char),
  isSpace,
  word: (char: string) => word.test(char),
};
