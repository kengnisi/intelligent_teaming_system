interface userInfo {
  username: string
  openId: string
  avatarUrl: string
  gender: number
  phone: string
  email: string
  userStatus: number
  isDelete: number
  userRole: number
  tags: string
}
interface editAttr {
  attrName: string
  value: string | number | Date
}

interface editTeam {
  id: number
  name?: string
  description?: string
  password?: string
  maxNum?: number
  status?: number
  expireTime?: Date
}

interface joinInfo {
  userId: number,
  teamId: number,
  joinTime: Date
}
export { userInfo, editAttr, editTeam, joinInfo }