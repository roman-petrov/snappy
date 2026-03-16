const lengths = [`extend`, `keep`, `shorten`] as const;
const styles = [`business`, `friendly`, `humorous`, `neutral`, `selling`] as const;

export type SnappyLength = (typeof lengths)[number];

export type SnappyOptions = { addEmoji: boolean; addFormatting: boolean; length: SnappyLength; style: SnappyStyle };

export type SnappyStyle = (typeof styles)[number];

const defaultOptions: SnappyOptions = { addEmoji: false, addFormatting: false, length: `keep`, style: `neutral` };
const lengthEmojis: Record<SnappyLength, string> = { extend: `↔`, keep: `●`, shorten: `✂` };

const styleEmojis: Record<SnappyStyle, string> = {
  business: `💼`,
  friendly: `🤝`,
  humorous: `😄`,
  neutral: `⚖`,
  selling: `🛒`,
};

export const Snappy = { defaultOptions, lengthEmojis, lengths, styleEmojis, styles };
