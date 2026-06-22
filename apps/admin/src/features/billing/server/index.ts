import 'server-only';
import type { Subscription } from '@internal/rdb/generated/prisma/client.js';
import { prisma } from '@internal/rdb/index.js';
import { cache } from 'react';

// ユーザーIDに紐づくサブスクリプションを取得する
export const findSubscription = cache(
  async (userId: string): Promise<Subscription | null> => {
    return await prisma.subscription.findUnique({
      where: { userId },
    });
  },
);
