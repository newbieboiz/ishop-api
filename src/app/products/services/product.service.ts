import { MethodNotAllowedException, NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { ProductPayload } from '../schemas';

export class ProductService {
  public findMany = async ({ shopId }: { shopId: string }) => {
    return await db.product.findMany({
      where: {
        shopId,
      },
      include: {
        category: true,
        brand: true,
      },
    });
  };

  public findUnique = async ({ shopId, productId }: { shopId: string; productId: string }) => {
    const product = await db.product.findUnique({
      where: {
        shopId,
        id: productId,
      },
      include: {
        category: true,
        brand: true,
        productItems: {
          include: {
            configurations: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  };

  public create = async (payload: ProductPayload, { userId, shopId }: { userId: string; shopId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.product.create({
      data: {
        shopId,
        ...payload,
        productItems: {
          create: payload.productItems?.map((item) => ({
            ...item,
            configurations: {
              connect: item.configurations.map(({ variantOptionId }) => ({
                id: variantOptionId,
              })),
            },
          })),
        },
      },
    });
  };

  public update = async (
    payload: Omit<ProductPayload, 'productItems'>,
    { userId, shopId, productId }: { userId: string; shopId: string; productId: string },
  ) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.product.update({
      where: {
        shopId,
        id: productId,
      },
      data: {
        ...payload,
      },
    });
  };

  public delete = async ({ userId, shopId, productId }: { userId: string; shopId: string; productId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.product.delete({
      where: {
        shopId,
        id: productId,
      },
    });
  };

  public countStock = async ({ shopId }: { shopId: string }) => {
    return await db.product.count({
      where: {
        shopId,
      },
    });
  };
}
