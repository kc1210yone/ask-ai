'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { revalidatePath } from 'next/cache';
import { FormSchema, type FormSchemaType } from './types';
import { getAuthUserOrRedirect } from '#src/features/auth';
import {
  findSubscription,
  isSubscriptionActive,
  FREE_PLAN_ITEM_LIMIT,
} from '#src/features/billing';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

interface ActionResponse {
  status: 'ok' | 'error' | 'limit_exceeded';
}

export const formAction = async (
  projectId: string,
  formData: FormSchemaType,
): Promise<ActionResponse> => {
  if (!FormSchema.safeParse(formData).success) {
    serverLogger.warn('Bad request.');
    return {
      status: 'error',
    };
  }

  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    serverLogger.warn('Invalid project.');
    return {
      status: 'error',
    };
  }

  const subscription = await findSubscription(user.id);
  if (!isSubscriptionActive(subscription)) {
    const faqCount = await prisma.faq.count({
      where: { projectId, deletedAt: null },
    });
    if (faqCount >= FREE_PLAN_ITEM_LIMIT) {
      serverLogger.warn('無料プランのFAQ登録上限に達しています。', {
        projectId,
      });
      return {
        status: 'limit_exceeded',
      };
    }
  }

  await prisma.faq.create({
    data: {
      projectId,
      question: formData.question,
      answer: formData.answer,
    },
  });

  revalidatePath(`/projects/${projectId}/faqs`);

  return {
    status: 'ok',
  };
};
