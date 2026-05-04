/**
 * 動作確認用
 */

import type { Context } from 'aws-lambda';
import { handler as uploadKnowledgeBaseHandler } from './upload-knowledge-base/index.js';

await uploadKnowledgeBaseHandler(
  {
    projectId: 'cmor7fsyt00025yqj23jbjqcq',
  },
  {} as Context,
);
