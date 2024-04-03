import { NextFunction, Request, Response } from 'express';

import { BadRequestException, UnauthorizedException } from '@/common/exceptions';
import { JwtService } from '@/lib/auth/jwt.service';
import db from '@/lib/database';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const csrf_token = req.headers.csrf_token;
  const access_token = req.cookies.access_token;

  if (access_token && csrf_token) {
    try {
      const jwtService = new JwtService();
      const verified = jwtService.verify(access_token) as JwtPayload;

      if (verified.csrf_token !== csrf_token) {
        throw new UnauthorizedException('Invalid access token');
      }

      const user = await db.user.findUnique({
        where: {
          id: verified.id,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next(new BadRequestException('Missing access token'));
  }
}
