import { MethodNotAllowedException, NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { BillboardPayload } from '../schemas';

export class BillboardService {
  public findMany = async ({ shopId }: { shopId: string }) => {
    return await db.billboard.findMany({
      where: {
        shopId,
      },
    });
  };

  public findUnique = async ({ shopId, billboardId }: { shopId: string; billboardId: string }) => {
    const billboard = await db.billboard.findUnique({
      where: {
        shopId,
        id: billboardId,
      },
    });

    if (!billboard) {
      throw new NotFoundException('Billboard not found');
    }

    return billboard;
  };

  public create = async (payload: BillboardPayload, { ownerId, shopId }: { ownerId: string; shopId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.billboard.create({
      data: {
        shopId,
        ...payload,
      },
    });
  };

  public update = async (
    payload: BillboardPayload,
    { ownerId, shopId, billboardId }: { ownerId: string; shopId: string; billboardId: string },
  ) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.billboard.update({
      where: {
        id: billboardId,
      },
      data: payload,
    });
  };

  public delete = async ({
    ownerId,
    shopId,
    billboardId,
  }: {
    ownerId: string;
    shopId: string;
    billboardId: string;
  }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.billboard.delete({
      where: {
        shopId,
        id: billboardId,
      },
    });
  };
}
