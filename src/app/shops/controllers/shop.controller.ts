import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { ShopPayload, ShopPayloadSchema } from '../schemas';
import { ShopService } from '../services/shop.service';

export class ShopController {
  public path = '/shops';
  public router = Router();
  private shopService = new ShopService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(ShopPayloadSchema), this.create);
    this.router.get(this.path, authenticate, this.getMany);
    this.router.get(`${this.path}/first`, authenticate, this.getFirst);
    this.router.get(`${this.path}/:shopId`, authenticate, this.getUnique);
    this.router.put(`${this.path}/:shopId`, authenticate, payloadValidator(ShopPayloadSchema), this.update);
    this.router.delete(`${this.path}/:shopId`, authenticate, this.delete);
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const payload: ShopPayload = {
      slug: req.body.slug,
      name: req.body.name,
    };

    try {
      const shop = await this.shopService.create(payload, { ownerId });
      res.status(HttpStatusCodes.CREATED).send(shop);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;

    try {
      const shop = await this.shopService.findUnique({ ownerId, shopId });
      res.status(HttpStatusCodes.OK).send(shop);
    } catch (error) {
      next(error);
    }
  };

  public getFirst = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;

    try {
      const shop = await this.shopService.findFirst({ ownerId });
      res.status(HttpStatusCodes.OK).send(shop);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;

    try {
      const shops = await this.shopService.findMany({ ownerId });
      res.status(HttpStatusCodes.OK).send(shops);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const payload: ShopPayload = {
      slug: req.body.slug,
      name: req.body.name,
    };

    try {
      const shop = await this.shopService.update(payload, { ownerId, shopId });
      res.status(HttpStatusCodes.OK).send(shop);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;

    try {
      const shop = await this.shopService.delete({ ownerId, shopId });
      res.status(HttpStatusCodes.OK).send(shop);
    } catch (error) {
      next(error);
    }
  };
}
