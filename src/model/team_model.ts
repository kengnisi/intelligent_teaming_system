import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement } from 'sequelize-typescript';
import user_team from './userTeam_model';

@Table
class Team extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  @ForeignKey(() => user_team)
  id!: number;
  @Column(DataType.BIGINT)
  userId!: number;
  @Column(DataType.STRING(256))
  name!: string
  @Column(DataType.STRING(1024))
  description!: string
  @Column(DataType.STRING(512))
  password!: string
  @Column
  maxNum!: number
  @Column
  status!: number
  @Column
  isDelete!: number
  @Column
  expireTime!: Date;
  @CreatedAt
  createTime!: Date;
  @UpdatedAt
  updateTime!: Date;
}

export default Team;