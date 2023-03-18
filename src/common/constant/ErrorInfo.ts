export interface errorType {
  code: number
  message: string
}

const SUCCESS: errorType = {
  code: 0,
  message: "ok",
}
const PARAMS_ERROR: errorType = {
  code: 40000,
  message: "请求参数错误",
}
const NULL_ERROR: errorType = {
  code: 40101,
  message: "请求数据为空",
}
const NOT_LOGIN: errorType = {
  code: 40100,
  message: "未登录",
}
const NO_AUTH: errorType = {
  code: 40101,
  message: "禁止操作",
}
const FORBIDDEN: errorType = {
  code: 40301,
  message: "无权限",
}
const NOT_FOUND: errorType = {
  code: 40400,
  message: "未找到资源",
}
const SYSTEM_ERROR: errorType = {
  code: 50000,
  message: "系统内部异常",
}


export default {
  SUCCESS,
  PARAMS_ERROR,
  NULL_ERROR,
  NOT_LOGIN,
  NO_AUTH,
  FORBIDDEN,
  NOT_FOUND,
  SYSTEM_ERROR
}
