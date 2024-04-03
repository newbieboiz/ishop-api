import { NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { AddToCartPayload, RemoveToCartPayload } from '../schemas';

export class ShoppingCartService {
  public findUnique = async ({ userId }: { userId: string }) => {
    const shoppingCart = await db.shoppingCart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                configurations: true,
              },
            },
          },
        },
      },
    });

    if (!shoppingCart) {
      throw new NotFoundException('ShoppingCart not found');
    }

    return shoppingCart;
  };

  public addToCart = async (payload: AddToCartPayload, { userId }: { userId: string }) => {
    return await db.shoppingCart.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        items: {
          create: { productItemId: payload.productItemId, qty: payload.qty },
        },
      },
      update: {
        items: {
          upsert: {
            where: { cartItemId: { shoppingCartId: payload.shoppingCartId, productItemId: payload.productItemId } },
            create: { productItemId: payload.productItemId, qty: payload.qty },
            update: { qty: payload.qty },
          },
        },
      },
    });
  };

  public removeFromCart = async (payload: RemoveToCartPayload, { userId }: { userId: string }) => {
    return await db.shoppingCart.update({
      where: {
        userId,
      },
      data: {
        items: {
          delete: { cartItemId: { shoppingCartId: payload.shoppingCartId, productItemId: payload.productItemId } },
        },
      },
    });
  };

  public clearCart = async ({ userId }: { userId: string }) => {
    return await db.shoppingCart.delete({
      where: {
        userId,
      },
    });
  };
}
