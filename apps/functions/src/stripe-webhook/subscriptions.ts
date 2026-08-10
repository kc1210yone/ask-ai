import assert from 'node:assert/strict';
import { prisma } from '@internal/rdb/index.js';
import type Stripe from 'stripe';
import { stripe } from './stripe-client.js';
import { logger } from '#src/lib/logger/index.js';

// Stripe v22ではcurrent_period_start/endはSubscriptionItemに移動したため、最初のアイテムから取得する
const getPeriodFromSubscription = (
  subscription: Stripe.Subscription,
): { currentPeriodStart: Date; currentPeriodEnd: Date } => {
  const firstItem = subscription.items.data[0];
  assert(firstItem, 'サブスクリプションにアイテムが存在しません。');
  return {
    currentPeriodStart: new Date(firstItem.current_period_start * 1000),
    currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
  };
};

// チェックアウト完了時にサブスクリプションをDBへ保存する
export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
): Promise<void> => {
  if (!session.subscription || !session.customer) {
    logger.warn(
      'checkout.session.completedにsubscriptionまたはcustomerが存在しません。',
      { sessionId: session.id },
    );
    return;
  }

  const stripeSubscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id;

  const stripeCustomerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;

  const subscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId },
  });

  if (!user) {
    logger.warn('Stripe顧客IDに対応するユーザーが見つかりません。', {
      stripeCustomerId,
    });
    return;
  }

  const { currentPeriodStart, currentPeriodEnd } =
    getPeriodFromSubscription(subscription);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId,
      status: subscription.status,
      currentPeriodStart,
      currentPeriodEnd,
    },
    update: {
      stripeSubscriptionId,
      status: subscription.status,
      currentPeriodStart,
      currentPeriodEnd,
    },
  });

  logger.info('サブスクリプションをDBに保存しました。', {
    userId: user.id,
    stripeSubscriptionId,
    status: subscription.status,
  });
};

// サブスクリプション更新時にDBの状態を同期する
export const handleSubscriptionUpdated = async (
  subscription: Stripe.Subscription,
): Promise<void> => {
  const { currentPeriodStart, currentPeriodEnd } =
    getPeriodFromSubscription(subscription);

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart,
      currentPeriodEnd,
    },
  });

  logger.info('サブスクリプションのDBレコードを更新しました。', {
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
  });
};

// サブスクリプションキャンセル時にDBの状態をcanceledに更新する
export const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription,
): Promise<void> => {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
    },
  });

  logger.info('サブスクリプションをキャンセル済みに更新しました。', {
    stripeSubscriptionId: subscription.id,
  });
};
