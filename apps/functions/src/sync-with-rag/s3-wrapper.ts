import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const BUCKET = 'ask-ai-knowledge-base-953334885917-ap-northeast-1-an';

const s3 = new S3Client();

export const listObjects = async (
  prefix: string,
): Promise<Map<string, Date>> => {
  const map = new Map<string, Date>();
  let continuationToken: string | undefined;

  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    for (const obj of response.Contents ?? []) {
      if (obj.Key && obj.LastModified) {
        map.set(obj.Key, obj.LastModified);
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return map;
};

export const putObject = async (key: string, body: string): Promise<void> => {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: 'text/plain',
    }),
  );
};

export const deleteObject = async (key: string): Promise<void> => {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
};
