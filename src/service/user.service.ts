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
import { RequestMatchKey, RequestChangeUserTags } from "../common/type/requestParam";
import Tag from "../model/tagList_model";

class UserService {
  async createUser(openId: string, avatarUrl: string, username: string) {
    console.log("注册", avatarUrl, username)
    const res = await User.create({ openId: `${openId}`, tags: JSON.stringify([]), avatarUrl, username })
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
  async getUserByTags(tags: Array<string>, page: number = 1, limit: number = 15) {
    console.log(page, limit)
    const { rows, count } = await User.findAndCountAll(
      {
        attributes: { exclude: ['isDelete', 'updateTime'] },
        where: {
          isDelete: 0
        }
      }
    )
    const userList = rows.filter((user) => {
      if (user.tags == null || user.tags == "[]") {
        return false
      }
      const tagsList = JSON.parse(user.tags)
      for (let tagItem of tags) {
        if (tagsList.includes(tagItem)) {
          return true
        }
      }
      return false
    })
    const resList = userList.slice((page - 1) * limit, (page - 1) * limit + limit)
    resList.forEach((item) => {
      item.tags = JSON.parse(item.tags)
    })
    return { resList, count: userList.length }
  }
  async updateUser(ctx: Context, editAttr: editAttr, userInfo: safeUserInfo) {
    const userId = userInfo.id
    console.log(editAttr)
    // console.log(editAttr.attrName, userInfo)
    if (userId < 0) {
      return sendError(errorTypes.NOT_LOGIN, ctx, "请先登陆")
    }
    if (!editAttr.attrName) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    if (editAttr.value == '男' && editAttr.attrName == 'gender') {
      editAttr.value = 0
    } else if (editAttr.value == '女' && editAttr.attrName == 'gender') {
      editAttr.value = 1
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

  async matchUsers(ctx: Context, loginUser, searchKey: RequestMatchKey, page: number = 1, limit: number = 15) {
    console.log(searchKey[0])
    // const start = process.hrtime();
    // 1.获取所有用户
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
    // const end = process.hrtime(start);
    // console.log(`程序运行了 ${end[0]} 秒 ${end[1] / 1000000} 毫秒`);
    // 2.整理用户匹配标签
    const loginUserTags = [...loginUser.tags, ...searchKey as any]
    // 3.计算匹配程度
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
    // 4.排序
    matchUsers = matchUsers.sort((a, b) => {
      return a.distance - b.distance
    })
    const userIdList = matchUsers.map((user) => {
      return user.userInfo["id"]
    })
    // 5.获取匹配用户
    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ['isDelete', 'updateTime'] },
      where: {
        id: userIdList,
        isDelete: 0
      }
    })
    rows.forEach((item) => {
      item.tags = JSON.parse(item.tags)
    })
    // const safeUserList = rows.map(userItem => {
    //   return getSafetyUser(userItem)
    // })
    console.log(userIdList)
    const finalUserList = []
    // 6.重新排序
    for (const safeUser of rows) {
      const index = userIdList.indexOf(safeUser.id)
      finalUserList[index] = safeUser
    }
    const resList = finalUserList.slice((page - 1) * limit, (page - 1) * limit + limit)
    return { finalUserList: resList, count }
  }

  async changeTags(ctx: Context, loginUser, tagsList: RequestChangeUserTags) {
    // const tags = await Tag.findAll({
    //   attributes: ['tagName', 'isParent'],
    //   where: {
    //     id: tagsList,
    //     isDelete: {
    //       [Op.eq]: 0
    //     }
    //   }
    // })
    // const resTags = tags.map(item => {
    //   if (item.isParent == 0) {
    //     return item.tagName
    //   }
    // }).filter(item => {
    //   return item != null
    // })
    const res = await User.update({ tags: JSON.stringify(tagsList) }, {
      where: {
        id: loginUser.id
      }
    });
    return res
  }
}

export default new UserService