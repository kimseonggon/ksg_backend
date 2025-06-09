import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) { }

  @Get('me')
  async me(@CurrentUser() user) {
    return user
  }
}
