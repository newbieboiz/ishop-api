import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { CategoryPayload, CategoryPayloadSchema } from '../schemas';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  public path = '/:shopId/categories';
  public router = Router();
  private categoryService = new CategoryService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(CategoryPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/:categoryId`, this.getUnique);
    this.router.put(`${this.path}/:categoryId`, authenticate, payloadValidator(CategoryPayloadSchema), this.update);
    this.router.delete(`${this.path}/:categoryId`, authenticate, this.delete);
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const payload: CategoryPayload = {
      parentCategoryId: req.body.parentCategoryId,
      name: req.body.name,
    };

    try {
      const category = await this.categoryService.create(payload, { ownerId, shopId });
      res.status(HttpStatusCodes.OK).send(category);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const categoryId = req.params.categoryId;

    try {
      const category = await this.categoryService.findUnique({ shopId, categoryId });
      res.status(HttpStatusCodes.OK).send(category);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;

    try {
      const categories = await this.categoryService.findMany({ shopId });
      res.status(HttpStatusCodes.OK).send(categories);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const categoryId = req.params.categoryId;
    const payload: CategoryPayload = {
      parentCategoryId: req.body.parentCategoryId,
      name: req.body.name,
    };

    try {
      const category = await this.categoryService.update(payload, { ownerId, shopId, categoryId });
      res.status(HttpStatusCodes.OK).send(category);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user!.id;
    const shopId = req.params.shopId;
    const categoryId = req.params.categoryId;

    try {
      const category = await this.categoryService.delete({
        ownerId,
        shopId,
        categoryId,
      });
      res.status(HttpStatusCodes.OK).send(category);
    } catch (error) {
      next(error);
    }
  };
}
