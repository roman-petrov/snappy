import type { Config } from "stylelint";

export const StyleLintConfig: Config = {
  defaultSeverity: `warning`,
  extends: [`stylelint-config-standard`, `stylelint-config-recess-order`],
  ignoreFiles: [`**/dist/**`],
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};
