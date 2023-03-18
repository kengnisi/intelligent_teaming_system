import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import user_team from './userTeam_model';

@Table
class user extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  @ForeignKey(() => user_team)
  id!: number;
  @Column(DataType.STRING(256))
  username!: string
  @Column(DataType.STRING(256))
  openId!: string
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
  @Column
  userRole!: number
  @Column(DataType.STRING(1024))
  tags!: string
  @Column(DataType.STRING(1024))
  profile!: string
  @CreatedAt
  createTime!: Date;
  @UpdatedAt
  updateTime!: Date;
}

export default user;