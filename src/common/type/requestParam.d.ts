import { type } from "os";
import teamStatusEnum from "../emun/teamStatus"
type RequestAddTeam = {
  userId?: number;
  name: string
  description: string
  password?: string
  maxNum: number
  status: number
  expireTime: number;
}

type RequestGetTeam = {
  teamId?: number
  teamIdList?: Array<number>
  userId?: number
  name?: string
  description?: string
  searchText?: string
  maxNum?: number
  status?: teamStatusEnum,
  expireTime?: number;
}

type RequestJoinTeam = {
  teamId: number,
  password?: string
}

type RequestTeamMessage = {
  teamId: number
}
type RequestMatchKey = {
  searchKey: Array<string>
}
type RequestCreateTag = {
  tagName: string
  userId?: number
  parentId?: number
  isParent: number
}

type RequestDeletePTag = {
  parentId: number
}
// 删除子标签
type RequestDeleteCTag = {
  parentId: number
  children: number
}
type RequestUpdateTag = {
  id: number
  text: string
}
type RequestChangeUserTags = {
  tagIdList: Array<string>
}
type RequestAdminInfo = {
  account: string,
  password: string
}
type RequestPageUser = {
  limit: number,
  page: number,
  searchKey: string
}
type RequestDeleteUser = {
  idList: Array<number>
}
export { RequestAddTeam, RequestGetTeam, RequestJoinTeam, RequestTeamMessage, RequestMatchKey, RequestCreateTag, RequestChangeUserTags, RequestAdminInfo, RequestPageUser, RequestDeleteUser, RequestDeleteCTag, RequestDeletePTag, RequestUpdateTag }