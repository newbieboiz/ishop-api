import { MethodNotAllowedException, NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { ProductItemPayload } from '../schemas';

export class ProductItemService {
  public findMany = async ({ productId }: { productId?: string }) => {
    return await db.productItem.findMany({
      where: {
        productId,
      },
    });
  };

  public findUnique = async ({ SKU }: { SKU: string }) => {
    const productItem = await db.productItem.findUnique({
      where: {
        SKU,
      },
      include: {
        configurations: true,
      },
    });

    if (!productItem) {
      throw new NotFoundException(`Product item ${SKU} not found`);
    }

    return productItem;
  };

  public create = async (
    payload: ProductItemPayload,
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

    return await db.productItem.create({
      data: {
        ...payload,
        productId,
        configurations: {
          connect: payload.configurations.map(({ variantOptionId }) => ({
            id: variantOptionId,
          })),
        },
      },
    });
  };

  public update = async (
    payload: ProductItemPayload,
    { userId, shopId, productItemId }: { userId: string; shopId: string; productItemId: string },
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

    const updatedProductItem = await db.productItem.update({
      where: {
        id: productItemId,
      },
      data: {
        ...payload,
        configurations: {
          connect: payload.configurations.map(({ variantOptionId }) => ({
            id: variantOptionId,
          })),
        },
      },
    });

    return updatedProductItem;
  };

  public delete = async ({
    userId,
    shopId,
    productItemId,
  }: {
    userId: string;
    shopId: string;
    productItemId: string;
  }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.productItem.delete({
      where: {
        id: productItemId,
      },
    });
  };
}
