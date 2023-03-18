import { Context } from "koa"
import { errorType } from "../common/constant/ErrorInfo"
class response {
  successResult(ctx: Context, data: any, description: string = "") {
    ctx.body = {
      code: 200,
      data,
      description
    }
  }
  errorResult(ctx: Context, data: any = [], ErrorInfo: errorType, description: string = "") {
    const { code, message } = ErrorInfo
    ctx.body = {
      code,
      message,
      description,
      data
    }
  }
}

export default new response