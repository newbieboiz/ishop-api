import { MethodNotAllowedException, NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { CategoryPayload } from '../schemas';

export class CategoryService {
  public findMany = async ({ shopId }: { shopId: string }) => {
    return await db.category.findMany({
      where: { shopId, parentCategoryId: null },
      include: {
        subCategories: true,
      },
    });
  };

  public findUnique = async ({ shopId, categoryId }: { shopId: string; categoryId: string }) => {
    const category = await db.category.findUnique({
      where: { shopId, id: categoryId },
      include: {
        subCategories: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  };

  public create = async (payload: CategoryPayload, { ownerId, shopId }: { ownerId: string; shopId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.category.create({
      data: {
        shopId,
        ...payload,
      },
    });
  };

  public update = async (
    payload: CategoryPayload,
    { ownerId, shopId, categoryId }: { ownerId: string; shopId: string; categoryId: string },
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

    return await db.category.update({
      where: {
        id: categoryId,
      },
      data: payload,
    });
  };

  public delete = async ({ ownerId, shopId, categoryId }: { ownerId: string; shopId: string; categoryId: string }) => {
    const shopByOwner = await db.shop.findUnique({
      where: {
        userId: ownerId,
        id: shopId,
      },
    });

    if (!shopByOwner) {
      throw new MethodNotAllowedException('Not allowed!');
    }

    return await db.category.delete({
      where: {
        shopId,
        id: categoryId,
      },
    });
  };
}
