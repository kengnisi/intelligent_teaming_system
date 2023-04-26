
import Router from "koa-router";
import { verifyAuth, verifyParams } from '../middleware/auth.middleware';
import { getTeamMessage, getPerMessage, getAllPerMessage } from '../controller/meaasge.controller'
const messageRouter = new Router({ prefix: '/message' })

messageRouter.post("/teamMessage", verifyAuth, getTeamMessage)
messageRouter.post("/perMessage", verifyAuth, getPerMessage)
messageRouter.post("/allPerMessage", verifyAuth, getAllPerMessage)




module.exports = messageRouter
// export default userRouter