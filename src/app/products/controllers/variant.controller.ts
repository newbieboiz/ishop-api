import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { VariantPayload, VariantPayloadSchema } from '../schemas';
import { VariantService } from '../services/variant.service';

export class VariantController {
  public path = '/:categoryId/variants';
  public router = Router();
  private variantService = new VariantService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(VariantPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/:variantId`, this.getUnique);
    this.router.put(`${this.path}/:variantId`, authenticate, payloadValidator(VariantPayloadSchema), this.update);
    this.router.delete(`${this.path}/:variantId`, authenticate, this.delete);
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const payload: VariantPayload = {
      name: req.body.name,
      options: req.body.options,
    };

    try {
      const variant = await this.variantService.create(payload, { categoryId });
      res.status(HttpStatusCodes.OK).send(variant);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const variantId = req.params.variantId;

    try {
      const variant = await this.variantService.findUnique({ categoryId, variantId });
      res.status(HttpStatusCodes.OK).send(variant);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;

    try {
      const variants = await this.variantService.findMany({ categoryId });
      res.status(HttpStatusCodes.OK).send(variants);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const variantId = req.params.variantId;
    const payload: VariantPayload = {
      name: req.body.name,
      options: req.body.options,
    };

    try {
      const variant = await this.variantService.update(payload, { categoryId, variantId });
      res.status(HttpStatusCodes.OK).send(variant);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const variantId = req.params.variantId;

    try {
      const variant = await this.variantService.delete({
        categoryId,
        variantId,
      });
      res.status(HttpStatusCodes.OK).send(variant);
    } catch (error) {
      next(error);
    }
  };
}
