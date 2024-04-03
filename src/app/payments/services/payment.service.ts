import Stripe from 'stripe';

import configEnv from '@/config';
import db from '@/lib/database';
import { stripe } from '@/lib/payment/stripe';

import { CheckoutPayload } from '../schemas';

export class PaymentService {
  private readonly appStoreUrl = configEnv.get('appStoreURL');

  public checkout = async (payload: CheckoutPayload, { shopId }: { shopId: string }) => {
    // check validity of products
    const productItems = await db.productItem.findMany({
      where: {
        SKU: {
          in: payload.items.map(({ SKU }) => SKU),
        },
      },
      include: {
        product: true,
        configurations: true,
      },
    });

    // create billing
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    productItems.forEach((productItem) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: productItem.product.name,
          },
          unit_amount: productItem.price.toNumber() * 100,
        },
      });
    });

    // save the unpaid order
    const order = await db.order.create({
      data: {
        shopId,
        // customerName: '',
        // customerPhone: '',
        // addressLine: '',
        // addressId: '',
        // districtCode: '',
        // provinceCode: '',
        // note: '',
        // shippingMethodId: '',
        // orderStatusId: '',
        // orderTotal: '',
        isPaid: false,
        orderLine: {
          create: payload.items.map(({ SKU, qty }) => ({
            productItem: {
              connect: {
                SKU,
              },
            },
            qty,
          })),
        },
      },
    });

    // send payment's info to third party payment
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      currency: 'usd',
      success_url: `${this.appStoreUrl}/cart?success=1`,
      cancel_url: `${this.appStoreUrl}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return {
      callbackUrl: checkoutSession.url,
    };
  };

  public pay = async ({ orderId }: { orderId: string }) => {
    const order = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
      },
      include: {
        orderLines: true,
      },
    });

    for (const orderLine of order.orderLines) {
      await db.productItem.updateMany({
        where: {
          id: orderLine.productItemId,
        },
        data: {
          qtyInStock: {
            decrement: orderLine.qty,
          },
        },
      });
    }
  };
}
