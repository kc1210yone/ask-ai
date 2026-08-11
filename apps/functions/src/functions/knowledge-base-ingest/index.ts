import type { Context } from 'aws-lambda';
import { startIngestion } from './bedrock-client.js';

export const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<void> => {
  await startIngestion();
};
