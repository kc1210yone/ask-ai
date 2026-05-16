import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl = new URL(process.env['DATABASE_URL'] ?? 'invalid://');
databaseUrl.password = process.env['DATABASE_PASSWORD'] ?? '';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: databaseUrl.href,
  },
});
