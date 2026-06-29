/* eslint-disable init-declarations */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Config, ConfigValues, SecretKeys, type SecretValues } from "@snappy/config";
import { _, MimeType } from "@snappy/core";
import { Readable } from "node:stream";

const clientFrom = (source: SecretValues) => ({
  bucket: ConfigValues.required(source, SecretKeys.s3Bucket),
  sdk: new S3Client({
    credentials: {
      accessKeyId: ConfigValues.required(source, SecretKeys.s3AccessKey),
      secretAccessKey: ConfigValues.required(source, SecretKeys.s3SecretKey),
    },
    endpoint: `https://s3.regru.cloud`,
    forcePathStyle: true,
    region: `ru-1`,
  }),
});

let cached: ReturnType<typeof clientFrom> | undefined;

const withClient = async <T>(fn: (client: ReturnType<typeof clientFrom>) => Promise<T>) => {
  cached ??= clientFrom(ConfigValues.values());

  return fn(cached);
};

const user = (userId: string) => {
  const key = (path: string) => `public/${userId}/${path}`;

  const putPng = async (path: string, src: Buffer | string) =>
    withClient(async ({ bucket, sdk }) =>
      sdk.send(
        new PutObjectCommand({
          Body: _.isString(src) ? Buffer.from(src.split(`,`)[1] ?? ``, `base64`) : src,
          Bucket: bucket,
          CacheControl: `private, max-age=${Config.s3ObjectMaxAgeSec}, immutable`,
          ContentType: MimeType.imagePng,
          Key: key(path),
        }),
      ),
    );

  const stream = async (path: string) =>
    withClient(async ({ bucket, sdk }) => {
      const result = await sdk.send(new GetObjectCommand({ Bucket: bucket, Key: key(path) }));
      const body = result.Body;

      if (body === undefined || !(body instanceof Readable)) {
        return undefined;
      }

      return body;
    });

  const remove = async (path: string) =>
    withClient(async ({ bucket, sdk }) => sdk.send(new DeleteObjectCommand({ Bucket: bucket, Key: key(path) })));

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
              Delete: { Objects: keys.map(objectKey => ({ Key: objectKey })), Quiet: true },
            }),
          );
        }

        if (listed.IsTruncated === true) {
          await page(listed.NextContinuationToken);
        }
      };

      await page();
    });

  return { id: userId, purge, putPng, remove, stream };
};

export const S3Core = { user };

export type S3Core = typeof S3Core;

export type S3CoreUser = ReturnType<typeof user>;
