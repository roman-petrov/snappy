/* eslint-disable init-declarations */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Config } from "@snappy/config";

import { S3CoreRuntime } from "./S3CoreRuntime";
import { S3CoreSetup } from "./S3CoreSetup";

const { publicPrefix, runtime } = S3CoreRuntime;
const prefix = (userId: string) => `${publicPrefix}/${userId}/`;
const objectKey = (userId: string, path: string) => `${prefix(userId)}${path}`;

const signedUrl = async (userId: string, path: string) => {
  const { bucket, sdk } = runtime();

  return getSignedUrl(sdk, new GetObjectCommand({ Bucket: bucket, Key: objectKey(userId, path) }), {
    expiresIn: Config.s3SignedUrlTtlSec,
  });
};

const put = async (userId: string, path: string, body: Buffer, contentType: string) => {
  const { bucket, sdk } = runtime();

  return sdk.send(
    new PutObjectCommand({ Body: body, Bucket: bucket, ContentType: contentType, Key: objectKey(userId, path) }),
  );
};

const remove = async (userId: string, path: string) =>
  runtime().sdk.send(new DeleteObjectCommand({ Bucket: runtime().bucket, Key: objectKey(userId, path) }));

const purge = async (userId: string) => {
  const { bucket, sdk } = runtime();
  const objectPrefix = prefix(userId);
  let continuationToken: string | undefined;

  do {
    const listed = await sdk.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken, Prefix: objectPrefix }),
    );

    const keys = (listed.Contents ?? []).map(item => item.Key).filter((key): key is string => key !== undefined);

    if (keys.length > 0) {
      await sdk.send(
        new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: keys.map(key => ({ Key: key })), Quiet: true } }),
      );
    }

    continuationToken = listed.IsTruncated === true ? listed.NextContinuationToken : undefined;
  } while (continuationToken !== undefined);
};

const user = (userId: string) => ({
  id: userId,
  purge: async () => purge(userId),
  put: async (path: string, body: Buffer, contentType: string) => put(userId, path, body, contentType),
  remove: async (path: string) => remove(userId, path),
  url: async (path: string) => signedUrl(userId, path),
});

export const S3Core = { publicPrefix, setup: S3CoreSetup.setup, user };

export type S3Core = typeof S3Core;

export type S3CoreUser = ReturnType<typeof user>;
