import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLog } from './user-log.model';
import { UserLogService } from './user-log.service';
import { UserLogController } from './user-log.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([UserLog])],
  providers: [UserLogService],
  controllers: [UserLogController],
  exports: [UserLogService],
})
export class UserLogModule { }
