export const GlassLook = {
  clear: { blur: 1.5, roughness: 0, tint: 0.12 },
  frost: { blur: 0.5, roughness: 0.4, tint: 0.2 },
  haze: { blur: 1, roughness: 0.25, tint: 0.4 },
  mist: { blur: 1, roughness: 0.16, tint: 0.2 },
} as const;

export type GlassLook = keyof typeof GlassLook;
