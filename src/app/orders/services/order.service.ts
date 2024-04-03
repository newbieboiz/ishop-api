import db from '@/lib/database';

export class OrderService {
  public findMany = async ({ storeId, isPaid }: { storeId: string; isPaid?: boolean }) => {
    return await db.order.findMany({
      where: {
        storeId,
        isPaid,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };
}
