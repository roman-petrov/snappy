import { _ } from "@snappy/core";

import type { SnappyToolFactory } from "../SnappyTypes";

export default _.fromEntries(
  Object.values(import.meta.glob<Record<string, SnappyToolFactory>>(`./*Tool.ts`, { eager: true })).flatMap(
    moduleObject =>
      _.entries(moduleObject)
        .filter(([, value]) => _.isFunction(value))
        .map(([name, tool]) => [_.kebabCase(name.replace(/Tool$/u, ``)), tool] as const),
  ),
);
