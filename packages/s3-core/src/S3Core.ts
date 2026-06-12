/* eslint-disable init-declarations */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable no-await-in-loop */
import {
  DeleteBucketPolicyCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Config, ConfigValues } from "@snappy/config";
import { _ } from "@snappy/core";

const publicPrefix = `public`;
const endpoint = `https://s3.regru.cloud`;
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

const setup = async () => {
  const mode = ConfigValues.env();
  const loaded = ConfigValues.secretsFor(mode);
  if (!loaded.ok) {
    return { error: loaded.error, ok: false as const };
  }

  const { bucket, sdk } = clientFrom(loaded.value);
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

const user = (userId: string) => {
  const key = (path: string) => `${publicPrefix}/${userId}/${path}`;

  const putPng = async (path: string, src: Buffer | string) => {
    const { bucket, sdk } = runtime();

    return sdk.send(
      new PutObjectCommand({
        Body: _.isString(src) ? Buffer.from(src.split(`,`)[1] ?? ``, `base64`) : src,
        Bucket: bucket,
        ContentType: `image/png`,
        Key: key(path),
      }),
    );
  };

  const remove = async (path: string) => {
    const { bucket, sdk } = runtime();

    return sdk.send(new DeleteObjectCommand({ Bucket: bucket, Key: key(path) }));
  };

  const url = async (path: string) => {
    const { bucket, sdk } = runtime();

    return getSignedUrl(sdk, new GetObjectCommand({ Bucket: bucket, Key: key(path) }), {
      expiresIn: Config.s3SignedUrlTtlSec,
    });
  };

  const purge = async () => {
    const { bucket, sdk } = runtime();
    const objectPrefix = key(``);
    let continuationToken: string | undefined;

    do {
      const listed = await sdk.send(
        new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken, Prefix: objectPrefix }),
      );

      const keys = (listed.Contents ?? []).map(item => item.Key).filter((item): item is string => item !== undefined);

      if (keys.length > 0) {
        await sdk.send(
          new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: keys.map(item => ({ Key: item })), Quiet: true },
          }),
        );
      }

      continuationToken = listed.IsTruncated === true ? listed.NextContinuationToken : undefined;
    } while (continuationToken !== undefined);
  };

  return { id: userId, purge, putPng, remove, url };
};

export const S3Core = { setup, user };

export type S3Core = typeof S3Core;

export type S3CoreSetupResult = Awaited<ReturnType<typeof setup>>;

export type S3CoreUser = ReturnType<typeof user>;
