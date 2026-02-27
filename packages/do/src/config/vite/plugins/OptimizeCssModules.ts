/**
 * Deterministic scoped names so SSR and client builds get the same class names.
 * Based on https://github.com/simonwep/vite-plugin-optimize-css-modules
 */
import type { Plugin } from "vite";

import { createHash } from "node:crypto";

export const pluginOptimizeCssModules = (): Plugin => ({
  apply: `build`,
  config: () => ({
    css: {
      modules: {
        generateScopedName: (name: string, fileName: string) => {
          const dict = `_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
          const dictSizePow = 4;

          const toCssId = () => {
            const hex = createHash(`sha256`)
              .update(fileName + name)
              .digest(`hex`);

            const seed = Number.parseInt(hex.slice(0, 8), 16) % dict.length ** dictSizePow;
            const index0 = seed % dict.length;
            const index1 = Math.trunc(seed / dict.length) % dict.length;
            const index2 = Math.trunc(seed / dict.length ** 2) % dict.length;
            const index3 = Math.trunc(seed / (dict.length ** 2 * dict.length)) % dict.length;
            const raw = (dict[index0] ?? ``) + (dict[index1] ?? ``) + (dict[index2] ?? ``) + (dict[index3] ?? ``);
            const first = raw[0] ?? ``;
            const second = raw[1] ?? ``;
            const digit = (c: string) => c >= `0` && c <= `9`;
            const needsUnderscore = digit(first) || (first === `-` && digit(second));

            return needsUnderscore ? `_${raw}` : raw;
          };

          return toCssId();
        },
      },
    },
  }),
  name: `optimize-css-modules`,
});
