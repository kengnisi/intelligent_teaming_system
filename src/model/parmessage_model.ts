import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
@Table
class parmessage extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id!: number;
  @Column(DataType.BIGINT)
  sendUserId!: number;
  @Column(DataType.BIGINT)
  acceptUserId!: number;
  @Column(DataType.STRING(256))
  name!: string
  @Column(DataType.STRING(1024))
  avatarUrl!: string
  // '0 - 字符串，1 - emoj，2 - 图片， 3 - 文件',
  @Column(DataType.BIGINT)
  style!: number;
  @Column(DataType.STRING(1024))
  message!: string
  @CreatedAt
  createTime!: Date;
  @UpdatedAt
  updateTime!: Date;
  @Column
  isDelete!: number
}

export default parmessage;