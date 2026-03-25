import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret', { infer: true }),
    });
  }

  async validate(payload: any): Promise<{ username: string; role: string }> {
    return { username: payload.username, role: payload.role };
  }

  // method to extract jwt from bearer token
  private static extractJWT(req: Request): string | null {
    let token = null;
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      }
    }
    return token;
  }
}
