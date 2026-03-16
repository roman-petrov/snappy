import { Snappy, type SnappyLength, type SnappyOptions, type SnappyStyle } from "@snappy/domain";
import { i } from "@snappy/intl";
import { InlineKeyboard } from "gramio";

import { type Locale, t } from "./Locale";

const { lengthEmojis, styleEmojis, styles } = Snappy;

const callback = {
  emoji: `o:e`,
  format: `o:f`,
  length: (v: SnappyLength) => `o:l:${v === `extend` ? `e` : v === `shorten` ? `s` : `k`}`,
  new: `o:nw`,
  process: `o:go`,
  style: (v: SnappyStyle) =>
    `o:s:${({ business: `b`, friendly: `f`, humorous: `h`, neutral: `n`, selling: `s` } as const)[v]}`,
};

const parseLength = (s: string): SnappyLength | undefined =>
  s === `k` ? `keep` : s === `e` ? `extend` : s === `s` ? `shorten` : undefined;

const parseStyle = (s: string): SnappyStyle | undefined =>
  styles.find((styleKey: SnappyStyle) => styleKey.startsWith(s)) ?? undefined;

const optionsKeyboard = (locale: Locale, options: SnappyOptions) => {
  const { addEmoji, addFormatting, length, style } = options;

  return new InlineKeyboard()
    .text(
      `${t(locale, `options.emoji`)}${addEmoji ? ` ✓` : ``}`,
      callback.emoji,
      addEmoji ? { style: `success` } : undefined,
    )
    .text(
      `${t(locale, `options.format`)}${addFormatting ? ` ✓` : ``}`,
      callback.format,
      addFormatting ? { style: `success` } : undefined,
    )
    .row()
    .text(lengthEmojis.keep, callback.length(`keep`), length === `keep` ? { style: `success` } : undefined)
    .text(lengthEmojis.extend, callback.length(`extend`), length === `extend` ? { style: `success` } : undefined)
    .text(lengthEmojis.shorten, callback.length(`shorten`), length === `shorten` ? { style: `success` } : undefined)
    .row()
    .text(styleEmojis.neutral, callback.style(`neutral`), style === `neutral` ? { style: `success` } : undefined)
    .text(styleEmojis.business, callback.style(`business`), style === `business` ? { style: `success` } : undefined)
    .text(styleEmojis.friendly, callback.style(`friendly`), style === `friendly` ? { style: `success` } : undefined)
    .text(styleEmojis.humorous, callback.style(`humorous`), style === `humorous` ? { style: `success` } : undefined)
    .text(styleEmojis.selling, callback.style(`selling`), style === `selling` ? { style: `success` } : undefined)
    .row()
    .text(t(locale, `keyboard.process`), callback.process, { style: `primary` })
    .text(t(locale, `keyboard.new`), callback.new);
};

const resultKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `keyboard.retry`), `a:retry`, { style: `primary` })
    .text(t(locale, `keyboard.new`), `a:new`);

const premiumKeyboard = (locale: Locale, premiumPrice: number) =>
  new InlineKeyboard().text(
    t(locale, `commands.premium.button`, { price: i.price(premiumPrice, `default`, locale) }),
    `premium:buy`,
  );

const limitKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `features.subscriptionButton`), `premium:buy`)
    .text(t(locale, `features.balanceButton`), `limit:balance`);

const subscriptionKeyboard = (locale: Locale, autoRenew = false) =>
  new InlineKeyboard()
    .text(
      t(locale, autoRenew ? `commands.premium.autoRenewOffButton` : `commands.premium.autoRenewOnButton`),
      autoRenew ? `premium:auto-renew:off` : `premium:auto-renew:on`,
    )
    .row()
    .text(t(locale, `commands.premium.renewButton`), `premium:renew`)
    .row()
    .text(t(locale, `commands.premium.deleteButton`), `premium:delete`);

const subscriptionDeleteConfirmKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `commands.premium.deleteConfirmButton`), `premium:delete:confirm`)
    .text(t(locale, `commands.premium.deleteCancelButton`), `premium:delete:cancel`);

type OptionAction =
  | { type: `emoji` }
  | { type: `format` }
  | { type: `length`; value: SnappyLength }
  | { type: `new` }
  | { type: `process` }
  | { type: `style`; value: SnappyStyle };

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

export const Keyboards = {
  limitKeyboard,
  optionsKeyboard,
  parseOptionCallback,
  parseResultCallback,
  premiumKeyboard,
  resultKeyboard,
  subscriptionDeleteConfirmKeyboard,
  subscriptionKeyboard,
};
