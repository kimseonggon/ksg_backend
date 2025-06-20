import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserLogModule } from './user-log/user-log.module';
import { RequestContextModule } from 'nestjs-request-context';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RequestContextModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    RedisModule,
    AuthModule,
    UserModule,
    UserLogModule,
  ]
})
export class AppModule { }
