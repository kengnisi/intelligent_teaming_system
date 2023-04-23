
import Router from "koa-router";
import { verifyAdminAuth, verifyParams } from '../middleware/auth.middleware';
import { getTagsList, createTag, deleteCtag, deletePtag, updateTag } from '../controller/tags.controller'
const tagsRouter = new Router({ prefix: '/tags' })

// @ts-ignore
tagsRouter.get("/list", getTagsList)
// @ts-ignore
tagsRouter.post("/create", verifyAdminAuth, verifyParams, createTag)
// @ts-ignore
tagsRouter.post("/cDelete", verifyAdminAuth, verifyParams, deleteCtag)
// @ts-ignore
tagsRouter.post("/pDelete", verifyAdminAuth, verifyParams, deletePtag)
// @ts-ignore
tagsRouter.post("/updateTag", verifyAdminAuth, verifyParams, updateTag)




module.exports = tagsRouter
// export default userRouter