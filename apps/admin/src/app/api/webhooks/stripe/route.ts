import { prisma } from '@internal/rdb/index.js';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import invariant from 'tiny-invariant';
import { serverLogger } from '#src/lib/logger';

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
invariant(stripeSecretKey, 'STRIPE_SECRET_KEY が設定されていません。');
const stripe = new Stripe(stripeSecretKey);

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'stripe-signatureヘッダーがありません。' },
      { status: 400 },
    );
  }

  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];
  invariant(webhookSecret, 'STRIPE_WEBHOOK_SECRET が設定されていません。');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    serverLogger.warn('Stripe Webhook署名の検証に失敗しました。', { error });
    return NextResponse.json({ error: '署名が無効です。' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutSessionCompleted(event.data.object);
    } else if (event.type === 'customer.subscription.updated') {
      await handleSubscriptionUpdated(event.data.object);
    } else if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object);
    }
  } catch (error) {
    serverLogger.error('Stripe Webhookの処理中にエラーが発生しました。', {
      eventType: event.type,
      error,
    });
    return NextResponse.json(
      { error: 'Webhookの処理に失敗しました。' },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
};

// Stripe v22ではcurrent_period_start/endはSubscriptionItemに移動したため、最初のアイテムから取得する
const getPeriodFromSubscription = (
  subscription: Stripe.Subscription,
): { currentPeriodStart: Date; currentPeriodEnd: Date } => {
  const firstItem = subscription.items.data[0];
  invariant(firstItem, 'サブスクリプションにアイテムが存在しません。');
  return {
    currentPeriodStart: new Date(firstItem.current_period_start * 1000),
    currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
  };
};

// チェックアウト完了時にサブスクリプションをDBへ保存する
const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
): Promise<void> => {
  if (!session.subscription || !session.customer) {
    serverLogger.warn(
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
    serverLogger.warn('Stripe顧客IDに対応するユーザーが見つかりません。', {
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

  serverLogger.info('サブスクリプションをDBに保存しました。', {
    userId: user.id,
    stripeSubscriptionId,
    status: subscription.status,
  });
};

// サブスクリプション更新時にDBの状態を同期する
const handleSubscriptionUpdated = async (
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

  serverLogger.info('サブスクリプションのDBレコードを更新しました。', {
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
  });
};

// サブスクリプションキャンセル時にDBの状態をcanceledに更新する
const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription,
): Promise<void> => {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
    },
  });

  serverLogger.info('サブスクリプションをキャンセル済みに更新しました。', {
    stripeSubscriptionId: subscription.id,
  });
};
