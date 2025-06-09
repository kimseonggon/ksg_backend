import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user?.password === password) return user;
    throw new UnauthorizedException();
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisClient.set(`access:${accessToken}`, JSON.stringify({
      user: user
    }), 'EX', 60 * 60 * 24 * 7);
    await this.redisClient.set(`refresh:${refreshToken}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
    return { accessToken, refreshToken, user };
  }

  async refresh(userId: number, refreshToken: string) {
    const stored = await this.redisClient.get(`refresh:${userId}`);
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const newAccessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });
    return { accessToken: newAccessToken };
  }

  async logout(userId: number) {
    await this.redisClient.del(`refresh:${userId}`);
    return { message: 'Logged out' };
  }

  /**
   * 토큰만 추출
   *
   * @param authorization
   * @returns string
   */
  private getUserToken(authorization: string): string {
    const type = authorization?.split(' ')?.[0]
    if (type !== 'Bearer') {
      throw new UnauthorizedException('인증가능한 토큰이 존재하지 않습니다.')
    }
    return authorization?.split(' ')?.[1]
  }

  /**
   * redis 내에서 인증토큰 조회하기
   *
   * @param authorization
   * @returns Promise<string | null>
   */
  getUserInfo(authorization: string): Promise<string | null> {
    const splitedToken = this.getUserToken(authorization)
    return this.redisClient.get(`access:${splitedToken}`)
  }
}
