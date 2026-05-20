const values = [`dark`, `light`, `system`] as const;const key = `snappy-theme`;

export type Theme = (typeof values)[number];

const resolve = (value: Theme | undefined): Theme | undefined =>
  value === `dark` || value === `light` || value === `system` ? value : undefined;

export const Theme = { key, resolve, values };
