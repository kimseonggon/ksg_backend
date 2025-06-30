import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass()
      ])

      if (isPublic) {
        return true
      }

      const request = context.switchToHttp().getRequest<Request>()

      // authorization 헤더
      const authorization = request?.headers?.authorization as string
      const userInfo = await this.authService.getUserInfo(authorization)
      if (!userInfo) {
        throw new UnauthorizedException('사용자 토큰이 존재하지 않습니다.')
      }
      request['user'] = JSON.parse(userInfo)
      return true
    } catch (err) {
      this.logger.error(err.stack || err)
      throw new UnauthorizedException('시스템 인증을 실패하였습니다.')
    }
  }
}
