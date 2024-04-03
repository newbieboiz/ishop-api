import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';

import { BrandPayload, BrandPayloadSchema } from '../schemas';
import { BrandService } from '../services/brand.service';

export class BrandController {
  public path = '/:shopId/brands';
  public router = Router();
  private brandService = new BrandService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(BrandPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/:brandId`, this.getUnique);
    this.router.put(`${this.path}/:brandId`, authenticate, payloadValidator(BrandPayloadSchema), this.update);
    this.router.delete(
      `${this.path}/:brandId`,
      authenticate,
      authorize(({ can }) => [can('delete', 'Brand')]),
      this.delete,
    );
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const payload: BrandPayload = {
      name: req.body.name,
      description: req.body.description,
    };

    try {
      const brand = await this.brandService.create(payload, { userId, shopId });
      res.status(HttpStatusCodes.OK).send(brand);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const brandId = req.params.brandId;

    try {
      const brand = await this.brandService.findUnique({ shopId, brandId });
      res.status(HttpStatusCodes.OK).send(brand);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;

    try {
      const brands = await this.brandService.findMany({ shopId });
      res.status(HttpStatusCodes.OK).send(brands);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const brandId = req.params.brandId;
    const payload: BrandPayload = {
      name: req.body.name,
      description: req.body.description,
    };

    try {
      const brand = await this.brandService.update(payload, { userId, shopId, brandId });
      res.status(HttpStatusCodes.OK).send(brand);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const brandId = req.params.brandId;

    try {
      const brand = await this.brandService.delete({
        userId,
        shopId,
        brandId,
      });
      res.status(HttpStatusCodes.OK).send(brand);
    } catch (error) {
      next(error);
    }
  };
}
