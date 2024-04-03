import { MethodNotAllowedException, NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { BrandPayload } from '../schemas';

export class BrandService {
  public findMany = async ({ shopId }: { shopId: string }) => {
    return await db.brand.findMany({
      where: {
        shopId,
      },
    });
  };

  public findUnique = async ({ shopId, brandId }: { shopId: string; brandId: string }) => {
    const brand = await db.brand.findUnique({
      where: {
        shopId,
        id: brandId,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  };

  public create = async (payload: BrandPayload, { userId, shopId }: { userId: string; shopId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.brand.create({
      data: {
        shopId,
        ...payload,
      },
    });
  };

  public update = async (
    payload: BrandPayload,
    { userId, shopId, brandId }: { userId: string; shopId: string; brandId: string },
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

    return await db.brand.update({
      where: {
        id: brandId,
      },
      data: payload,
    });
  };

  public delete = async ({ userId, shopId, brandId }: { userId: string; shopId: string; brandId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.brand.delete({
      where: {
        shopId,
        id: brandId,
      },
    });
  };
}
