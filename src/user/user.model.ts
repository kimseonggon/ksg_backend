import { Column, DataType, DeletedAt, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  paranoid: true, // 👈 소프트 삭제 활성화
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'unique_user_email' // 유니크 키 이름 지정
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE
  })
  deactivatedFrom: Date;

  @Column({
    type: DataType.STRING
  })
  description: string;


  @DeletedAt
  declare deletedAt: Date; // 👈 삭제 시간 기록됨
}
