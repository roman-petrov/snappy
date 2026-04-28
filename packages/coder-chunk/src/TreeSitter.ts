/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";
import { createRequire } from "node:module";
import { Language, Parser } from "web-tree-sitter";

const require = createRequire(import.meta.url);

await Parser.init();

const languages = [`css`, `java`, `javascript`, `json`, `tsx`, `typescript`] as const;

export type TreeSitterLanguage = (typeof languages)[number];

const languageParsers = _.fromEntries(
  await Promise.all(
    languages.map(
      async language =>
        [
          language,
          await Language.load(
            require.resolve(
              `${
                language === `tsx` || language === `typescript` ? `tree-sitter-typescript` : `tree-sitter-${language}`
              }/tree-sitter-${language}.wasm`,
            ),
          ),
        ] as const,
    ),
  ),
);

const parserCache: Partial<Record<TreeSitterLanguage, Parser>> = {};

export const TreeSitter = (language: TreeSitterLanguage) => {
  const cached = parserCache[language];
  if (cached !== undefined) {
    return cached;
  }

  const parser = new Parser();
  parser.setLanguage(languageParsers[language]);
  parserCache[language] = parser;

  return parser;
};
