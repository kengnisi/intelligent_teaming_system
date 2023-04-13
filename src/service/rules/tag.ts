import { Rules } from 'async-validator'
export const cTagRule: Rules = {
  tagName: {
    type: 'string',
    required: true,
    min: 0,
    max: 20,
    message: "标签不能过长或为空"
  },
  userId: {
    type: 'number',
    required: true,
    min: 0,
    message: "用户id不能小于0"
  },
  parentId: {
    type: 'number',
    min: 0,
    message: "父id不能小于0"
  },
  isParent: {
    type: 'enum',
    required: true,
    enum: [0, 1],
    message: "状态码错误"
  }
}