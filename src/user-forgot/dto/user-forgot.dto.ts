import { ApiProperty } from '@nestjs/swagger'
import 'reflect-metadata'
import { UserForgot } from '../user-forgot.model'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class SelectUserForgotDto extends UserForgot {}

export class CreateUserForgotDto {
  @ApiProperty({ description: 'USER ID', type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number
}
