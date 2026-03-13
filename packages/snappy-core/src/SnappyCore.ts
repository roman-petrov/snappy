import { _ } from "@snappy/core";

import { Prompts } from "./Prompts";

const lengthEmoji = { extend: `↔`, keep: `●`, shorten: `✂` } as const;
const styleEmoji = { business: `💼`, friendly: `🤝`, humorous: `😄`, neutral: `⚖`, selling: `🛒` } as const;

export type SnappyCoreLength = keyof typeof lengthEmoji;

export type SnappyCoreOptions = {
  addEmoji?: boolean;
  addFormatting?: boolean;
  length?: SnappyCoreLength;
  style?: SnappyCoreStyle;
};

export type SnappyCoreStyle = keyof typeof styleEmoji;

const lengthKeys = _.keys(lengthEmoji);
const styleKeys = _.keys(styleEmoji);

const defaultOptions: Required<SnappyCoreOptions> = {
  addEmoji: false,
  addFormatting: false,
  length: `keep`,
  style: `neutral`,
};

const generateSystemPrompt = (options: SnappyCoreOptions): string => {
  const merged = { ...defaultOptions, ...options };

  const optional = [
    ...(merged.addEmoji ? [Prompts.addEmoji] : []),
    ...(merged.addFormatting ? [Prompts.addFormatting] : []),
  ];

  return [Prompts.base, Prompts.length[merged.length], Prompts.style[merged.style], ...optional].join(`\n\n`);
};

export const SnappyCore = { defaultOptions, generateSystemPrompt, lengthEmoji, lengthKeys, styleEmoji, styleKeys };
