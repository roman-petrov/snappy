import { S3Core, type S3CoreUser } from "@snappy/s3-core";

export const S3 = S3Core;

export type S3 = typeof S3;

export type S3User = S3CoreUser;
