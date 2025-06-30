import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SenderService } from './sender.service'
import { EmailSendDto } from './dto/sender.dto'

@ApiTags('sender')
@Controller('sender')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Post('email')
  @HttpCode(HttpStatus.OK)
  async email(@Body() dto: EmailSendDto) {
    return this.senderService.sendEmail(dto)
  }
}
