import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Logger } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey'
    })
  }

  async validate(payload: any) {
    const logger = new Logger('JwtStrategy')
    logger.debug(`🧾 JWT payload: ${JSON.stringify(payload)}`)

    return { userId: payload.sub, email: payload.email }
  }
}
