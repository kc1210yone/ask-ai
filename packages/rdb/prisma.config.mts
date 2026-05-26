import 'dotenv/config';
import assert from 'node:assert/strict';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { defineConfig } from 'prisma/config';
import { z } from 'zod';

const secretsManagerClient = new SecretsManagerClient();

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

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: await getDatabaseUrl(),
  },
});
