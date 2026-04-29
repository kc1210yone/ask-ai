import 'server-only';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import invariant from 'tiny-invariant';
import { PrismaClient } from '#src/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = (): PrismaClient => {
  const databaseUrl = process.env['DATABASE_URL'];
  invariant(databaseUrl);
  const adapter = new PrismaMariaDb(databaseUrl);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
