import type { SnappyOptions } from "@snappy/domain";

import { Prompts } from "./Prompts";

const generateSystemPrompt = (options: SnappyOptions): string => {
  const optional = [
    ...(options.addEmoji ? [Prompts.addEmoji] : []),
    ...(options.addFormatting ? [Prompts.addFormatting] : []),
  ];

  return [Prompts.base, Prompts.length[options.length], Prompts.style[options.style], ...optional].join(`\n\n`);
};

export const SnappyCore = { generateSystemPrompt };
