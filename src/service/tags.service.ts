import Tags from "../model/tagList_model"
import { cTagRule } from "./rules/tag"
import { RequestCreateTag } from "../common/type/requestParam"
import { Context } from "koa"
import validata from "../utils/validata"
import errorTypes from "../common/constant/error-types"
import { sendError } from "../utils/sendError"

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
}
export default new MessageService