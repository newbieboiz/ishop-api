import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { authenticate } from '@/middlewares/authenticate';

import { UserService } from '../services/user.service';

export class UserController {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/me', authenticate, this.me);
    this.router.get(this.path, authenticate, this.getAll);
    this.router.get(`${this.path}/:id`, authenticate, this.getOneById);
  }

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUnique(req.user!.id);
      res.status(HttpStatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  };

  public getOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUnique(req.params.id);
      res.status(HttpStatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findMany();
      res.status(HttpStatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  };
}
