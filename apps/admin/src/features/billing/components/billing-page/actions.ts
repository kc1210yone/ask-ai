'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import invariant from 'tiny-invariant';
import { findSubscription } from '../../server';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
invariant(stripeSecretKey, 'STRIPE_SECRET_KEY が設定されていません。');
const stripe = new Stripe(stripeSecretKey);

interface ActionResponse {
  status: 'ok' | 'error';
}

// Stripe Checkoutセッションを作成してStripeのチェックアウトページへリダイレクトする
export const createCheckoutSessionAction = async (): Promise<never> => {
  const appUrl = process.env['APP_URL'];
  invariant(appUrl, 'APP_URL が設定されていません。');

  const priceId = process.env['STRIPE_PRICE_ID'];
  invariant(priceId, 'STRIPE_PRICE_ID が設定されていません。');

  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  // Stripe顧客IDを取得、未作成の場合は新規作成してDBに保存
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: authUser.username,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${appUrl}/billing?success=true`,
    cancel_url: `${appUrl}/billing?canceled=true`,
  });

  serverLogger.info('Stripe Checkoutセッションを作成しました。', {
    sessionId: session.id,
    userId: user.id,
  });

  invariant(
    session.url,
    'Stripe CheckoutセッションのURLが取得できませんでした。',
  );
  redirect(session.url);
};

// サブスクリプションを現在の契約期間の終了時に解約する
export const cancelSubscriptionAction = async (): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const subscription = await findSubscription(user.id);
  if (!subscription) {
    serverLogger.warn('Subscription not found.');
    return { status: 'error' };
  }

  try {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    serverLogger.error('サブスクリプションの解約に失敗しました。', {
      error,
      userId: user.id,
    });
    return { status: 'error' };
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: true },
  });

  serverLogger.info('サブスクリプションの解約を予約しました。', {
    userId: user.id,
  });

  revalidatePath('/billing');

  return { status: 'ok' };
};

// 現在の契約期間の終了時の解約予約を取り消す
export const resumeSubscriptionAction = async (): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const subscription = await findSubscription(user.id);
  if (!subscription) {
    serverLogger.warn('Subscription not found.');
    return { status: 'error' };
  }

  try {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    serverLogger.error(
      'サブスクリプションの解約予約の取り消しに失敗しました。',
      {
        error,
        userId: user.id,
      },
    );
    return { status: 'error' };
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: false },
  });

  serverLogger.info('サブスクリプションの解約予約を取り消しました。', {
    userId: user.id,
  });

  revalidatePath('/billing');

  return { status: 'ok' };
};
