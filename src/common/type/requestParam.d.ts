import { type } from "os";
import teamStatusEnum from "../emun/teamStatus"
type RequestAddTeam = {
  userId?: number;
  name: string
  description: string
  password?: string
  maxNum: number
  status: number
  expireTime: Date;
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
  expireTime?: Date;
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
export { RequestAddTeam, RequestGetTeam, RequestJoinTeam, RequestTeamMessage, RequestMatchKey }