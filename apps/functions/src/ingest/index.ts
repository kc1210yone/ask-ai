import type { Context } from 'aws-lambda';
import { startIngestion, waitForIngestionFinish } from './bedrockWrapper.js';

export const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<void> => {
  const ingestionJobId = await startIngestion();
  await waitForIngestionFinish(ingestionJobId);
};
