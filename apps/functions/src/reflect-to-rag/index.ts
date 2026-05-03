import 'dotenv/config';
import assert from 'node:assert/strict';
import { prisma } from '@internal/db/index.js';
import type { Context } from 'aws-lambda';
import { z } from 'zod';

const EventSchema = z.object({
  projectId: z.string(),
});

export const handler = async (
  event: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<void> => {
  const parsedEvent = EventSchema.parse(event);

  const project = await prisma.project.findUnique({
    where: { id: parsedEvent.projectId },
  });
  assert(project);

  const documents = await prisma.document.findMany({
    where: { projectId: project.id },
  });

  const faqs = await prisma.faq.findMany({
    where: { projectId: project.id },
  });
};

// const S3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
//
// // ローカルのファイルを読み込んでS3にアップロードします
// // *srcPath: ローカルに保存しているファイルのパス
// // *fileName: S3でファイル名を決める
// // *バッケット名
//
// const uploadLocalFileToS3 = async (srcPath, fileName, bucketName) => {
//   //ストリームを開ける
//   const readStream = fs.createReadStream(srcPath);
//   try {
//     const command = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: fileName,
//       Body: readStream,
//     });
//     await S3.send(command);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     //ストリームを閉める
//     readStream.close();
//   }
// };
//
// uploadLocalFileToS3('./for-demo.png', 'test1.png', DEMO_BUCKET);
//
// const downloadFileFromS3ToLocal = async (desPath, fileName, bucketName) => {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: bucketName,
//       Key: fileName,
//     });
//     const response = await S3.send(command);
//     response.Body.pipe(fs.createWriteStream(desPath))
//       .on('error', (error) => {
//         throw error;
//       })
//       .on('close', () => {
//         console.log('completed');
//       });
//   } catch (error) {
//     console.log('error', error);
//   }
// };
//
// downloadFileFromS3ToLocal(
//   './downloaded/image_s3.png',
//   'test1.png',
//   DEMO_BUCKET,
// );
//
