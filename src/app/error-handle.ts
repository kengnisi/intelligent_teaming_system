import { Context } from "koa";
import errorTypes from "../common/constant/error-types";
import { errorType } from "../common/constant/ErrorInfo";
import errorInfo from "../common/constant/ErrorInfo";
import resultUtils from "../utils/resultUtils";

const errorHandler = (error: Error, ctx: Context, description: string = "") => {
  let repError: errorType;
  switch (error.message) {
    case errorTypes.PARAMS_ERROR:
      repError = errorInfo.PARAMS_ERROR
      break;
    case errorTypes.NULL_ERROR:
      repError = errorInfo.NULL_ERROR
      break;
    case errorTypes.NOT_LOGIN:
      repError = errorInfo.NOT_LOGIN
      break;
    case errorTypes.NO_AUTH:
      repError = errorInfo.NO_AUTH
      break;
    case errorTypes.FORBIDDEN:
      repError = errorInfo.FORBIDDEN
      break;
    case errorTypes.SYSTEM_ERROR:
      repError = errorInfo.SYSTEM_ERROR
      break;
    default:
      repError = errorInfo.PARAMS_ERROR
  }
  return resultUtils.errorResult(ctx, [], repError, description)
}

export default errorHandler;
