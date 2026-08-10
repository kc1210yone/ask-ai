'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import invariant from 'tiny-invariant';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
invariant(stripeSecretKey, 'STRIPE_SECRET_KEY が設定されていません。');
const stripe = new Stripe(stripeSecretKey);

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
