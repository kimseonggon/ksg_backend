import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import 'reflect-metadata'
import { User } from '../user.model'
import { PaginationDto } from 'src/lib/dto/common.dto'
import { IsOptional, IsString } from 'class-validator'

export class SelectUserDto extends User { }


export class ResponseUserDto {
  @ApiProperty({ description: '사용자 고유번호' })
  readonly id: number
  @ApiProperty({ description: '이름' })
  readonly name: string
  @ApiPropertyOptional({ description: '이메일' })
  readonly email?: string
  @ApiPropertyOptional({ description: '휴대폰번호' })
  readonly phone?: string


  constructor(responseUserDto: User) {
    this.id = responseUserDto.id
    this.name = responseUserDto.name
    this.email = responseUserDto.email || undefined
    this.phone = responseUserDto.phone || undefined
  }

}

export class SearchUserDto extends PaginationDto {

  @ApiPropertyOptional({ description: '이메일', type: String })
  @IsOptional()
  @IsString()
  email?: string | null

  @ApiPropertyOptional({ description: '이름', type: String })
  @IsOptional()
  @IsString()
  name?: string | null

  @ApiPropertyOptional({ description: '휴대폰번호', type: String })
  @IsOptional()
  @IsString()
  phone?: string | null
}