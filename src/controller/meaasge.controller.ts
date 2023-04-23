import { Context } from 'koa'
import { Op } from 'sequelize'
import errorTypes from '../common/constant/error-types'
import { RequestTeamMessage } from '../common/type/requestParam'
import parmessage from '../model/parmessage_model'
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
  async getPerMessage(ctx: Context) {
    console.log(ctx.request.body)
    const acceptUserId = Number(ctx.request.body["acceptUserId"])
    console.log(acceptUserId)
    const userId = ctx["userInfo"].id
    const messageList = await parmessage.findAll({
      where: {
        isDelete: 0,
        [Op.or]: [
          {
            sendUserId: acceptUserId,
            acceptUserId: userId
          },
          {
            sendUserId: userId,
            acceptUserId: acceptUserId
          }
        ]
      }
    })
    resultUtils.successResult(ctx, messageList, "获取聊天记录成功")
  }
}
export const { getTeamMessage, getPerMessage } = new MessageController