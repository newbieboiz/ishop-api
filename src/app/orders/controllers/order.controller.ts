import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { authenticate } from '@/middlewares/authenticate';

import { OrderService } from '../services/order.service';

export class OrderController {
  public path = '/:storeId/orders';
  public router = Router();
  private orderService = new OrderService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authenticate, this.getMany);
  }

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;
    const isPaid = req.query.isPaid ? Boolean(req.query.isPaid) : undefined;

    try {
      const orders = await this.orderService.findMany({ storeId, isPaid });
      res.status(HttpStatusCodes.OK).send(orders);
    } catch (error) {
      next(error);
    }
  };
}
