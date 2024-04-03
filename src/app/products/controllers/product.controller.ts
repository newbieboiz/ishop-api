import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { ProductPayload, ProductPayloadSchema } from '../schemas';
import { ProductService } from '../services/product.service';

export class ProductController {
  public path = '/:shopId/products';
  public router = Router();
  private productService = new ProductService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(ProductPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/count-stock`, authenticate, this.countStock);
    this.router.get(`${this.path}/:productId`, this.getUnique);
    this.router.put(
      `${this.path}/:productId`,
      authenticate,
      payloadValidator(ProductPayloadSchema.omit({ productItems: true })),
      this.update,
    );
    this.router.delete(`${this.path}/:productId`, authenticate, this.delete);
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const payload: ProductPayload = {
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      isFeatured: req.body.isFeatured,
      productItems: req.body.productItems,
    };

    try {
      const product = await this.productService.create(payload, { userId, shopId });
      res.status(HttpStatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const productId = req.params.productId;

    try {
      const product = await this.productService.findUnique({ shopId, productId });
      res.status(HttpStatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;

    try {
      const products = await this.productService.findMany({ shopId });
      res.status(HttpStatusCodes.OK).send(products);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const productId = req.params.productId;
    const payload: ProductPayload = {
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      isFeatured: req.body.isFeatured,
    };

    try {
      const product = await this.productService.update(payload, { userId, shopId, productId });
      res.status(HttpStatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const productId = req.params.productId;

    try {
      const product = await this.productService.delete({
        userId,
        shopId,
        productId,
      });
      res.status(HttpStatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  };

  public countStock = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;

    try {
      const count = await this.productService.countStock({ shopId });
      res.status(HttpStatusCodes.OK).send({ count });
    } catch (error) {
      next(error);
    }
  };
}
