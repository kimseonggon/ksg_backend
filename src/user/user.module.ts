import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './user.model'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthModule } from '../auth/auth.module'
import { UserLog } from 'src/user-log/user-log.model'
import { Transactional } from 'src/common/sequelize'
import { RedisModule } from 'src/redis/redis.module'
import { UserForgot } from 'src/user-forgot/user-forgot.model'
import { SenderModule } from 'src/sender/sender.module'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule,
    RedisModule,
    SenderModule,
    SequelizeModule.forFeature([User, UserLog, UserForgot]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '15m' }
    })
  ],
  providers: [UserService, Transactional],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
