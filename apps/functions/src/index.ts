/**
 * 動作確認用
 */

import type { Context } from 'aws-lambda';
import { handler as syncWithRagHandler } from './sync-with-rag/index.js';

await syncWithRagHandler(
  {
    projectId: 'cmor7fsyt00025yqj23jbjqcq',
  },
  {} as Context,
);
