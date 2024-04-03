import { NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { VariantPayload } from '../schemas';

export class VariantService {
  public findMany = async ({ categoryId }: { categoryId: string }) => {
    return await db.variant.findMany({
      where: {
        categoryId,
      },
      include: {
        variantOptions: true,
      },
    });
  };

  public findUnique = async ({ categoryId, variantId }: { categoryId: string; variantId: string }) => {
    const variant = await db.variant.findUnique({
      where: { categoryId, id: variantId },
      include: {
        variantOptions: true,
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  };

  public create = async (payload: VariantPayload, { categoryId }: { categoryId: string }) => {
    return await db.variant.create({
      data: {
        categoryId,
        name: payload.name,
        variantOptions: {
          createMany: {
            data: payload.options,
          },
        },
      },
    });
  };

  public update = async (
    payload: VariantPayload,
    { categoryId, variantId }: { categoryId: string; variantId: string },
  ) => {
    const [, updatedVariant] = await db.$transaction([
      db.variant.update({
        where: {
          categoryId,
          id: variantId,
        },
        data: {
          name: payload.name,
          variantOptions: {
            deleteMany: {},
          },
        },
      }),
      db.variant.update({
        where: {
          categoryId,
          id: variantId,
        },
        data: {
          variantOptions: {
            createMany: {
              data: payload.options,
            },
          },
        },
      }),
    ]);

    return updatedVariant;
  };

  public delete = async ({ categoryId, variantId }: { categoryId: string; variantId: string }) => {
    return await db.variant.delete({
      where: {
        categoryId,
        id: variantId,
      },
    });
  };
}
