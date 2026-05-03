/**
 * 動作確認用
 */

import type { Context } from 'aws-lambda';
import { handler as reflectToRagHandler } from './reflect-to-rag/index.js';

await reflectToRagHandler(
  {
    projectId: 'cmomg4ait0002afqjw2ggflj4',
  },
  {} as Context,
);
