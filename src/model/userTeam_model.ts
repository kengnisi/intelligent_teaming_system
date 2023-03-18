import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import Team from './team_model';
import user from './user_model';

@Table
class user_team extends Model {
  @Column(DataType.BIGINT)
  @ForeignKey(() => user)
  userId!: number;
  @Column(DataType.BIGINT)
  @ForeignKey(() => Team)
  teamId!: number;
  @Column
  isDelete!: number
  @CreatedAt
  createTime!: Date;
  @Column
  joinTime!: Date;
  @UpdatedAt
  updateTime!: Date;
}

export default user_team;