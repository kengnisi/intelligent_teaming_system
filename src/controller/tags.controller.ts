import { Context } from 'koa'
import errorTypes from '../common/constant/error-types'
import { RequestCreateTag, RequestDeleteCTag, RequestDeletePTag, RequestPageUser, RequestTeamMessage, RequestUpdateTag } from '../common/type/requestParam'
import tagsService from '../service/tags.service'
import resultUtils from '../utils/resultUtils'
import { sendError } from '../utils/sendError'
class TagsController {
  async getTagsList(ctx: Context) {
    const res = await tagsService.getTagsList()
    resultUtils.successResult(ctx, res, "获取标签成功")
  }
  async createTag(ctx: Context) {
    const currentLogin = ctx.adminInfo
    const tagInfo: RequestCreateTag = ctx.request.body as RequestCreateTag
    const res = await tagsService.createTag(ctx, currentLogin.id, tagInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "创建标签成功")
  }
  // 修改标签
  async updateTag(ctx: Context) {
    const currentLogin = ctx.adminInfo
    const updateInfo: RequestUpdateTag = ctx.request.body as RequestUpdateTag
    const res = await tagsService.updateTag(ctx, updateInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "修改标签成功")
  }
  // 删除单个子标签
  async deleteCtag(ctx: Context) {
    const currentLogin = ctx.adminInfo
    const deleteInfo: RequestDeleteCTag = ctx.request.body as RequestDeleteCTag
    const res = await tagsService.deleteCtag(ctx, currentLogin.id, deleteInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "删除标签成功")
  }
  // 删除整个标签组
  async deletePtag(ctx: Context) {
    const currentLogin = ctx.adminInfo
    const deleteInfo: RequestDeletePTag = ctx.request.body as RequestDeletePTag
    console.log(deleteInfo)
    const res = await tagsService.deletePtag(ctx, currentLogin.id, deleteInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "删除标签成功")
  }

}
export const { getTagsList, createTag, deleteCtag, deletePtag, updateTag } = new TagsController