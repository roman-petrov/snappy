import { ConfigValues } from "@snappy/config";
import { join } from "node:path";
import pino from "pino";

export const FileLogger = (name: string) =>
  pino(
    { level: ConfigValues.production() ? `info` : `debug` },
    pino.transport({
      options: {
        dateFormat: `yyyy-MM-dd`,
        file: join(ConfigValues.root, `.logs`, name),
        frequency: `daily`,
        limit: { count: 14, removeOtherLogFiles: true },
        mkdir: true,
        size: `20m`,
      },
      target: `pino-roll`,
    }),
  );
