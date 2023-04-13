import { Context, Next } from 'koa';
import userService from '../service/user.service';
import axios from 'axios';
import config from '../app/config';
import md5password from '../utils/password-handle';
import errorTypes from '../common/constant/error-types'
import resultUtils from '../utils/resultUtils';
import { getSafetyUser } from '../utils/SafetyUserUtils';
import user from '../model/user_model';
import { editAttr } from '../service/type/serviceType';
import { sendError } from '../utils/sendError';
import { RequestChangeUserTags } from '../common/type/requestParam';

class UserController {

  /**
   * 登陆
   * @param ctx 
   * @author hly
   * @param next 
   * @returns 
   */
  async userLogin(ctx: Context, next: Next) {
    // 1.发送请求，获取openId等信息
    const res = await axios.get('https://api.weixin.qq.com/sns/jscode2session?', {
      params: {
        appid: config.APP_ID,
        secret: config.APP_SECRET,
        js_code: ctx["loginCode"],
        grant_type: 'authorization_code'
      }
    })
    console.log(res.data)
    // 2.判断是否获取成功
    if (!res.data) {
      const error = new Error(errorTypes.PARAMS_ERROR);
      return ctx.app.emit('error', error, ctx, "code错误");
    }
    const openId = res.data.openid
    // 3.判断用户是否存在的
    let userInfo = await userService.getUserByOpenId(md5password(openId));
    // 4.若不存在，则进行注册
    if (!userInfo) {
      userInfo = await userService.createUser(md5password(openId))
      if (!userInfo) {
        const error = new Error(errorTypes.SYSTEM_ERROR);
        return ctx.app.emit('error', error, ctx, "注册失败");
      }
    }
    ctx.session["userInfo"] = getSafetyUser(userInfo)
    resultUtils.successResult(ctx, getSafetyUser(userInfo))

  }
  /**
   * 验证当前状态
   * @author hly
   * @param ctx
   * @returns 
   */
  async getCurrentUser(ctx: Context) {
    const userInfo = ctx["userInfo"]
    const id = userInfo.id
    const user = await userService.getUserById(id)
    const safeUser = getSafetyUser(user as user)
    resultUtils.successResult(ctx, safeUser)
  }
  /**
   * 通过标签查找用户
   * @author hly
   * @param ctx 
   * @param next 
   * @returns 
   */
  async userSearchBytags(ctx: Context, next: Next) {
    const tags: string = ctx.query.tags as string
    console.log(tags)
    const res = await userService.getUserByTags(JSON.parse(tags))
    resultUtils.successResult(ctx, res)
  }

  /**
   * 更新用户信息
   * @author hly
   * @param ctx 
   */
  async updateUser(ctx: Context) {
    if (JSON.stringify(ctx.request.body) == "{}") {
      return sendError(errorTypes.PARAMS_ERROR, ctx, "参数不能为空")
    }
    const editInfo: editAttr = ctx.request.body as editAttr
    const userInfo = ctx["userInfo"]
    const res = await userService.updateUser(ctx, editInfo, userInfo)
    resultUtils.successResult(ctx, res)
  }

  /**
   * 推荐用户
   * @param ctx
   * @author hly
   */
  async recommendUsers(ctx: Context) {
    const recommendUserList = await user.findAll({ offset: 0, limit: 20 })
    const userList = recommendUserList.map(userItem => {
      return getSafetyUser(userItem)
    })
    resultUtils.successResult(ctx, userList, "获取用户成功")
  }

  /**
   * 获取用户匹配的用户
   */
  async matchUsers(ctx: Context) {
    const searchKey = JSON.parse(ctx.query["searchKey"] as string)
    const loginUser = ctx["userInfo"]
    const matchUsers = await userService.matchUsers(ctx, loginUser, searchKey)
    resultUtils.successResult(ctx, matchUsers)
  }
  /**
   * 
   * @param ctx 修改用户标签
   */
  async changeTags(ctx: Context) {
    const tagsList = ctx.request.body["tagsList"] as RequestChangeUserTags
    const loginUser = ctx["userInfo"]
    const matchUsers = await userService.changeTags(ctx, loginUser, tagsList)
    resultUtils.successResult(ctx, matchUsers)
  }
}
export const { userLogin, userSearchBytags, getCurrentUser, updateUser, recommendUsers, matchUsers, changeTags } = new UserController