/**
 * 動作確認用
 */

import 'dotenv/config';
import type { Context } from 'aws-lambda';
import { handler as knowledgeBaseIngestHandler } from './knowledge-base-ingest/index.js';
import { handler as knowledgeBaseUploadHandler } from './knowledge-base-upload/index.js';

await knowledgeBaseUploadHandler(
  {
    projectId: 'cmp9d7hru0001072bgpmplwfl',
  },
  {} as Context,
);

await knowledgeBaseIngestHandler({}, {} as Context);
