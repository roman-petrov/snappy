/* eslint-disable @typescript-eslint/no-magic-numbers */
// cspell:word Segoe
import { _ } from "@snappy/core";

import { Colors } from "./Colors";

const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
const fontSize = { body: _.px(15), heading: _.px(22), small: _.px(13) } as const;

const margin = {
  bottom12: `0 0 ${_.px(12)}`,
  bottom24: `0 0 ${_.px(24)}`,
  footer: `${_.px(24)} 0 0`,
  urlLabel: `${_.px(24)} 0 ${_.px(8)}`,
} as const;

const padding = { button: `${_.px(12)} ${_.px(24)}`, container: _.px(32), section: `${_.px(40)} ${_.px(16)}` } as const;
const radius = { button: _.px(8), container: _.px(12) } as const;
const border = `${_.px(1)} solid ${Colors.border}`;
const maxWidth = _.px(480);

export const Layout = { border, font, fontSize, margin, maxWidth, padding, radius };
