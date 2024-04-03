import { NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { ShopPayload } from '../schemas';

export class ShopService {
  public findMany = async ({ ownerId }: { ownerId: string }) => {
    return await db.shop.findMany({
      where: {
        userId: ownerId,
      },
    });
  };

  public findFirst = async ({ ownerId }: { ownerId: string }) => {
    const shop = await db.shop.findFirst({
      where: {
        userId: ownerId,
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  };

  public findUnique = async ({ ownerId, shopId }: { ownerId: string; shopId: string }) => {
    const shop = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  };

  public create = async (payload: ShopPayload, { ownerId }: { ownerId: string }) => {
    return await db.shop.create({
      data: {
        userId: ownerId,
        ...payload,
      },
    });
  };

  public update = async (payload: ShopPayload, { ownerId, shopId }: { ownerId: string; shopId: string }) => {
    return await db.shop.update({
      where: {
        userId: ownerId,
        id: shopId,
      },
      data: payload,
    });
  };

  public delete = async ({ ownerId, shopId }: { ownerId: string; shopId: string }) => {
    return await db.shop.delete({
      where: { userId: ownerId, id: shopId },
    });
  };
}
