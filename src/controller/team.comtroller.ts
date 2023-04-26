import { Context } from 'koa';

import { sendError } from '../utils/sendError';
import errorTypes from '../common/constant/error-types';
import teamService from '../service/team.service';
import { RequestAddTeam, RequestJoinTeam } from '../common/type/requestParam';
import resultUtils from '../utils/resultUtils';
import { editTeam } from '../service/type/serviceType';
import Team from '../model/team_model';
import user from '../model/user_model';
import user_team from '../model/userTeam_model';
import console from 'console';
import paginate from '../utils/paginate';


class TeamController {
  /**
   * 添加队伍
   * @author hly
   * @param ctx 
   * @returns 
   */
  async addTeam(ctx: Context) {
    if (JSON.stringify(ctx.request.body) == "{}") {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数不能为空")
    }

    const userInfo = ctx["userInfo"]
    const teamInfo: RequestAddTeam = ctx.request.body as RequestAddTeam
    const res = await teamService.addTeam(ctx, teamInfo, userInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "创建队伍成功")
  }

  /**
   * 修改队伍信息
   * @author hly
   * @param ctx 
   * @returns 
   */
  async updateTeam(ctx: Context) {
    if (JSON.stringify(ctx.request.body) == "{}") {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数不能为空")
    }
    const userInfo = ctx["userInfo"]
    const updateInfo: editTeam = ctx.request.body as editTeam
    console.log(updateInfo)
    const res = await teamService.updateTeam(ctx, updateInfo, userInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "修改队伍信息成功")
  }

  /**
   * 根据队伍Id获取用户
   * @param ctx 
   * @returns 
   */
  async getTeamById(ctx: Context) {
    const teamId = Number(ctx.query.teamId)
    if (!teamId || teamId < 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍Id错误")
    }
    const res = await teamService.teamById(ctx, teamId)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res.safeTeamList, "获取队伍信息成功")
  }

  /**
   * 获取队伍信息列表
   * @param ctx
   * @returns 
   */
  async getTeamList(ctx: Context) {
    // 小程序的参数会自动变为字符串后期要改
    const searchInfo = ctx.request.body
    console.log(ctx.request.body);

    console.log("searchInfo", searchInfo)
    const res = await teamService.getTeamList(ctx, searchInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "获取队伍信息成功")
  }

  /**
   * 分页查找队伍列表
   * @param ctx
   */
  async getTeamListPage(ctx: Context) {
    const { page, limit } = ctx.query
    if (page == null || Number(page) < 1 || limit == null || Number(limit) < 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const res = await teamService.getTeamListPage(ctx, Number(page), Number(limit))
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res, "获取列表成功")
    // @ts-ignore
    resultUtils.successResult(ctx, paginate(res.safeTeamList, Number(page), res.count, Number(limit)), "获取用户成功")
  }

  async joinTeam(ctx: Context) {
    if (!ctx.request.body) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const joinInfo: RequestJoinTeam = ctx.request.body as RequestJoinTeam
    const res = await teamService.joinTeam(ctx, joinInfo, ctx.userInfo)
    if (typeof res === "boolean") {
      return res
    }
    return resultUtils.successResult(ctx, res, "加入队伍成功")
  }

  async guanlian(ctx: Context) {
    Team.hasMany(user_team, { foreignKey: "teamId" })
    user_team.belongsTo(user, { foreignKey: "userId" })
    const res = await Team.findAll({
      where: {
        id: 49
      },
      include: [{
        model: user_team,
        include: [{
          model: user,
          where: {
            isDelete: 0
          }
        }]
      }]
    })
    const userList = []
    for (const iterator of res[0]["user_teams"]) {
      userList.push(iterator.user)
    }
    ctx.body = {
      res,
      userList
    }
  }

  async deleteTeam(ctx: Context) {
    const teamId = Number(ctx.request.body["teamId"])
    console.log(teamId)
    if (!teamId || teamId <= 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const loginUser = ctx["userInfo"]
    const res = await teamService.deleteTeam(ctx, teamId, loginUser)
    if (typeof res === "boolean") {
      return res
    }
    return resultUtils.successResult(ctx, res, "解散成功")
  }

  async quitTeam(ctx: Context) {
    const teamId = ctx.request.body["teamId"]
    console.log("quitTeam", teamId)
    if (teamId == null || teamId < 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const loginUser = ctx["userInfo"]
    const res = await teamService.quitTeam(ctx, teamId as number, loginUser)
    if (typeof res === "boolean") {
      return res
    }
    return resultUtils.successResult(ctx, res, "退出成功")

  }

  async getMyCreateTeam(ctx: Context) {
    const userInfo = ctx.userInfo
    const res = await teamService.getMyCreateTeam(ctx, userInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res.safeTeamList, "我创建的队伍")
  }

  async getMyJoinTeam(ctx: Context) {
    const userInfo = ctx.userInfo
    const res = await teamService.getMyJoinTeam(ctx, userInfo)
    if (typeof res === "boolean") {
      return res
    }
    resultUtils.successResult(ctx, res.safeTeamList, "我所在的队伍")

  }
  async getMatchTeam(ctx: Context) {
    const searchKey = JSON.parse(ctx.query["searchKey"] as string)
    const page = ctx.query.page
    const limit = ctx.query.limit
    const loginUser = ctx["userInfo"]
    const matchTeam = await teamService.getMatchTeam(ctx, loginUser, searchKey, Number(page), Number(limit))
    //@ts-ignore
    resultUtils.successResult(ctx, paginate(matchTeam.resList, Number(page), matchTeam.count, Number(limit)), "获取用户成功")
  }


}
export const { addTeam, deleteTeam, updateTeam, getTeamById, getTeamList, getTeamListPage, joinTeam, quitTeam, getMyCreateTeam, getMyJoinTeam, getMatchTeam, guanlian } = new TeamController