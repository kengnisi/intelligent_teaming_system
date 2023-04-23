import { Context } from "koa";
import Team from '../model/team_model';
import { LOCK, Op } from "sequelize"

import { RequestAddTeam, RequestGetTeam, RequestJoinTeam } from "../common/type/requestParam";
import { safeTeamInfo, safeUserInfo } from "../common/type/responseResultType";
import { sequelize } from '../app/database';
import UserTeam from '../model/userTeam_model';
import validata from '../utils/validata';
import { teamRule, searchTeamRules } from './rules/team'
import { sendError } from "../utils/sendError";
import errorTypes from "../common/constant/error-types";
import { editTeam, joinInfo } from "./type/serviceType";
import { where } from "sequelize";
import user from "../model/user_model";
import user_team from "../model/userTeam_model";
import { getSafetyUser } from "../utils/SafetyUserUtils";
import teamStatusEnum from "../common/emun/teamStatus";
import redisLock from "../app/RedisLock";
import { v1 as uuidv1 } from 'uuid';
import { RequestMatchKey } from "../common/type/requestParam"
import minDistance from "../utils/AlgorithmUtils2";
class TeamService {
  /**
   * 添加队伍
   * @author hly
   * @param ctx
   * @param teamInfo 
   * @param loginUser 
   * @returns 
   */
  async addTeam(ctx: Context, teamInfo: RequestAddTeam, loginUser: safeUserInfo) {
    if (teamInfo.status == 0) {
      Reflect.deleteProperty(teamInfo, "password");
      Reflect.deleteProperty(teamRule, "password");
    }
    const loginUserId = loginUser.id
    teamInfo.userId = loginUserId
    const res = await validata<RequestAddTeam>(teamInfo, teamRule)
    if (res.error !== null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, res.error)
    }
    const userAndteam = await UserTeam.findAll({
      where: {
        userId: `${loginUserId}`,
        isDelete: 0
      }
    })
    if (userAndteam.length >= 5) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "个人最多创建或加入5个队伍")
    }
    // 事务
    try {
      const result = await sequelize.transaction(async (t) => {
        const res = await Team.create<Team>(teamInfo, { transaction: t })
        const relation = {
          id: null,
          userId: res.userId,
          teamId: res.id,
          joinTime: new Date()
        }
        await UserTeam.create(relation, { transaction: t })
        return res.id
      });
      return {
        teamid: result
      }
      // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
      // `result` 就是从事务回调中返回的结果(在这种情况下为 `user`)

    } catch (error) {
      console.log(error)
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      return sendError(errorTypes.PARAMS_ERROR, ctx, "创建队伍失败")
    }
  }

  /**
   * 修改队伍
   * @author hly
   * @param ctx 
   * @param updateInfo 
   * @param loginUser 
   * @returns 
   */
  async updateTeam(ctx: Context, updateInfo: editTeam, loginUser: safeUserInfo) {
    if (updateInfo.status == 0) {
      Reflect.deleteProperty(updateInfo, "password");
      Reflect.deleteProperty(teamRule, "password");
    }
    const loginUserId = loginUser.id
    const res = await validata<RequestAddTeam>(updateInfo, teamRule)
    if (res.error !== null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, res.error)
    }
    const teamId = updateInfo.id
    if (teamId == null || teamId < 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const teamItem: Team = await Team.findOne({ where: { id: `${teamId}`, isDelete: 0 } })
    if (teamItem === null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍不存在")
    }
    if (teamItem.userId !== loginUserId) {
      return sendError(errorTypes.NO_AUTH, ctx, "无权限修改")
    }
    const teamNum = await user_team.count({
      where: {
        teamId: `${teamId}`,
        isDelete: 0
      }
    })
    console.log(teamNum)
    if (teamNum > updateInfo.maxNum) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍限制人数不能小于现有人数")
    }
    console.log(updateInfo)
    const updateRes = await Team.update(
      updateInfo,
      {
        where: {
          id: `${teamId}`
        }
      }
    )
    console.log(updateRes)
    return updateRes
  }
  /**
   * 根据队伍id获取队伍信息
   * @param ctx 
   * @param teamId 
   * @returns 
   */
  async teamById(ctx: Context, teamId: number) {
    if (teamId < 0 || teamId == null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍Id错误")
    }
    const rearchCondition = {
      where: {
        id: `${teamId}`
      }
    }
    const teamInfo = await this.getTeamByCondition(ctx, rearchCondition, true)
    return teamInfo
  }


  /**
   * 根据搜索内容返回队伍的信息，创建人信息，队伍成员信息
   * @param ctx 
   * @param searchInfo 
   * @returns 
   */
  async getTeamList(ctx: Context, searchInfo: RequestGetTeam) {
    // 验证传输内容
    const res = await validata<RequestGetTeam>(searchInfo, searchTeamRules)
    if (res.error !== null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, res.error)
    }
    // 搜索条件未处理
    const condition = res.data
    // 搜索条件结果
    const searchCondition = {}
    // 处理搜索条件
    for (const key in condition) {
      if (Object.prototype.hasOwnProperty.call(condition, key) && (!condition[key] == false || condition[key] == 0)) {
        // 队伍id
        if (key == "teamId") {
          searchCondition["id"] = condition[key]
          continue
        }
        // 队伍id列表
        if (key == "teamIdList") {
          searchCondition["id"] = condition[key]
          continue
        }
        // 队伍名称或描述
        if (key == "name" || key == "description") {
          searchCondition[key] = {
            [Op.substring]: [condition[key]],
          }
          continue
        }
        // 搜索关键内容
        if (key == "searchText") {
          searchCondition[Op.or] = [
            {
              name: {
                [Op.substring]: condition[key]
              }
            },
            {
              description: {
                [Op.substring]: condition[key]
              }
            }
          ]
          continue
        }
        if (key == "maxNum") {
          searchCondition[key] = {
            [Op.lte]: condition[key]
          }
          continue
        }
        if (key == "expireTime") {
          searchCondition[key] = {
            [Op.gt]: new Date(condition[key])
          }
          continue
        }
        searchCondition[key] = condition[key]
      }
    }
    if (!searchCondition["status"]) {
      searchCondition["status"] = { [Op.ne]: 1 }
    }
    if (!searchCondition["expireTime"]) {
      searchCondition["expireTime"] = { [Op.gt]: new Date() }
    }
    const start = process.hrtime();
    // 包装搜索条件
    const conditionResult = {
      where: searchCondition
    }
    const safeTeamList = await this.getTeamByCondition(ctx, conditionResult, true)
    const end = process.hrtime(start);
    console.log(`程序运行了 ${end[0]} 秒 ${end[1] / 1000000} 毫秒`);
    if (typeof safeTeamList === "boolean") {
      return safeTeamList
    }
    return {
      teamList: safeTeamList.safeTeamList
    }
  }

  async getTeamListPage(ctx: Context, page: number = 1, limit: number = 15) {
    if (page == null || page < 1 || limit == null || limit < 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const searchCondition = {
      where: {
        status: {
          [Op.ne]: 1,
        },
        expireTime: {
          [Op.gt]: new Date(),
        }
      }
    }
    const res = await this.getTeamByCondition(ctx, searchCondition, true)
    if (typeof res == "boolean") {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍Id错误")
    }
    const resList = res["safeTeamList"].slice((page - 1) * limit, (page - 1) * limit + limit)
    return {
      safeTeamList: resList,
      count: res["safeTeamList"].length
    }
  }

  async joinTeam(ctx: Context, joinInfo: RequestJoinTeam, loginUser: safeUserInfo) {
    if (joinInfo == null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    const teamId = joinInfo.teamId
    const team = await this.getTeamById(ctx, teamId)
    if (typeof team === "boolean") {
      return team
    }
    const status = team.teamInfo["status"]
    if (teamStatusEnum.PRIVATE == status) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "禁止加入私有队伍")
    }
    if (team.teamInfo["expireTime"] < new Date()) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍已过期")
    }
    if (teamStatusEnum.PASSWORD == status) {
      const password = joinInfo.password
      if (password !== team.teamInfo["password"]) {
        return sendError(errorTypes.PARAMS_ERROR, ctx, "密码错误")
      }
    }
    const userId = loginUser.id
    // 使用分布式锁
    try {
      // 生成任务的唯一id
      // 防止释放其他任务的锁
      const id = uuidv1();
      await redisLock.lock("joinTeam", id, 20);
      const joinNum = await user_team.count({
        where: {
          userId,
          isDelete: 0
        }
      })
      if (joinNum >= 5) {
        const unLock = await redisLock.unLock("joinTeam", id);
        console.log('unLock: ', "joinTeam", id, unLock);
        return sendError(errorTypes.PARAMS_ERROR, ctx, "最多创建或加入5个队伍")
      }
      const isJoinTeam = await user_team.count({
        where: {
          userId,
          teamId,
          isDelete: 0
        }
      })
      if (isJoinTeam > 0) {
        const unLock = await redisLock.unLock("joinTeam", id);
        console.log('unLock: ', "joinTeam", id, unLock);
        return sendError(errorTypes.PARAMS_ERROR, ctx, "已在队伍当中")
      }
      const teamHasNum = await user_team.count({
        where: {
          teamId,
          isDelete: 0
        }
      })
      if (teamHasNum >= team.teamInfo["maxNum"]) {
        const unLock = await redisLock.unLock("joinTeam", id);
        console.log('unLock: ', "joinTeam", id, unLock);
        return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍已满")
      }
      const res = await user_team.create({
        userId,
        teamId,
        joinTime: new Date()
      })

      const unLock = await redisLock.unLock("joinTeam", id);
      console.log('unLock: ', "joinTeam", id, unLock);
      return res
    } catch (err) {
      console.log('上锁失败', err);
    }


    // const joinNum = await user_team.count({
    //   where: {
    //     userId,
    //     isDelete: 0
    //   }
    // })
    // if (joinNum >= 5) {
    //   return sendError(errorTypes.PARAMS_ERROR, ctx, "最多创建或加入5个队伍")
    // }
    // const isJoinTeam = await user_team.count({
    //   where: {
    //     userId,
    //     teamId
    //   }
    // })
    // if (isJoinTeam > 0) {
    //   return sendError(errorTypes.PARAMS_ERROR, ctx, "已在队伍当中")
    // }
    // const teamHasNum = await user_team.count({
    //   where: {
    //     teamId,
    //     isDelete: 0
    //   }
    // })
    // if (teamHasNum >= team.teamInfo["maxNum"]) {
    //   return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍已满")
    // }
    // return await user_team.create({
    //   userId,
    //   teamId,
    //   joinTime: new Date()
    // })
  }

  async deleteTeam(ctx: Context, deleteId: number, loginUser: safeUserInfo) {
    const team = await this.getTeamById(ctx, deleteId)
    console.log("team", team)
    if (typeof team === "boolean") {
      return team
    }
    if (team.teamInfo["userId"] != loginUser.id) {
      return sendError(errorTypes.NO_AUTH, ctx, "你不是队长，无权限解散")
    }
    const updateResult = await user_team.update({ isDelete: 1 }, {
      where: {
        teamId: deleteId
      }
    })
    if (updateResult["affectedCount"] == 0) {
      return sendError(errorTypes.SYSTEM_ERROR, ctx, "删除队伍关联信息错误")
    }
    return await Team.update({ isDelete: 1 }, {
      where: {
        id: deleteId
      }
    })
  }

  async quitTeam(ctx: Context, quitTeamId: number, loginUser: safeUserInfo) {
    const team = await this.getTeamById(ctx, quitTeamId)
    if (typeof team === "boolean") {
      return team
    }
    const loginUserId = loginUser.id
    const userTeam = await user_team.count({
      where: {
        userId: loginUserId,
        teamId: quitTeamId,
        isDelete: 0
      }
    })
    if (userTeam == 0) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "未加入队伍")
    }
    const teamCount = await user_team.count({
      where: {
        teamId: quitTeamId
      }
    })
    // 使用sequelizse的事务，sql发生错误时回退
    try {
      const result = await sequelize.transaction(async (t) => {
        if (teamCount == 1) {
          const res = this.deleteTeam(ctx, quitTeamId, loginUser)
          if (typeof res === "boolean") {
            return res
          }
        } else {
          // 队伍还剩至少两人
          // 是队长
          if (team.teamInfo.userId == loginUserId) {
            const userTeamList = await user_team.findAll({
              where: {
                teamId: quitTeamId,
                isDelete: 0
              },
              limit: 2,
              order: [[
                'id', 'ASC'
              ]]
            })
            console.log("userTeamList", userTeamList)
            if (userTeamList == null || userTeamList.length <= 1) {
              return sendError(errorTypes.SYSTEM_ERROR, ctx)
            }
            const nextUserTeamId = userTeamList[1].userId
            const updateRes = await Team.update({ userId: nextUserTeamId }, {
              where: {
                id: quitTeamId
              },
              transaction: t
            },

            )
            if (updateRes[0] != 1) {
              return sendError(errorTypes.SYSTEM_ERROR, ctx, "更新队伍队长失败")
            }
          }
        }

        const res = await user_team.update({ isDelete: 1 }, {
          where: {
            teamId: quitTeamId,
            userId: loginUserId
          },
          transaction: t
        })
        console.log("==============", res)
        if (res[0] == 0) {
          return sendError(errorTypes.SYSTEM_ERROR, ctx, "退出失败")
        }
        return {
          res
        }
      });
      return result
      // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
      // `result` 就是从事务回调中返回的结果(在这种情况下为 `user`)

    } catch (error) {
      console.log(error)
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error)
      return sendError(errorTypes.PARAMS_ERROR, ctx, "退出失败")
    }

  }

  async getMyCreateTeam(ctx: Context, loginUser: safeUserInfo) {
    const conditionResult = {
      where: {
        userId: loginUser.id,
        status: [0, 1, 2]
      }
    }
    const res = await this.getTeamByCondition(ctx, conditionResult, false)
    return res
  }

  async getMyJoinTeam(ctx: Context, loginUser: safeUserInfo) {
    // 获取用户和队伍关系
    const myJoinTeamList = await user_team.findAll({
      where: {
        userId: loginUser.id,
        isDelete: 0
      }
    })
    const joinTeamList = myJoinTeamList.map(teamItem => {
      return teamItem.teamId
    })
    const conditionResult = {
      where: {
        id: joinTeamList,
        status: [0, 1, 2]
      }
    }
    const res = await this.getTeamByCondition(ctx, conditionResult, false)
    return res
  }
  /**
   * 根据搜索条件搜索队伍
   * @param ctx 
   * @param condition 
   * @param isDelete 
   * @returns 
   */
  async getTeamByCondition(ctx: Context, condition: object, isDelete: boolean) {
    condition["where"]["isDelete"] = isDelete ? 0 : [0, 1],
      console.log(condition);

    Team.hasMany(user_team, { foreignKey: "teamId" })
    user_team.belongsTo(user, { foreignKey: "userId" })
    const { rows, count } = await Team.findAndCountAll({
      ...condition,
      include: [{
        model: user_team,
        where: {
          isDelete: 0
        },
        include: [{
          model: user,
          where: {
            isDelete: 0
          }
        }]
      }],
      subQuery: false
    })
    if (rows == null) {
      return sendError(errorTypes.NULL_ERROR, ctx, "队伍不存在")
    }
    console.log("条件搜索中", rows.length)
    // 返回的安全数组列表信息,添加创建人，成员信息
    const safeTeamList: Array<safeTeamInfo> = []
    for (const iterator of rows) {
      const createUser = await user.findOne({
        where: {
          id: iterator.userId
        }
      })
      const userList = []
      for (const userIterator of iterator["user_teams"]) {
        if (userIterator.user.id == iterator.userId) {
          continue
        }
        userList.push(userIterator.user)
      }
      const safeTeam: safeTeamInfo = {
        id: iterator.id,
        userId: iterator.userId,
        name: iterator.name,
        description: iterator.description,
        maxNum: iterator.maxNum,
        status: iterator.status,
        expireTime: iterator.expireTime,
        createTime: iterator.createTime,
        updateTime: iterator.updateTime,
        createUser: getSafetyUser(createUser),
        teamMembers: userList,
        isDelete: iterator.isDelete
      }
      safeTeamList.push(safeTeam)
    }
    if (rows == null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数错误")
    }
    return { safeTeamList, count }
  }

  /**
   * 根据队伍id获取队伍信息
   * @param ctx 
   * @param teamId 
   * @returns 
   */
  async getTeamById(ctx: Context, teamId: number) {
    if (teamId < 0 || teamId == null) {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "队伍Id错误")
    }
    console.log("teamById", teamId)
    const teamInfo = await Team.findOne({
      where: {
        id: teamId,
        isDelete: {
          [Op.ne]: 1
        }
      }
    })
    if (teamInfo == null) {
      return sendError(errorTypes.NULL_ERROR, ctx, "队伍不存在")
    }
    return {
      teamInfo
    }
  }

  /**
   * 获取匹配队伍
   * @param ctx 
   * @param loginUser 
   * @param searchKey 
   * @param page 
   * @param limit 
   * @returns 
   */
  async getMatchTeam(ctx: Context, loginUser, searchKey: RequestMatchKey, page: number = 1, limit: number = 15) {
    console.log(searchKey[0])
    const start = process.hrtime();
    const teamList = await Team.findAll({
      attributes: ['id', 'name', 'description'],
      where: {
        userId: {
          [Op.ne]: loginUser.id
        },
        expireTime: {
          [Op.gt]: new Date()
        },
        isDelete: 0
      }
    })
    const end = process.hrtime(start);
    console.log(`程序运行了 ${end[0]} 秒 ${end[1] / 1000000} 毫秒`);
    const searchContext = [...loginUser.tags, ...searchKey as any].join("")
    console.log("searchContext", searchContext)
    let matchTeams = new Array()
    for (const iterator of teamList) {
      const name = iterator.name
      if (name == null || name == "") {
        continue
      }
      const distance = minDistance(name, searchContext)
      if (distance == 0) {
        continue
      }
      matchTeams.push({
        distance,
        teamInfo: iterator
      })
    }
    matchTeams = matchTeams.sort((a, b) => {
      return b.distance - a.distance
    })
    const teamIdList = matchTeams.map((team) => {
      return team.teamInfo["id"]
    })
    console.log(teamIdList)
    const resTeamList = await this.getTeamByCondition(ctx, {
      where: {
        id: {
          [Op.in]: teamIdList
        }
      }
    }, true)
    if (typeof resTeamList === "boolean") {
      return resTeamList
    }
    const finalTeamList = []
    // @ts-ignore
    for (const safeTeam of resTeamList.safeTeamList) {
      const index = teamIdList.indexOf(safeTeam.id)
      finalTeamList[index] = safeTeam
    }
    const resList = finalTeamList.slice((page - 1) * limit, (page - 1) * limit + limit)
    return { resList, count: finalTeamList.length }
  }
}

export default new TeamService