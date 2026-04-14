/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";
import treeSitterParser from "tree-sitter";

const parserCache: Record<string, treeSitterParser | undefined> = {};

const parser = (extension: string, language: unknown) => {
  const cached = parserCache[extension];
  if (cached !== undefined) {
    return cached;
  }

  const isParserLanguage = (value: unknown): value is treeSitterParser.Language => _.isObject(value);
  if (!isParserLanguage(language)) {
    return undefined;
  }

  const parserInstance = new treeSitterParser();
  parserInstance.setLanguage(language);
  parserCache[extension] = parserInstance;

  return parserInstance;
};

export const TreeSitter = { parser };
