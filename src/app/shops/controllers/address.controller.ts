import { NextFunction, Request, Response, Router } from 'express';

import { HttpStatusCodes } from '@/common/constants';
import { payloadValidator } from '@/lib/validator/payload-validator';
import { authenticate } from '@/middlewares/authenticate';

import { AddressPayload, AddressPayloadSchema, ImportProvincesPayload, ImportProvincesPayloadSchema } from '../schemas';
import { AddressService } from '../services/address.service';

export class AddressController {
  public path = '/:shopId/addresses';
  public router = Router();
  private addressService = new AddressService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/import-provinces`,
      authenticate,
      payloadValidator(ImportProvincesPayloadSchema),
      this.importProvinces,
    );
    this.router.get(`${this.path}/extract-provinces`, this.extractProvinces);
    this.router.post(this.path, authenticate, payloadValidator(AddressPayloadSchema), this.create);
    this.router.get(this.path, authenticate, this.getMany);
    this.router.get(`${this.path}/:addressId`, authenticate, this.getUnique);
    this.router.put(`${this.path}/:addressId`, authenticate, payloadValidator(AddressPayloadSchema), this.update);
    this.router.delete(`${this.path}/:addressId`, authenticate, this.delete);
  }

  public importProvinces = async (req: Request, res: Response, next: NextFunction) => {
    const payload: ImportProvincesPayload = {
      provinces: req.body.provinces,
    };

    try {
      const address = await this.addressService.importProvinces(payload);
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };

  public extractProvinces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.addressService.extractProvinces();
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };

  public getUnique = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.addressId;

    try {
      const address = await this.addressService.findUnique({ userId, addressId });
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };

  public getMany = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    try {
      const addresses = await this.addressService.findMany({ userId });
      res.status(HttpStatusCodes.OK).send(addresses);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const payload: AddressPayload = {
      name: req.body.name,
      addressLine: req.body.addressLine,
      wardCode: req.body.wardCode,
      districtCode: req.body.districtCode,
      provinceCode: req.body.provinceCode,
    };

    try {
      const address = await this.addressService.create(payload, { userId });
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.addressId;
    const payload: AddressPayload = {
      name: req.body.name,
      addressLine: req.body.addressLine,
      wardCode: req.body.wardCode,
      districtCode: req.body.districtCode,
      provinceCode: req.body.provinceCode,
    };

    try {
      const address = await this.addressService.update(payload, { userId, addressId });
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.addressId;

    try {
      const address = await this.addressService.delete({
        userId,
        addressId,
      });
      res.status(HttpStatusCodes.OK).send(address);
    } catch (error) {
      next(error);
    }
  };
}
