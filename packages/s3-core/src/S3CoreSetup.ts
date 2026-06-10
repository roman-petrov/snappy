/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { DeleteBucketPolicyCommand, HeadBucketCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { ConfigValues, type Environment } from "@snappy/config";

import { S3CoreRuntime } from "./S3CoreRuntime";

const setup = async (mode: Environment, secretsKey?: string) => {
  const loaded = ConfigValues.secretsFor(mode, secretsKey);
  if (!loaded.ok) {
    return { error: loaded.error, ok: false as const };
  }

  const { bucket, sdk } = S3CoreRuntime.clientFrom(loaded.value);
  const origin = ConfigValues.origin(mode);

  try {
    await sdk.send(new HeadBucketCommand({ Bucket: bucket }));
    await sdk.send(new DeleteBucketPolicyCommand({ Bucket: bucket })).catch((error: unknown) => {
      if (!(error instanceof Error) || error.name !== `NoSuchBucketPolicy`) {
        throw error;
      }
    });
    await sdk.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: {
          CORSRules: [
            { AllowedHeaders: [`*`], AllowedMethods: [`GET`], AllowedOrigins: [origin], MaxAgeSeconds: 3600 },
          ],
        },
      }),
    );

    return { ok: true as const };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), ok: false as const };
  }
};

export const S3CoreSetup = { setup };

export type S3CoreSetupResult = Awaited<ReturnType<typeof setup>>;
