import Tags from "../model/tagList_model"
import { cTagRule } from "./rules/tag"
import { RequestCreateTag, RequestDeleteCTag, RequestDeletePTag, RequestUpdateTag } from "../common/type/requestParam"
import { Context } from "koa"
import validata from "../utils/validata"
import errorTypes from "../common/constant/error-types"
import { sendError } from "../utils/sendError"
import Tag from "../model/tagList_model"
import { Op } from "sequelize"

class MessageService {
  async getTagsList() {
    const res = await Tags.findAll({
      where: {
        isDelete: 0
      }
    })
    return res.map(item => {
      const { id, parentId, isParent, tagName } = item
      return { id, parentId, isParent, tagName }
    })
  }
  async createTag(ctx: Context, userId: number, tagInfo: RequestCreateTag) {
    if (tagInfo.isParent == 1) {
      tagInfo.parentId = null
    }
    tagInfo.userId = userId
    const isAccord = await validata<RequestCreateTag>(tagInfo, cTagRule)
    if (isAccord.error !== null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, isAccord.error)
    }
    try {
      const res = await Tags.create(isAccord.data)
      return res
    } catch (error) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "标签已存在")
    }
  }

  // 删除整个标签组
  async deletePtag(ctx: Context, userId: number, deleteInfo: RequestDeletePTag) {
    const { parentId } = deleteInfo
    const isDelete = await Tag.update({ isDelete: 1 }, {
      where: {
        [Op.or]: [
          {
            id: parentId,
          },
          {
            parentId: parentId
          }
        ]

      }
    })
    console.log(isDelete)
    return isDelete
  }
  // 删除
  async deleteCtag(ctx: Context, userId: number, deleteInfo: RequestDeleteCTag) {
    const { children, parentId } = deleteInfo
    const isDelete = await Tag.update({ isDelete: 1 }, {
      where: {
        id: children,
        parentId
      }
    })
    console.log(isDelete)
    return isDelete
  }
  // 修改
  async updateTag(ctx: Context, updateInfo: RequestUpdateTag) {
    const { id, text } = updateInfo
    const updateRes = await Tag.update({ tagName: text }, {
      where: {
        [Op.and]: [
          {
            id: id,
          },
          {
            isDelete: {
              [Op.eq]: 0
            }
          }
        ]

      }
    })
    return {
      updateRes
    }
  }
}
export default new MessageService