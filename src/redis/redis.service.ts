import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) { }

  async blacklistToken(token: string, ttl: number) {
    await this.redisClient.set(`blacklist:${token}`, '1', 'EX', ttl);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await this.redisClient.get(`blacklist:${token}`);
    return exists === '1';
  }
}