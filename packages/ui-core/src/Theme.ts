const values = [`dark`, `light`, `system`] as const;
const key = `snappy-theme`;

export type ResolvedTheme = `dark` | `light`;

export type Theme = (typeof values)[number];

const resolve = (value: Theme | undefined): ResolvedTheme | undefined =>
  value === `dark` || value === `light` ? value : undefined;

export const Theme = { key, resolve, values };
