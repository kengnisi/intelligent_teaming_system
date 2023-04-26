
import Router from "koa-router";

import { verifyLogin, verifyAuth, verifyParams, verifyAdminAuth } from '../middleware/auth.middleware'
import { adminLogin, getCurrentAdmin, adminlogout, getAllUser, getUserListPage, deleteUser, updateUserInfo, updateTeamInfo, deletTeam, searchTeam } from "../controller/admin.controller"
const adminRouter = new Router({ prefix: '/admin' })

adminRouter.post('/login', verifyParams, adminLogin)
// @ts-ignore
adminRouter.get('/current', verifyAdminAuth, getCurrentAdmin)
adminRouter.post('/logout', verifyAdminAuth, adminlogout)
adminRouter.post('/allUser', verifyAdminAuth, getAllUser)
adminRouter.post('/pageUser', verifyAdminAuth, getUserListPage)
adminRouter.post('/deleteUser', verifyAdminAuth, deleteUser)
adminRouter.post('/updateUserInfo', verifyAdminAuth, updateUserInfo)
adminRouter.post("/updateTeam", verifyAdminAuth, updateTeamInfo)
adminRouter.post("/deletTeam", verifyAdminAuth, deletTeam)
adminRouter.post("/searchTeam", verifyAdminAuth, searchTeam)


module.exports = adminRouter
// export default userRouter