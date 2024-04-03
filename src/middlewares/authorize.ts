import { NextFunction, Request, Response } from 'express';

import { ForbiddenException, UnauthorizedException } from '@/common/exceptions';
import { AppAbility, defineAbilityFor } from '@/lib/auth/permissions';

export function authorize(abilityCallback: (appAbility: AppAbility) => boolean[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedException('Unauthorized'));
    }

    try {
      const userAbility = defineAbilityFor(user);
      // authorize
      if (abilityCallback(userAbility).some((result) => !result)) {
        throw new ForbiddenException('Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
