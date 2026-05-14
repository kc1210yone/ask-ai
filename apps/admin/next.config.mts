import type { NextConfig } from 'next';

export default {
  reactCompiler: true,
  serverExternalPackages: ['@internal/db'],
} satisfies NextConfig;
