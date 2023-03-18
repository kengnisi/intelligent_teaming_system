import user from "../model/user_model"
import { safeUserInfo } from "../common/type/responseResultType"
export function getSafetyUser(originUserInfo: user) {
  if (originUserInfo == null) {
    return null
  }
  const safeUserInfo: safeUserInfo = {
    id: originUserInfo.id,
    openId: originUserInfo.openId,
    avatarUrl: originUserInfo.avatarUrl,
    username: originUserInfo.username,
    gender: originUserInfo.gender,
    phone: originUserInfo.phone,
    email: originUserInfo.email,
    userStatus: originUserInfo.userStatus,
    userRole: originUserInfo.userRole,
    tags: JSON.parse(originUserInfo.tags),
    profile: originUserInfo.profile,
    createTime: originUserInfo.createTime
  }
  return safeUserInfo
}