/* eslint-disable init-declarations */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
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
import { _, Cache } from "@snappy/core";

const clientFrom = (source: Record<string, string>) => ({
  bucket: ConfigValues.required(source, `S3_BUCKET`),
  sdk: new S3Client({
    credentials: {
      accessKeyId: ConfigValues.required(source, `S3_ACCESS_KEY`),
      secretAccessKey: ConfigValues.required(source, `S3_SECRET_KEY`),
    },
    endpoint: `https://s3.regru.cloud`,
    forcePathStyle: true,
    region: `ru-1`,
  }),
});

let cached: ReturnType<typeof clientFrom> | undefined;
const urlCache = Cache<{ expiresAt: number; url: string }>();

const withClient = async <T>(fn: (client: ReturnType<typeof clientFrom>) => Promise<T>) => {
  cached ??= clientFrom(ConfigValues.values());

  return fn(cached);
};

const setup = async () => {
  const mode = ConfigValues.env();
  const loaded = ConfigValues.secretsFor(mode);
  if (!loaded.ok) {
    return { error: loaded.error, ok: false as const };
  }

  const { bucket, sdk } = clientFrom(loaded.value);

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
            {
              AllowedHeaders: [`*`],
              AllowedMethods: [`GET`],
              AllowedOrigins: [ConfigValues.origin(mode)],
              MaxAgeSeconds: Config.s3CorsMaxAgeSec,
            },
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
  const key = (path: string) => `public/${userId}/${path}`;

  const putPng = async (path: string, src: Buffer | string) => {
    urlCache.remove(key(path));

    return withClient(async ({ bucket, sdk }) =>
      sdk.send(
        new PutObjectCommand({
          Body: _.isString(src) ? Buffer.from(src.split(`,`)[1] ?? ``, `base64`) : src,
          Bucket: bucket,
          CacheControl: `public, max-age=${Config.s3SignedUrlTtlSec}`,
          ContentType: `image/png`,
          Key: key(path),
        }),
      ),
    );
  };

  const remove = async (path: string) => {
    urlCache.remove(key(path));

    return withClient(async ({ bucket, sdk }) => sdk.send(new DeleteObjectCommand({ Bucket: bucket, Key: key(path) })));
  };

  const url = async (path: string) => {
    const objectKey = key(path);
    const now = _.now();
    const entry = urlCache.get(objectKey);

    if (entry !== undefined && entry.expiresAt > now) {
      return entry.url;
    }

    urlCache.prune(({ expiresAt }) => expiresAt > now);

    return urlCache.set(objectKey, {
      expiresAt: now + Config.s3SignedUrlTtlSec * _.second - Config.s3UrlCacheMarginMs,
      url: await withClient(async ({ bucket, sdk }) =>
        getSignedUrl(sdk, new GetObjectCommand({ Bucket: bucket, Key: objectKey }), {
          expiresIn: Config.s3SignedUrlTtlSec,
        }),
      ),
    }).url;
  };

  const purge = async () =>
    withClient(async ({ bucket, sdk }) => {
      const page = async (token?: string) => {
        const listed = await sdk.send(
          new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token, Prefix: key(``) }),
        );

        const keys = (listed.Contents ?? []).map(item => item.Key).filter((item): item is string => item !== undefined);

        if (keys.length > 0) {
          await sdk.send(
            new DeleteObjectsCommand({
              Bucket: bucket,
              Delete: {
                Objects: keys.map(objectKey => {
                  urlCache.remove(objectKey);

                  return { Key: objectKey };
                }),
                Quiet: true,
              },
            }),
          );
        }

        if (listed.IsTruncated === true) {
          await page(listed.NextContinuationToken);
        }
      };

      await page();
    });

  return { id: userId, purge, putPng, remove, url };
};

export const S3Core = { setup, user };

export type S3Core = typeof S3Core;

export type S3CoreSetupResult = Awaited<ReturnType<typeof setup>>;

export type S3CoreUser = ReturnType<typeof user>;
