import type { Config } from "stylelint";

export const StyleLintConfig: Config = {
  defaultSeverity: `warning`,
  extends: [`stylelint-config-standard-scss`, `stylelint-config-recess-order`],
  ignoreFiles: [`.analyze`, `**/dist/**`],
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};
