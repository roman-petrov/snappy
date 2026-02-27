import type { Plugin } from "vite";

import { _ } from "@snappy/core";

export const cssModulesCamelCasePlugin = (): Plugin => ({
  enforce: `post`,
  name: `css-modules-camelcase`,
  transform(code, id) {
    if (!id.includes(`.module.css`)) {
      return undefined;
    }

    if (!_.isString(code) || !code.includes(`export default`)) {
      return undefined;
    }

    const newCode = code.replaceAll(
      /"(?<key>[^"]+)":\s*"(?<value>[^"]*)"/gu,
      (_m, key: string, value: string) => `"${_.camelCase(key)}": "${value}"`,
    );

    if (newCode === code) {
      return undefined;
    }

    return { code: newCode, map: undefined };
  },
});
