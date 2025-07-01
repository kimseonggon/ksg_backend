import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { UserService } from 'src/user/user.service'
import { compareSync } from 'bcrypt'
import { ResponseUserDto } from 'src/user/dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async validateUser(email: string, password: string): Promise<ResponseUserDto> {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('가입된 회원이 아니거나 로그인정보가 틀립니다.')
    }

    const isCorrect = compareSync(password, user.password.toString())
    if (!isCorrect) {
      throw new UnauthorizedException('가입된 회원이 아니거나 로그인정보가 틀립니다')
    }

    return new ResponseUserDto(user)
  }

  async login(user: ResponseUserDto) {
    const payload = { email: user.email, sub: user.id }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    await this.redisClient.set(
      `access:${accessToken}`,
      JSON.stringify({
        user: user
      }),
      'EX',
      60 * 60 * 24 * 7
    )
    await this.redisClient.set(`refresh:${refreshToken}`, refreshToken, 'EX', 60 * 60 * 24 * 7)
    await this.redisClient.set(
      `userId:${user.id}`,
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken
      }),
      'EX',
      60 * 60 * 24 * 7
    )

    return { accessToken, refreshToken, user }
  }

  async refresh(userId: number, refreshToken: string) {
    const stored = await this.redisClient.get(`refresh:${userId}`)
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    const newAccessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' })
    return { accessToken: newAccessToken }
  }

  async logout(userId: number) {
    await this.redisClient.del(`refresh:${userId}`)
    return { message: 'Logged out' }
  }

  /**
   * 토큰만 추출
   *
   * @param authorization
   * @returns string
   */
  private async getUserToken(authorization: string): Promise<string> {
    const type = authorization?.split(' ')?.[0]
    const token = authorization?.split(' ')?.[1]
    if (type !== 'Bearer') {
      throw new UnauthorizedException('인증가능한 토큰이 존재하지 않습니다.')
    }

    if (token) {
      const isBlacklisted = await this.redisClient.get(`blacklist:${token}`)
      if (isBlacklisted === '1') {
        throw new UnauthorizedException('인증이 되지 않은 토큰입니다.')
      }
    }
    return token
  }

  /**
   * redis 내에서 인증토큰 조회하기
   *
   * @param authorization
   * @returns Promise<string | null>
   */
  async getUserInfo(authorization: string): Promise<string | null> {
    const splitedToken = await this.getUserToken(authorization)
    return this.redisClient.get(`access:${splitedToken}`)
  }
}
