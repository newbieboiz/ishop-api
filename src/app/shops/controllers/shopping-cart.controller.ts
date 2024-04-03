import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { AddToCartPayload, AddToCartPayloadSchema, RemoveToCartPayload, RemoveToCartPayloadSchema } from '../schemas';
import { ShoppingCartService } from '../services/shopping-cart.service';

export class ShoppingCartController {
  public path = '/:shopId/shopping-cart';
  public router = Router();
  private shoppingCartService = new ShoppingCartService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.put(`${this.path}/add`, authenticate, payloadValidator(AddToCartPayloadSchema), this.addToCart);
    this.router.get(this.path, authenticate, this.getUnique);
    this.router.put(
      `${this.path}/remove`,
      authenticate,
      payloadValidator(RemoveToCartPayloadSchema),
      this.removeFromCart,
    );
    this.router.delete(this.path, authenticate, this.removeFromCart);
  }

  public addToCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const payload: AddToCartPayload = {
      shoppingCartId: req.body.shoppingCartId,
      productItemId: req.body.productItemId,
      qty: req.body.qty,
    };

    try {
      const shoppingCart = await this.shoppingCartService.addToCart(payload, { userId });
      res.status(HttpStatusCodes.OK).send(shoppingCart);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    try {
      const shoppingCart = await this.shoppingCartService.findUnique({ userId });
      res.status(HttpStatusCodes.OK).send(shoppingCart);
    } catch (error) {
      next(error);
    }
  };

  public removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const payload: RemoveToCartPayload = {
      shoppingCartId: req.body.shoppingCartId,
      productItemId: req.body.productItemId,
    };

    try {
      const shoppingCart = await this.shoppingCartService.removeFromCart(payload, { userId });
      res.status(HttpStatusCodes.OK).send(shoppingCart);
    } catch (error) {
      next(error);
    }
  };

  public clearCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    try {
      const shoppingCart = await this.shoppingCartService.clearCart({ userId });
      res.status(HttpStatusCodes.OK).send(shoppingCart);
    } catch (error) {
      next(error);
    }
  };
}
