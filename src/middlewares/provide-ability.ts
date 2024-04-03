import { unpackRules } from '@casl/ability/extra';
import { NextFunction, Request, Response } from 'express';

import { JwtService } from '@/lib/auth/jwt.service';
import { createAbility } from '@/lib/auth/permissions';

export async function provideAbility(req: Request, res: Response, next: NextFunction) {
  const access_token = req.cookies.access_token;

  if (access_token) {
    const jwtService = new JwtService();
    const verified = jwtService.verify(access_token) as JwtPayload;

    req.ability = createAbility(unpackRules(verified.permissions));
  }

  next();
}
