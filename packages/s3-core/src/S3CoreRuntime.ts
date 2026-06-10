/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigValues } from "@snappy/config";

const endpoint = `https://s3.regru.cloud`;
const publicPrefix = `public`;
const region = `ru-1`;

const clientFrom = (source: Record<string, string>) => ({
  bucket: ConfigValues.required(source, `S3_BUCKET`),
  sdk: new S3Client({
    credentials: {
      accessKeyId: ConfigValues.required(source, `S3_ACCESS_KEY`),
      secretAccessKey: ConfigValues.required(source, `S3_SECRET_KEY`),
    },
    endpoint,
    forcePathStyle: true,
    region,
  }),
});

let cached: ReturnType<typeof clientFrom> | undefined;

const runtime = () => {
  cached ??= clientFrom(ConfigValues.values());

  return cached;
};

export const S3CoreRuntime = { clientFrom, endpoint, publicPrefix, runtime };
