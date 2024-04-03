import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';

import { BillboardPayload, BillboardPayloadSchema } from '../schemas';
import { BillboardService } from '../services/billboard.service';

export class BillboardController {
  public path = '/:shopId/billboards';
  public router = Router();
  private billboardService = new BillboardService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(BillboardPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/:billboardId`, this.getUnique);
    this.router.put(`${this.path}/:billboardId`, authenticate, payloadValidator(BillboardPayloadSchema), this.update);
    this.router.delete(
      `${this.path}/:billboardId`,
      authenticate,
      authorize(({ can }) => [can('delete', 'Billboard')]),
      this.delete,
    );
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const payload: BillboardPayload = {
      heading: req.body.heading,
      subheading: req.body.subheading,
      imageUrl: req.body.imageUrl,
    };

    try {
      const billboard = await this.billboardService.create(payload, { ownerId, shopId });
      res.status(HttpStatusCodes.OK).send(billboard);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const billboardId = req.params.billboardId;

    try {
      const billboard = await this.billboardService.findUnique({ shopId, billboardId });
      res.status(HttpStatusCodes.OK).send(billboard);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;

    try {
      const billboards = await this.billboardService.findMany({ shopId });
      res.status(HttpStatusCodes.OK).send(billboards);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const billboardId = req.params.billboardId;
    const payload: BillboardPayload = {
      heading: req.body.heading,
      subheading: req.body.subheading,
      imageUrl: req.body.imageUrl,
    };

    try {
      const billboard = await this.billboardService.update(payload, { ownerId, shopId, billboardId });
      res.status(HttpStatusCodes.OK).send(billboard);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const billboardId = req.params.billboardId;

    try {
      const billboard = await this.billboardService.delete({
        ownerId,
        shopId,
        billboardId,
      });
      res.status(HttpStatusCodes.OK).send(billboard);
    } catch (error) {
      next(error);
    }
  };
}
