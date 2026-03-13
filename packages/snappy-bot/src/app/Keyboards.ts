import { SnappyCore, type SnappyCoreLength, type SnappyCoreOptions, type SnappyCoreStyle } from "@snappy/snappy-core";
import { InlineKeyboard } from "gramio";

import { type Locale, t } from "./Locale";

const { lengthEmoji, styleEmoji, styleKeys } = SnappyCore;

const callback = {
  emoji: `o:e`,
  format: `o:f`,
  length: (v: SnappyCoreLength) => `o:l:${v === `extend` ? `e` : v === `shorten` ? `s` : `k`}`,
  new: `o:nw`,
  process: `o:go`,
  style: (v: SnappyCoreStyle) =>
    `o:s:${({ business: `b`, friendly: `f`, humorous: `h`, neutral: `n`, selling: `s` } as const)[v]}`,
};

const parseLength = (s: string): SnappyCoreLength | undefined =>
  s === `k` ? `keep` : s === `e` ? `extend` : s === `s` ? `shorten` : undefined;

const parseStyle = (s: string): SnappyCoreStyle | undefined =>
  styleKeys.find(styleKey => styleKey.startsWith(s)) ?? undefined;

const optionsKeyboard = (localeKey: Locale, options: SnappyCoreOptions) => {
  const addEmoji = options.addEmoji ?? false;
  const addFormatting = options.addFormatting ?? false;
  const length = options.length ?? `keep`;
  const style = options.style ?? `neutral`;

  return new InlineKeyboard()
    .text(
      `${t(localeKey, `options.emoji`)}${addEmoji ? ` ✓` : ``}`,
      callback.emoji,
      addEmoji ? { style: `success` } : undefined,
    )
    .text(
      `${t(localeKey, `options.format`)}${addFormatting ? ` ✓` : ``}`,
      callback.format,
      addFormatting ? { style: `success` } : undefined,
    )
    .row()
    .text(lengthEmoji.keep, callback.length(`keep`), length === `keep` ? { style: `success` } : undefined)
    .text(lengthEmoji.extend, callback.length(`extend`), length === `extend` ? { style: `success` } : undefined)
    .text(lengthEmoji.shorten, callback.length(`shorten`), length === `shorten` ? { style: `success` } : undefined)
    .row()
    .text(styleEmoji.neutral, callback.style(`neutral`), style === `neutral` ? { style: `success` } : undefined)
    .text(styleEmoji.business, callback.style(`business`), style === `business` ? { style: `success` } : undefined)
    .text(styleEmoji.friendly, callback.style(`friendly`), style === `friendly` ? { style: `success` } : undefined)
    .text(styleEmoji.humorous, callback.style(`humorous`), style === `humorous` ? { style: `success` } : undefined)
    .text(styleEmoji.selling, callback.style(`selling`), style === `selling` ? { style: `success` } : undefined)
    .row()
    .text(t(localeKey, `keyboard.process`), callback.process, { style: `primary` })
    .text(t(localeKey, `keyboard.new`), callback.new);
};

const resultKeyboard = (localeKey: Locale) =>
  new InlineKeyboard()
    .text(t(localeKey, `keyboard.retry`), `a:retry`, { style: `primary` })
    .text(t(localeKey, `keyboard.new`), `a:new`);

const premiumKeyboard = (localeKey: Locale, premiumPrice: number) =>
  new InlineKeyboard().text(t(localeKey, `commands.premium.button`, { price: premiumPrice }), `premium:buy`);

type OptionAction =
  | { type: `emoji` }
  | { type: `format` }
  | { type: `length`; value: SnappyCoreLength }
  | { type: `new` }
  | { type: `process` }
  | { type: `style`; value: SnappyCoreStyle };

const parseOptionCallback = (data: string): OptionAction | undefined => {
  if (data === callback.emoji) {
    return { type: `emoji` };
  }
  if (data === callback.format) {
    return { type: `format` };
  }
  if (data === callback.new) {
    return { type: `new` };
  }
  if (data === callback.process) {
    return { type: `process` };
  }
  const lengthPrefix = `o:l:`;
  const stylePrefix = `o:s:`;

  if (data.startsWith(lengthPrefix)) {
    const value = parseLength(data.slice(lengthPrefix.length));

    return value === undefined ? undefined : { type: `length`, value };
  }

  if (data.startsWith(stylePrefix)) {
    const value = parseStyle(data.slice(stylePrefix.length));

    return value === undefined ? undefined : { type: `style`, value };
  }

  return undefined;
};

const parseResultCallback = (data: string) => {
  if (data === `a:new`) {
    return `new` as const;
  }
  if (data === `a:retry`) {
    return `retry` as const;
  }

  return undefined;
};

export const Keyboards = { optionsKeyboard, parseOptionCallback, parseResultCallback, premiumKeyboard, resultKeyboard };
