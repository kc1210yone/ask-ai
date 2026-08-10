import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';
import type Stripe from 'stripe';
import { stripe } from './stripe-client.js';
import {
  handleCheckoutSessionCompleted,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from './subscriptions.js';
import { logger } from '#src/lib/logger/index.js';

// Stripe WebhookをLambda Function URL / API Gatewayで受け取るHandler
export const handler = async (
  event: APIGatewayProxyEventV2,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const signature = event.headers['stripe-signature'];
  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'stripe-signatureヘッダーがありません。' }),
    };
  }

  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET が設定されていません。');
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf-8')
    : (event.body ?? '');

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    logger.warn('Stripe Webhook署名の検証に失敗しました。', { error });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '署名が無効です。' }),
    };
  }

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      await handleCheckoutSessionCompleted(stripeEvent.data.object);
    } else if (stripeEvent.type === 'customer.subscription.updated') {
      await handleSubscriptionUpdated(stripeEvent.data.object);
    } else if (stripeEvent.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(stripeEvent.data.object);
    }
  } catch (error) {
    logger.error('Stripe Webhookの処理中にエラーが発生しました。', {
      eventType: stripeEvent.type,
      error,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhookの処理に失敗しました。' }),
    };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
