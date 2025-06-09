import { Module } from '@nestjs/common';
import Redis from 'ioredis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'localhost',
      port: 6379,
    });
  },
};

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
