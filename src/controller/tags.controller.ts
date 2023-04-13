import { Context } from 'koa'
import errorTypes from '../common/constant/error-types'
import { RequestCreateTag, RequestTeamMessage } from '../common/type/requestParam'
import tagsService from '../service/tags.service'
import resultUtils from '../utils/resultUtils'
import { sendError } from '../utils/sendError'
class TagsController {
  async getTagsList(ctx: Context) {
    const res = await tagsService.getTagsList()
    resultUtils.successResult(ctx, res, "获取标签成功")
  }
  async createTag(ctx: Context) {
    const currentLogin = ctx.userInfo
    const tagInfo: RequestCreateTag = ctx.request.body as RequestCreateTag
    const res = await tagsService.createTag(ctx, currentLogin.id, tagInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "创建标签成功")
  }
  async updateTag(ctx: Context) {
    const currentLogin = ctx.userInfo
    const tagInfo: RequestCreateTag = ctx.request.body as RequestCreateTag
    const res = await tagsService.createTag(ctx, currentLogin.id, tagInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "创建标签成功")
  }
  async deleteTag(ctx: Context) {
    const currentLogin = ctx.userInfo
    const tagInfo: RequestCreateTag = ctx.request.body as RequestCreateTag
    const res = await tagsService.createTag(ctx, currentLogin.id, tagInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "创建标签成功")
  }
}
export const { getTagsList, createTag } = new TagsController