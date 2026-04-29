import type { Config } from "stylelint";

import { StylelintOrderOrder, StylelintPropertyDisallowedList } from "./rules";

export const StyleLintConfig: Config = {
  defaultSeverity: `warning`,
  extends: [`stylelint-config-standard-scss`, `stylelint-config-recess-order`],
  ignoreFiles: [`.analyze`, `**/dist/**`],
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: { "order/order": StylelintOrderOrder, "property-disallowed-list": StylelintPropertyDisallowedList },
};
