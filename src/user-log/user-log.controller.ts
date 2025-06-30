import {
  Body,
  Controller,
  Post,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  Param
} from '@nestjs/common'
import { UserLogService } from './user-log.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Public } from 'src/auth/decorator'

@UseGuards(AuthGuard)
@Controller('user-log')
export class UserLogController {
  constructor(private usersLogService: UserLogService) {}

  @Public()
  @Post()
  async create(@Body() user) {
    return this.usersLogService.create(user)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.usersLogService.remove(id)
  }
}
