import { NextFunction, Request, Response } from 'express';

import { HttpStatusCodes } from '@/common/constants';

export default function errorHandler(err: ErrorResponse, req: Request, res: Response, next: NextFunction) {
  console.log('🚀 ~ errorHandler ~ err:', err);
  res.status(err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
    message: err.message,
    status: err.status,
  });
}
