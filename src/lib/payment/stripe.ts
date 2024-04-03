import Stripe from 'stripe';

import configEnv from '@/config';

export const stripe = new Stripe(configEnv.get('stripeAPIKey'), {
  apiVersion: '2023-10-16',
  typescript: true,
});
