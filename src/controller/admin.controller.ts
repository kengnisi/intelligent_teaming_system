import { Context, Next } from 'koa';
import adminService from '../service/admin.service';
import axios from 'axios';
import config from '../app/config';
import md5password from '../utils/password-handle';
import errorTypes from '../common/constant/error-types'
import resultUtils from '../utils/resultUtils';
import { getSafetyUser } from '../utils/SafetyUserUtils';
import { RequestAdminInfo, RequestDeleteUser, RequestPageUser } from '../common/type/requestParam'
import user from '../model/user_model';
import { URLSearchParams } from "url"
import paginate from '../utils/paginate';
import { Op } from 'sequelize';
import Team from '../model/team_model';
import user_team from '../model/userTeam_model';
import { sendError } from '../utils/sendError';
import teamService from '../service/team.service';

class AdminController {

  /**
   * 登陆
   * @param ctx 
   * @author hly
   * @param next 
   * @returns 
   */
  async adminLogin(ctx: Context, next: Next) {
    console.log("controll", ctx.request.body)
    const { account, password } = ctx.request.body as RequestAdminInfo
    if (!account || !password) {
      const error = new Error(errorTypes.PARAMS_ERROR);
      return ctx.app.emit('error', error, ctx, "账号或密码不能为空");
    }
    const adminInfo = await adminService.getAdminByAccount(account, password)
    if (!adminInfo) {
      const error = new Error(errorTypes.PARAMS_ERROR);
      return ctx.app.emit('error', error, ctx, "账号或密码错误");
    }
    ctx.session["adminInfo"] = adminInfo
    resultUtils.successResult(ctx, adminInfo)
  }
  /**
   * 验证当前状态
   * @author hly
   * @param ctx
   * @returns 
   */
  async getCurrentAdmin(ctx: Context) {
    console.log(ctx.session)
    const adminInfo = ctx.session["adminInfo"]
    const account = adminInfo["userAccount"]
    const admin = await adminService.getAdminById(account)
    resultUtils.successResult(ctx, admin)
  }
  async adminlogout(ctx: Context) {
    console.log("我要退出")
    ctx.session["adminInfo"] = null
    resultUtils.successResult(ctx, {})
  }
  // 获取所有用户
  async getAllUser(ctx: Context) {
    const userList = await user.findAll()
    resultUtils.successResult(ctx, userList)
  }
  // 分页获取用户信息
  async getUserListPage(ctx: Context) {
    const { limit, page, searchKey } = ctx.request.body as RequestPageUser
    const searchCondition = {
      where: {
        isDelete: {
          [Op.eq]: 0
        }
      },
      limit: Number(limit),
      offset: (page - 1) * limit
    }
    if (!!searchKey) {
      searchCondition.where[Op.or] = [
        {
          id: {
            [Op.substring]: searchKey
          }
        },
        {
          username: {
            [Op.substring]: searchKey
          }
        },
        {
          profile: {
            [Op.substring]: searchKey
          }
        }
      ]
    }
    const { rows, count } = await user.findAndCountAll(searchCondition)

    resultUtils.successResult(ctx, paginate(rows, page, count, limit))
  }

  // 删除用户
  async deleteUser(ctx: Context) {
    const { idList } = ctx.request.body as RequestDeleteUser
    console.log(idList)
    const deleteUsers = await user.update({ isDelete: 1 }, {
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: idList
            }
          },
          {
            isDelete: {
              [Op.eq]: 0
            }
          }
        ]

      }
    })
    resultUtils.successResult(ctx, deleteUsers, "删除成功")
  }

  // 修改用户信息
  async updateUserInfo(ctx: Context) {
    // @ts-ignore
    const { userInfo } = ctx.request.body
    console.log(userInfo)
    userInfo.tags = JSON.stringify(userInfo.tags)
    const updateRes = await user.update(userInfo, {
      where: {
        id: userInfo.id
      }
    })
    resultUtils.successResult(ctx, updateRes, "修改成功")
  }
  async updateTeamInfo(ctx: Context) {
    const updateInfo = ctx.request.body
    const updateRes = await Team.update(
      updateInfo,
      {
        where: {
          // @ts-ignore
          id: updateInfo.id
        }
      }
    )
    resultUtils.successResult(ctx, updateRes, "修改成功")
  }
  async deletTeam(ctx: Context) {
    const deletTeamId = ctx.request.body["deleteId"]
    console.log(deletTeamId[0])
    const updateResult = await user_team.update({ isDelete: 1 }, {
      where: {
        teamId: {
          [Op.in]: deletTeamId,
        }
      }
    })
    if (updateResult["affectedCount"] == 0) {
      return sendError(errorTypes.SYSTEM_ERROR, ctx, "删除队伍关联信息错误")
    }
    const res = await Team.update({ isDelete: 1 }, {
      where: {
        id: {
          [Op.in]: deletTeamId,
        }
      }
    })
    resultUtils.successResult(ctx, res, "删除队伍成功")
  }
  async searchTeam(ctx: Context) {
    const { limit, page, searchKey } = ctx.request.body as RequestPageUser
    const searchCondition = {
      where: {
        isDelete: {
          [Op.eq]: 0
        }
      },
      limit: Number(limit),
      offset: (page - 1) * limit
    }
    if (!!searchKey) {
      searchCondition.where[Op.or] = [
        {
          id: {
            [Op.substring]: searchKey
          }
        },
        {
          name: {
            [Op.substring]: searchKey
          }
        },
        {
          description: {
            [Op.substring]: searchKey
          }
        }
      ]
    }
    //@ts-ignore
    const { safeTeamList, count } = await teamService.getTeamByCondition(ctx, searchCondition)

    resultUtils.successResult(ctx, paginate(safeTeamList, page, count, limit))
  }
}
export const { adminLogin, getCurrentAdmin, adminlogout, getAllUser, getUserListPage, deleteUser, updateUserInfo, updateTeamInfo, deletTeam, searchTeam } = new AdminController