
import Router from "koa-router";

import {
  userLogin,
  userSearchBytags,
  getCurrentUser,
  updateUser,
  recommendUsers,
  matchUsers,
  changeTags,
  userSearchById
} from '../controller/user.controller'
import { verifyLogin, verifyAuth, verifyParams } from '../middleware/auth.middleware'
const userRouter = new Router({ prefix: '/user' })
import { Context } from "vm";

userRouter.post('/login', verifyLogin, userLogin)
userRouter.get('/search/id', verifyParams, userSearchById)
userRouter.get('/search/tags', verifyParams, userSearchBytags)
userRouter.get('/current', verifyAuth, getCurrentUser)
userRouter.post('/update', verifyAuth, updateUser)
// @ts-ignore
userRouter.get('/recommend', recommendUsers)
// @ts-ignore
userRouter.get('/match', verifyAuth, verifyParams, matchUsers)
// @ts-ignore
userRouter.post('/changeTags', verifyAuth, verifyParams, changeTags)


userRouter.post("/test", async (ctx: Context) => {
  ctx.session.userInfo = "hly"
  console.log(ctx.session.userInfo)
  const userInfo = ctx.session.userInfo
  ctx.body = {
    userInfo: userInfo
  }
})
userRouter.post("/getUserInfo", async (ctx: Context) => {
  console.log(ctx)
  console.log(ctx.header['set-cookie'])
})

module.exports = userRouter
// export default userRouter