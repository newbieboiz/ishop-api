import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { ProductItemPayload, ProductItemPayloadSchema } from '../schemas';
import { ProductItemService } from '../services/product-item.service';

export class ProductItemController {
  public path = '/:shopId/products/:productId';
  public router = Router();
  private productItemService = new ProductItemService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authenticate, payloadValidator(ProductItemPayloadSchema), this.create);
    this.router.get(this.path, this.getMany);
    this.router.get(`${this.path}/:SKU`, this.getUnique);
    this.router.put(`${this.path}/:SKU`, authenticate, payloadValidator(ProductItemPayloadSchema), this.update);
    this.router.delete(`${this.path}/:SKU`, authenticate, this.delete);
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const productId = req.params.productId;
    const payload: ProductItemPayload = {
      SKU: req.body.SKU,
      qtyInStock: req.body.qtyInStock,
      imageUrl: req.body.imageUrl,
      configurations: req.body.configurations,
      price: req.body.price,
    };

    try {
      const productItem = await this.productItemService.create(payload, { userId, shopId, productId });
      res.status(HttpStatusCodes.OK).send(productItem);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const SKU = req.params.SKU;

    try {
      const productItem = await this.productItemService.findUnique({ SKU });
      res.status(HttpStatusCodes.OK).send(productItem);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.productId;
      const productItems = await this.productItemService.findMany({ productId });
      res.status(HttpStatusCodes.OK).send(productItems);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const productItemId = req.params.productItemId;
    const payload: ProductItemPayload = {
      SKU: req.body.SKU,
      qtyInStock: req.body.qtyInStock,
      imageUrl: req.body.imageUrl,
      configurations: req.body.configurations,
      price: req.body.price,
    };

    try {
      const productItem = await this.productItemService.update(payload, { userId, shopId, productItemId });
      res.status(HttpStatusCodes.OK).send(productItem);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const shopId = req.params.shopId;
    const productItemId = req.params.productItemId;

    try {
      const productItem = await this.productItemService.delete({
        userId,
        shopId,
        productItemId,
      });
      res.status(HttpStatusCodes.OK).send(productItem);
    } catch (error) {
      next(error);
    }
  };
}
