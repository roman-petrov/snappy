import type { Config } from "stylelint";

export const StyleLintConfig: Config = {
  defaultSeverity: `warning`,
  extends: [`stylelint-config-standard`, `stylelint-config-recess-order`],
  ignoreFiles: [`**/dist/**`, `**/styled-system/**`],
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};
