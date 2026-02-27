// cspell:word lightningcss
import { defineConfig, type UserConfig } from "vite";
import typedCssModules from "vite-plugin-typed-css-modules";

import { cssModulesCamelCasePlugin } from "./CssModules";

export type ViteConfigOverride = UserConfig & { typedCssInclude?: string[] };

export const ViteConfig = (override: ViteConfigOverride = {}): ReturnType<typeof defineConfig> => {
  const { plugins: extraPlugins, typedCssInclude, ...rest } = override;

  const plugins = [
    typedCssInclude === undefined ? typedCssModules() : typedCssModules({ include: typedCssInclude }),
    cssModulesCamelCasePlugin(),
    ...(extraPlugins ?? []),
  ];

  return defineConfig({
    css: { lightningcss: { cssModules: { pattern: `[hash]-[local]` } }, transformer: `lightningcss` },
    ...rest,
    plugins,
  });
};
