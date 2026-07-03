import type { StreamRoute } from "@snappy/server-module";

import { MimeType } from "@snappy/core";
import { join } from "node:path";

const filename = `snappy.apk`;

export const MountDownload = (distDir: string): StreamRoute => ({
  disposition: `attachment; filename="${filename}"`,
  file: join(distDir, filename),
  path: `/download/${filename}`,
  type: MimeType.apk,
});
