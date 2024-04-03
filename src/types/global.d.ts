import { RawRuleOf } from '@casl/ability';
import { PackRule } from '@casl/ability/extra';
import type { User } from '@prisma/client';

import { AppAbility } from '@/lib/auth/permissions';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      SERVER_PORT: string;
      API_PREFIX: string;
      SESSION_SECRET: string;
      SESSION_EXPIRES_IN: string;
      TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;
      VERIFICATION_TOKEN_EXPIRES_IN: string;
      PASSWORD_RESET_TOKEN_EXPIRES_IN: string;
      TWO_FACTOR_TOKEN_EXPIRES_IN: string;
      DATABASE_URL: string;
      RESEND_API_KEY: string;
      APP_ADMIN_URL: string;
      APP_STORE_URL: string;
      STRIPE_API_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      user?: User;
      ability?: AppAbility;
    }
  }

  interface Controller {
    path: string;
    router: Router;
  }

  type ErrorResponse = {
    message: string;
    status: number;
  };

  type JwtPayload = {
    id: string;
    email: string;
    csrf_token: string;
    permissions: PackRule<RawRuleOf<AppAbility>>[];
  };
}
