import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ComponentForm } from './component-form';
import { Button } from '#src/components/ui/button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import {
  findSubscription,
  isSubscriptionActive,
  FREE_PLAN_ITEM_LIMIT,
} from '#src/features/billing';
import { findUserOrRedirect } from '#src/features/users';

interface Props {
  projectId: string;
}

export const FaqCreatePage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const subscription = await findSubscription(user.id);

  let isLimitExceeded = false;
  if (!isSubscriptionActive(subscription)) {
    const faqCount = await prisma.faq.count({
      where: { projectId, deletedAt: null },
    });
    isLimitExceeded = faqCount >= FREE_PLAN_ITEM_LIMIT;
  }

  return (
    <>
      <h2 className="text-xl font-semibold">FAQ作成</h2>
      <p className="text-muted-foreground mt-4">
        FAQは、AIアシスタントが参照する質問と回答のペアです。
      </p>
      {isLimitExceeded ? (
        <div className="bg-muted mt-8 space-y-4 rounded-md p-4">
          <p className="text-sm">
            無料プランでは、FAQは1プロジェクトあたり{FREE_PLAN_ITEM_LIMIT}
            件までしか登録できません。さらに登録するには、プランのアップグレードが必要です。
          </p>
          <Button asChild>
            <Link href="/billing">課金ページへ</Link>
          </Button>
        </div>
      ) : (
        <ComponentForm projectId={projectId} className="mt-8" />
      )}
    </>
  );
};
