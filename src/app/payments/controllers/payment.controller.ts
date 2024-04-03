import { NextFunction, Request, Response, Router } from 'express';
import Stripe from 'stripe';

import { HttpStatusCodes } from '@/common/constants';
import { InternalServerException } from '@/common/exceptions';
import configEnv from '@/config';
import { stripe } from '@/lib/payment/stripe';
import { payloadValidator } from '@/lib/validator/payload-validator';

import { CheckoutPayload, CheckoutPayloadSchema } from '../schemas';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  public path = '/:shopId/payment';
  public router = Router();
  private paymentService = new PaymentService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/checkout`, payloadValidator(CheckoutPayloadSchema), this.checkout);
    this.router.post(`${this.path}/webhook`, this.webhook);
  }

  public checkout = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const payload: CheckoutPayload = {
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      addressLine: req.body.addressLine,
      addressId: req.body.addressId,
      note: req.body.note,
      items: req.body.items,
    };

    try {
      const checkoutData = await this.paymentService.checkout(payload, { shopId });
      res.status(HttpStatusCodes.CREATED).send(checkoutData);
    } catch (error) {
      next(error);
    }
  };

  public webhook = async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, configEnv.get('stripeWebhookSecret'));
    } catch (error: any) {
      res.status(HttpStatusCodes.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
      return;
    }

    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    if (!checkoutSession.customer_details || !checkoutSession.metadata) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Webhook Error: Payment failure');
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        await this.paymentService.pay({ orderId: checkoutSession.metadata.orderId });
        res.status(HttpStatusCodes.CREATED).send('Payment success!');
        return;
      }

      throw new InternalServerException('Webhook Error: Payment failure');
    } catch (error) {
      next(error);
    }
  };
}
