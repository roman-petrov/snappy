import { _ } from "@snappy/core";
import pluginReact from "@vitejs/plugin-react";
import { NodePackageImporter } from "sass-embedded";
import { mergeConfig, type UserConfig } from "vite";
import pluginSassDts from "vite-plugin-sass-dts";

import { pluginOptimizeCssModules } from "./plugins";

export const ViteConfig = (override: UserConfig = {}) =>
  mergeConfig(
    {
      css: {
        modules: { localsConvention: `camelCaseOnly` },
        preprocessorOptions: { scss: { importers: [new NodePackageImporter()] } },
      },
      plugins: [
        pluginReact(),
        pluginOptimizeCssModules(),
        pluginSassDts({
          esmExport: true,
          exportName: { replacement: fileName => `__${_.pascalCase(fileName.split(`.`)[0] ?? ``)}` },
          legacyFileFormat: true,
        }),
      ],
    },
    override,
  );
