import User from "../model/user_model";
import { getSafetyUser } from "../utils/SafetyUserUtils"
import { editAttr } from "./type/serviceType"
import { safeUserInfo } from "../common/type/responseResultType";
import errorTypes from "../common/constant/error-types";
import { sendError } from "../utils/sendError";
import { Context } from "koa";
import minDistance from "../utils/AlgorithmUtils";
import user from "../model/user_model";
import { Op } from "sequelize";
import { userInfo } from "os";
import { RequestMatchKey } from "../common/type/requestParam";

class UserService {
  async createUser(openId: string) {
    const res = await User.create({ openId: `${openId}` })
    return res
  }
  async getUserByOpenId(openId: string) {
    const res = await User.findOne({ where: { openId: `${openId}` } })
    return res
  }
  async getUserById(id: string) {
    const res = await User.findOne({ where: { id: `${id}` } })
    return res
  }
  async getUserByTags(tags: Array<string>) {
    const res: Array<User> = await User.findAll()
    const userList = res.filter((user) => {
      if (user.tags == null) {
        return false
      }
      const tagsList = JSON.parse(user.tags)
      for (let tagItem of tags) {
        if (tagsList.includes(tagItem)) {
          return true
        }
      }
      return false
    }).map(user => {
      return getSafetyUser(user)
    })
    return userList
  }
  async updateUser(ctx: Context, editAttr: editAttr, userInfo: safeUserInfo) {
    const userId = userInfo.id
    console.log(editAttr)
    console.log(editAttr.attrName, userInfo)
    if (userId < 0) {
      return sendError(errorTypes.NOT_LOGIN, ctx, "请先登陆")
    }
    if (!editAttr.attrName) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }

    const res = await User.update({
      [editAttr.attrName]: editAttr.value
    }, {
      where: {
        id: userId
      }
    })
    return res
  }

  async matchUsers(ctx, loginUser, searchKey: RequestMatchKey) {
    console.log(searchKey[0])
    const start = process.hrtime();
    const userList = await User.findAll({
      attributes: ['id', 'tags'],
      where: {
        id: {
          [Op.ne]: loginUser.id
        },
        isDelete: 0,
        tags: {
          [Op.not]: "[]",
        }
      }
    })
    const end = process.hrtime(start);
    console.log(`程序运行了 ${end[0]} 秒 ${end[1] / 1000000} 毫秒`);
    const loginUserTags = [...loginUser.tags, ...searchKey as any]
    let matchUsers = new Array()
    for (const iterator of userList) {
      const tags = iterator.tags
      if (tags == null || tags == "[]") {
        continue
      }
      const sTags = JSON.parse(tags)
      const distance = minDistance(sTags, loginUserTags)
      if (distance == 1 && sTags.length == 1) {
        continue
      }
      matchUsers.push({
        distance,
        userInfo: iterator
      })
    }
    matchUsers = matchUsers.sort((a, b) => {
      return a.distance - b.distance
    })
    const userIdList = matchUsers.map((user) => {
      return user.userInfo["id"]
    })
    const resUserList = await User.findAll({
      where: {
        id: userIdList
      }
    })
    const safeUserList = resUserList.map(userItem => {
      return getSafetyUser(userItem)
    })
    const finalUserList = []
    for (const safeUser of safeUserList) {
      const index = userIdList.indexOf(safeUser.id)
      finalUserList[index] = safeUser
    }
    return finalUserList
  }
}

export default new UserService