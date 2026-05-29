const values = [`dark`, `light`, `system`] as const;
const key = `snappy-theme`;

export type ResolvedTheme = `dark` | `light`;

export type Theme = (typeof values)[number];

const chrome: Record<ResolvedTheme, string> = { dark: `#131214`, light: `#f6f6f7` };

const resolve = (value: Theme | undefined): ResolvedTheme | undefined =>
  value === `dark` || value === `light` ? value : undefined;

export const Theme = { chrome, key, resolve, values };
