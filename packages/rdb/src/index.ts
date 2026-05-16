import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = (): PrismaClient => {
  const databaseUrl = new URL(process.env['DATABASE_URL'] ?? 'invalid://');
  databaseUrl.password = process.env['DATABASE_PASSWORD'] ?? '';

  const adapter = new PrismaMariaDb(databaseUrl.href);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
