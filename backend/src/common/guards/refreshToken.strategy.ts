import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractRefreshJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret', { infer: true }),
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestType,
    payload: any,
  ): Promise<{ [key: string]: any; refreshToken: string }> {
    const refreshToken = RefreshTokenStrategy.extractRefreshJWT(req);
    return { ...payload, refreshToken };
  }

  private static extractRefreshJWT(req: RequestType): string | null {
    return req.body?.refreshToken || null;
  }
}
