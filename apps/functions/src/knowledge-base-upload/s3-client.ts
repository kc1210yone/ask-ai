import assert from 'node:assert/strict';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const BUCKET = 'ask-ai-knowledge-base-953334885917-us-east-1-an';

const s3Client = new S3Client({ region: 'us-east-1' });

export interface ListObjectsItem {
  key: string;
  lastModified: Date;
}

export const listObjects = async (
  prefix: string,
): Promise<Record<string, ListObjectsItem>> => {
  const result: Record<string, ListObjectsItem> = {};
  let continuationToken: string | undefined;
  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    (response.Contents ?? []).reduce((accumulator, c) => {
      assert(c.Key);
      assert(c.LastModified);
      accumulator[c.Key] = {
        key: c.Key,
        lastModified: c.LastModified,
      };
      return accumulator;
    }, result);
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  return result;
};

export const putObject = async (key: string, body: string): Promise<void> => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: 'text/plain',
    }),
  );
};

export const deleteObjects = async (keys: string[]): Promise<void> => {
  const chunkSize = 1000;
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunkedKeys = keys.slice(i, i + chunkSize);
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: {
          Objects: chunkedKeys.map((k) => ({ Key: k })),
        },
      }),
    );
  }
};
