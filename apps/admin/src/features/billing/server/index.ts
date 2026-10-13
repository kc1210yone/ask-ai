import 'server-only';
import type { Subscription } from '@internal/rdb/generated/prisma/client.js';
import { prisma } from '@internal/rdb/index.js';
import { cache } from 'react';

// 無料プランでプロジェクトごとに登録できるFAQ・Documentの上限数
export const FREE_PLAN_ITEM_LIMIT = 5;

// ユーザーIDに紐づくサブスクリプションを取得する
export const findSubscription = cache(
  async (userId: string): Promise<Subscription | null> => {
    return await prisma.subscription.findUnique({
      where: { userId },
    });
  },
);

// サブスクリプションが課金中（有効）かどうかを判定する
export const isSubscriptionActive = (
  subscription: Subscription | null,
): boolean => {
  return subscription?.status === 'active';
};
