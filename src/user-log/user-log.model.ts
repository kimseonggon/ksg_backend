import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table
export class UserLog extends Model {
  @ApiProperty({ description: 'User ID', type: Number })
  @ForeignKey(() => User)
  @Column
  UserId: number


  @BelongsTo(() => User)
  user?: User

  @ApiPropertyOptional({ description: '변경 기록' })
  @AllowNull
  @Column(DataType.JSONB)
  change: any


  @ApiPropertyOptional({ description: '내용', type: String })
  @AllowNull
  @Column(DataType.STRING(300))
  description: string | null

}
