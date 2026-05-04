/**
 * 動作確認用
 */

import 'dotenv/config';
import type { Context } from 'aws-lambda';
import { handler as ingestHandler } from './ingest/index.js';
// import { handler as uploadKnowledgeBaseHandler } from './upload-knowledge-base/index.js';

// await uploadKnowledgeBaseHandler(
//   {
//     projectId: 'cmor7fsyt00025yqj23jbjqcq',
//   },
//   {} as Context,
// );

await ingestHandler({}, {} as Context);
