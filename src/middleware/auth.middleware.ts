import { Context, Next } from "koa";

import errorTypes from "../common/constant/error-types";
import { sendError } from "../utils/sendError";

/**
 * 中间件：判断登陆是否有openId
 * @param ctx 
 * @param next 
 * @returns 
 */
export const verifyLogin = async (ctx: Context, next: Next) => {
  // 1.获取openId
  const loginCode = ctx.request.body["code"];
  // 2.判断openId
  if (!loginCode) {
    return sendError(errorTypes.PARAMS_ERROR, ctx, "code为空")
  }
  ctx.loginCode = loginCode
  await next();
}

/**
 * 中间件： 验证是否登陆
 * @param ctx 
 * @param next 
 */
export const verifyAuth = async (ctx: Context, next: Next) => {
  const userInfo = ctx.session["userInfo"]
  if (!userInfo) {
    return sendError(errorTypes.NOT_LOGIN, ctx, "请先登陆")
  }
  ctx.userInfo = userInfo
  await next();
}
export const verifyAdminAuth = async (ctx: Context, next: Next) => {
  const adminInfo = ctx.session["adminInfo"]
  if (!adminInfo) {
    return sendError(errorTypes.NOT_LOGIN, ctx, "请先登陆")
  }
  ctx.adminInfo = adminInfo
  await next();
}

/**
 * 
 * @param ctx 中间件：请求参数不能为空
 * @param next 
 * @returns 
 */
export const verifyParams = async (ctx: Context, next: Next) => {
  if (JSON.stringify(ctx.request.body) === "{}" && JSON.stringify(ctx.query) === "{}") {
    return sendError(errorTypes.PARAMS_ERROR, ctx, "请求参数不能为空")
  }
  await next();
}