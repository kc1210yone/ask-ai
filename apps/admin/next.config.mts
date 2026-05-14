import type { NextConfig } from 'next';

export default {
  reactCompiler: true,
  serverExternalPackages: ['@internal/rdb'],
} satisfies NextConfig;
