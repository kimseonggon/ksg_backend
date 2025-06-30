import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  Table
} from 'sequelize-typescript'
import { BaseModel } from 'src/common/basemodel'
import { UserForgotType } from 'src/user/types'
import { User } from 'src/user/user.model'

@Table
export class UserForgot extends BaseModel<UserForgot> {
  @ApiProperty({ description: 'user ID', type: Number })
  @ForeignKey(() => User)
  @Column
  userId: number

  @BelongsTo(() => User)
  user?: User

  @ApiPropertyOptional({ description: '발송 유형' })
  @Column(DataType.STRING(5))
  type: UserForgotType

  @ApiPropertyOptional({ description: '검증번호' })
  @Column(DataType.INTEGER)
  verificationNumber: number

  @ApiPropertyOptional({ description: '유효일시' })
  @Column(DataType.DATE)
  expiredAfter: Date

  @ApiPropertyOptional({ description: '내용', type: String })
  @AllowNull
  @Column(DataType.STRING(300))
  description: string | null

  @DeletedAt
  declare deletedAt: Date // 👈 삭제 시간 기록됨
}
