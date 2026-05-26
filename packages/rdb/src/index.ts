import assert from 'node:assert/strict';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { z } from 'zod';
import { PrismaClient } from './generated/prisma/client.js';

const secretsManagerClient = new SecretsManagerClient();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = async (): Promise<PrismaClient> => {
  const databaseUrl = await getDatabaseUrl();
  const adapter = new PrismaMariaDb(databaseUrl);
  return new PrismaClient({ adapter });
};

const getDatabaseUrl = async (): Promise<string> => {
  // Next.jsのビルドやprisma generateのときはDATABASE_URL不要
  if (!process.env['DATABASE_URL']) {
    return '';
  }

  const databaseUrl = new URL(process.env['DATABASE_URL']);

  const credentials = await getCredentials();
  databaseUrl.username = credentials.username;
  databaseUrl.password = credentials.password;

  return databaseUrl.href;
};

const getCredentials = async (): Promise<{
  username: string;
  password: string;
}> => {
  const databaseCredentialsSecret = process.env['DATABASE_CREDENTIALS_SECRET'];
  assert(databaseCredentialsSecret);

  const response = await secretsManagerClient.send(
    new GetSecretValueCommand({
      SecretId: databaseCredentialsSecret,
    }),
  );
  const secretString = response.SecretString;
  assert(secretString);

  return z
    .object({ username: z.string(), password: z.string() })
    .parse(JSON.parse(secretString));
};

export const prisma = globalForPrisma.prisma ?? (await createPrismaClient());

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
