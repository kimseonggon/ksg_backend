import { Body, Controller, Get, Post, Query, UseGuards, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorator';
import { ApiOperation } from '@nestjs/swagger';
import { SearchUserDto } from './dto/user.dto';


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) { }

  @Public()
  @Post()
  async create(@Body() user) {
    return this.usersService.create(user)
  }

  @Delete()
  async delete(@Body() dto) {
    console.log('dto', dto)
    return this.usersService.delete(dto)
  }

  @Patch(':id')
  async update(@Body() dto) {
    return this.usersService.update(dto)
  }

  @Get('list')
  @ApiOperation({ summary: '유저 리스트 조회', description: '유저 리스트 조회' })
  async list(
    @Query() dto: SearchUserDto
  ) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
    return this.usersService.list(dto)
  }

  @Get('me')
  async me(@CurrentUser() user) {
    return user
  }
}
