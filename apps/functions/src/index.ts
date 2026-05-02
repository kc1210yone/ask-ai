import 'dotenv/config';
import type { Context } from 'aws-lambda';

export const handler = async (
  event: unknown,
  context: Context,
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(event, context);
};
