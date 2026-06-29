/* eslint-disable unused-imports/no-unused-vars */
const locales = [`en`, `ru`] as const;

export type Locale = (typeof locales)[number];

const defaultValue: Locale = `ru`;

export const Locale = { default: defaultValue };
