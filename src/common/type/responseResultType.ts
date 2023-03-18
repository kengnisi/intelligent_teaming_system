type safeUserInfo = {
  id: number
  username: string
  openId: string
  avatarUrl: string
  gender: number
  phone: string
  email: string
  userStatus: number
  userRole: number
  tags: string
  profile: string
  createTime: Date
}

type safeTeamInfo = {
  id: number,
  userId: number
  name: string
  description: string
  maxNum: number
  status: number
  expireTime: Date
  createTime: Date
  updateTime: Date
  createUser: safeUserInfo,
  teamMembers: Array<safeTeamInfo>
  isDelete: number
}

export { safeUserInfo, safeTeamInfo }