import jwt from 'jsonwebtoken';

import configEnv from '@/config';

export class JwtService {
  private readonly secret = configEnv.get('token.secret');

  public create(payload: JwtPayload, expiresIn = 3600): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  public verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
