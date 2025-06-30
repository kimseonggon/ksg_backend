import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  AutoIncrement,
  Column,
  Comment,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize/types'

// eslint-disable-next-line @typescript-eslint/ban-types
export class BaseModel<
  T extends Model<InferAttributes<Model<T>>, InferCreationAttributes<Model<T>>>
> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T, { omit: 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' }>
> {
  @ApiProperty({ description: 'ID', type: Number })
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number

  @ApiProperty({ description: '생성일시', type: Date })
  @Comment('생성일시')
  @CreatedAt
  @Column
  declare createdAt: Date

  @ApiProperty({ description: '수정일시', type: Date })
  @Comment('수정일시')
  @UpdatedAt
  @Column
  declare updatedAt: Date

  @ApiPropertyOptional({ description: '삭제일시', type: Date })
  @Comment('삭제일시')
  @DeletedAt
  @Column(DataType.DATE)
  declare deletedAt: Date | null
}

export class CreateOnlyBaseModel<
  T extends Model<InferAttributes<Model<T>>, InferCreationAttributes<Model<T>>>
> extends Model<InferAttributes<T>, InferCreationAttributes<T, { omit: 'id' | 'createdAt' }>> {
  @ApiProperty({ description: 'ID', type: Number })
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number

  @ApiProperty({ description: '생성일시', type: Date })
  @Comment('생성일시')
  @CreatedAt
  @Column
  declare createdAt: Date
}

export class CreatedAtOnlyBaseModel<
  T extends Model<InferAttributes<Model<T>>, InferCreationAttributes<Model<T>>>
> extends Model<InferAttributes<T>, InferCreationAttributes<T, { omit: 'id' | 'createdAt' }>> {
  @ApiProperty({ description: 'ID', type: Number })
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number

  @ApiProperty({ description: '생성일시', type: Date })
  @Comment('생성일시')
  @CreatedAt
  @Column
  declare createdAt: Date
}

export class DateOnlyBaseModel<
  T extends Model<InferAttributes<Model<T>>, InferCreationAttributes<Model<T>>>
> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T, { omit: 'id' | 'createdAt' | 'updatedAt' }>
> {
  @ApiProperty({ description: 'ID', type: Number })
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number

  @ApiProperty({ description: '생성일시', type: Date })
  @Comment('생성일시')
  @CreatedAt
  @Column
  declare createdAt: Date

  @ApiProperty({ description: '수정일시', type: Date })
  @Comment('수정일시')
  @UpdatedAt
  @Column
  declare updatedAt: Date
}

export class IdOnlyBaseModel<
  T extends Model<InferAttributes<Model<T>>, InferCreationAttributes<Model<T>>>
> extends Model<InferAttributes<T>, InferCreationAttributes<T, { omit: 'id' }>> {
  @ApiProperty({ description: 'ID', type: Number })
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number
}
