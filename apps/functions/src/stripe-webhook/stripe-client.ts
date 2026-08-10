import assert from 'node:assert/strict';
import Stripe from 'stripe';

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
assert(stripeSecretKey, 'STRIPE_SECRET_KEY が設定されていません。');

export const stripe = new Stripe(stripeSecretKey);
