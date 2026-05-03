/**
 * 動作確認用
 */

import type { Context } from 'aws-lambda';
import { handler as syncWithRagHandler } from './sync-with-rag/index.js';

await syncWithRagHandler(
  {
    projectId: 'cmomg4ait0002afqjw2ggflj4',
  },
  {} as Context,
);
