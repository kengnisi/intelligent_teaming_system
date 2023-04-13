
import Router from "koa-router";
import { addTeam, updateTeam, getTeamById, getTeamList, getTeamListPage, joinTeam, quitTeam, getMyCreateTeam, getMyJoinTeam, deleteTeam, getMatchTeam, guanlian } from "../controller/team.comtroller";
import { verifyAuth, verifyParams } from '../middleware/auth.middleware';
const teamRouter = new Router({ prefix: '/team' })

teamRouter.post("/add", verifyAuth, addTeam)
teamRouter.post("/update", verifyAuth, updateTeam)
// 根据id获取队伍
teamRouter.get("/getTeam", verifyParams, getTeamById)
// 搜索队伍
teamRouter.get("/search", verifyParams, getTeamList)
// 获取队伍
teamRouter.get("/list/page", verifyParams, getTeamListPage)
// @ts-ignore
teamRouter.get("/list/match", verifyAuth, verifyParams, getMatchTeam)
teamRouter.post("/join", verifyAuth, joinTeam)
teamRouter.post("/quit", verifyAuth, quitTeam)
teamRouter.post("/my/create", verifyAuth, getMyCreateTeam)
teamRouter.post("/my/join", verifyAuth, getMyJoinTeam)
teamRouter.post("/delete", verifyAuth, deleteTeam)
teamRouter.get("/test", verifyAuth, guanlian)


module.exports = teamRouter
// export default userRouter