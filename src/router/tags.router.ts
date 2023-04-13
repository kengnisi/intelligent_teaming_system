
import Router from "koa-router";
import { verifyAuth, verifyParams } from '../middleware/auth.middleware';
import { getTagsList, createTag } from '../controller/tags.controller'
const tagsRouter = new Router({ prefix: '/tags' })

// @ts-ignore
tagsRouter.get("/list", getTagsList)
// @ts-ignore
tagsRouter.post("/create", verifyAuth, verifyParams, createTag)




module.exports = tagsRouter
// export default userRouter