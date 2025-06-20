import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import 'reflect-metadata'
import { UserLog } from '../user-log.model'
import { PaginationDto } from 'src/lib/dto/common.dto'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class SelectUserLogDto extends UserLog { }

export class CreateUserLogDto {

  @ApiProperty({ description: 'USER ID', type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number

  @ApiProperty({ description: '내용', type: String, maxLength: 300 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly description: string

}

export class UpdateCsLogDto extends PartialType(PickType(CreateUserLogDto, [
  'description',
])) { }


export class ResponseUserLogDto {

}

export class SearchUserLogDto extends PaginationDto {

}