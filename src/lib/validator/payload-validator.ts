import { NextFunction, Request, Response } from 'express';
import z from 'zod';

import { BadRequestException } from '@/common/exceptions';

export function payloadValidator(schema: z.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      schema.parse(payload);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('🚀 ~ payloadValidator ~ error:', error.issues);
        const messages = error.issues.map(({ message }) => message);

        throw new BadRequestException(messages.join(', '));
      }
    }

    next();
  };
}
