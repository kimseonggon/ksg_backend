import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Delete,
  Patch,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { AuthGuard } from 'src/auth/auth.guard'
import { Public } from 'src/auth/decorator'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { SearchUserDto } from './dto/user.dto'
import { User } from './user.model'
import { isUserForgotType, UserForgotType } from './types'
import { UserForgot } from 'src/user-forgot/user-forgot.model'
import { isEmail } from 'class-validator'

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Public()
  @Post()
  async create(@Body() user) {
    return this.usersService.create(user)
  }

  @Delete()
  async remove(@Body() dto) {
    return this.usersService.remove(dto)
  }

  @Patch(':id')
  async update(@Body() dto) {
    return this.usersService.update(dto)
  }

  @Get('me')
  async me(@CurrentUser() user) {
    return user
  }

  @Get(':id')
  @ApiOperation({
    summary: '유저 조회'
  })
  async findOne(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOne(id)
  }

  @Get('list')
  @ApiOperation({
    summary: '유저 리스트 조회',
    description: '유저 리스트 조회'
  })
  async list(@Query() dto: SearchUserDto) {
    await new Promise((resolve) => setTimeout(resolve, 3000)) // 3초 대기
    return this.usersService.list(dto)
  }

  @Public()
  @Put('forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '비밀번호 찾기 인증번호 발급' })
  @ApiQuery({ name: 'email', description: '로그인 이름' })
  @ApiQuery({ name: 'type', enum: UserForgotType, description: '비밀번호 찾기 유형' })
  @ApiOkResponse({ type: UserForgot, description: '인증 번호 정보' })
  @ApiBadRequestResponse({ description: '잘못된 정보로 요청' })
  async forgot(@Query('email') email: string, @Query('type') type: UserForgotType) {
    if (!isUserForgotType(type)) {
      throw new BadRequestException('유효한 요청이 아닙니다.')
    }
    if (!isEmail(email)) {
      throw new BadRequestException('유효한 이메일이 아닙니다.')
    }

    const foundUser = await this.usersService.findOneByUserEmail(email)
    if (!foundUser) {
      throw new BadRequestException('유효한 이메일이 아닙니다.')
    }

    return this.usersService.createForgotNumber({ ...foundUser, email }, UserForgotType.EMAIL)
  }

  @Public()
  @Post('/forgot/change_password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '비밀번호 찾기로 비밀번호 수정' })
  @ApiOkResponse({ description: '정상 처리됨' })
  async forgotChangePassword(
    @Body('verificationNumber') verificationNumber: number,
    @Body('password') password: string
  ) {
    return this.usersService.changePasswordWithForgotNumber(verificationNumber, password)
  }
}
