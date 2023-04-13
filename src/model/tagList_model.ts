import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
@Table
class Tag extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id!: number;
  @Column(DataType.BIGINT)
  userId!: number;
  @Column(DataType.BIGINT)
  parentId!: number;
  @Column(DataType.BIGINT)
  isParent!: number;
  @Column(DataType.STRING(256))
  tagName!: string
  @CreatedAt
  createTime!: Date;
  @UpdatedAt
  updateTime!: Date;
  @Column
  isDelete!: number
}

export default Tag;
