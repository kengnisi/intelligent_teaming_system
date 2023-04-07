import { Context } from 'koa'
import errorTypes from '../common/constant/error-types'
import { RequestTeamMessage } from '../common/type/requestParam'
import messageService from '../service/message.service'
import resultUtils from '../utils/resultUtils'
import { sendError } from '../utils/sendError'
class MessageController {
  async getTeamMessage(ctx: Context) {
    if (JSON.stringify(ctx.request.body) == "{}") {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数不能为空")
    }
    const { teamId } = ctx.request.body as RequestTeamMessage
    const res = await messageService.getTeamMessage(teamId)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "查询成功")
  }
}
export const { getTeamMessage } = new MessageController