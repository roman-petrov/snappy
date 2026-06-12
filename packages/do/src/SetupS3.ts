import { S3 } from "@snappy/s3";

const setup = async () => {
  const result = await S3.setup();

  return result.ok ? 0 : { exitCode: 1, message: result.error };
};

export const SetupS3 = { setup };
