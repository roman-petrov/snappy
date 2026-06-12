import { S3 } from "@snappy/s3";

import type { Command } from "../Command";

export const SetupS3: Command = {
  description: `Apply S3 bucket policy and CORS.`,
  label: `📦 S3`,
  mcp: false,
  name: `setup-s3`,
  run: async () => {
    const result = await S3.setup();

    return result.ok ? 0 : { exitCode: 1, message: result.error };
  },
};
