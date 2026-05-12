import type { NextConfig } from 'next';

export default {
  reactCompiler: true,
  // TODO
  serverExternalPackages: ['@prisma/client', '@prisma/engines', '@internal/db'],
} satisfies NextConfig;
