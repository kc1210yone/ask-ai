import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// CIでDATABASE_URLがセットされていなくてもprisma generateが動くようにする。
process.env['DATABASE_URL'] = process.env['DATABASE_URL'] ?? 'dummy';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
