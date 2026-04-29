/* eslint-disable unused-imports/no-unused-vars */
const locales = [`en`, `ru`] as const;

export type Locale = (typeof locales)[number];
