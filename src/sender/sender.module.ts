import { Module } from '@nestjs/common'
import { SenderController } from './sender.controller'
import { SenderService } from './sender.service'

@Module({
  imports: [],
  providers: [SenderService],
  controllers: [SenderController],
  exports: [SenderService]
})
export class SenderModule {}
