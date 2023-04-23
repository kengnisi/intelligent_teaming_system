import { Rules } from 'async-validator'
export const teamRule: Rules = {
  name: {
    type: 'string',
    required: true,
    min: 0,
    max: 20,
    message: "队伍名不能过长或为空"
  },
  description: {
    type: 'string',
    required: true,
    min: 0,
    max: 512,
    message: "描述不能过长"
  },
  maxNum: {
    type: 'number',
    required: true,
    min: 0,
    max: 20,
    message: "队伍限制人数只能在1~20人"
  },
  password: {
    type: 'string',
    required: true,
    min: 4,
    max: 15,
    message: "密码需为4~15位"
  },
  status: {
    type: 'enum',
    required: true,
    enum: [0, 1, 2]
  },
  expireTime: {
    type: 'number',
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (new Date(value) < new Date()) {
          reject('截止时间错误');  // reject with error message
        } else {
          resolve();
        }
      });
    },
  }
}

export const searchTeamRules: Rules = {
  teamId: {
    type: 'number',
    min: 0,
    message: "队伍id错误"
  },
  teamIdList: {
    type: 'array',
    message: "队伍id列表格式错误"
  },
  userId: {
    type: 'number',
    min: 0,
    message: "创建用户id错误"
  },
  searchText: {
    type: 'string',
    min: 0,
    max: 20,
    message: "搜索关键内容过程"
  },
  name: {
    type: 'string',
    min: 0,
    max: 20,
    message: "队伍名不能过长或为空"
  },
  description: {
    type: 'string',
    max: 512,
    message: "描述不能过长"
  },
  maxNum: {
    type: 'number',
    min: 0,
    max: 20,
    message: "队伍限制人数只能在1~20人"
  },
  status: {
    type: 'enum',
    enum: [0, 2],
    message: "队伍类型错误"
  },
  expireTime: {
    type: 'number',
    message: "时间格式错误"
  }
}