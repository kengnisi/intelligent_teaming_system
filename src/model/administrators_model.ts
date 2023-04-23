import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
class Administrators extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id!: number;
  @Column(DataType.STRING(256))
  username!: string
  @Column(DataType.STRING(256))
  userAccount!: string
  @Column(DataType.STRING(512))
  userPassword!: string
  @Column(DataType.STRING(1024))
  avatarUrl!: string
  @Column
  gender!: number
  @Column(DataType.STRING(128))
  phone!: string
  @Column(DataType.STRING(512))
  email!: string
  @Column
  userStatus!: number
  @Column
  isDelete!: number
  @CreatedAt
  createTime!: Date;
  @UpdatedAt
  updateTime!: Date;
}

export default Administrators;